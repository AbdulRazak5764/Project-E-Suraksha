import React from 'react';
import type {
  VerificationApplication,
  Instrument,
  VerificationCertificate,
  ExpiryAlert
} from '../types';
import {
  Scale,
  XCircle,
  AlertTriangle,
  Key,
  Lock
} from 'lucide-react';

interface LMODashboardProps {
  applications: VerificationApplication[];
  instruments: Instrument[];
  certificates?: VerificationCertificate[];
  alerts?: ExpiryAlert[];
  onApproveApplication: (appId: string, dscSignature: string) => void;
  onRejectApplication: (appId: string, reason: string) => void;
}

export const LMODashboard: React.FC<LMODashboardProps> = ({
  applications,
  instruments,
  onApproveApplication,
  onRejectApplication
}) => {
  const [selectedAppId, setSelectedAppId] = React.useState<string | null>(
    applications[0]?.id || null
  );
  const [testWeightInput, setTestWeightInput] = React.useState('100');
  const [observedErrorInput, setObservedErrorInput] = React.useState('0.02');
  const [mpeResult, setMpeResult] = React.useState<'PASS' | 'FAIL'>('PASS');
  const [showDscModal, setShowDscModal] = React.useState(false);
  const [isSigning, setIsSigning] = React.useState(false);
  const [rejectionReason, setRejectionReason] = React.useState('');
  const [showRejectInput, setShowRejectInput] = React.useState(false);

  const pendingApps = applications.filter(
    (a) => a.status === 'AWAITING_LMO_APPROVAL'
  );
  const currentApp = applications.find((a) => a.id === selectedAppId) || pendingApps[0];
  const currentInstrument = currentApp
    ? instruments.find((i) => i.udii === currentApp.udii)
    : null;

  const handleApproveWithDsc = () => {
    setIsSigning(true);
    setTimeout(() => {
      setIsSigning(false);
      setShowDscModal(false);
      if (currentApp) {
        onApproveApplication(
          currentApp.id,
          `SIG_SHA256_RSA2048_S_REDDY_TG_LM_OFFICER_2026_${Date.now()}`
        );
      }
    }, 2000);
  };

  const handleReject = () => {
    if (currentApp && rejectionReason.trim()) {
      onRejectApplication(currentApp.id, rejectionReason.trim());
      setShowRejectInput(false);
      setRejectionReason('');
    }
  };

  return (
    <div className="space-y-6">
      {/* Officer Header */}
      <div className="bg-gradient-to-r from-purple-950 via-indigo-950 to-slate-900 border border-purple-800/60 rounded-2xl p-5 shadow-xl text-white">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 bg-purple-500/20 border border-purple-400/40 rounded-xl flex items-center justify-center text-purple-300">
              <Scale className="w-6 h-6" />
            </div>
            <div>
              <span className="text-[10px] font-bold tracking-widest text-purple-300 uppercase">
                LEGAL METROLOGY OFFICER (LMO) FIELD PORTAL
              </span>
              <h2 className="text-xl font-bold tracking-tight text-white">
                Officer Mr. S. Reddy &bull; Hyderabad Circle
              </h2>
              <p className="text-xs text-purple-200">
                Employee ID: <span className="font-mono text-white">LMO-TG-HYD-042</span> &bull; DSC Serial: <span className="font-mono text-white">8872-9910-4421</span>
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-3">
            <div className="bg-slate-900/80 px-4 py-2 rounded-xl border border-purple-800/60 text-center">
              <span className="text-[10px] text-purple-300 uppercase block font-bold">Pending Review</span>
              <span className="text-xl font-black text-amber-400">{pendingApps.length}</span>
            </div>
          </div>
        </div>
      </div>

      {/* LMO Dashboard Urgent Expiry Alerts */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 shadow-lg space-y-3">
        <div className="flex items-center space-x-2 text-amber-400 text-xs font-bold uppercase tracking-wider">
          <AlertTriangle className="w-4 h-4 text-amber-400" />
          <span>LMO DASHBOARD - URGENT EXPIRY ALERTS</span>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          <div className="bg-red-950/40 border border-red-800/60 p-3 rounded-xl space-y-1">
            <div className="flex items-center justify-between text-xs">
              <span className="font-bold text-red-400">URGENT: EXPIRING TODAY</span>
              <span className="text-[10px] text-red-300">27-08-2026</span>
            </div>
            <div className="font-mono text-xs font-bold text-white">UDII: 250720-1505-008901-Y</div>
            <div className="text-[11px] text-slate-300">Shop: Ramesh Grocery Store</div>
            <div className="text-[11px] text-slate-400">Contact: 9876543210</div>
          </div>
          <div className="bg-orange-950/40 border border-orange-800/60 p-3 rounded-xl space-y-1">
            <div className="flex items-center justify-between text-xs">
              <span className="font-bold text-orange-400">EXPIRING IN 3 DAYS</span>
              <span className="text-[10px] text-orange-300">30-08-2026</span>
            </div>
            <div className="font-mono text-xs font-bold text-white">UDII: 260826-1505-004567-X</div>
            <div className="text-[11px] text-slate-300">Shop: Ramesh Grocery Store</div>
            <div className="text-[11px] text-slate-400">Contact: 9876543210</div>
          </div>
          <div className="bg-yellow-950/40 border border-yellow-800/60 p-3 rounded-xl space-y-1">
            <div className="flex items-center justify-between text-xs">
              <span className="font-bold text-yellow-400">EXPIRING IN 7 DAYS</span>
              <span className="text-[10px] text-yellow-300">03-09-2026</span>
            </div>
            <div className="font-mono text-xs font-bold text-white">UDII: 261015-1505-002345-Z</div>
            <div className="text-[11px] text-slate-300">Shop: Balaji Electronics</div>
            <div className="text-[11px] text-slate-400">Contact: 9876543212</div>
          </div>
        </div>
      </div>

      {/* Main Review & Approval Workstation */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left: Pending Applications List */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 space-y-3">
          <h3 className="font-bold text-sm text-white flex items-center justify-between border-b border-slate-800 pb-2">
            <span>Pending Submissions ({pendingApps.length})</span>
            <span className="text-xs text-indigo-400">Step 3 of Workflow</span>
          </h3>

          {pendingApps.length === 0 ? (
            <div className="text-center py-8 text-slate-500 text-xs">
              All pending verification submissions reviewed!
            </div>
          ) : (
            <div className="space-y-2 max-h-[500px] overflow-y-auto">
              {pendingApps.map((app) => {
                const inst = instruments.find((i) => i.udii === app.udii);
                const isSelected = app.id === currentApp?.id;
                return (
                  <div
                    key={app.id}
                    onClick={() => setSelectedAppId(app.id)}
                    className={`p-3 rounded-xl border cursor-pointer transition ${
                      isSelected
                        ? 'bg-indigo-950/80 border-indigo-500 shadow-md'
                        : 'bg-slate-950/60 border-slate-800 hover:border-slate-700'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-mono text-xs font-bold text-amber-400">{app.udii}</span>
                      <span className="text-[10px] bg-amber-500/20 text-amber-300 px-1.5 py-0.5 rounded font-semibold">
                        AWAITING LMO
                      </span>
                    </div>
                    <div className="text-xs text-white font-medium mt-1">
                      {inst?.subType} ({inst?.denomination})
                    </div>
                    <div className="text-[11px] text-slate-400 mt-0.5 flex justify-between">
                      <span>Repairer: {app.repairerName}</span>
                      <span>{new Date(app.submittedAt).toLocaleDateString()}</span>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Right: Selected Application Detail */}
        {currentApp && currentInstrument ? (
          <div className="lg:col-span-2 space-y-4">
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-4 shadow-xl">
              <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                <div>
                  <span className="text-[10px] text-indigo-400 font-bold uppercase tracking-wider block">
                    INSPECTION REVIEW WORKSTATION
                  </span>
                  <h3 className="font-bold text-lg text-white">
                    {currentInstrument.subType} - {currentInstrument.businessName}
                  </h3>
                </div>
                <div className="font-mono text-xs bg-slate-800 px-3 py-1 rounded-lg border border-slate-700 text-amber-400 font-bold">
                  UDII: {currentApp.udii}
                </div>
              </div>

              {/* Repairer Submission Details */}
              <div className="bg-slate-950 p-4 rounded-xl border border-slate-800/80 space-y-2 text-xs">
                <div className="font-bold text-slate-300 flex items-center justify-between border-b border-slate-800/60 pb-1.5">
                  <span className="text-blue-400">Repairer Submission Data</span>
                  <span>License: {currentApp.repairerLicense}</span>
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 text-slate-300">
                  <div>
                    <span className="text-[10px] text-slate-500 block">Licensed Repairer:</span>
                    <span className="font-semibold text-white">{currentApp.repairerName}</span>
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-500 block">Manufacturer / Model:</span>
                    <span className="font-semibold text-white">{currentInstrument.manufacturer} ({currentInstrument.model})</span>
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-500 block">Serial Number:</span>
                    <span className="font-semibold text-white">{currentInstrument.serialNumber}</span>
                  </div>
                </div>
                <div>
                  <span className="text-[10px] text-slate-500 block">Repairer Remarks:</span>
                  <p className="text-slate-300 italic bg-slate-900 p-2 rounded border border-slate-800">{currentApp.remarks}</p>
                </div>
              </div>

              {/* MPE Accuracy Test Recording Section */}
              <div className="bg-indigo-950/30 border border-indigo-800/60 p-4 rounded-xl space-y-3">
                <div className="flex items-center justify-between">
                  <h4 className="font-bold text-xs text-indigo-200 uppercase tracking-wide flex items-center gap-1.5">
                    <Scale className="w-4 h-4 text-indigo-400" />
                    RECORD PHYSICAL INSPECTION & MPE TEST RESULTS
                  </h4>
                  <span className="text-xs bg-emerald-950 text-emerald-400 px-2 py-0.5 rounded font-bold border border-emerald-800">
                    MPE Rule 27 Compliant
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
                  <div>
                    <label className="block text-slate-400 mb-1">Applied Test Weight (kg/g):</label>
                    <input
                      type="text"
                      value={testWeightInput}
                      onChange={(e) => setTestWeightInput(e.target.value)}
                      className="w-full bg-slate-900 text-white rounded p-2 border border-slate-700 font-mono"
                    />
                  </div>
                  <div>
                    <label className="block text-slate-400 mb-1">Observed Error (% or g):</label>
                    <input
                      type="text"
                      value={observedErrorInput}
                      onChange={(e) => setObservedErrorInput(e.target.value)}
                      className="w-full bg-slate-900 text-white rounded p-2 border border-slate-700 font-mono"
                    />
                  </div>
                  <div>
                    <label className="block text-slate-400 mb-1">MPE Result:</label>
                    <select
                      value={mpeResult}
                      onChange={(e) => setMpeResult(e.target.value as 'PASS' | 'FAIL')}
                      className={`w-full font-bold rounded p-2 border ${
                        mpeResult === 'PASS'
                          ? 'bg-emerald-950 text-emerald-400 border-emerald-700'
                          : 'bg-red-950 text-red-400 border-red-700'
                      }`}
                    >
                      <option value="PASS">PASS - Within MPE Limits</option>
                      <option value="FAIL">FAIL - Exceeds MPE Tolerance</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="pt-2 flex flex-wrap items-center justify-end gap-3">
                {showRejectInput ? (
                  <div className="w-full space-y-2 bg-red-950/40 p-3 rounded-xl border border-red-800">
                    <textarea
                      placeholder="Enter official rejection reason..."
                      value={rejectionReason}
                      onChange={(e) => setRejectionReason(e.target.value)}
                      className="w-full bg-slate-900 text-white text-xs p-2 rounded border border-slate-700"
                    />
                    <div className="flex justify-end space-x-2">
                      <button
                        onClick={() => setShowRejectInput(false)}
                        className="px-3 py-1 bg-slate-800 text-slate-300 text-xs rounded"
                      >
                        Cancel
                      </button>
                      <button
                        onClick={handleReject}
                        className="px-3 py-1 bg-red-600 text-white text-xs font-bold rounded"
                      >
                        Confirm Rejection
                      </button>
                    </div>
                  </div>
                ) : (
                  <>
                    <button
                      onClick={() => setShowRejectInput(true)}
                      className="px-4 py-2 bg-slate-800 hover:bg-red-950 text-red-400 hover:text-red-300 text-xs font-bold rounded-xl border border-slate-700 transition flex items-center space-x-1"
                    >
                      <XCircle className="w-4 h-4" />
                      <span>Reject Application</span>
                    </button>
                    <button
                      onClick={() => setShowDscModal(true)}
                      className="px-5 py-2.5 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white text-xs font-black rounded-xl shadow-lg shadow-purple-600/20 active:scale-95 transition flex items-center space-x-2"
                    >
                      <Key className="w-4 h-4" />
                      <span>Approve & Sign with Digital Signature (DSC)</span>
                    </button>
                  </>
                )}
              </div>
            </div>
          </div>
        ) : (
          <div className="lg:col-span-2 bg-slate-900 border border-slate-800 rounded-2xl p-8 text-center text-slate-500">
            Select an application from the pending queue to inspect.
          </div>
        )}
      </div>

      {/* DSC Digital Signing Modal Simulation */}
      {showDscModal && (
        <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-slate-900 border-2 border-purple-500/80 rounded-2xl p-6 max-w-md w-full shadow-2xl space-y-4 text-white">
            <div className="flex items-center space-x-3 border-b border-slate-800 pb-3">
              <div className="w-10 h-10 bg-purple-600/20 rounded-xl flex items-center justify-center text-purple-400">
                <Key className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-bold text-sm">Legal Metrology DSC Digital Signing</h3>
                <p className="text-xs text-slate-400">Government Class-3 Certificate Verification</p>
              </div>
            </div>

            <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 text-xs space-y-2">
              <div className="flex justify-between text-slate-400">
                <span>Signer:</span>
                <span className="font-bold text-white">Mr. S. Reddy (LMO Officer)</span>
              </div>
              <div className="flex justify-between text-slate-400">
                <span>Target UDII:</span>
                <span className="font-mono font-bold text-amber-400">{currentApp?.udii}</span>
              </div>
              <div className="flex justify-between text-slate-400">
                <span>CA Issuer:</span>
                <span className="text-purple-300">eMudhra CCA India PKI</span>
              </div>
              <div className="flex justify-between text-slate-400">
                <span>Algorithm:</span>
                <span className="font-mono text-xs text-emerald-400">SHA256withRSA 2048-bit</span>
              </div>
            </div>

            {isSigning ? (
              <div className="py-6 text-center space-y-2">
                <div className="w-10 h-10 border-4 border-purple-500 border-t-transparent rounded-full animate-spin mx-auto"></div>
                <p className="text-xs text-purple-300 font-semibold">Applying Cryptographic Stamp & Enabling Payment...</p>
              </div>
            ) : (
              <div className="flex justify-end space-x-2 pt-2">
                <button
                  onClick={() => setShowDscModal(false)}
                  className="px-4 py-2 bg-slate-800 text-slate-300 text-xs font-semibold rounded-lg"
                >
                  Cancel
                </button>
                <button
                  onClick={handleApproveWithDsc}
                  className="px-5 py-2 bg-purple-600 hover:bg-purple-500 text-white text-xs font-bold rounded-lg shadow-lg shadow-purple-600/30 flex items-center space-x-1.5"
                >
                  <Lock className="w-3.5 h-3.5" />
                  <span>Execute Digital Signature</span>
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
