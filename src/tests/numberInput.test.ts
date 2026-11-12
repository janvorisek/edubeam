import { describe, it, expect } from 'vitest';
import { isNumberInputCharacter, parseNumberInput } from '@/utils/numberInput';

describe('reading a number field', () => {
  it('reads numbers the way they are written', () => {
    expect(parseNumberInput('12')).toBe(12);
    expect(parseNumberInput(' 0,5 ')).toBe(0.5);
    expect(parseNumberInput('.5')).toBe(0.5);
    expect(parseNumberInput('-3.25')).toBe(-3.25);
    expect(parseNumberInput('1e3')).toBe(1000);
    expect(parseNumberInput('1E+3')).toBe(1000);
    expect(parseNumberInput('2.1e-5')).toBeCloseTo(2.1e-5, 20);
    expect(parseNumberInput('210 000')).toBe(210000);
    expect(parseNumberInput('210 000')).toBe(210000);
    expect(parseNumberInput('−4')).toBe(-4);
  });

  it('works out plain arithmetic, with the precedence of paper', () => {
    expect(parseNumberInput('1/2')).toBe(0.5);
    expect(parseNumberInput('2+2')).toBe(4);
    expect(parseNumberInput('6/2*3')).toBe(9);
    expect(parseNumberInput('2+3*4')).toBe(14);
    expect(parseNumberInput('(2+3)*4')).toBe(20);
    expect(parseNumberInput('2^3^2')).toBe(512);
    expect(parseNumberInput('-2^2')).toBe(-4);
    expect(parseNumberInput('10*-2')).toBe(-20);
    expect(parseNumberInput('2^-1')).toBe(0.5);
    expect(parseNumberInput('(-2)^2')).toBe(4);
    expect(parseNumberInput('1,5*2')).toBe(3);
    expect(parseNumberInput('3×1,5')).toBe(4.5);
    expect(parseNumberInput('1e3/4')).toBe(250);
  });

  it('refuses anything else as a whole, rather than reading part of it', () => {
    for (const text of [
      '',
      ' ',
      '-',
      'abc',
      '5abc',
      '1..2',
      '1,2,3',
      '1.000,5',
      '1/0',
      '(1+2',
      '1+',
      '2*',
      'e5',
      'pi',
      'sqrt(4)',
      '1 2 3+',
    ]) {
      expect(parseNumberInput(text), JSON.stringify(text)).toBeNaN();
    }
  });

  it('lets through only what a number or a sum can be typed with', () => {
    for (const char of '0123456789.,eE+-*/^() ×÷') expect(isNumberInputCharacter(char), char).toBe(true);
    for (const char of 'aZx%$=;') expect(isNumberInputCharacter(char), char).toBe(false);
  });
});
