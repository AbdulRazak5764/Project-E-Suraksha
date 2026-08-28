import React from 'react';
import type { UserRole, UserProfile, Instrument, VerificationCertificate } from '../types';
import {
  ShieldCheck,
  Store,
  Wrench,
  Scale,
  UserCheck,
  Shield,
  Search,
  ArrowRight,
  Sparkles,
  Lock,
  ChevronRight
} from 'lucide-react';

interface LandingPageProps {
  users: UserProfile[];
  instruments: Instrument[];
  certificates: VerificationCertificate[];
  onOpenLoginModal: (role: UserRole) => void;
  onSearchUDII: (udii: string) => void;
}

export const LandingPage: React.FC<LandingPageProps> = ({
  instruments,
  certificates,
  onOpenLoginModal,
  onSearchUDII
}) => {
  const [quickSearchInput, setQuickSearchInput] = React.useState('');
  const [searchResult, setSearchResult] = React.useState<{ inst: Instrument; cert?: VerificationCertificate } | null>(null);
  const [searchError, setSearchError] = React.useState(false);

  const handleQuickSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setSearchError(false);
    if (!quickSearchInput.trim()) return;

    const term = quickSearchInput.trim();
    const inst = instruments.find((i) => i.udii === term);
    const cert = certificates.find((c) => c.udii === term || c.certificateNumber === term);

    if (inst || cert) {
      const targetInst = inst || instruments.find((i) => i.udii === cert?.udii);
      if (targetInst) {
        setSearchResult({ inst: targetInst, cert });
      } else {
        onSearchUDII(term);
      }
    } else {
      setSearchError(true);
    }
  };

  const roles = [
    {
      role: 'SHOPKEEPER' as UserRole,
      title: 'Shopkeeper (Business Owner)',
      badge: 'Traders & Businesses',
      description: 'View color-coded machine status, register new weighing scales, renew verifications, and pay statutory fees online.',
      icon: Store,
      color: 'from-amber-500 to-amber-600',
      btnText: 'Login as Shopkeeper'
    },
    {
      role: 'REPAIRER' as UserRole,
      title: 'Licensed Repairer',
      badge: 'Service & Maintenance',
      description: 'Scan machine QR codes for 30-day auto-fill, upload technician reports, seal-break letters & geotagged photos.',
      icon: Wrench,
      color: 'from-blue-600 to-indigo-600',
      btnText: 'Login as Repairer'
    },
    {
      role: 'LMO' as UserRole,
      title: 'LMO Officer (Inspector)',
      badge: 'Field Verification & Enforcement',
      description: 'Inspect field accuracy (MPE standards), record test errors, and apply PKI Class-3 Digital Signature Certificates (DSC).',
      icon: Scale,
      color: 'from-purple-600 to-indigo-700',
      btnText: 'Officer Login (LMO Portal)'
    },
    {
      role: 'CONSUMER' as UserRole,
      title: 'Consumer / Public Portal',
      badge: 'Public Protection & Grievances',
      description: 'Scan sticker QR code on shop scales to verify legal authenticity, and file QR-linked complaints with GPS evidence.',
      icon: UserCheck,
      color: 'from-emerald-600 to-teal-600',
      btnText: 'Consumer QR Verification'
    },
    {
      role: 'ADMIN' as UserRole,
      title: 'State Administrator',
      badge: 'Directorate Control Room',
      description: 'Monitor state-wide compliance, master UDII Luhn registry, DigiLocker push pipeline, and Legal Metrology analytics.',
      icon: Shield,
      color: 'from-slate-700 to-slate-800',
      btnText: 'Directorate Admin Login'
    }
  ];

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 font-sans selection:bg-indigo-500 selection:text-white">
      {/* Top Govt Bar */}
      <div className="bg-slate-900 border-b border-slate-800 px-4 py-2 text-xs font-semibold text-slate-300">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-2">
          <div className="flex items-center space-x-3">
            <span className="flex items-center gap-1.5 text-amber-400 font-bold">
              <span className="w-2.5 h-2.5 rounded-full bg-amber-400 animate-pulse"></span>
              GOVERNMENT OF TELANGANA
            </span>
            <span className="text-slate-700">|</span>
            <span className="text-slate-300">DEPARTMENT OF LEGAL METROLOGY</span>
            <span className="text-slate-700 hidden md:inline">|</span>
            <span className="text-indigo-300 hidden md:inline font-mono">SIH 26036 Project</span>
          </div>

          <div className="flex items-center space-x-2 text-[11px]">
            <span className="bg-indigo-950 text-indigo-300 px-2 py-0.5 rounded border border-indigo-800">
              Legal Metrology Act, 2009 Compliant
            </span>
          </div>
        </div>
      </div>

      {/* Main Landing Header */}
      <header className="border-b border-slate-800/80 bg-slate-950/80 backdrop-blur-md sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 bg-gradient-to-br from-indigo-500 to-blue-700 rounded-2xl flex items-center justify-center shadow-lg shadow-indigo-500/20 ring-4 ring-indigo-500/10">
              <ShieldCheck className="w-8 h-8 text-white" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <h1 className="text-2xl font-black tracking-tight text-white">
                  e-Suraksha <span className="text-indigo-400">2.0</span>
                </h1>
                <span className="text-[10px] bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 px-2 py-0.5 rounded-full font-bold">
                  NATIONAL SIH 26036
                </span>
              </div>
              <p className="text-xs text-slate-400 hidden sm:block">
                Online Verification & Digital Certification System for Weighing and Measuring Instruments
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-3">
            <button
              onClick={() => onOpenLoginModal('SHOPKEEPER')}
              className="bg-gradient-to-r from-indigo-600 to-blue-600 hover:from-indigo-500 hover:to-blue-500 text-white px-5 py-2.5 rounded-xl text-xs font-black shadow-lg shadow-indigo-600/20 active:scale-95 transition flex items-center space-x-2"
            >
              <Lock className="w-4 h-4" />
              <span>PORTAL LOGIN</span>
            </button>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative overflow-hidden pt-12 pb-16 bg-gradient-to-b from-slate-950 via-indigo-950/40 to-slate-950">
        <div className="absolute -top-40 left-1/2 -translate-x-1/2 w-[800px] h-[500px] bg-indigo-600/10 blur-[120px] rounded-full pointer-events-none"></div>

        <div className="max-w-7xl mx-auto px-4 text-center space-y-6 relative z-10">
          <div className="inline-flex items-center space-x-2 bg-gradient-to-r from-amber-500/10 via-indigo-500/10 to-amber-500/10 border border-amber-500/30 px-4 py-1.5 rounded-full text-xs font-bold text-amber-300">
            <Sparkles className="w-4 h-4 text-amber-400" />
            <span>SIH 26036 &bull; Smart India Hackathon Official Solution</span>
          </div>

          <h2 className="text-3xl sm:text-5xl md:text-6xl font-black text-white tracking-tight leading-tight max-w-4xl mx-auto">
            Legal Metrology Verification & <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 via-blue-400 to-emerald-400">Digital Certification Platform</span>
          </h2>

          <p className="text-sm sm:text-base text-slate-300 max-w-2xl mx-auto leading-relaxed">
            Eliminating paper delays with **Permanent UDII Identity**, **30-Day Repairer Auto-Fill**, **LMO Mobile DSC Signing**, **DigiLocker Push**, and **QR Consumer Grievances**.
          </p>

          {/* Quick UDII Verification Search Box */}
          <div className="max-w-2xl mx-auto bg-slate-900/90 border border-slate-800 p-2 sm:p-3 rounded-2xl shadow-2xl backdrop-blur-xl space-y-3">
            <form onSubmit={handleQuickSearch} className="flex items-center gap-2">
              <div className="relative flex-1">
                <input
                  type="text"
                  placeholder="Enter UDII (e.g. 260826-1505-004567-X) or Cert No..."
                  value={quickSearchInput}
                  onChange={(e) => setQuickSearchInput(e.target.value)}
                  className="w-full bg-slate-950 text-white text-xs sm:text-sm rounded-xl pl-10 pr-4 py-3 border border-slate-700 font-mono focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                />
                <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
              </div>
              <button
                type="submit"
                className="bg-emerald-600 hover:bg-emerald-500 text-white font-black px-5 py-3 rounded-xl text-xs sm:text-sm transition flex items-center space-x-1.5 shadow-lg shadow-emerald-600/20"
              >
                <span>Verify Now</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </form>

            {searchError && (
              <div className="text-xs text-red-400 font-semibold text-left px-2">
                No matching instrument or certificate found for "{quickSearchInput}". Try demo UDII: <span className="font-mono text-amber-400 cursor-pointer" onClick={() => setQuickSearchInput('260826-1505-004567-X')}>260826-1505-004567-X</span>
              </div>
            )}

            {/* Quick Search Result Card */}
            {searchResult && (
              <div className="bg-slate-950 p-4 rounded-xl border border-indigo-500/60 text-left space-y-3 animate-fade-in">
                <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                  <span className="font-mono text-xs font-bold text-amber-400">UDII: {searchResult.inst.udii}</span>
                  <span className="text-xs bg-emerald-950 text-emerald-400 font-bold px-2 py-0.5 rounded border border-emerald-800">
                    {searchResult.inst.status}
                  </span>
                </div>
                <div className="grid grid-cols-2 gap-2 text-xs">
                  <div>
                    <span className="text-slate-400 block text-[10px]">Business Name:</span>
                    <span className="font-bold text-white">{searchResult.inst.businessName}</span>
                  </div>
                  <div>
                    <span className="text-slate-400 block text-[10px]">Instrument Type:</span>
                    <span className="font-semibold text-indigo-300">{searchResult.inst.subType} ({searchResult.inst.denomination})</span>
                  </div>
                </div>
                {searchResult.cert && (
                  <button
                    onClick={() => onSearchUDII(searchResult.inst.udii)}
                    className="w-full bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs py-2 rounded-lg transition"
                  >
                    View Official Digital Certificate
                  </button>
                )}
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Stakeholder Login Portals Section */}
      <section className="py-12 px-4 max-w-7xl mx-auto space-y-8">
        <div className="text-center space-y-2">
          <span className="text-xs font-bold text-indigo-400 uppercase tracking-widest block">
            STAKEHOLDER DASHBOARDS & ACCESS PORTALS
          </span>
          <h3 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
            Select Your Role to Login & Open Dashboard
          </h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {roles.map((r) => {
            const Icon = r.icon;
            return (
              <div
                key={r.role}
                className="bg-slate-900/80 border border-slate-800 rounded-3xl p-6 hover:border-indigo-500/50 transition-all duration-300 flex flex-col justify-between space-y-5 shadow-xl group hover:-translate-y-1"
              >
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className={`w-12 h-12 rounded-2xl bg-gradient-to-r ${r.color} flex items-center justify-center text-white shadow-lg`}>
                      <Icon className="w-6 h-6" />
                    </div>
                    <span className="text-[10px] font-bold bg-slate-950 text-slate-300 px-2.5 py-1 rounded-full border border-slate-800">
                      {r.badge}
                    </span>
                  </div>

                  <div>
                    <h4 className="text-lg font-bold text-white group-hover:text-indigo-300 transition">
                      {r.title}
                    </h4>
                    <p className="text-xs text-slate-400 leading-relaxed mt-1.5">
                      {r.description}
                    </p>
                  </div>
                </div>

                <button
                  onClick={() => onOpenLoginModal(r.role)}
                  className={`w-full py-3 px-4 rounded-xl text-xs font-black text-white bg-gradient-to-r ${r.color} hover:opacity-90 transition shadow-md flex items-center justify-center space-x-2`}
                >
                  <span>{r.btnText}</span>
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            );
          })}
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-slate-900 bg-slate-950 py-8 text-center text-xs text-slate-500 space-y-2">
        <p className="font-bold text-slate-400">
          e-Suraksha 2.0 &bull; Legal Metrology Verification System (SIH 26036)
        </p>
        <p>Implemented under Section 24 of Legal Metrology Act, 2009 & Rule 27 of General Rules, 2011</p>
      </footer>
    </div>
  );
};
