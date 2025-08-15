import Qty from 'js-quantities';

/**
 * Custom force unit conversion function
 * Supports: N, kgf, Tonf
 */
export const customForceConversion = (fromUnit: string, toUnit: string) => {
  const conversionFactors = {
    'N': 1,
    'kgf': 9.80665,
    'Tonf': 9806.65
  };

  return (value: number) => {
    if (!(fromUnit in conversionFactors) || !(toUnit in conversionFactors)) {
      // ถ้าไม่รู้จักหน่วย ให้ใช้ js-quantities แทน
      return Qty.swiftConverter(fromUnit, toUnit)(value);
    }
    
    // แปลงเป็น N ก่อน แล้วแปลงเป็นหน่วยที่ต้องการ
    const valueInN = value * conversionFactors[fromUnit];
    const result = valueInN / conversionFactors[toUnit];
    return result;
  };
};

/**
 * Custom pressure unit conversion function
 * Supports: Pa, kPa, MPa, GPa, psi, ksc
 */
export const customPressureConversion = (fromUnit: string, toUnit: string) => {
  const pressureFactors = {
    'Pa': 1,
    'kPa': 1000,
    'MPa': 1000000,
    'GPa': 1000000000,
    'psi': 6894.757,
    'ksc': 98066.5  // kg/cm²
  };
  
  return (value: number) => {
    if (!(fromUnit in pressureFactors) || !(toUnit in pressureFactors)) {
      return Qty.swiftConverter(fromUnit, toUnit)(value);
    }
    
    const valueInPa = value * pressureFactors[fromUnit];
    const result = valueInPa / pressureFactors[toUnit];
    return result;
  };
};
