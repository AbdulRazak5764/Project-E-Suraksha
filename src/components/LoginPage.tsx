import React from 'react';
import type { UserRole, UserProfile } from '../types';
import {
  ShieldCheck,
  Store,
  Wrench,
  Scale,
  UserCheck,
  Shield,
  Lock,
  User,
  CheckCircle,
  Sparkles,
  ArrowRight,
  UserPlus
} from 'lucide-react';

interface LoginPageProps {
  users: UserProfile[];
  onLoginSuccess: (user: UserProfile) => void;
  onRegisterUser: (newUser: UserProfile) => void;
}

export const LoginPage: React.FC<LoginPageProps> = ({
  users,
  onLoginSuccess,
  onRegisterUser
}) => {
  const [activeRole, setActiveRole] = React.useState<UserRole>('SHOPKEEPER');
  const [isRegisterMode, setIsRegisterMode] = React.useState(false);

  // Form states - empty defaults by default for authentic real login
  const [identifier, setIdentifier] = React.useState('');
  const [password, setPassword] = React.useState('');
  const [errorMessage, setErrorMessage] = React.useState<string | null>(null);

  // Register Form states
  const [regName, setRegName] = React.useState('');
  const [regBusiness, setRegBusiness] = React.useState('');
  const [regMobile, setRegMobile] = React.useState('');
  const [regEmail, setRegEmail] = React.useState('');
  const [regPassword, setRegPassword] = React.useState('');
  const [regAddress, setRegAddress] = React.useState('');
  const [regAadhaar, setRegAadhaar] = React.useState('');
  const [regLicense, setRegLicense] = React.useState('');
  const [regEmpId, setRegEmpId] = React.useState('');
  const [regSuccess, setRegSuccess] = React.useState(false);

  const handleRoleTabChange = (role: UserRole) => {
    setActiveRole(role);
    setErrorMessage(null);
    setIdentifier('');
    setPassword('');
  };

  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    if (!identifier.trim()) {
      setErrorMessage('Please enter your Mobile, Email, License or Employee ID');
      return;
    }

    // Find user by role & identifier
    const foundUser = users.find(
      (u) =>
        u.role === activeRole &&
        (u.mobile === identifier.trim() ||
          u.email === identifier.trim() ||
          u.licenseNumber === identifier.trim() ||
          u.employeeId === identifier.trim())
    );

    if (foundUser) {
      onLoginSuccess(foundUser);
    } else {
      if (activeRole === 'CONSUMER') {
        const guestUser: UserProfile = {
          id: `usr-guest-${Date.now()}`,
          name: 'Public Consumer',
          address: 'Hyderabad, Telangana',
          mobile: identifier.trim() || '9876543299',
          email: 'consumer@public.in',
          aadhaarHash: 'guest_aadhaar_hash',
          role: 'CONSUMER'
        };
        onLoginSuccess(guestUser);
      } else {
        setErrorMessage(`No registered ${activeRole} account found matching "${identifier}". Please Register your account below.`);
      }
    }
  };

  const handleRegisterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!regName || !regMobile || !regPassword) {
      setErrorMessage('Please fill in Name, Mobile Number and Password');
      return;
    }

    const newUser: UserProfile = {
      id: `usr-${Date.now()}`,
      name: regName,
      businessName: regBusiness || `${regName} Enterprise`,
      address: regAddress || 'Hyderabad, Telangana',
      mobile: regMobile,
      email: regEmail || `${regMobile}@gmail.com`,
      password: regPassword,
      aadhaarHash: `hash_${regAadhaar || '123456789012'}`,
      role: activeRole,
      licenseNumber: regLicense || undefined,
      employeeId: regEmpId || undefined
    };

    onRegisterUser(newUser);
    setRegSuccess(true);
    setTimeout(() => {
      onLoginSuccess(newUser);
    }, 1200);
  };

  return (
    <div className="min-h-screen bg-slate-950 text-white flex flex-col justify-center py-12 sm:px-6 lg:px-8 selection:bg-indigo-500 selection:text-white">
      {/* Top Banner */}
      <div className="sm:mx-auto sm:w-full sm:max-w-md text-center space-y-3">
        <div className="inline-flex items-center space-x-2 bg-gradient-to-r from-indigo-500/20 via-purple-500/20 to-blue-500/20 border border-indigo-500/40 px-3 py-1 rounded-full text-xs font-bold text-indigo-300">
          <Sparkles className="w-3.5 h-3.5 text-amber-400" />
          <span>GOVERNMENT OF TELANGANA &bull; LEGAL METROLOGY</span>
        </div>

        <div className="flex items-center justify-center space-x-3">
          <div className="w-12 h-12 bg-gradient-to-br from-indigo-500 to-blue-700 rounded-2xl flex items-center justify-center shadow-lg shadow-indigo-500/30 ring-4 ring-indigo-500/20">
            <ShieldCheck className="w-8 h-8 text-white" />
          </div>
          <h2 className="text-3xl font-black tracking-tight text-white">
            e-Suraksha <span className="text-indigo-400">2.0</span>
          </h2>
        </div>
        <p className="text-xs text-slate-400 max-w-sm mx-auto">
          Unified Digital Platform for Legal Metrology Verification, Certification, and Lifecycle Management
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-xl">
        <div className="bg-slate-900/90 border border-slate-800 backdrop-blur-xl py-8 px-4 shadow-2xl rounded-3xl sm:px-8 space-y-6">
          {/* Role Selection Bar */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-2 text-center">
              Select Stakeholder Portal Role:
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-5 gap-1.5 p-1.5 bg-slate-950 rounded-2xl border border-slate-800">
              <button
                type="button"
                onClick={() => handleRoleTabChange('SHOPKEEPER')}
                className={`py-2 px-1 rounded-xl text-[11px] font-bold transition flex flex-col items-center gap-1 ${
                  activeRole === 'SHOPKEEPER'
                    ? 'bg-amber-500 text-slate-950 shadow-lg font-black'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                <Store className="w-4 h-4" />
                <span>Shopkeeper</span>
              </button>
              <button
                type="button"
                onClick={() => handleRoleTabChange('REPAIRER')}
                className={`py-2 px-1 rounded-xl text-[11px] font-bold transition flex flex-col items-center gap-1 ${
                  activeRole === 'REPAIRER'
                    ? 'bg-blue-600 text-white shadow-lg font-black'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                <Wrench className="w-4 h-4" />
                <span>Repairer</span>
              </button>
              <button
                type="button"
                onClick={() => handleRoleTabChange('LMO')}
                className={`py-2 px-1 rounded-xl text-[11px] font-bold transition flex flex-col items-center gap-1 ${
                  activeRole === 'LMO'
                    ? 'bg-purple-600 text-white shadow-lg font-black'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                <Scale className="w-4 h-4" />
                <span>LMO Officer</span>
              </button>
              <button
                type="button"
                onClick={() => handleRoleTabChange('CONSUMER')}
                className={`py-2 px-1 rounded-xl text-[11px] font-bold transition flex flex-col items-center gap-1 ${
                  activeRole === 'CONSUMER'
                    ? 'bg-emerald-600 text-white shadow-lg font-black'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                <UserCheck className="w-4 h-4" />
                <span>Consumer</span>
              </button>
              <button
                type="button"
                onClick={() => handleRoleTabChange('ADMIN')}
                className={`py-2 px-1 rounded-xl text-[11px] font-bold transition flex flex-col items-center gap-1 col-span-2 sm:col-span-1 ${
                  activeRole === 'ADMIN'
                    ? 'bg-slate-700 text-white shadow-lg font-black'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                <Shield className="w-4 h-4" />
                <span>State Admin</span>
              </button>
            </div>
          </div>

          {errorMessage && (
            <div className="bg-red-950/80 border border-red-800 text-red-300 text-xs p-3 rounded-xl font-medium">
              {errorMessage}
            </div>
          )}

          {regSuccess && (
            <div className="bg-emerald-950/80 border border-emerald-700 text-emerald-300 text-xs p-3 rounded-xl font-bold flex items-center gap-2">
              <CheckCircle className="w-4 h-4 text-emerald-400" />
              <span>Registration Successful! Logging into dashboard...</span>
            </div>
          )}

          {/* Toggle Login / Register */}
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <h3 className="text-sm font-bold text-white uppercase tracking-wider">
              {isRegisterMode ? `New ${activeRole} Self-Registration (eKYC)` : `${activeRole} Portal Login`}
            </h3>
            <button
              onClick={() => setIsRegisterMode(!isRegisterMode)}
              className="text-xs font-bold text-indigo-400 hover:underline flex items-center gap-1"
            >
              {isRegisterMode ? (
                <>Existing User? Login Here</>
              ) : (
                <>
                  <UserPlus className="w-3.5 h-3.5" /> New User? Register Account
                </>
              )}
            </button>
          </div>

          {/* LOGIN FORM */}
          {!isRegisterMode && (
            <form onSubmit={handleLoginSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1">
                  {activeRole === 'SHOPKEEPER' && 'Mobile Number or Registered Email:'}
                  {activeRole === 'REPAIRER' && 'Repairer License Number:'}
                  {activeRole === 'LMO' && 'Government Employee ID:'}
                  {activeRole === 'ADMIN' && 'Official Directorate Email:'}
                  {activeRole === 'CONSUMER' && 'Mobile Number for OTP:'}
                </label>
                <div className="relative">
                  <input
                    type="text"
                    required
                    placeholder={
                      activeRole === 'SHOPKEEPER'
                        ? 'Enter Mobile Number or Email'
                        : activeRole === 'REPAIRER'
                        ? 'Enter License Number (e.g. RL-086/RR/2018)'
                        : activeRole === 'LMO'
                        ? 'Enter Employee ID (e.g. LMO-TG-HYD-042)'
                        : activeRole === 'ADMIN'
                        ? 'Enter Email'
                        : 'Enter Mobile Number'
                    }
                    value={identifier}
                    onChange={(e) => setIdentifier(e.target.value)}
                    className="w-full bg-slate-950 text-white text-xs rounded-xl px-3 py-2.5 border border-slate-700 focus:ring-2 focus:ring-indigo-500 font-mono font-semibold"
                  />
                  <User className="w-4 h-4 text-slate-500 absolute right-3 top-3" />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1">Password / 2FA Pin:</label>
                <div className="relative">
                  <input
                    type="password"
                    required
                    placeholder="Enter Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full bg-slate-950 text-white text-xs rounded-xl px-3 py-2.5 border border-slate-700 focus:ring-2 focus:ring-indigo-500 font-mono"
                  />
                  <Lock className="w-4 h-4 text-slate-500 absolute right-3 top-3" />
                </div>
              </div>

              <button
                type="submit"
                className="w-full bg-gradient-to-r from-indigo-600 to-blue-600 hover:from-indigo-500 hover:to-blue-500 text-white font-black py-3 rounded-xl text-xs shadow-xl shadow-indigo-600/20 active:scale-95 transition flex items-center justify-center space-x-2"
              >
                <span>SECURE LOGIN TO e-SURAKSHA 2.0</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </form>
          )}

          {/* REGISTER FORM */}
          {isRegisterMode && (
            <form onSubmit={handleRegisterSubmit} className="space-y-3 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-300 mb-1">Full Name *</label>
                  <input
                    type="text"
                    required
                    placeholder="Enter Full Name"
                    value={regName}
                    onChange={(e) => setRegName(e.target.value)}
                    className="w-full bg-slate-950 text-white p-2 rounded-lg border border-slate-700"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-300 mb-1">Business / Firm Name</label>
                  <input
                    type="text"
                    placeholder="e.g. Sri Balaji Supermarket"
                    value={regBusiness}
                    onChange={(e) => setRegBusiness(e.target.value)}
                    className="w-full bg-slate-950 text-white p-2 rounded-lg border border-slate-700"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-300 mb-1">Mobile Number (Primary Key) *</label>
                  <input
                    type="tel"
                    required
                    placeholder="10-digit Mobile Number"
                    value={regMobile}
                    onChange={(e) => setRegMobile(e.target.value)}
                    className="w-full bg-slate-950 text-white p-2 rounded-lg border border-slate-700 font-mono"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-300 mb-1">Email Address</label>
                  <input
                    type="email"
                    placeholder="user@example.com"
                    value={regEmail}
                    onChange={(e) => setRegEmail(e.target.value)}
                    className="w-full bg-slate-950 text-white p-2 rounded-lg border border-slate-700"
                  />
                </div>
              </div>

              {activeRole === 'REPAIRER' && (
                <div>
                  <label className="block font-bold text-slate-300 mb-1">Repairer License Number *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. RL-099/RR/2026"
                    value={regLicense}
                    onChange={(e) => setRegLicense(e.target.value)}
                    className="w-full bg-slate-950 text-white p-2 rounded-lg border border-slate-700 font-mono"
                  />
                </div>
              )}

              {activeRole === 'LMO' && (
                <div>
                  <label className="block font-bold text-slate-300 mb-1">Government LMO Employee ID *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. LMO-TG-HYD-099"
                    value={regEmpId}
                    onChange={(e) => setRegEmpId(e.target.value)}
                    className="w-full bg-slate-950 text-white p-2 rounded-lg border border-slate-700 font-mono"
                  />
                </div>
              )}

              <div>
                <label className="block font-bold text-slate-300 mb-1">Aadhaar Number (eKYC Verification)</label>
                <input
                  type="text"
                  placeholder="12-digit Aadhaar Number"
                  value={regAadhaar}
                  onChange={(e) => setRegAadhaar(e.target.value)}
                  className="w-full bg-slate-950 text-white p-2 rounded-lg border border-slate-700 font-mono"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-300 mb-1">Password *</label>
                <input
                  type="password"
                  required
                  placeholder="Create Password"
                  value={regPassword}
                  onChange={(e) => setRegPassword(e.target.value)}
                  className="w-full bg-slate-950 text-white p-2 rounded-lg border border-slate-700 font-mono"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-300 mb-1">Premises Address</label>
                <textarea
                  rows={2}
                  placeholder="Full Address..."
                  value={regAddress}
                  onChange={(e) => setRegAddress(e.target.value)}
                  className="w-full bg-slate-950 text-white p-2 rounded-lg border border-slate-700"
                />
              </div>

              <button
                type="submit"
                className="w-full bg-emerald-600 hover:bg-emerald-500 text-white font-black py-3 rounded-xl text-xs shadow-xl transition"
              >
                CREATE ACCOUNT & LOGIN
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
