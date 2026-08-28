import type {
  Instrument,
  VerificationApplication,
  VerificationCertificate,
  Grievance,
  ExpiryAlert,
  UserProfile
} from '../types';

const LOCAL_STORAGE_KEY = 'esuraksha_v2_data_store';

export interface DataStore {
  users: UserProfile[];
  instruments: Instrument[];
  applications: VerificationApplication[];
  certificates: VerificationCertificate[];
  grievances: Grievance[];
  alerts: ExpiryAlert[];
  businessQrCode: string;
}

const INITIAL_USERS: UserProfile[] = [
  {
    id: 'usr-shopkeeper-1',
    name: 'Ramesh Kumar',
    businessName: 'Ramesh Grocery Store',
    address: 'H.No. 12-5-32, Main Road, Kukatpally, Hyderabad - 500072, Telangana',
    mobile: '9876543210',
    email: 'ramesh@gmail.com',
    aadhaarHash: 'e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855',
    role: 'SHOPKEEPER'
  },
  {
    id: 'usr-repairer-1',
    name: 'Mr. Sharma',
    businessName: 'Sri Sai Weighing Solutions',
    address: 'Shop No. 4, Industrial Estate, Balanagar, Hyderabad - 500037',
    mobile: '9876543211',
    email: 'repairer.sharma@saiscales.in',
    licenseNumber: 'RL-086/RR/2018',
    aadhaarHash: 'a1b2c3d4e5f67890123456789012345678901234567890123456789012345678',
    role: 'REPAIRER'
  },
  {
    id: 'usr-lmo-1',
    name: 'Mr. S. Reddy',
    businessName: 'Department of Legal Metrology, Govt. of Telangana',
    address: 'Legal Metrology Office, Circle 4, Hyderabad',
    mobile: '9876543212',
    email: 's.reddy.lmo@telangana.gov.in',
    employeeId: 'LMO-TG-HYD-042',
    jurisdictionDistrict: 'Hyderabad',
    aadhaarHash: 'b2c3d4e5f6789012345678901234567890123456789012345678901234567890',
    role: 'LMO'
  }
];

function getDateString(daysFromNow: number): string {
  const d = new Date();
  d.setDate(d.getDate() + daysFromNow);
  return d.toISOString().split('T')[0];
}

const INITIAL_INSTRUMENTS: Instrument[] = [
  {
    udii: '240315-1505-001234-X',
    ownerId: 'usr-shopkeeper-1',
    ownerName: 'Ramesh Kumar',
    businessName: 'Ramesh Grocery Store',
    businessAddress: 'H.No. 12-5-32, Main Road, Kukatpally, Hyderabad',
    mobile: '9876543210',
    email: 'ramesh@gmail.com',
    type: 'weighing_scale',
    subType: 'Mechanical Counter Scale',
    denomination: '0-50kg (30kg)',
    quantity: 1,
    manufacturer: 'Avery India',
    model: 'AV-30M',
    serialNumber: 'SN-2024-0091',
    registrationDate: '2024-03-15',
    status: 'ACTIVE'
  },
  {
    udii: '260826-1505-004567-X',
    ownerId: 'usr-shopkeeper-1',
    ownerName: 'Ramesh Kumar',
    businessName: 'Ramesh Grocery Store',
    businessAddress: 'H.No. 12-5-32, Main Road, Kukatpally, Hyderabad',
    mobile: '9876543210',
    email: 'ramesh@gmail.com',
    type: 'weighing_scale',
    subType: 'Electronic Tabletop Scale',
    denomination: '51-100kg (100kg)',
    quantity: 1,
    manufacturer: 'Essae-Teraoka Pvt. Ltd.',
    model: 'DS-852',
    serialNumber: 'SN-2026-001234',
    registrationDate: '2024-08-26',
    status: 'ACTIVE'
  },
  {
    udii: '250720-1505-008901-Y',
    ownerId: 'usr-shopkeeper-1',
    ownerName: 'Ramesh Kumar',
    businessName: 'Ramesh Grocery Store',
    businessAddress: 'H.No. 12-5-32, Main Road, Kukatpally, Hyderabad',
    mobile: '9876543210',
    email: 'ramesh@gmail.com',
    type: 'weighing_scale',
    subType: 'Electronic Platform Scale',
    denomination: '101-500kg (300kg)',
    quantity: 1,
    manufacturer: 'Essae-Teraoka Pvt. Ltd.',
    model: 'DS-980',
    serialNumber: 'SN-2025-0088',
    registrationDate: '2025-08-26',
    status: 'ACTIVE'
  },
  {
    udii: '261015-1505-002345-Z',
    ownerId: 'usr-shopkeeper-1',
    ownerName: 'Ramesh Kumar',
    businessName: 'Ramesh Grocery Store',
    businessAddress: 'H.No. 12-5-32, Main Road, Kukatpally, Hyderabad',
    mobile: '9876543210',
    email: 'ramesh@gmail.com',
    type: 'length_measure',
    subType: 'Steel Tape Measure',
    denomination: '0-10m (5m)',
    quantity: 2,
    manufacturer: 'Freemans Measuring Tape',
    model: 'FMT-5M',
    serialNumber: 'SN-2025-0442',
    registrationDate: '2024-10-15',
    status: 'ACTIVE'
  },
  {
    udii: '261220-1505-009876-A',
    ownerId: 'usr-shopkeeper-1',
    ownerName: 'Ramesh Kumar',
    businessName: 'Ramesh Grocery Store',
    businessAddress: 'H.No. 12-5-32, Main Road, Kukatpally, Hyderabad',
    mobile: '9876543210',
    email: 'ramesh@gmail.com',
    type: 'storage_tank',
    subType: 'Vertical Storage Vessel',
    denomination: '0-1000L (1000L)',
    quantity: 1,
    manufacturer: 'Vanguard Tanks',
    model: 'VT-1000',
    serialNumber: 'SN-2023-991',
    registrationDate: '2023-12-20',
    status: 'ACTIVE'
  }
];

