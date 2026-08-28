import React from 'react';
import type { UserRole } from '../types';
import { Store, Wrench, Scale, UserCheck, Shield, Sparkles } from 'lucide-react';

interface RoleSelectorProps {
  currentRole: UserRole;
  onRoleChange: (role: UserRole) => void;
}

export const RoleSelector: React.FC<RoleSelectorProps> = ({ currentRole, onRoleChange }) => {
  const roles: { role: UserRole; label: string; icon: React.ComponentType<{ className?: string }>; description: string; color: string }[] = [
    {
      role: 'SHOPKEEPER',
      label: 'Shopkeeper (Business Owner)',
      icon: Store,
      description: 'Business Scanner, Renewals & DigiCertificates',
      color: 'from-amber-500 to-amber-600'
    },
    {
      role: 'REPAIRER',
      label: 'Licensed Repairer',
      icon: Wrench,
      description: 'Auto-fill QR scan & Submit to LMO',
      color: 'from-blue-500 to-blue-600'
    },
    {
      role: 'LMO',
      label: 'LMO Officer (Inspector)',
      icon: Scale,
      description: 'MPE accuracy checks & Digital Signing (DSC)',
      color: 'from-purple-500 to-indigo-600'
    },
    {
      role: 'CONSUMER',
      label: 'Consumer / Public',
      icon: UserCheck,
      description: 'Scan QR authenticity & File Grievance',
      color: 'from-emerald-500 to-teal-600'
    },
    {
      role: 'ADMIN',
      label: 'State Administrator',
      icon: Shield,
      description: 'Analytics, DigiLocker & System Audit',
      color: 'from-slate-700 to-slate-800'
    }
  ];

  return (
    <div className="bg-slate-900 border-b border-slate-800 px-4 py-2 sticky top-[77px] z-30 shadow-md">
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-2 overflow-x-auto no-scrollbar">
        <div className="flex items-center space-x-1 sm:space-x-2 min-w-max">
          <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider hidden lg:flex items-center gap-1 mr-2">
            <Sparkles className="w-3 h-3 text-amber-400" /> Stakeholder Role:
          </span>
          {roles.map((r) => {
            const Icon = r.icon;
            const isActive = currentRole === r.role;
            return (
              <button
                key={r.role}
                onClick={() => onRoleChange(r.role)}
                className={`flex items-center space-x-2 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all duration-200 ${
                  isActive
                    ? `bg-gradient-to-r ${r.color} text-white shadow-md shadow-indigo-900/40 ring-1 ring-white/20 scale-105`
                    : 'bg-slate-800/80 text-slate-300 hover:bg-slate-700 hover:text-white border border-slate-700/60'
                }`}
              >
                <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-white' : 'text-slate-400'}`} />
                <span>{r.label}</span>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};
