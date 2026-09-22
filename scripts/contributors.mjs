#!/usr/bin/env node
/*
 * Who wrote a release.
 *
 * Reads the range out of git rather than out of someone's memory, and writes the result into the
 * release entry in public/changelog/en.json. Names and links do not depend on the language, so
 * they live in the base file only - every locale inherits them through the changelog's merge.
 *
 *   npm run contributors                      # what has landed since the last version bump
 *   npm run contributors -- --write           # put it in the changelog entry for package.json's version
 *   npm run contributors -- --from v1.1.0 --to HEAD --version 1.2.0 --write
 *
 * A GitHub handle comes from the commit email when GitHub wrote it (12345+handle@users.noreply.
 * github.com). Any other address has to be mapped by hand in scripts/github-handles.json, because
 * an email address is not a GitHub account and guessing one would credit the wrong person.
 */
import { execFileSync } from 'node:child_process';
import { readFileSync, writeFileSync, existsSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, resolve } from 'node:path';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const CHANGELOG = resolve(root, 'public/changelog/en.json');
const HANDLES = resolve(root, 'scripts/github-handles.json');

const git = (...args) => execFileSync('git', args, { cwd: root, encoding: 'utf8' }).trim();

/** Same, but a failure is an answer rather than noise on the terminal. */
const gitQuiet = (...args) => {
  try {
    return execFileSync('git', args, { cwd: root, encoding: 'utf8', stdio: ['ignore', 'pipe', 'ignore'] }).trim();
  } catch {
    return '';
  }
};

const parseArgs = (argv) => {
  const out = { write: false, json: false };
  for (let i = 0; i < argv.length; i++) {
    const arg = argv[i];
    if (arg === '--write') out.write = true;
    else if (arg === '--json') out.json = true;
    else if (arg === '--from' || arg === '--to' || arg === '--version') out[arg.slice(2)] = argv[++i];
    else if (arg === '--help' || arg === '-h') out.help = true;
    else throw new Error(`Unknown argument: ${arg}`);
  }
  return out;
};

/**
 * Where the previous release ended.
 *
 * A tag if the repository has them. Otherwise the last commit that changed the version in
 * package.json - the bump itself, so the range that follows it is the work being released now.
 * A bump that is still uncommitted does not count, which is what makes this work while preparing.
 */
const previousRelease = () => {
  const described = gitQuiet('describe', '--tags', '--abbrev=0');
  if (described) return described;

  const bumps = git('log', '--format=%H', '-G', '^\\s*"version":', '--', 'package.json').split('\n').filter(Boolean);
  if (!bumps.length) throw new Error('No tags and no version bump in package.json - pass --from explicitly.');
  return bumps[0];
};

const isBot = (name, email) => /\[bot\]/i.test(name) || /\[bot\]/i.test(email);

const handleFromEmail = (email) => {
  const match = /^(?:\d+\+)?([^@]+)@users\.noreply\.github\.com$/i.exec(email);
  return match ? match[1] : null;
};

const loadHandles = () => {
  if (!existsSync(HANDLES)) return {};
  const raw = JSON.parse(readFileSync(HANDLES, 'utf8'));
  return Object.fromEntries(Object.entries(raw).map(([key, value]) => [key.toLowerCase(), value]));
};

const collect = (from, to) => {
  const handles = loadHandles();
  // %aN and %aE apply .mailmap, so a contributor who changed address is still one person.
  const log = git('log', '--no-merges', '--format=%aN%x1f%aE', `${from}..${to}`);
  const people = new Map();

  for (const line of log.split('\n').filter(Boolean)) {
    const [name, email] = line.split('\x1f');
    if (isBot(name, email)) continue;

    const key = email.toLowerCase();
    const existing = people.get(key);
    if (existing) {
      existing.commits++;
      continue;
    }
    const handle = handles[key] ?? handles[name.toLowerCase()] ?? handleFromEmail(email);
    people.set(key, { name, email, commits: 1, handle: handle ?? null });
  }

  return [...people.values()].sort((a, b) => b.commits - a.commits || a.name.localeCompare(b.name));
};

const toEntries = (people) =>
  people.map((person) => ({
    name: person.name,
    commits: person.commits,
    ...(person.handle ? { url: `https://github.com/${person.handle}` } : {}),
  }));

const main = () => {
  const args = parseArgs(process.argv.slice(2));
  if (args.help) {
    console.log(
      readFileSync(fileURLToPath(import.meta.url), 'utf8')
        .split('*/')[0]
        .split('/*')[1]
        .trim()
    );
    return;
  }

  const pkg = JSON.parse(readFileSync(resolve(root, 'package.json'), 'utf8'));
  const version = args.version ?? pkg.version;
  const from = args.from ?? previousRelease();
  const to = args.to ?? 'HEAD';

  const people = collect(from, to);
  const entries = toEntries(people);

  if (args.json) {
    console.log(JSON.stringify(entries, null, 2));
  } else {
    const total = people.reduce((sum, person) => sum + person.commits, 0);
    console.log(`${git('rev-parse', '--short', from)}..${to} - ${total} commits by ${people.length}:\n`);
    for (const person of people) {
      const share = total ? Math.round((person.commits / total) * 100) : 0;
      const link = person.handle
        ? `https://github.com/${person.handle}`
        : 'no GitHub handle - add one to scripts/github-handles.json';
      console.log(
        `  ${String(person.commits).padStart(4)}  ${String(share).padStart(3)}%  ${person.name.padEnd(16)} ${link}`
      );
    }
  }

  if (!args.write) {
    if (!args.json) console.log(`\nRun again with --write to put this in the ${version} entry of the changelog.`);
    return;
  }

  const changelog = JSON.parse(readFileSync(CHANGELOG, 'utf8'));
  const release = (changelog.releases ?? []).find((entry) => entry.version === version);
  if (!release) throw new Error(`No release ${version} in public/changelog/en.json - add the entry first.`);

  release.contributors = entries;
  writeFileSync(CHANGELOG, `${JSON.stringify(changelog, null, 2)}\n`);
  console.log(`\nWrote ${entries.length} contributors into the ${version} entry.`);
};

try {
  main();
} catch (error) {
  console.error(error.message);
  process.exitCode = 1;
}
