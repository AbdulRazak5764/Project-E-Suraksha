import React from 'react';
import type {
  Instrument,
  VerificationCertificate,
  ExpiryAlert,
  UserProfile
} from '../types';
import { parseUDIIStatus } from '../utils/udii';
import {
  Store,
  Phone,
  Mail,
  AlertTriangle,
  Clock,
  CheckCircle,
  FileText,
  CreditCard,
  ShieldAlert,
  Calendar,
  PlusCircle
} from 'lucide-react';

interface BusinessScannerViewProps {
  currentUser: UserProfile | null;
  instruments: Instrument[];
  certificates: VerificationCertificate[];
  alerts: ExpiryAlert[];
  businessQrCode: string;
  onOpenCertificate: (udii: string) => void;
  onInitiatePayment: (udiiList: string[]) => void;
  onSelectInstrumentForRepair: (udii: string) => void;
  onOpenAddInstrumentModal: () => void;
}

export const BusinessScannerView: React.FC<BusinessScannerViewProps> = ({
  currentUser,
  instruments,
  certificates,
  businessQrCode,
  onOpenCertificate,
  onInitiatePayment,
  onSelectInstrumentForRepair,
  onOpenAddInstrumentModal
}) => {
  // Map instruments to their latest certificate & status
  const instrumentData = instruments.map((inst) => {
    const cert = certificates
      .filter((c) => c.udii === inst.udii)
      .sort((a, b) => new Date(b.issueDate).getTime() - new Date(a.issueDate).getTime())[0];

    const expiryDateStr = cert ? cert.expiryDate : '2024-01-01';
    const statusObj = parseUDIIStatus(expiryDateStr);

    return {
      instrument: inst,
      certificate: cert,
      ...statusObj
    };
  });

  const expiredList = instrumentData.filter((i) => i.status === 'EXPIRED');
  const expiringSoonList = instrumentData.filter((i) => i.status === 'EXPIRING_SOON');
  const planAheadList = instrumentData.filter((i) => i.status === 'PLAN_AHEAD');
  const validList = instrumentData.filter((i) => i.status === 'VALID');

  const total = instrumentData.length;

  return (
    <div className="space-y-6">
      {/* Top Shop Banner */}
      <div className="bg-gradient-to-br from-indigo-950 via-slate-900 to-indigo-900 border border-indigo-700/50 rounded-2xl p-5 shadow-xl text-white relative overflow-hidden">
        <div className="absolute -right-10 -top-10 w-40 h-40 bg-indigo-500/10 rounded-full blur-2xl"></div>

        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-indigo-800/60 pb-4">
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 bg-amber-500/20 border border-amber-500/40 rounded-xl flex items-center justify-center text-amber-400">
              <Store className="w-6 h-6" />
            </div>
            <div>
              <span className="text-[10px] font-bold tracking-widest text-amber-400 uppercase">
                BUSINESS SCANNER RESULT VIEW
              </span>
              <h2 className="text-xl sm:text-2xl font-black tracking-tight text-white">
                {currentUser?.businessName || 'MR. RAMESH KUMAR - GROCERY STORE'}
              </h2>
              <p className="text-xs text-indigo-200">
                Owner: {currentUser?.name || 'Ramesh Kumar'} &bull; All Weighing & Measuring Instruments Verification Dashboard
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-3 text-xs">
            <div className="bg-slate-800/80 px-3 py-1.5 rounded-lg border border-slate-700 font-mono text-indigo-300">
              Business ID: <span className="font-bold text-white">{businessQrCode}</span>
            </div>
            <div className="flex items-center space-x-1.5 bg-slate-800/80 px-3 py-1.5 rounded-lg border border-slate-700 text-slate-300">
              <Phone className="w-3.5 h-3.5 text-emerald-400" />
              <span>{currentUser?.mobile || '9876543210'}</span>
            </div>
            <div className="flex items-center space-x-1.5 bg-slate-800/80 px-3 py-1.5 rounded-lg border border-slate-700 text-slate-300">
              <Mail className="w-3.5 h-3.5 text-blue-400" />
              <span>{currentUser?.email || 'ramesh@gmail.com'}</span>
            </div>
            <button
              onClick={onOpenAddInstrumentModal}
              className="bg-amber-500 hover:bg-amber-400 text-slate-950 font-black px-3.5 py-1.5 rounded-lg text-xs transition flex items-center space-x-1 shadow"
            >
              <PlusCircle className="w-4 h-4" />
              <span>Register New Machine</span>
            </button>
          </div>
        </div>

        {/* Quick Summary Cards Bar */}
        <div className="pt-4 grid grid-cols-2 sm:grid-cols-5 gap-3">
          <div className="bg-slate-900/60 p-2.5 rounded-xl border border-slate-800 text-center">
            <span className="text-xs text-slate-400">Total Machines</span>
            <div className="text-2xl font-black text-white">{total}</div>
          </div>
          <div className="bg-red-950/40 p-2.5 rounded-xl border border-red-900/50 text-center">
            <span className="text-xs text-red-400 font-medium">🔴 Expired</span>
            <div className="text-2xl font-black text-red-400">{expiredList.length}</div>
          </div>
          <div className="bg-orange-950/40 p-2.5 rounded-xl border border-orange-900/50 text-center">
            <span className="text-xs text-orange-400 font-medium">🟠 Expiring Soon</span>
            <div className="text-2xl font-black text-orange-400">{expiringSoonList.length}</div>
          </div>
          <div className="bg-yellow-950/40 p-2.5 rounded-xl border border-yellow-900/50 text-center">
            <span className="text-xs text-yellow-400 font-medium">🟡 Plan Ahead</span>
            <div className="text-2xl font-black text-yellow-400">{planAheadList.length}</div>
          </div>
          <div className="bg-emerald-950/40 p-2.5 rounded-xl border border-emerald-900/50 text-center col-span-2 sm:col-span-1">
            <span className="text-xs text-emerald-400 font-medium">🟢 Valid</span>
            <div className="text-2xl font-black text-emerald-400">{validList.length}</div>
          </div>
        </div>
      </div>

      {/* Bulk Renewal Action Bar */}
      {(expiredList.length > 0 || expiringSoonList.length > 0) && (
        <div className="bg-gradient-to-r from-red-600 via-orange-600 to-amber-600 p-4 rounded-xl shadow-lg text-white flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center space-x-3">
            <AlertTriangle className="w-6 h-6 text-yellow-200 animate-bounce" />
            <div>
              <h4 className="font-bold text-sm">Action Required for {expiredList.length + expiringSoonList.length} Instruments</h4>
              <p className="text-xs text-orange-100">
                Prevent Legal Metrology penalties by renewing expired & expiring instruments in one click.
              </p>
            </div>
          </div>
          <button
            onClick={() =>
              onInitiatePayment([
                ...expiredList.map((i) => i.instrument.udii),
                ...expiringSoonList.map((i) => i.instrument.udii)
              ])
            }
            className="w-full sm:w-auto bg-white text-slate-900 font-black px-4 py-2 rounded-lg text-xs hover:bg-slate-100 transition shadow-md flex items-center justify-center space-x-2"
          >
            <CreditCard className="w-4 h-4 text-orange-600" />
            <span>Pay Bulk Renewal Fee (Multi-Machine)</span>
          </button>
        </div>
      )}

      {/* 🔴 EXPIRED MACHINES */}
      {expiredList.length > 0 && (
        <div className="border-2 border-red-500/80 bg-red-950/20 rounded-2xl overflow-hidden shadow-lg">
          <div className="bg-red-600 text-white px-4 py-2.5 flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <ShieldAlert className="w-5 h-5" />
              <h3 className="font-bold text-sm tracking-wide uppercase">
                🚫 EXPIRED MACHINES (Needs Immediate Action)
              </h3>
            </div>
            <span className="text-xs bg-red-800 px-2 py-0.5 rounded font-bold">
              {expiredList.length} Machine(s)
            </span>
          </div>

          <div className="p-4 space-y-3">
            {expiredList.map((item) => (
              <div
                key={item.instrument.udii}
                className="bg-slate-900 border border-red-950/80 rounded-xl p-4 flex flex-col md:flex-row items-start md:items-center justify-between gap-4 hover:border-red-500/50 transition"
              >
                <div className="space-y-1.5">
                  <div className="flex items-center space-x-2">
                    <span className="font-mono font-bold text-amber-400 text-sm bg-slate-800 px-2 py-0.5 rounded border border-slate-700">
                      UDII: {item.instrument.udii}
                    </span>
                    <span className="text-xs font-bold text-red-400 bg-red-950 px-2 py-0.5 rounded border border-red-800">
                      Expired: {item.daysRemaining < 0 ? Math.abs(item.daysRemaining) : 0} days ago
                    </span>
                  </div>
                  <div className="text-sm font-semibold text-white">
                    Type: {item.instrument.subType} ({item.instrument.denomination})
                  </div>
                  <div className="text-xs text-slate-400">
                    Serial No: <span className="text-slate-200">{item.instrument.serialNumber}</span> |
                    Manufacturer: <span className="text-slate-200">{item.instrument.manufacturer}</span> |
                    Last Cert: <span className="text-slate-200">{item.certificate?.certificateNumber || 'N/A'}</span>
                  </div>
                </div>

                <div className="flex flex-wrap items-center gap-2 w-full md:w-auto">
                  <button
                    onClick={() => onInitiatePayment([item.instrument.udii])}
                    className="flex-1 md:flex-initial bg-gradient-to-r from-red-600 to-rose-600 text-white font-bold px-3.5 py-2 rounded-lg text-xs shadow hover:from-red-500 hover:to-rose-500 transition flex items-center justify-center space-x-1.5"
                  >
                    <CreditCard className="w-3.5 h-3.5" />
                    <span>RENEW NOW - URGENT</span>
                  </button>
                  <button
                    onClick={() => onSelectInstrumentForRepair(item.instrument.udii)}
                    className="flex-1 md:flex-initial bg-slate-800 hover:bg-slate-700 text-slate-200 px-3 py-2 rounded-lg text-xs font-medium border border-slate-700 transition"
                  >
                    Request Repairer
                  </button>
                  {item.certificate && (
                    <button
                      onClick={() => onOpenCertificate(item.instrument.udii)}
                      className="bg-slate-800 hover:bg-slate-700 text-indigo-300 px-3 py-2 rounded-lg text-xs font-medium border border-slate-700 transition"
                    >
                      View History
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 🟠 EXPIRING SOON */}
      {expiringSoonList.length > 0 && (
        <div className="border-2 border-orange-500/80 bg-orange-950/20 rounded-2xl overflow-hidden shadow-lg">
          <div className="bg-orange-600 text-white px-4 py-2.5 flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Clock className="w-5 h-5" />
              <h3 className="font-bold text-sm tracking-wide uppercase">
                ⏰ EXPIRING SOON (Within 30 Days - Schedule Now!)
              </h3>
            </div>
            <span className="text-xs bg-orange-800 px-2 py-0.5 rounded font-bold">
              {expiringSoonList.length} Machine(s)
            </span>
          </div>

          <div className="p-4 space-y-3">
            {expiringSoonList.map((item) => (
              <div
                key={item.instrument.udii}
                className="bg-slate-900 border border-orange-950/80 rounded-xl p-4 flex flex-col md:flex-row items-start md:items-center justify-between gap-4 hover:border-orange-500/50 transition"
              >
                <div className="space-y-1.5">
                  <div className="flex items-center space-x-2">
                    <span className="font-mono font-bold text-amber-400 text-sm bg-slate-800 px-2 py-0.5 rounded border border-slate-700">
                      UDII: {item.instrument.udii}
                    </span>
                    <span className="text-xs font-bold text-orange-400 bg-orange-950 px-2 py-0.5 rounded border border-orange-800">
                      Expires: {item.certificate?.expiryDate} ({item.daysRemaining} days left)
                    </span>
                  </div>
                  <div className="text-sm font-semibold text-white">
                    Type: {item.instrument.subType} ({item.instrument.denomination})
                  </div>
                  <div className="text-xs text-slate-400">
                    Serial No: <span className="text-slate-200">{item.instrument.serialNumber}</span> |
                    Last Cert: <span className="text-slate-200">{item.certificate?.certificateNumber}</span>
                  </div>
                </div>

                <div className="flex flex-wrap items-center gap-2 w-full md:w-auto">
                  <button
                    onClick={() => onInitiatePayment([item.instrument.udii])}
                    className="flex-1 md:flex-initial bg-gradient-to-r from-orange-600 to-amber-600 text-white font-bold px-3.5 py-2 rounded-lg text-xs shadow hover:from-orange-500 hover:to-amber-500 transition flex items-center justify-center space-x-1.5"
                  >
                    <CreditCard className="w-3.5 h-3.5" />
                    <span>RENEW NOW</span>
                  </button>
                  {item.certificate && (
                    <button
                      onClick={() => onOpenCertificate(item.instrument.udii)}
                      className="flex-1 md:flex-initial bg-slate-800 hover:bg-slate-700 text-slate-200 px-3 py-2 rounded-lg text-xs font-medium border border-slate-700 transition flex items-center justify-center space-x-1"
                    >
                      <FileText className="w-3.5 h-3.5 text-indigo-400" />
                      <span>View Cert</span>
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 🟡 EXPIRING IN 30-60 DAYS */}
      {planAheadList.length > 0 && (
        <div className="border border-yellow-500/50 bg-yellow-950/10 rounded-2xl overflow-hidden shadow-md">
          <div className="bg-yellow-600/90 text-slate-950 px-4 py-2 flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Calendar className="w-4 h-4 font-bold" />
              <h3 className="font-bold text-xs tracking-wide uppercase">
                📅 EXPIRING IN 30-60 DAYS (Plan Ahead)
              </h3>
            </div>
            <span className="text-[11px] bg-yellow-400/80 text-slate-950 px-2 py-0.5 rounded font-bold">
              {planAheadList.length} Machine(s)
            </span>
          </div>

          <div className="p-4 space-y-3">
            {planAheadList.map((item) => (
              <div
                key={item.instrument.udii}
                className="bg-slate-900 border border-slate-800 rounded-xl p-3.5 flex flex-col md:flex-row items-start md:items-center justify-between gap-3"
              >
                <div>
                  <div className="flex items-center space-x-2">
                    <span className="font-mono text-xs text-amber-400 font-semibold">{item.instrument.udii}</span>
                    <span className="text-xs text-yellow-400 bg-yellow-950/60 px-2 py-0.5 rounded">
                      Days Left: {item.daysRemaining} days
                    </span>
                  </div>
                  <div className="text-xs text-slate-300 font-medium mt-1">
                    {item.instrument.subType} ({item.instrument.denomination})
                  </div>
                </div>

                {item.certificate && (
                  <button
                    onClick={() => onOpenCertificate(item.instrument.udii)}
                    className="bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs px-3 py-1.5 rounded-lg border border-slate-700 transition flex items-center space-x-1"
                  >
                    <FileText className="w-3.5 h-3.5 text-slate-400" />
                    <span>View Certificate</span>
                  </button>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 🟢 VALID */}
      {validList.length > 0 && (
        <div className="border border-emerald-500/40 bg-emerald-950/10 rounded-2xl overflow-hidden shadow-md">
          <div className="bg-emerald-700/80 text-white px-4 py-2 flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <CheckCircle className="w-4 h-4" />
              <h3 className="font-bold text-xs tracking-wide uppercase">
                🟢 VALID (&gt;60 Days Remaining) - No Action Needed
              </h3>
            </div>
            <span className="text-[11px] bg-emerald-900 text-emerald-200 px-2 py-0.5 rounded font-bold">
              {validList.length} Machine(s)
            </span>
          </div>

          <div className="p-4 space-y-3">
            {validList.map((item) => (
              <div
                key={item.instrument.udii}
                className="bg-slate-900 border border-slate-800 rounded-xl p-3.5 flex flex-col md:flex-row items-start md:items-center justify-between gap-3"
              >
                <div>
                  <div className="flex items-center space-x-2">
                    <span className="font-mono text-xs text-amber-400 font-semibold">{item.instrument.udii}</span>
                    <span className="text-xs text-emerald-400 bg-emerald-950/60 px-2 py-0.5 rounded">
                      Expires: {item.certificate?.expiryDate || 'Valid'} ({item.daysRemaining} days left)
                    </span>
                  </div>
                  <div className="text-xs text-slate-300 font-medium mt-1">
                    {item.instrument.subType} ({item.instrument.denomination})
                  </div>
                </div>

                <div className="flex items-center space-x-2">
                  {item.certificate && (
                    <button
                      onClick={() => onOpenCertificate(item.instrument.udii)}
                      className="bg-slate-800 hover:bg-slate-700 text-emerald-400 text-xs px-3 py-1.5 rounded-lg border border-slate-700 transition flex items-center space-x-1"
                    >
                      <FileText className="w-3.5 h-3.5" />
                      <span>View Digital Certificate</span>
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
