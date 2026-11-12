/** Saves a blob as a file through a temporary link. */
export const downloadBlob = (blob: Blob, filename: string): void => {
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement('a');

  anchor.href = url;
  anchor.download = filename;
  anchor.style.display = 'none';

  document.body.appendChild(anchor);
  anchor.click();
  document.body.removeChild(anchor);

  // Safari starts reading the file after `click()` returns, and a URL revoked right away can cancel the
  // download. A minute is long enough for any file this app writes; until then the blob stays in memory.
  window.setTimeout(() => URL.revokeObjectURL(url), 60_000);
};
