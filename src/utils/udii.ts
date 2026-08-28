/**
 * e-Suraksha 2.0 UDII (Unified Digital Identity for Instruments) Generator
 * Format: YYMMDD-DOB_DDMM-SEQ_6-CHECK
 * Example: 260828-1505-004567-3
 */

export function calculateCheckDigit(base: string): string {
  let total = 0;
  // Clean base of non-alphanumeric if any
  const cleanBase = base.replace(/[^0-9]/g, '');
  
  for (let i = 0; i < cleanBase.length; i++) {
    let digit = parseInt(cleanBase.charAt(cleanBase.length - 1 - i), 10);
    if (isNaN(digit)) digit = 0;
    
    if (i % 2 === 1) {
      digit *= 2;
      if (digit > 9) digit -= 9;
    }
    total += digit;
  }
  
  const check = (10 - (total % 10)) % 10;
  return check.toString();
}

export function generateUDII(ownerDob: string = '15-05-1990', counter: number = 4567): string {
  const now = new Date();
  const yy = String(now.getFullYear()).slice(-2);
  const mm = String(now.getMonth() + 1).padStart(2, '0');
  const dd = String(now.getDate()).padStart(2, '0');
  const datePart = `${yy}${mm}${dd}`;

  // ownerDob format expected DD-MM-YYYY or similar
  const parts = ownerDob.split(/[-/.]/);
  let dobDdmm = '1505';
  if (parts.length >= 2) {
    dobDdmm = `${parts[0].padStart(2, '0')}${parts[1].padStart(2, '0')}`;
  }

  const seqPart = String(counter).padStart(6, '0');
  const base = `${datePart}${dobDdmm}${seqPart}`;
  const checkDigit = calculateCheckDigit(base);

  return `${datePart}-${dobDdmm}-${seqPart}-${checkDigit}`;
}

export function parseUDIIStatus(expiryDateStr: string): {
  status: 'EXPIRED' | 'EXPIRING_SOON' | 'PLAN_AHEAD' | 'VALID';
  daysRemaining: number;
  badgeColor: string;
  badgeBg: string;
  badgeBorder: string;
  label: string;
} {
  const expiryDate = new Date(expiryDateStr);
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  expiryDate.setHours(0, 0, 0, 0);

  const diffTime = expiryDate.getTime() - today.getTime();
  const daysRemaining = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

  if (daysRemaining < 0) {
    return {
      status: 'EXPIRED',
      daysRemaining,
      badgeColor: 'text-red-700 dark:text-red-400',
      badgeBg: 'bg-red-50 dark:bg-red-950/50',
      badgeBorder: 'border-red-300 dark:border-red-800',
      label: `EXPIRED (${Math.abs(daysRemaining)} days ago)`
    };
  } else if (daysRemaining <= 30) {
    return {
      status: 'EXPIRING_SOON',
      daysRemaining,
      badgeColor: 'text-orange-700 dark:text-orange-400',
      badgeBg: 'bg-orange-50 dark:bg-orange-950/50',
      badgeBorder: 'border-orange-300 dark:border-orange-800',
      label: `EXPIRING SOON (${daysRemaining} days left)`
    };
  } else if (daysRemaining <= 60) {
    return {
      status: 'PLAN_AHEAD',
      daysRemaining,
      badgeColor: 'text-yellow-700 dark:text-yellow-400',
      badgeBg: 'bg-yellow-50 dark:bg-yellow-950/50',
      badgeBorder: 'border-yellow-300 dark:border-yellow-800',
      label: `PLAN AHEAD (${daysRemaining} days left)`
    };
  } else {
    return {
      status: 'VALID',
      daysRemaining,
      badgeColor: 'text-emerald-700 dark:text-emerald-400',
      badgeBg: 'bg-emerald-50 dark:bg-emerald-950/50',
      badgeBorder: 'border-emerald-300 dark:border-emerald-800',
      label: `VALID (${daysRemaining} days remaining)`
    };
  }
}
