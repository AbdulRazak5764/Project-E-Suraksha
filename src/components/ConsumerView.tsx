import React from 'react';
import type { Instrument, VerificationCertificate } from '../types';
import { parseUDIIStatus } from '../utils/udii';
import {
  ShieldCheck,
  CheckCircle,
  AlertTriangle,
  FileText,
  AlertCircle
} from 'lucide-react';

interface ConsumerViewProps {
  instruments: Instrument[];
  certificates: VerificationCertificate[];
  scannedUdii?: string;
  onOpenGrievanceForm: (udii: string) => void;
  onOpenCertificate: (udii: string) => void;
}

export const ConsumerView: React.FC<ConsumerViewProps> = ({
  instruments,
  certificates,
  scannedUdii = '',
  onOpenGrievanceForm,
  onOpenCertificate
}) => {
  const [selectedUdii, setSelectedUdii] = React.useState(scannedUdii || instruments[0]?.udii || '');

  const inst = instruments.find((i) => i.udii === selectedUdii);
  const cert = certificates
    .filter((c) => c.udii === selectedUdii)
    .sort((a, b) => new Date(b.issueDate).getTime() - new Date(a.issueDate).getTime())[0];

  const statusObj = parseUDIIStatus(cert?.expiryDate || '2024-01-01');

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Consumer Banner */}
      <div className="bg-gradient-to-r from-emerald-950 via-teal-950 to-slate-900 border border-emerald-800/60 rounded-2xl p-5 shadow-xl text-white">
        <div className="flex items-center space-x-3">
          <div className="w-12 h-12 bg-emerald-500/20 border border-emerald-400/40 rounded-xl flex items-center justify-center text-emerald-400">
            <ShieldCheck className="w-6 h-6" />
          </div>
          <div>
            <span className="text-[10px] font-bold tracking-widest text-emerald-400 uppercase">
              CONSUMER & PUBLIC QR VERIFICATION VIEW
            </span>
            <h2 className="text-xl font-bold tracking-tight text-white">
              Instant Instrument Authenticity & Compliance Scanner
            </h2>
            <p className="text-xs text-emerald-200">
              Scan sticker on shop weighing machine to verify legal stamping status & file grievances
            </p>
          </div>
        </div>
      </div>

      {/* Select UDII Selector */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 space-y-3">
        <label className="block text-xs font-bold text-slate-300">
          Simulated QR Scan (Select Instrument Sticker):
        </label>
        <select
          value={selectedUdii}
          onChange={(e) => setSelectedUdii(e.target.value)}
          className="w-full bg-slate-950 text-white text-xs rounded-lg p-2.5 border border-slate-700 font-mono font-semibold"
        >
          {instruments.map((i) => (
            <option key={i.udii} value={i.udii}>
              {i.udii} - {i.businessName} ({i.subType})
            </option>
          ))}
        </select>
      </div>

      {inst && cert && (
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-6">
          {/* Main Authenticity Status Card */}
          <div
            className={`p-5 rounded-2xl border-2 flex flex-col sm:flex-row items-center justify-between gap-4 ${
              statusObj.status === 'VALID' || statusObj.status === 'PLAN_AHEAD'
                ? 'bg-emerald-950/40 border-emerald-500/80 text-emerald-200'
                : 'bg-red-950/40 border-red-500/80 text-red-200'
            }`}
          >
            <div className="flex items-center space-x-4">
              {statusObj.status === 'VALID' || statusObj.status === 'PLAN_AHEAD' ? (
                <div className="w-14 h-14 rounded-2xl bg-emerald-500/20 border border-emerald-500 flex items-center justify-center text-emerald-400">
                  <CheckCircle className="w-8 h-8" />
                </div>
              ) : (
                <div className="w-14 h-14 rounded-2xl bg-red-500/20 border border-red-500 flex items-center justify-center text-red-400">
                  <AlertTriangle className="w-8 h-8" />
                </div>
              )}
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider block text-slate-400">
                  VERIFICATION STATUS
                </span>
                <h3 className="text-2xl font-black tracking-tight">
                  {statusObj.status === 'VALID' || statusObj.status === 'PLAN_AHEAD'
                    ? 'VERIFIED & VALID'
                    : 'EXPIRED / UNVERIFIED'}
                </h3>
                <p className="text-xs font-semibold mt-0.5">{statusObj.label}</p>
              </div>
            </div>

            <button
              onClick={() => onOpenCertificate(selectedUdii)}
              className="bg-slate-900 hover:bg-slate-800 text-white font-bold px-4 py-2 rounded-xl text-xs border border-slate-700 shadow flex items-center space-x-2 transition"
            >
              <FileText className="w-4 h-4 text-emerald-400" />
              <span>View Official Certificate</span>
            </button>
          </div>

          {/* Instrument & Shop Info Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-2">
              <span className="text-[10px] text-slate-400 font-bold uppercase block border-b border-slate-800 pb-1">
                Shop / Owner Information
              </span>
              <div>
                <span className="text-slate-400">Shop Name:</span>{' '}
                <span className="font-bold text-white">{inst.businessName}</span>
              </div>
              <div>
                <span className="text-slate-400">Owner:</span>{' '}
                <span className="font-semibold text-slate-200">{inst.ownerName}</span>
              </div>
              <div>
                <span className="text-slate-400">Address:</span>{' '}
                <span className="text-slate-300 block">{inst.businessAddress}</span>
              </div>
            </div>

            <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-2">
              <span className="text-[10px] text-slate-400 font-bold uppercase block border-b border-slate-800 pb-1">
                Machine Specifications
              </span>
              <div>
                <span className="text-slate-400">UDII Number:</span>{' '}
                <span className="font-mono font-bold text-amber-400">{inst.udii}</span>
              </div>
              <div>
                <span className="text-slate-400">Instrument Type:</span>{' '}
                <span className="font-semibold text-white">{inst.subType} ({inst.denomination})</span>
              </div>
              <div>
                <span className="text-slate-400">Last Verified Date:</span>{' '}
                <span className="font-semibold text-white">{cert.issueDate}</span>
              </div>
              <div>
                <span className="text-slate-400">Valid Until:</span>{' '}
                <span className="font-bold text-emerald-400">{cert.expiryDate}</span>
              </div>
            </div>
          </div>

          {/* Action to file complaint */}
          <div className="bg-amber-950/30 border border-amber-800/60 p-4 rounded-xl flex flex-col sm:flex-row items-center justify-between gap-3">
            <div className="flex items-center space-x-3">
              <AlertCircle className="w-5 h-5 text-amber-400 flex-shrink-0" />
              <div>
                <h4 className="font-bold text-xs text-white">Suspect Short-Weighing or Fraud?</h4>
                <p className="text-[11px] text-amber-200">
                  File a QR-linked grievance directly to Legal Metrology Inspector Mr. S. Reddy.
                </p>
              </div>
            </div>
            <button
              onClick={() => onOpenGrievanceForm(selectedUdii)}
              className="bg-amber-500 hover:bg-amber-400 text-slate-950 font-black px-4 py-2 rounded-xl text-xs shadow-md transition flex items-center space-x-1.5"
            >
              <span>FILE COMPLAINT FOR THIS UDII</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