const INITIAL_CERTIFICATES: VerificationCertificate[] = [
  {
    id: 'cert-1',
    applicationId: 'app-old-1',
    udii: '240315-1505-001234-X',
    certificateNumber: 'TG-HYD-2024-001123',
    issueDate: '2024-03-15',
    expiryDate: getDateString(-164),
    issuedByLmoId: 'usr-lmo-1',
    lmoName: 'Mr. S. Reddy',
    lmoDesignation: 'Legal Metrology Officer (LMO)',
    lmoDistrict: 'Hyderabad Circle',
    repairerName: 'Mr. Sharma',
    repairerLicense: 'RL-086/RR/2018',
    ownerName: 'Ramesh Kumar',
    businessName: 'Ramesh Grocery Store',
    businessAddress: 'H.No. 12-5-32, Main Road, Kukatpally, Hyderabad',
    ownerMobile: '9876543210',
    ownerEmail: 'ramesh@gmail.com',
    instrumentType: 'Weighing Scale',
    subType: 'Mechanical Counter Scale',
    denomination: '0-50kg (30kg)',
    quantity: 1,
    manufacturer: 'Avery India',
    model: 'AV-30M',
    serialNumber: 'SN-2024-0091',
    digitalSignature: 'SIG_SHA256_RSA2048_S_REDDY_TG_LM_OFFICER_2024',
    digiLockerPushStatus: 'SUCCESS',
    digiLockerPushDate: '2024-03-15T11:20:00Z',
    feePaid: 354
  },
  {
    id: 'cert-2',
    applicationId: 'app-old-2',
    udii: '260826-1505-004567-X',
    certificateNumber: 'TG-HYD-2024-001234',
    issueDate: '2024-08-28',
    expiryDate: getDateString(22),
    issuedByLmoId: 'usr-lmo-1',
    lmoName: 'Mr. S. Reddy',
    lmoDesignation: 'Legal Metrology Officer (LMO)',
    lmoDistrict: 'Hyderabad Circle',
    repairerName: 'Mr. Sharma',
    repairerLicense: 'RL-086/RR/2018',
    ownerName: 'Ramesh Kumar',
    businessName: 'Ramesh Grocery Store',
    businessAddress: 'H.No. 12-5-32, Main Road, Kukatpally, Hyderabad',
    ownerMobile: '9876543210',
    ownerEmail: 'ramesh@gmail.com',
    instrumentType: 'Weighing Scale',
    subType: 'Electronic Tabletop Scale',
    denomination: '51-100kg (100kg)',
    quantity: 1,
    manufacturer: 'Essae-Teraoka Pvt. Ltd.',
    model: 'DS-852',
    serialNumber: 'SN-2026-001234',
    digitalSignature: 'SIG_SHA256_RSA2048_S_REDDY_TG_LM_OFFICER_2024',
    digiLockerPushStatus: 'SUCCESS',
    digiLockerPushDate: '2024-08-28T14:30:00Z',
    feePaid: 413
  },
  {
    id: 'cert-3',
    applicationId: 'app-old-3',
    udii: '250720-1505-008901-Y',
    certificateNumber: 'TG-HYD-2025-008901',
    issueDate: '2025-08-28',
    expiryDate: getDateString(2),
    issuedByLmoId: 'usr-lmo-1',
    lmoName: 'Mr. S. Reddy',
    lmoDesignation: 'Legal Metrology Officer (LMO)',
    lmoDistrict: 'Hyderabad Circle',
    repairerName: 'Mr. Sharma',
    repairerLicense: 'RL-086/RR/2018',
    ownerName: 'Ramesh Kumar',
    businessName: 'Ramesh Grocery Store',
    businessAddress: 'H.No. 12-5-32, Main Road, Kukatpally, Hyderabad',
    ownerMobile: '9876543210',
    ownerEmail: 'ramesh@gmail.com',
    instrumentType: 'Weighing Scale',
    subType: 'Electronic Platform Scale',
    denomination: '101-500kg (300kg)',
    quantity: 1,
    manufacturer: 'Essae-Teraoka Pvt. Ltd.',
    model: 'DS-980',
    serialNumber: 'SN-2025-0088',
    digitalSignature: 'SIG_SHA256_RSA2048_S_REDDY_TG_LM_OFFICER_2025',
    digiLockerPushStatus: 'SUCCESS',
    digiLockerPushDate: '2025-08-28T10:15:00Z',
    feePaid: 472
  },
  {
    id: 'cert-4',
    applicationId: 'app-old-4',
    udii: '261015-1505-002345-Z',
    certificateNumber: 'TG-HYD-2024-005521',
    issueDate: '2024-10-15',
    expiryDate: getDateString(45),
    issuedByLmoId: 'usr-lmo-1',
    lmoName: 'Mr. S. Reddy',
    lmoDesignation: 'Legal Metrology Officer (LMO)',
    lmoDistrict: 'Hyderabad Circle',
    repairerName: 'Mr. Sharma',
    repairerLicense: 'RL-086/RR/2018',
    ownerName: 'Ramesh Kumar',
    businessName: 'Ramesh Grocery Store',
    businessAddress: 'H.No. 12-5-32, Main Road, Kukatpally, Hyderabad',
    ownerMobile: '9876543210',
    ownerEmail: 'ramesh@gmail.com',
    instrumentType: 'Length Measure',
    subType: 'Steel Tape Measure',
    denomination: '0-10m (5m)',
    quantity: 2,
    manufacturer: 'Freemans Measuring Tape',
    model: 'FMT-5M',
    serialNumber: 'SN-2025-0442',
    digitalSignature: 'SIG_SHA256_RSA2048_S_REDDY_TG_LM_OFFICER_2024',
    digiLockerPushStatus: 'SUCCESS',
    digiLockerPushDate: '2024-10-15T09:00:00Z',
    feePaid: 123.9
  },
  {
    id: 'cert-5',
    applicationId: 'app-old-5',
    udii: '261220-1505-009876-A',
    certificateNumber: 'TG-HYD-2023-009876',
    issueDate: '2023-12-20',
    expiryDate: getDateString(845),
    issuedByLmoId: 'usr-lmo-1',
    lmoName: 'Mr. S. Reddy',
    lmoDesignation: 'Legal Metrology Officer (LMO)',
    lmoDistrict: 'Hyderabad Circle',
    repairerName: 'Mr. Sharma',
    repairerLicense: 'RL-086/RR/2018',
    ownerName: 'Ramesh Kumar',
    businessName: 'Ramesh Grocery Store',
    businessAddress: 'H.No. 12-5-32, Main Road, Kukatpally, Hyderabad',
    ownerMobile: '9876543210',
    ownerEmail: 'ramesh@gmail.com',
    instrumentType: 'Storage Tank',
    subType: 'Vertical Storage Vessel',
    denomination: '0-1000L (1000L)',
    quantity: 1,
    manufacturer: 'Vanguard Tanks',
    model: 'VT-1000',
    serialNumber: 'SN-2023-991',
    digitalSignature: 'SIG_SHA256_RSA2048_S_REDDY_TG_LM_OFFICER_2023',
    digiLockerPushStatus: 'SUCCESS',
    digiLockerPushDate: '2023-12-20T16:00:00Z',
    feePaid: 619.5
  }
];

