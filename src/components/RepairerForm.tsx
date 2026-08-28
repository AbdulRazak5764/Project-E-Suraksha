import React from 'react';
import type {
  Instrument,
  VerificationCertificate,
  VerificationApplication
} from '../types';
import {
  Wrench,
  QrCode,
  CheckCircle,
  FileCheck,
  Send,
  MapPin,
  Clock,
  Sparkles,
  Check
} from 'lucide-react';

interface RepairerFormProps {
  instruments: Instrument[];
  certificates: VerificationCertificate[];
  initialUdii?: string;
  onSubmitApplication: (app: Partial<VerificationApplication>) => void;
}

export const RepairerForm: React.FC<RepairerFormProps> = ({
  instruments,
  certificates,
  initialUdii = '',
  onSubmitApplication
}) => {
  const [selectedUdii, setSelectedUdii] = React.useState(initialUdii || (instruments[0]?.udii || ''));
  const [remarks, setRemarks] = React.useState(
    'Annual repair, cleaning and recalibration completed. Accuracy verified within Maximum Permissible Error (MPE).'
  );
  const [techReportFile] = React.useState<string | null>(
    'https://storage.lmd.gov.in/reports/tech_001.pdf'
  );
  const [sealPermissionFile] = React.useState<string | null>(
    'https://storage.lmd.gov.in/seal/perm_001.pdf'
  );
  const [photos] = React.useState<string[]>([
    'https://images.unsplash.com/photo-1591488320449-011701bb6704?w=500&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1581092160607-ee22621dd758?w=500&auto=format&fit=crop'
  ]);
  const [submittedSuccess, setSubmittedSuccess] = React.useState(false);

  const currentInstrument = instruments.find((i) => i.udii === selectedUdii);
  const latestCertificate = certificates
    .filter((c) => c.udii === selectedUdii)
    .sort((a, b) => new Date(b.issueDate).getTime() - new Date(a.issueDate).getTime())[0];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedUdii || !currentInstrument) return;

    onSubmitApplication({
      udii: selectedUdii,
      repairerId: 'usr-repairer-1',
      repairerName: 'Mr. Sharma',
      repairerLicense: 'RL-086/RR/2018',
      technicianReportUrl: techReportFile || undefined,
      sealBreakPermissionUrl: sealPermissionFile || undefined,
      photos,
      remarks,
      status: 'AWAITING_LMO_APPROVAL',
      submittedAt: new Date().toISOString()
    });

    setSubmittedSuccess(true);
    setTimeout(() => {
      setSubmittedSuccess(false);
    }, 4000);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Module Title Banner */}
      <div className="bg-gradient-to-r from-blue-900 via-indigo-900 to-slate-900 border border-blue-700/50 rounded-2xl p-5 shadow-xl text-white">
        <div className="flex items-center space-x-3">
          <div className="w-12 h-12 bg-blue-500/20 border border-blue-400/40 rounded-xl flex items-center justify-center text-blue-400">
            <Wrench className="w-6 h-6" />
          </div>
          <div>
            <span className="text-[10px] font-bold tracking-widest text-blue-300 uppercase">
              MODULE 8: REPAIRER AUTO-FILL WORKFLOW
            </span>
            <h2 className="text-xl font-bold tracking-tight text-white">
              Digital Repairer Entry & LMO Approval Submission
            </h2>
            <p className="text-xs text-blue-200">
              Scan UDII QR code &bull; 30-Day Auto-Fill from last verification record &bull; Instant LMO Notification
            </p>
          </div>
        </div>
      </div>

      {submittedSuccess && (
        <div className="bg-emerald-950/80 border-2 border-emerald-500 text-emerald-200 p-4 rounded-xl flex items-center space-x-3 animate-fade-in shadow-xl">
          <CheckCircle className="w-6 h-6 text-emerald-400 flex-shrink-0" />
          <div>
            <h4 className="font-bold text-sm">Application Submitted Successfully!</h4>
            <p className="text-xs text-emerald-300">
              Application is now pending LMO approval (Status: <span className="font-mono font-bold text-white">AWAITING_LMO_APPROVAL</span>). Assigned LMO Officer Mr. S. Reddy notified via SMS/Email.
            </p>
          </div>
        </div>
      )}

      {/* Step 1: Scan / Select Instrument UDII */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-4 shadow-lg">
        <div className="flex items-center justify-between border-b border-slate-800 pb-3">
          <div className="flex items-center space-x-2">
            <span className="w-6 h-6 rounded-full bg-blue-600 text-white font-bold text-xs flex items-center justify-center">
              1
            </span>
            <h3 className="font-bold text-sm text-white">Scan Machine QR Code / Select UDII</h3>
          </div>
          <span className="text-xs text-emerald-400 font-semibold flex items-center gap-1">
            <Sparkles className="w-3.5 h-3.5" /> 30-Day Auto-Fill Active
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-medium text-slate-300 mb-1">
              Select Instrument UDII (Simulated QR Scan):
            </label>
            <select
              value={selectedUdii}
              onChange={(e) => setSelectedUdii(e.target.value)}
              className="w-full bg-slate-800 text-white text-xs rounded-lg px-3 py-2.5 border border-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500 font-mono font-semibold"
            >
              {instruments.map((i) => (
                <option key={i.udii} value={i.udii}>
                  {i.udii} - {i.subType} ({i.denomination})
                </option>
              ))}
            </select>
          </div>

          <div className="flex items-end">
            <div className="w-full bg-blue-950/40 border border-blue-800/60 rounded-lg p-2.5 text-xs text-blue-200 flex items-center justify-between">
              <div>
                <span className="text-[10px] text-blue-400 font-bold uppercase block">Scanned Machine Identity</span>
                <span className="font-mono font-bold text-white text-xs">{selectedUdii}</span>
              </div>
              <QrCode className="w-6 h-6 text-blue-400" />
            </div>
          </div>
        </div>
      </div>

      {/* Step 2: Auto-Filled Fields */}
      {currentInstrument && (
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-4 shadow-lg">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div className="flex items-center space-x-2">
                <span className="w-6 h-6 rounded-full bg-blue-600 text-white font-bold text-xs flex items-center justify-center">
                  2
                </span>
                <h3 className="font-bold text-sm text-white">Auto-Populated Details (From Last Verification Record)</h3>
              </div>
              <span className="text-xs bg-emerald-950 text-emerald-400 px-2 py-0.5 rounded border border-emerald-800 font-bold flex items-center gap-1">
                <Check className="w-3 h-3" /> Auto-Filled via UDII
              </span>
            </div>

            {/* Readonly Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 bg-slate-950/60 p-4 rounded-xl border border-slate-800/80">
              <div>
                <span className="text-[10px] text-slate-400 block font-semibold">Shop / Firm Name</span>
                <span className="text-xs font-bold text-white">{currentInstrument.businessName}</span>
              </div>
              <div>
                <span className="text-[10px] text-slate-400 block font-semibold">Owner Name & Mobile</span>
                <span className="text-xs font-bold text-white">{currentInstrument.ownerName} ({currentInstrument.mobile})</span>
              </div>
              <div>
                <span className="text-[10px] text-slate-400 block font-semibold">Shop Address</span>
                <span className="text-xs font-bold text-white truncate block">{currentInstrument.businessAddress}</span>
              </div>
              <div>
                <span className="text-[10px] text-slate-400 block font-semibold">Instrument Type</span>
                <span className="text-xs font-bold text-amber-400">{currentInstrument.subType}</span>
              </div>
              <div>
                <span className="text-[10px] text-slate-400 block font-semibold">Denomination & Qty</span>
                <span className="text-xs font-bold text-white">{currentInstrument.denomination} (Qty: {currentInstrument.quantity})</span>
              </div>
              <div>
                <span className="text-[10px] text-slate-400 block font-semibold">Manufacturer & Model</span>
                <span className="text-xs font-bold text-white">{currentInstrument.manufacturer} - {currentInstrument.model}</span>
              </div>
              <div>
                <span className="text-[10px] text-slate-400 block font-semibold">Last Certificate Number</span>
                <span className="text-xs font-mono text-indigo-300 font-bold">{latestCertificate?.certificateNumber || 'TG-HYD-2024-001234'}</span>
              </div>
              <div>
                <span className="text-[10px] text-slate-400 block font-semibold">Last Expiry Date</span>
                <span className="text-xs font-bold text-orange-400">{latestCertificate?.expiryDate || '2024-08-28'}</span>
              </div>
              <div>
                <span className="text-[10px] text-slate-400 block font-semibold">Previous Test Result</span>
                <span className="text-xs font-bold text-emerald-400">PASSED (MPE &lt; 0.05%)</span>
              </div>
            </div>
          </div>

          {/* Step 3: Required Uploads & Photos */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-4 shadow-lg">
            <div className="flex items-center space-x-2 border-b border-slate-800 pb-3">
              <span className="w-6 h-6 rounded-full bg-blue-600 text-white font-bold text-xs flex items-center justify-center">
                3
              </span>
              <h3 className="font-bold text-sm text-white">Upload Documents & Geotagged Machine Photos</h3>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-2">
                <label className="block text-xs font-bold text-white flex items-center justify-between">
                  <span>1. Technician Inspection Report (PDF/Img)*</span>
                  <span className="text-[10px] text-emerald-400 font-normal">Uploaded</span>
                </label>
                <div className="flex items-center space-x-2 bg-slate-900 p-2.5 rounded-lg border border-slate-700 text-xs">
                  <FileCheck className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                  <span className="font-mono text-slate-300 truncate">tech_report_udii_{selectedUdii.slice(-6)}.pdf</span>
                </div>
              </div>

              <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-2">
                <label className="block text-xs font-bold text-white flex items-center justify-between">
                  <span>2. Seal Break Permission Letter</span>
                  <span className="text-[10px] text-blue-400 font-normal">Optional</span>
                </label>
                <div className="flex items-center space-x-2 bg-slate-900 p-2.5 rounded-lg border border-slate-700 text-xs">
                  <FileCheck className="w-4 h-4 text-blue-400 flex-shrink-0" />
                  <span className="font-mono text-slate-300 truncate">seal_permission_001.pdf</span>
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <label className="block text-xs font-bold text-white flex items-center justify-between">
                <span>3. Geotagged Machine Photos (With Timestamps & GPS)</span>
                <span className="text-[10px] text-slate-400 flex items-center gap-1">
                  <MapPin className="w-3 h-3 text-red-400" /> Lat: 17.3850 N, Lng: 78.4867 E
                </span>
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {photos.map((url, idx) => (
                  <div key={idx} className="relative rounded-lg overflow-hidden border border-slate-700 bg-slate-950 group">
                    <img src={url} alt={`Machine photo ${idx + 1}`} className="w-full h-24 object-cover" />
                    <div className="absolute inset-0 bg-slate-950/60 p-1.5 flex flex-col justify-between text-[9px] text-white">
                      <span className="bg-slate-900/80 px-1 py-0.5 rounded font-mono">Photo #{idx + 1}</span>
                      <div className="bg-slate-900/90 p-1 rounded text-[8px] space-y-0.5">
                        <div className="flex items-center gap-1 text-emerald-300">
                          <MapPin className="w-2.5 h-2.5" /> 17.385° N, 78.486° E
                        </div>
                        <div className="flex items-center gap-1 text-slate-300">
                          <Clock className="w-2.5 h-2.5" /> 2026-08-28 20:20 IST
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-white mb-1">
                4. Repairer Calibration & Inspection Remarks:
              </label>
              <textarea
                rows={3}
                value={remarks}
                onChange={(e) => setRemarks(e.target.value)}
                className="w-full bg-slate-950 text-white text-xs rounded-lg p-3 border border-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          <div className="flex items-center justify-end space-x-3">
            <button
              type="submit"
              className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-bold px-6 py-3 rounded-xl text-sm shadow-xl shadow-blue-600/20 active:scale-95 transition flex items-center space-x-2"
            >
              <Send className="w-4 h-4" />
              <span>Submit to LMO for Approval & Digital Signing</span>
            </button>
          </div>
        </form>
      )}
    </div>
  );
};
