export type UserRole = 'SHOPKEEPER' | 'REPAIRER' | 'LMO' | 'CONSUMER' | 'ADMIN';

export type InstrumentType = 'weighing_scale' | 'capacity_measure' | 'length_measure' | 'storage_tank' | 'tank_lorry';

export type ApplicationStatus =
  | 'DRAFT'
  | 'AWAITING_LMO_APPROVAL'
  | 'APPROVED'
  | 'REJECTED'
  | 'PAYMENT_PENDING'
  | 'PAID'
  | 'CERTIFICATE_GENERATED'
  | 'EXPIRED';

export interface UserProfile {
  id: string;
  name: string;
  businessName?: string;
  address: string;
  mobile: string;
  email: string;
  password?: string;
  aadhaarHash: string;
  role: UserRole;
  licenseNumber?: string; // For repairer
  employeeId?: string; // For LMO
  jurisdictionDistrict?: string;
}

export interface Instrument {
  udii: string;
  ownerId: string;
  ownerName: string;
  businessName: string;
  businessAddress: string;
  mobile: string;
  email: string;
  type: InstrumentType;
  subType: string;
  denomination: string;
  quantity: number;
  manufacturer: string;
  model: string;
  serialNumber: string;
  registrationDate: string;
  status: 'ACTIVE' | 'SCRAPPED' | 'STOLEN';
}

export interface VerificationApplication {
  id: string;
  udii: string;
  repairerId: string;
  repairerName: string;
  repairerLicense: string;
  lmoId?: string;
  technicianReportUrl?: string;
  sealBreakPermissionUrl?: string;
  photos: string[];
  remarks: string;
  status: ApplicationStatus;
  submittedAt: string;
  approvedAt?: string;
  paymentEnabledAt?: string;
  paidAt?: string;
  certificateId?: string;
  rejectionReason?: string;
}

export interface VerificationCertificate {
  id: string;
  applicationId: string;
  udii: string;
  certificateNumber: string;
  issueDate: string;
  expiryDate: string;
  issuedByLmoId: string;
  lmoName: string;
  lmoDesignation: string;
  lmoDistrict: string;
  repairerName: string;
  repairerLicense: string;
  ownerName: string;
  businessName: string;
  businessAddress: string;
  ownerMobile: string;
  ownerEmail: string;
  instrumentType: string;
  subType: string;
  denomination: string;
  quantity: number;
  manufacturer: string;
  model: string;
  serialNumber: string;
  digitalSignature: string;
  digiLockerPushStatus: 'PENDING' | 'SUCCESS' | 'FAILED';
  digiLockerPushDate?: string;
  feePaid: number;
}

export interface Grievance {
  id: string;
  grievanceNumber: string; // e.g. GRV-2026-001234
  udii: string;
  complainantName: string;
  complainantMobile: string;
  complainantEmail: string;
  category: 'Incorrect Measurement (Overcharging)' | 'Expired Verification Certificate' | 'No Verification Stamp on Instrument' | 'Tampered / Broken Seal' | 'LMO / GATC Misconduct' | 'Unlicensed Repairer' | 'Other';
  description: string;
  status: 'Submitted' | 'Assigned' | 'Under Investigation' | 'Resolved';
  assignedToLmo?: string;
  assignedLmoName?: string;
  escalationLevel: number; // 0: Normal, 1: District Inspector, 2: State Controller
  photos: string[];
  locationLat?: number;
  locationLng?: number;
  submittedAt: string;
  assignedAt?: string;
  resolvedAt?: string;
  resolutionNotes?: string;
}

export interface ExpiryAlert {
  id: string;
  udii: string;
  businessName: string;
  daysRemaining: number;
  level: 'INFO' | 'WARNING' | 'URGENT' | 'CRITICAL';
  message: string;
  channels: ('SMS' | 'EMAIL' | 'IN_APP' | 'LMO')[];
  expiryDate: string;
  status: 'SENT' | 'PENDING';
  createdAt: string;
}

export interface FeeCalculation {
  baseFee: number;
  statutoryFee: number;
  lateFee: number;
  subtotal: number;
  gst: number;
  total: number;
  perInstrument: number;
}
