import { describe, it, expect } from 'vitest';
import { customForceConversion } from '../utils/unitConversions';

describe('Custom Force Unit Conversions', () => {
  describe('Newton (N) conversions', () => {
    it('should convert N to kgf correctly', () => {
      const converter = customForceConversion('N', 'kgf');
      
      // 1 N = 1/9.80665 kgf ≈ 0.10197 kgf
      expect(converter(1)).toBeCloseTo(0.10197, 4);
      expect(converter(9.80665)).toBeCloseTo(1, 4);
      expect(converter(100)).toBeCloseTo(10.197, 3);
    });

    it('should convert N to Tonf correctly', () => {
      const converter = customForceConversion('N', 'Tonf');
      
      // 1 N = 1/9806.65 Tonf ≈ 0.000102 Tonf
      expect(converter(1)).toBeCloseTo(0.000102, 6);
      expect(converter(9806.65)).toBeCloseTo(1, 4);
      expect(converter(100000)).toBeCloseTo(10.197, 3);
    });

    it('should convert N to N (same unit)', () => {
      const converter = customForceConversion('N', 'N');
      
      expect(converter(1)).toBe(1);
      expect(converter(100)).toBe(100);
      expect(converter(0)).toBe(0);
    });
  });

  describe('Kilogram-force (kgf) conversions', () => {
    it('should convert kgf to N correctly', () => {
      const converter = customForceConversion('kgf', 'N');
      
      // 1 kgf = 9.80665 N
      expect(converter(1)).toBeCloseTo(9.80665, 5);
      expect(converter(10)).toBeCloseTo(98.0665, 4);
      expect(converter(0.5)).toBeCloseTo(4.903325, 5);
    });

    it('should convert kgf to Tonf correctly', () => {
      const converter = customForceConversion('kgf', 'Tonf');
      
      // 1 kgf = 9.80665 N = 9.80665/9806.65 Tonf = 0.001 Tonf
      expect(converter(1)).toBeCloseTo(0.001, 6);
      expect(converter(1000)).toBeCloseTo(1, 4);
      expect(converter(500)).toBeCloseTo(0.5, 4);
    });

    it('should convert kgf to kgf (same unit)', () => {
      const converter = customForceConversion('kgf', 'kgf');
      
      expect(converter(1)).toBe(1);
      expect(converter(100)).toBe(100);
      expect(converter(0)).toBe(0);
    });
  });

  describe('Ton-force (Tonf) conversions', () => {
    it('should convert Tonf to N correctly', () => {
      const converter = customForceConversion('Tonf', 'N');
      
      // 1 Tonf = 9806.65 N
      expect(converter(1)).toBeCloseTo(9806.65, 2);
      expect(converter(0.1)).toBeCloseTo(980.665, 3);
      expect(converter(2)).toBeCloseTo(19613.3, 1);
    });

    it('should convert Tonf to kgf correctly', () => {
      const converter = customForceConversion('Tonf', 'kgf');
      
      // 1 Tonf = 9806.65 N = 9806.65/9.80665 kgf = 1000 kgf
      expect(converter(1)).toBeCloseTo(1000, 3);
      expect(converter(0.5)).toBeCloseTo(500, 3);
      expect(converter(2.5)).toBeCloseTo(2500, 3);
    });

    it('should convert Tonf to Tonf (same unit)', () => {
      const converter = customForceConversion('Tonf', 'Tonf');
      
      expect(converter(1)).toBe(1);
      expect(converter(100)).toBe(100);
      expect(converter(0)).toBe(0);
    });
  });

  describe('Edge cases and error handling', () => {
    it('should handle zero values correctly', () => {
      const converterNToKgf = customForceConversion('N', 'kgf');
      const converterKgfToN = customForceConversion('kgf', 'N');
      const converterTonfToN = customForceConversion('Tonf', 'N');
      
      expect(converterNToKgf(0)).toBe(0);
      expect(converterKgfToN(0)).toBe(0);
      expect(converterTonfToN(0)).toBe(0);
    });

    it('should handle negative values correctly', () => {
      const converter = customForceConversion('N', 'kgf');
      
      expect(converter(-100)).toBeCloseTo(-10.197, 3);
    });

    it('should fallback to js-quantities for unsupported units', () => {
      const converter = customForceConversion('kN', 'N');
      
      // ควรใช้ js-quantities สำหรับหน่วยที่ไม่รองรับ
      expect(converter(1)).toBe(1000);
    });

    it('should handle very large numbers', () => {
      const converter = customForceConversion('N', 'kgf');
      
      expect(converter(1000000)).toBeCloseTo(101971.6, 1);
    });

    it('should handle very small numbers', () => {
      const converter = customForceConversion('N', 'kgf');
      
      expect(converter(0.001)).toBeCloseTo(0.000102, 6);
    });
  });

  describe('Bidirectional conversion accuracy', () => {
    it('should maintain accuracy in bidirectional N <-> kgf conversions', () => {
      const nToKgf = customForceConversion('N', 'kgf');
      const kgfToN = customForceConversion('kgf', 'N');
      
      const originalValue = 100;
      const converted = nToKgf(originalValue);
      const backConverted = kgfToN(converted);
      
      expect(backConverted).toBeCloseTo(originalValue, 10);
    });

    it('should maintain accuracy in bidirectional N <-> Tonf conversions', () => {
      const nToTonf = customForceConversion('N', 'Tonf');
      const tonfToN = customForceConversion('Tonf', 'N');
      
      const originalValue = 50000;
      const converted = nToTonf(originalValue);
      const backConverted = tonfToN(converted);
      
      expect(backConverted).toBeCloseTo(originalValue, 8);
    });

    it('should maintain accuracy in bidirectional kgf <-> Tonf conversions', () => {
      const kgfToTonf = customForceConversion('kgf', 'Tonf');
      const tonfToKgf = customForceConversion('Tonf', 'kgf');
      
      const originalValue = 5000;
      const converted = kgfToTonf(originalValue);
      const backConverted = tonfToKgf(converted);
      
      expect(backConverted).toBeCloseTo(originalValue, 10);
    });
  });
});