const INITIAL_APPLICATIONS: VerificationApplication[] = [
  {
    id: 'app-2026-001234',
    udii: '260826-1505-004567-X',
    repairerId: 'usr-repairer-1',
    repairerName: 'Mr. Sharma',
    repairerLicense: 'RL-086/RR/2018',
    lmoId: 'usr-lmo-1',
    technicianReportUrl: 'https://storage.lmd.gov.in/reports/tech_001.pdf',
    sealBreakPermissionUrl: 'https://storage.lmd.gov.in/seal/perm_001.pdf',
    photos: [
      'https://images.unsplash.com/photo-1591488320449-011701bb6704?w=500&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1581092160607-ee22621dd758?w=500&auto=format&fit=crop'
    ],
    remarks: 'Annual re-verification requested. Calibration & zero-setting verified. Physical seal broken for internal sensor dust cleaning and resealed.',
    status: 'AWAITING_LMO_APPROVAL',
    submittedAt: '2026-08-27T10:30:00Z'
  }
];

const INITIAL_GRIEVANCES: Grievance[] = [
  {
    id: 'grv-1',
    grievanceNumber: 'GRV-2026-001234',
    udii: '260826-1505-004567-X',
    complainantName: 'Kiran Kumar',
    complainantMobile: '9876543299',
    complainantEmail: 'kiran.k@gmail.com',
    category: 'Incorrect Measurement (Overcharging)',
    description: 'The shopkeeper\'s weighing scale showed 500g weight for 450g of rice during my purchase. I suspect calibration tampering or an unverified scale.',
    status: 'Under Investigation',
    assignedToLmo: 'usr-lmo-1',
    assignedLmoName: 'Mr. S. Reddy',
    escalationLevel: 0,
    photos: [
      'https://images.unsplash.com/photo-1581092160607-ee22621dd758?w=500&auto=format&fit=crop'
    ],
    locationLat: 17.385,
    locationLng: 78.4867,
    submittedAt: '2026-08-25T10:00:00Z',
    assignedAt: '2026-08-25T16:00:00Z'
  },
  {
    id: 'grv-2',
    grievanceNumber: 'GRV-2026-001230',
    udii: '250720-1505-008901-Y',
    complainantName: 'Suresh Raina',
    complainantMobile: '9876543288',
    complainantEmail: 'suresh.r@gmail.com',
    category: 'Expired Verification Certificate',
    description: 'Expired verification certificate displayed on premises without renewal stamp.',
    status: 'Resolved',
    assignedToLmo: 'usr-lmo-1',
    assignedLmoName: 'Mr. S. Reddy',
    escalationLevel: 0,
    photos: [],
    submittedAt: '2026-08-15T12:00:00Z',
    assignedAt: '2026-08-15T14:00:00Z',
    resolvedAt: '2026-08-20T11:00:00Z',
    resolutionNotes: 'Shopkeeper renewed verification certificate and paid statutory fees.'
  }
];

