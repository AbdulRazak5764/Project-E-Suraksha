import React from 'react';
import { ShieldCheck, Bell, Search, QrCode, LogOut, PlusCircle } from 'lucide-react';
import type { UserRole, UserProfile } from '../types';

interface HeaderProps {
  currentUser: UserProfile | null;
  currentRole: UserRole;
  onOpenQRScanner: () => void;
  onSearchUDII: (udii: string) => void;
  activeAlertCount: number;
  onOpenAddInstrumentModal?: () => void;
  onLogout: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  currentUser,
  currentRole,
  onOpenQRScanner,
  onSearchUDII,
  activeAlertCount,
  onOpenAddInstrumentModal,
  onLogout
}) => {
  const [searchInput, setSearchInput] = React.useState('');

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchInput.trim()) {
      onSearchUDII(searchInput.trim());
    }
  };

  return (
    <header className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 text-white border-b border-indigo-900/60 sticky top-0 z-40 shadow-xl">
      {/* Top Govt Bar */}
      <div className="bg-slate-950/80 px-4 py-1 text-xs font-medium text-slate-400 flex items-center justify-between border-b border-slate-800">
        <div className="flex items-center space-x-3">
          <span className="flex items-center gap-1.5 text-amber-400 font-semibold">
            <span className="w-2 h-2 rounded-full bg-amber-400 animate-pulse"></span>
            GOVERNMENT OF TELANGANA
          </span>
          <span className="text-slate-600">|</span>
          <span>DEPARTMENT OF LEGAL METROLOGY</span>
          <span className="text-slate-600 hidden sm:inline">|</span>
          <span className="text-indigo-300 hidden sm:inline font-mono">SIH Hackathon 2026 (SIH 26036)</span>
        </div>
        <div className="flex items-center space-x-3">
          <span className="bg-indigo-900/60 text-indigo-200 px-2 py-0.5 rounded border border-indigo-700/50 text-[11px]">
            Legal Metrology Act, 2009 Compliant
          </span>
        </div>
      </div>

      {/* Main Header Container */}
      <div className="max-w-7xl mx-auto px-4 py-3 flex flex-col md:flex-row items-center justify-between gap-4">
        {/* Logo & Platform Title */}
        <div className="flex items-center space-x-3 w-full md:w-auto justify-between md:justify-start">
          <div className="flex items-center space-x-3">
            <div className="relative">
              <div className="w-11 h-11 bg-gradient-to-br from-indigo-500 to-blue-700 rounded-xl flex items-center justify-center shadow-lg shadow-indigo-500/20 ring-2 ring-indigo-400/30">
                <ShieldCheck className="w-7 h-7 text-white" />
              </div>
              <span className="absolute -top-1 -right-1 bg-amber-500 text-slate-950 font-black text-[9px] px-1 rounded-full border border-slate-900">
                2.0
              </span>
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <h1 className="text-xl font-bold tracking-tight text-white flex items-center gap-2">
                  e-Suraksha <span className="text-indigo-400">2.0</span>
                </h1>
                <span className="text-[10px] bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 px-2 py-0.5 rounded-full font-semibold">
                  REAL-TIME PORTAL
                </span>
              </div>
              <p className="text-xs text-slate-300 hidden sm:block">
                Unified Digital Platform for Legal Metrology Verification & Certification
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-2 md:hidden">
            <button
              onClick={onOpenQRScanner}
              className="flex items-center space-x-1 bg-indigo-600 text-white px-2.5 py-1 rounded text-xs"
            >
              <QrCode className="w-3.5 h-3.5" />
              <span>Scan</span>
            </button>
            <button
              onClick={onLogout}
              className="p-1 bg-slate-800 text-red-400 rounded border border-slate-700"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Search, User Badge & Logout */}
        <div className="flex items-center space-x-3 w-full md:w-auto justify-end">
          {/* Quick UDII Search */}
          <form onSubmit={handleSearchSubmit} className="relative flex-1 sm:w-60 md:w-64">
            <input
              type="text"
              placeholder="Search UDII or Cert No..."
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              className="w-full bg-slate-800/90 text-white placeholder-slate-400 text-xs rounded-lg pl-8 pr-4 py-2 border border-slate-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition"
            />
            <Search className="w-4 h-4 text-slate-400 absolute left-2.5 top-2.5" />
          </form>

          {/* Register New Machine Button for Shopkeeper */}
          {currentRole === 'SHOPKEEPER' && onOpenAddInstrumentModal && (
            <button
              onClick={onOpenAddInstrumentModal}
              className="hidden sm:flex items-center space-x-1.5 bg-amber-500 hover:bg-amber-400 text-slate-950 px-3 py-2 rounded-lg text-xs font-black shadow-md transition"
            >
              <PlusCircle className="w-4 h-4" />
              <span>Add Machine</span>
            </button>
          )}

          {/* Quick QR Scan Button */}
          <button
            onClick={onOpenQRScanner}
            className="hidden md:flex items-center space-x-1.5 bg-indigo-600 hover:bg-indigo-500 text-white px-3 py-2 rounded-lg text-xs font-semibold border border-indigo-400/30 transition"
          >
            <QrCode className="w-4 h-4" />
            <span>Scan QR</span>
          </button>

          {/* Logged in User Badge */}
          {currentUser && (
            <div className="hidden lg:flex items-center space-x-2 bg-slate-800/90 px-3 py-1.5 rounded-lg border border-slate-700 text-xs">
              <div className="w-6 h-6 rounded-full bg-indigo-600 text-white font-bold flex items-center justify-center text-[10px]">
                {currentUser.name.charAt(0)}
              </div>
              <div className="text-left">
                <span className="font-bold text-white block text-[11px] leading-tight">{currentUser.name}</span>
                <span className="text-[9px] text-amber-400 font-mono block leading-tight">{currentUser.role}</span>
              </div>
            </div>
          )}

          {/* Notification Bell */}
          <div className="relative">
            <div className="w-9 h-9 rounded-lg bg-slate-800/80 border border-slate-700 flex items-center justify-center text-slate-300 hover:text-white cursor-pointer transition">
              <Bell className="w-4 h-4" />
              {activeAlertCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center animate-bounce">
                  {activeAlertCount}
                </span>
              )}
            </div>
          </div>

          {/* Logout Button */}
          <button
            onClick={onLogout}
            title="Logout"
            className="hidden md:flex items-center space-x-1 bg-slate-800 hover:bg-red-950 text-slate-300 hover:text-red-300 px-3 py-2 rounded-lg text-xs font-semibold border border-slate-700 transition"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>Logout</span>
          </button>
        </div>
      </div>
    </header>
  );
};
