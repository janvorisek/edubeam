import { describe, it, expect } from 'vitest';
import { customPressureConversion } from '../utils/unitConversions';

describe('Custom Pressure Unit Conversions', () => {
  describe('Pascal (Pa) conversions', () => {
    it('should convert Pa to kPa correctly', () => {
      const converter = customPressureConversion('Pa', 'kPa');

      expect(converter(1000)).toBe(1);
      expect(converter(5000)).toBe(5);
      expect(converter(1)).toBe(0.001);
    });

    it('should convert Pa to MPa correctly', () => {
      const converter = customPressureConversion('Pa', 'MPa');

      expect(converter(1000000)).toBe(1);
      expect(converter(5000000)).toBe(5);
      expect(converter(1000)).toBe(0.001);
    });

    it('should convert Pa to ksc correctly', () => {
      const converter = customPressureConversion('Pa', 'ksc');

      // 1 ksc = 98066.5 Pa
      expect(converter(98066.5)).toBeCloseTo(1, 5);
      expect(converter(196133)).toBeCloseTo(2, 4);
      expect(converter(49033.25)).toBeCloseTo(0.5, 5);
    });

    it('should convert Pa to psi correctly', () => {
      const converter = customPressureConversion('Pa', 'psi');

      // 1 psi = 6894.757 Pa
      expect(converter(6894.757)).toBeCloseTo(1, 5);
      expect(converter(13789.514)).toBeCloseTo(2, 4);
      expect(converter(3447.3785)).toBeCloseTo(0.5, 5);
    });
  });

  describe('Kilogram per square centimeter (ksc) conversions', () => {
    it('should convert ksc to Pa correctly', () => {
      const converter = customPressureConversion('ksc', 'Pa');

      // 1 ksc = 98066.5 Pa
      expect(converter(1)).toBeCloseTo(98066.5, 1);
      expect(converter(0.5)).toBeCloseTo(49033.25, 2);
      expect(converter(2)).toBeCloseTo(196133, 0);
    });

    it('should convert ksc to kPa correctly', () => {
      const converter = customPressureConversion('ksc', 'kPa');

      // 1 ksc = 98066.5 Pa = 98.0665 kPa
      expect(converter(1)).toBeCloseTo(98.0665, 4);
      expect(converter(0.5)).toBeCloseTo(49.03325, 4);
      expect(converter(10)).toBeCloseTo(980.665, 3);
    });

    it('should convert ksc to MPa correctly', () => {
      const converter = customPressureConversion('ksc', 'MPa');

      // 1 ksc = 98066.5 Pa = 0.0980665 MPa
      expect(converter(1)).toBeCloseTo(0.0980665, 6);
      expect(converter(10)).toBeCloseTo(0.980665, 5);
      expect(converter(100)).toBeCloseTo(9.80665, 4);
    });

    it('should convert ksc to psi correctly', () => {
      const converter = customPressureConversion('ksc', 'psi');

      // 1 ksc = 98066.5 Pa, 1 psi = 6894.757 Pa
      // 1 ksc = 98066.5/6894.757 psi ≈ 14.223 psi
      expect(converter(1)).toBeCloseTo(14.223, 3);
      expect(converter(0.5)).toBeCloseTo(7.1115, 3);
      expect(converter(2)).toBeCloseTo(28.446, 2);
    });

    it('should convert ksc to ksc (same unit)', () => {
      const converter = customPressureConversion('ksc', 'ksc');

      expect(converter(1)).toBe(1);
      expect(converter(100)).toBe(100);
      expect(converter(0)).toBe(0);
    });
  });

  describe('Standard pressure unit conversions', () => {
    it('should convert kPa to MPa correctly', () => {
      const converter = customPressureConversion('kPa', 'MPa');

      expect(converter(1000)).toBe(1);
      expect(converter(500)).toBe(0.5);
      expect(converter(2500)).toBe(2.5);
    });

    it('should convert MPa to GPa correctly', () => {
      const converter = customPressureConversion('MPa', 'GPa');

      expect(converter(1000)).toBe(1);
      expect(converter(500)).toBe(0.5);
      expect(converter(2500)).toBe(2.5);
    });

    it('should convert psi to kPa correctly', () => {
      const converter = customPressureConversion('psi', 'kPa');

      // 1 psi = 6894.757 Pa = 6.894757 kPa
      expect(converter(1)).toBeCloseTo(6.894757, 5);
      expect(converter(10)).toBeCloseTo(68.94757, 4);
      expect(converter(100)).toBeCloseTo(689.4757, 3);
    });
  });

  describe('Edge cases and error handling', () => {
    it('should handle zero values correctly', () => {
      const converterPaToKsc = customPressureConversion('Pa', 'ksc');
      const converterKscToPa = customPressureConversion('ksc', 'Pa');

      expect(converterPaToKsc(0)).toBe(0);
      expect(converterKscToPa(0)).toBe(0);
    });

    it('should handle negative values correctly', () => {
      const converter = customPressureConversion('Pa', 'ksc');

      expect(converter(-98066.5)).toBeCloseTo(-1, 5);
    });

    it('should fallback to js-quantities for unsupported units', () => {
      const converter = customPressureConversion('bar', 'Pa');

      // ควรใช้ js-quantities สำหรับหน่วยที่ไม่รองรับ
      expect(converter(1)).toBe(100000);
    });

    it('should handle very large numbers', () => {
      const converter = customPressureConversion('Pa', 'ksc');

      expect(converter(98066500)).toBeCloseTo(1000, 1);
    });

    it('should handle very small numbers', () => {
      const converter = customPressureConversion('Pa', 'ksc');

      expect(converter(980.665)).toBeCloseTo(0.01, 6);
    });
  });

  describe('Bidirectional conversion accuracy', () => {
    it('should maintain accuracy in bidirectional Pa <-> ksc conversions', () => {
      const paToKsc = customPressureConversion('Pa', 'ksc');
      const kscToPa = customPressureConversion('ksc', 'Pa');

      const originalValue = 500000;
      const converted = paToKsc(originalValue);
      const backConverted = kscToPa(converted);

      expect(backConverted).toBeCloseTo(originalValue, 8);
    });

    it('should maintain accuracy in bidirectional ksc <-> psi conversions', () => {
      const kscToPsi = customPressureConversion('ksc', 'psi');
      const psiToKsc = customPressureConversion('psi', 'ksc');

      const originalValue = 5;
      const converted = kscToPsi(originalValue);
      const backConverted = psiToKsc(converted);

      expect(backConverted).toBeCloseTo(originalValue, 10);
    });

    it('should maintain accuracy in bidirectional ksc <-> MPa conversions', () => {
      const kscToMpa = customPressureConversion('ksc', 'MPa');
      const mpaToKsc = customPressureConversion('MPa', 'ksc');

      const originalValue = 50;
      const converted = kscToMpa(originalValue);
      const backConverted = mpaToKsc(converted);

      expect(backConverted).toBeCloseTo(originalValue, 10);
    });
  });

  describe('Engineering-specific test cases', () => {
    it('should convert common steel yield strength values correctly', () => {
      // เหล็ก SS400: ประมาณ 2400 ksc ≈ 235 MPa
      const kscToMpa = customPressureConversion('ksc', 'MPa');
      expect(kscToMpa(2400)).toBeCloseTo(235.36, 1);

      // เหล็ก SS490: ประมาณ 3200 ksc ≈ 314 MPa
      expect(kscToMpa(3200)).toBeCloseTo(313.81, 1);
    });

    it('should convert concrete compressive strength values correctly', () => {
      // คอนกรีต fc = 240 ksc ≈ 23.5 MPa
      const kscToMpa = customPressureConversion('ksc', 'MPa');
      expect(kscToMpa(240)).toBeCloseTo(23.536, 2);

      // คอนกรีต fc = 350 ksc ≈ 34.3 MPa
      expect(kscToMpa(350)).toBeCloseTo(34.323, 2);
    });

    it('should convert soil bearing capacity values correctly', () => {
      // ดินรับน้ำหนัก 20 ตัน/ตร.ม. = 2 ksc ≈ 0.196 MPa
      const kscToMpa = customPressureConversion('ksc', 'MPa');
      expect(kscToMpa(2)).toBeCloseTo(0.196, 3);
    });
  });
});