const INITIAL_ALERTS: ExpiryAlert[] = [
  {
    id: 'alert-1',
    udii: '250720-1505-008901-Y',
    businessName: 'Ramesh Grocery Store',
    daysRemaining: 2,
    level: 'URGENT',
    message: 'URGENT: 2 DAYS LEFT! Late fees & penalties will apply if UDII 250720-1505-008901-Y is not renewed by due date.',
    channels: ['SMS', 'EMAIL', 'IN_APP'],
    expiryDate: getDateString(2),
    status: 'SENT',
    createdAt: '2026-08-26T08:00:00Z'
  },
  {
    id: 'alert-2',
    udii: '260826-1505-004567-X',
    businessName: 'Ramesh Grocery Store',
    daysRemaining: 22,
    level: 'INFO',
    message: 'Notice: Your verification for UDII 260826-1505-004567-X expires in 22 days. Apply for renewal now.',
    channels: ['SMS', 'EMAIL'],
    expiryDate: getDateString(22),
    status: 'SENT',
    createdAt: '2026-08-24T08:00:00Z'
  },
  {
    id: 'alert-3',
    udii: '240315-1505-001234-X',
    businessName: 'Ramesh Grocery Store',
    daysRemaining: -164,
    level: 'CRITICAL',
    message: 'CRITICAL ALERT: UDII 240315-1505-001234-X is EXPIRED. Non-compliance enforcement notice issued under Legal Metrology Act Sec 24.',
    channels: ['SMS', 'EMAIL', 'LMO'],
    expiryDate: getDateString(-164),
    status: 'SENT',
    createdAt: '2026-08-01T08:00:00Z'
  }
];

export function getInitialDataStore(): DataStore {
  const stored = localStorage.getItem(LOCAL_STORAGE_KEY);
  if (stored) {
    try {
      return JSON.parse(stored);
    } catch (e) {
      console.error('Failed to parse local storage, resetting to defaults', e);
    }
  }

  const defaultStore: DataStore = {
    users: INITIAL_USERS,
    instruments: INITIAL_INSTRUMENTS,
    applications: INITIAL_APPLICATIONS,
    certificates: INITIAL_CERTIFICATES,
    grievances: INITIAL_GRIEVANCES,
    alerts: INITIAL_ALERTS,
    businessQrCode: 'BIZ-TG-HYD-2026-001'
  };

  saveDataStore(defaultStore);
  return defaultStore;
}

export function saveDataStore(store: DataStore): void {
  localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(store));
}
