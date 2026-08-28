import React from 'react';
import type {
  UserRole,
  Instrument,
  VerificationApplication,
  VerificationCertificate,
  Grievance,
  UserProfile
} from './types';
import { getInitialDataStore, saveDataStore } from './utils/storage';
import type { DataStore } from './utils/storage';
import { LandingPage } from './components/LandingPage';
import { Header } from './components/Header';
import { RoleSelector } from './components/RoleSelector';
import { LoginPage } from './components/LoginPage';
import { BusinessScannerView } from './components/BusinessScannerView';
import { RepairerForm } from './components/RepairerForm';
import { LMODashboard } from './components/LMODashboard';
import { ConsumerView } from './components/ConsumerView';
import { AdminDashboard } from './components/AdminDashboard';
import { CertificateModal } from './components/CertificateModal';
import { PaymentModal } from './components/PaymentModal';
import { GrievanceModule } from './components/GrievanceModule';
import { QRScanModal } from './components/QRScanModal';
import { AddInstrumentModal } from './components/AddInstrumentModal';
import { X } from 'lucide-react';

export function App() {
  const [store, setStore] = React.useState<DataStore>(() => getInitialDataStore());
  const [currentUser, setCurrentUser] = React.useState<UserProfile | null>(null);
  const [currentRole, setCurrentRole] = React.useState<UserRole>('SHOPKEEPER');

  // Modals state
  const [loginModalRole, setLoginModalRole] = React.useState<UserRole | null>(null);
  const [activeCertificateUdii, setActiveCertificateUdii] = React.useState<string | null>(null);
  const [paymentUdiiList, setPaymentUdiiList] = React.useState<string[] | null>(null);
  const [showQRScanner, setShowQRScanner] = React.useState(false);
  const [showAddInstrumentModal, setShowAddInstrumentModal] = React.useState(false);
  const [selectedUdiiForRepair, setSelectedUdiiForRepair] = React.useState<string>('');
  const [activeGrievanceView, setActiveGrievanceView] = React.useState(false);

  // Sync state changes to local storage
  const updateStore = (updater: (prev: DataStore) => DataStore) => {
    setStore((prev) => {
      const next = updater(prev);
      saveDataStore(next);
      return next;
    });
  };

  // Login handler
  const handleLoginSuccess = (user: UserProfile) => {
    setCurrentUser(user);
    setCurrentRole(user.role);
    setLoginModalRole(null);
  };

  // Register user handler
  const handleRegisterUser = (newUser: UserProfile) => {
    updateStore((prev) => ({
      ...prev,
      users: [newUser, ...prev.users]
    }));
  };

  // Logout handler
  const handleLogout = () => {
    setCurrentUser(null);
  };

  // Certificate Open Handler
  const handleOpenCertificate = (udii: string) => {
    setActiveCertificateUdii(udii);
  };

  // Payment Success Handler
  const handlePaymentSuccess = (udiiList: string[], totalAmount: number) => {
    updateStore((prev) => {
      const newCertificates: VerificationCertificate[] = udiiList.map((udii, idx) => {
        const inst = prev.instruments.find((i) => i.udii === udii);
        const certNum = `TG-HYD-2026-${Math.floor(100000 + Math.random() * 900000)}`;

        const nextYear = new Date();
        nextYear.setFullYear(nextYear.getFullYear() + 2);

        return {
          id: `cert-gen-${Date.now()}-${idx}`,
          applicationId: `app-${Date.now()}`,
          udii,
          certificateNumber: certNum,
          issueDate: new Date().toISOString().split('T')[0],
          expiryDate: nextYear.toISOString().split('T')[0],
          issuedByLmoId: 'usr-lmo-1',
          lmoName: 'Mr. S. Reddy',
          lmoDesignation: 'Legal Metrology Officer (LMO)',
          lmoDistrict: 'Hyderabad Circle',
          repairerName: 'Mr. Sharma',
          repairerLicense: 'RL-086/RR/2018',
          ownerName: inst?.ownerName || currentUser?.name || 'Ramesh Kumar',
          businessName: inst?.businessName || currentUser?.businessName || 'Ramesh Grocery Store',
          businessAddress: inst?.businessAddress || currentUser?.address || 'Hyderabad',
          ownerMobile: inst?.mobile || currentUser?.mobile || '9876543210',
          ownerEmail: inst?.email || currentUser?.email || 'ramesh@gmail.com',
          instrumentType: inst?.type === 'weighing_scale' ? 'Weighing Scale' : 'Measuring Instrument',
          subType: inst?.subType || 'Electronic Tabletop Scale',
          denomination: inst?.denomination || '100kg',
          quantity: inst?.quantity || 1,
          manufacturer: inst?.manufacturer || 'Essae-Teraoka',
          model: inst?.model || 'DS-852',
          serialNumber: inst?.serialNumber || 'SN-2026-001',
          digitalSignature: `SIG_SHA256_RSA2048_S_REDDY_TG_LM_OFFICER_2026_${Date.now()}`,
          digiLockerPushStatus: 'SUCCESS',
          digiLockerPushDate: new Date().toISOString(),
          feePaid: totalAmount / udiiList.length
        };
      });

      return {
        ...prev,
        certificates: [...prev.certificates, ...newCertificates]
      };
    });

    setPaymentUdiiList(null);
  };

  // Submit Application from Repairer
  const handleSubmitApplication = (appData: Partial<VerificationApplication>) => {
    updateStore((prev) => {
      const newApp: VerificationApplication = {
        id: `app-${Date.now()}`,
        udii: appData.udii || '',
        repairerId: currentUser?.id || 'usr-repairer-1',
        repairerName: currentUser?.name || appData.repairerName || 'Mr. Sharma',
        repairerLicense: currentUser?.licenseNumber || appData.repairerLicense || 'RL-086/RR/2018',
        technicianReportUrl: appData.technicianReportUrl,
        sealBreakPermissionUrl: appData.sealBreakPermissionUrl,
        photos: appData.photos || [],
        remarks: appData.remarks || '',
        status: 'AWAITING_LMO_APPROVAL',
        submittedAt: new Date().toISOString()
      };

      return {
        ...prev,
        applications: [newApp, ...prev.applications]
      };
    });
  };

  // Approve Application by LMO Officer
  const handleApproveApplication = (appId: string, _dscSignature: string) => {
    updateStore((prev) => {
      const updatedApps = prev.applications.map((a) => {
        if (a.id === appId) {
          return {
            ...a,
            status: 'APPROVED' as const,
            approvedAt: new Date().toISOString()
          };
        }
        return a;
      });

      const targetApp = prev.applications.find((a) => a.id === appId);
      if (targetApp) {
        setPaymentUdiiList([targetApp.udii]);
      }

      return {
        ...prev,
        applications: updatedApps
      };
    });
  };

  // Reject Application by LMO Officer
  const handleRejectApplication = (appId: string, reason: string) => {
    updateStore((prev) => {
      const updatedApps = prev.applications.map((a) => {
        if (a.id === appId) {
          return {
            ...a,
            status: 'REJECTED' as const,
            rejectionReason: reason
          };
        }
        return a;
      });

      return {
        ...prev,
        applications: updatedApps
      };
    });
  };

  // Add Grievance by Consumer
  const handleFileGrievance = (grievanceData: Partial<Grievance>) => {
    updateStore((prev) => {
      const newGrv: Grievance = {
        id: `grv-${Date.now()}`,
        grievanceNumber: grievanceData.grievanceNumber || `GRV-2026-${Math.floor(100000 + Math.random() * 900000)}`,
        udii: grievanceData.udii || '',
        complainantName: currentUser?.name || grievanceData.complainantName || 'Consumer',
        complainantMobile: currentUser?.mobile || grievanceData.complainantMobile || '9876543210',
        complainantEmail: currentUser?.email || grievanceData.complainantEmail || 'consumer@gmail.com',
        category: grievanceData.category || 'Incorrect Measurement (Overcharging)',
        description: grievanceData.description || '',
        status: 'Submitted',
        assignedToLmo: 'usr-lmo-1',
        assignedLmoName: 'Mr. S. Reddy',
        escalationLevel: 0,
        photos: grievanceData.photos || [],
        locationLat: 17.385,
        locationLng: 78.4867,
        submittedAt: new Date().toISOString()
      };

      return {
        ...prev,
        grievances: [newGrv, ...prev.grievances]
      };
    });
  };

  // Register New Instrument
  const handleAddNewInstrument = (newInst: Instrument) => {
    updateStore((prev) => ({
      ...prev,
      instruments: [newInst, ...prev.instruments]
    }));
  };

  const selectedCert = store.certificates.find((c) => c.udii === activeCertificateUdii);

  // If NOT logged in, show Landing Page with Login Modal Option
  if (!currentUser) {
    return (
      <div>
        <LandingPage
          users={store.users}
          instruments={store.instruments}
          certificates={store.certificates}
          onOpenLoginModal={(role) => setLoginModalRole(role)}
          onSearchUDII={(udii) => setActiveCertificateUdii(udii)}
        />

        {/* Login Modal Popup */}
        {loginModalRole && (
          <div className="fixed inset-0 bg-slate-950/85 backdrop-blur-md z-50 flex items-center justify-center p-4 overflow-y-auto">
            <div className="relative w-full max-w-xl">
              <button
                onClick={() => setLoginModalRole(null)}
                className="absolute top-4 right-4 z-50 text-slate-400 hover:text-white transition p-2 bg-slate-900 rounded-full"
              >
                <X className="w-5 h-5" />
              </button>
              <LoginPage
                users={store.users}
                onLoginSuccess={handleLoginSuccess}
                onRegisterUser={handleRegisterUser}
              />
            </div>
          </div>
        )}

        {/* Public Certificate View Modal */}
        {activeCertificateUdii && selectedCert && (
          <CertificateModal
            certificate={selectedCert}
            onClose={() => setActiveCertificateUdii(null)}
          />
        )}
      </div>
    );
  }

  // Filter user's own instruments if shopkeeper
  const userInstruments =
    currentRole === 'SHOPKEEPER'
      ? store.instruments.filter((i) => i.ownerId === currentUser.id || i.ownerId === 'usr-shopkeeper-1')
      : store.instruments;

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 font-sans selection:bg-indigo-500 selection:text-white pb-12">
      {/* Official Header */}
      <Header
        currentUser={currentUser}
        currentRole={currentRole}
        onOpenQRScanner={() => setShowQRScanner(true)}
        onSearchUDII={(udii) => {
          setActiveCertificateUdii(udii);
        }}
        activeAlertCount={store.alerts.length}
        onOpenAddInstrumentModal={() => setShowAddInstrumentModal(true)}
        onLogout={handleLogout}
      />

      {/* Role Switcher Navigation Bar */}
      <RoleSelector currentRole={currentRole} onRoleChange={setCurrentRole} />

      {/* Main Content Area */}
      <main className="max-w-7xl mx-auto px-4 py-6">
        {/* SHOPKEEPER ROLE */}
        {currentRole === 'SHOPKEEPER' && (
          <BusinessScannerView
            currentUser={currentUser}
            instruments={userInstruments}
            certificates={store.certificates}
            alerts={store.alerts}
            businessQrCode={store.businessQrCode}
            onOpenCertificate={handleOpenCertificate}
            onInitiatePayment={(list) => setPaymentUdiiList(list)}
            onSelectInstrumentForRepair={(udii) => {
              setSelectedUdiiForRepair(udii);
              setCurrentRole('REPAIRER');
            }}
            onOpenAddInstrumentModal={() => setShowAddInstrumentModal(true)}
          />
        )}

        {/* REPAIRER ROLE */}
        {currentRole === 'REPAIRER' && (
          <RepairerForm
            instruments={store.instruments}
            certificates={store.certificates}
            initialUdii={selectedUdiiForRepair}
            onSubmitApplication={handleSubmitApplication}
          />
        )}

        {/* LMO OFFICER ROLE */}
        {currentRole === 'LMO' && (
          <LMODashboard
            applications={store.applications}
            instruments={store.instruments}
            certificates={store.certificates}
            alerts={store.alerts}
            onApproveApplication={handleApproveApplication}
            onRejectApplication={handleRejectApplication}
          />
        )}

        {/* CONSUMER ROLE */}
        {currentRole === 'CONSUMER' && (
          <div>
            {activeGrievanceView ? (
              <GrievanceModule
                grievances={store.grievances}
                instruments={store.instruments}
                onFileGrievance={handleFileGrievance}
              />
            ) : (
              <ConsumerView
                instruments={store.instruments}
                certificates={store.certificates}
                onOpenGrievanceForm={() => setActiveGrievanceView(true)}
                onOpenCertificate={handleOpenCertificate}
              />
            )}
          </div>
        )}

        {/* STATE ADMIN ROLE */}
        {currentRole === 'ADMIN' && (
          <AdminDashboard
            instruments={store.instruments}
            certificates={store.certificates}
            applications={store.applications}
            grievances={store.grievances}
            onAddNewInstrument={handleAddNewInstrument}
          />
        )}
      </main>

      {/* MODALS */}

      {/* Add New Instrument Modal */}
      {showAddInstrumentModal && (
        <AddInstrumentModal
          currentUser={currentUser}
          onClose={() => setShowAddInstrumentModal(false)}
          onAddInstrument={handleAddNewInstrument}
        />
      )}

      {/* Official Verification Certificate Modal */}
      {activeCertificateUdii && selectedCert && (
        <CertificateModal
          certificate={selectedCert}
          onClose={() => setActiveCertificateUdii(null)}
        />
      )}

      {/* Payment Gateway Modal */}
      {paymentUdiiList && paymentUdiiList.length > 0 && (
        <PaymentModal
          udiiList={paymentUdiiList}
          instruments={store.instruments}
          certificates={store.certificates}
          onClose={() => setPaymentUdiiList(null)}
          onPaymentSuccess={handlePaymentSuccess}
        />
      )}

      {/* QR Code Scanner Modal */}
      {showQRScanner && (
        <QRScanModal
          instruments={store.instruments}
          onClose={() => setShowQRScanner(false)}
          onSelectUDII={(udii) => {
            setActiveCertificateUdii(udii);
          }}
        />
      )}
    </div>
  );
}

export default App;
