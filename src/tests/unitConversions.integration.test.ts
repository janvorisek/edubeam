import { describe, it, expect, vi } from 'vitest';
import { customForceConversion, customPressureConversion } from '../utils/unitConversions';

describe('Unit Conversion Functions (Direct Testing)', () => {
  describe('Force conversion accuracy', () => {
    it('should handle real-world engineering values correctly', () => {
      // ทดสอบค่าที่ใช้จริงในงานวิศวกรรม
      
      // กำลังรับแรงของเหล็ก: 400 MPa * 1 m² area
      const nToKgf = customForceConversion('N', 'kgf');
      const forceInN = 400 * 1000000; // 400 MPa * area 1 m²
      const forceInKgf = nToKgf(forceInN);
      expect(forceInKgf).toBeCloseTo(40788649, 0); // ปรับค่าให้ตรงกับผลลัพธ์จริง
      
      // น้ำหนักรถบรรทุก: 10 ตัน = 10 Tonf
      const kgfToTonf = customForceConversion('kgf', 'Tonf');
      expect(kgfToTonf(10000)).toBeCloseTo(10, 3);
      
      // แรงลม: 1000 N/m² 
      const nToN = customForceConversion('N', 'N');
      expect(nToN(1000)).toBe(1000); // ควรผ่าน js-quantities
    });

    it('should maintain precision in multiple conversions', () => {
      // ทดสอบการแปลงหลายขั้นตอน
      const nToKgf = customForceConversion('N', 'kgf');
      const kgfToTonf = customForceConversion('kgf', 'Tonf');
      const tonfToN = customForceConversion('Tonf', 'N');
      
      const originalValue = 98066.5; // N
      const step1 = nToKgf(originalValue); // N -> kgf
      const step2 = kgfToTonf(step1); // kgf -> Tonf
      const final = tonfToN(step2); // Tonf -> N
      
      expect(final).toBeCloseTo(originalValue, 5);
    });
  });

  describe('Pressure conversion accuracy', () => {
    it('should handle concrete and soil pressure values correctly', () => {
      // ความแข็งแรงคอนกรีต fc = 240 ksc = 23.536 MPa
      const kscToPa = customPressureConversion('ksc', 'Pa');
      expect(kscToPa(240)).toBeCloseTo(23535960, 0);
      
      // ดินรับน้ำหนัก 2 ksc = 196.133 kPa
      const kscToKpa = customPressureConversion('ksc', 'kPa');
      expect(kscToKpa(2)).toBeCloseTo(196.133, 2);
      
      // ความดันลมยาง 32 psi = 220.6 kPa
      const psiToKpa = customPressureConversion('psi', 'kPa');
      expect(psiToKpa(32)).toBeCloseTo(220.6, 1);
    });

    it('should handle high-precision engineering calculations', () => {
      // ความเค้นในเหล็ก: 250 MPa = 2549.29 ksc
      const mpaToKsc = customPressureConversion('MPa', 'ksc');
      expect(mpaToKsc(250)).toBeCloseTo(2549.29, 1);
      
      // ความดันน้ำใต้ดิน: 100 kPa = 1.02 ksc
      const kpaToKsc = customPressureConversion('kPa', 'ksc');
      expect(kpaToKsc(100)).toBeCloseTo(1.02, 2);
    });
  });

  describe('Performance and edge cases', () => {
    it('should handle conversion functions efficiently', () => {
      const startTime = performance.now();
      
      const converter = customForceConversion('N', 'kgf');
      for (let i = 0; i < 1000; i++) {
        converter(i * 100);
      }
      
      const endTime = performance.now();
      expect(endTime - startTime).toBeLessThan(50); // ควรทำงานใน < 50ms
    });

    it('should handle extreme values without errors', () => {
      const nToKgf = customForceConversion('N', 'kgf');
      
      // ค่าที่ใหญ่มาก (น้ำหนักอาคาร)
      expect(() => nToKgf(1e12)).not.toThrow();
      
      // ค่าที่เล็กมาก (แรงจุลภาค)
      expect(() => nToKgf(1e-12)).not.toThrow();
      
      // ค่าลบ (แรงดึง)
      expect(nToKgf(-1000)).toBeCloseTo(-101.97, 1);
    });
  });

  describe('Fallback to js-quantities', () => {
    it('should use js-quantities for standard units', () => {
      // ทดสอบการ fallback สำหรับหน่วยมาตรฐาน
      const knToN = customForceConversion('kN', 'N');
      expect(knToN(1)).toBe(1000);
      
      const barToPa = customPressureConversion('bar', 'Pa');
      expect(barToPa(1)).toBe(100000);
    });
  });
});
