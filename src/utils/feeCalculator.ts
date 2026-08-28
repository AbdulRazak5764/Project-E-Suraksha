import type { FeeCalculation, InstrumentType } from '../types';

export function calculateVerificationFee(
  type: InstrumentType,
  denomination: string,
  quantity: number = 1,
  isLate: boolean = false
): FeeCalculation {
  let baseFeePerUnit = 150; // default fallback

  if (type === 'weighing_scale') {
    if (denomination.includes('0-50kg') || denomination.includes('30kg') || denomination.includes('50kg')) {
      baseFeePerUnit = 100;
    } else if (denomination.includes('51-100kg') || denomination.includes('100kg')) {
      baseFeePerUnit = 150;
    } else if (denomination.includes('101-500kg') || denomination.includes('200kg') || denomination.includes('500kg')) {
      baseFeePerUnit = 200;
    } else if (denomination.includes('501-1000kg') || denomination.includes('1000kg')) {
      baseFeePerUnit = 350;
    } else {
      baseFeePerUnit = 500;
    }
  } else if (type === 'capacity_measure') {
    if (denomination.includes('0-50L') || denomination.includes('20L') || denomination.includes('50L')) {
      baseFeePerUnit = 100;
    } else if (denomination.includes('51-100L') || denomination.includes('100L')) {
      baseFeePerUnit = 150;
    } else if (denomination.includes('101-500L')) {
      baseFeePerUnit = 200;
    } else if (denomination.includes('501-1000L')) {
      baseFeePerUnit = 350;
    } else {
      baseFeePerUnit = 500;
    }
  } else if (type === 'length_measure') {
    if (denomination.includes('0-10m') || denomination.includes('5m') || denomination.includes('10m')) {
      baseFeePerUnit = 50;
    } else if (denomination.includes('11-50m')) {
      baseFeePerUnit = 100;
    } else {
      baseFeePerUnit = 150;
    }
  } else if (type === 'storage_tank') {
    if (denomination.includes('0-1000L') || denomination.includes('1000L')) {
      baseFeePerUnit = 500;
    } else if (denomination.includes('1001-5000L')) {
      baseFeePerUnit = 1000;
    } else {
      baseFeePerUnit = 1500;
    }
  } else if (type === 'tank_lorry') {
    baseFeePerUnit = 1000;
  }

  const baseFee = baseFeePerUnit * quantity;
  const statutoryFee = Math.round(baseFee * 0.05 * 100) / 100;
  const lateFee = isLate ? Math.round(baseFee * 0.30 * 100) / 100 : 0;
  const subtotal = Math.round((baseFee + statutoryFee + lateFee) * 100) / 100;
  const gst = Math.round(subtotal * 0.18 * 100) / 100;
  const total = Math.round((subtotal + gst) * 100) / 100;
  const perInstrument = quantity > 1 ? Math.round((total / quantity) * 100) / 100 : total;

  return {
    baseFee,
    statutoryFee,
    lateFee,
    subtotal,
    gst,
    total,
    perInstrument
  };
}
