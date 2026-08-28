import React from 'react';
import type {
  Instrument,
  VerificationCertificate,
  VerificationApplication,
  Grievance
} from '../types';
import { generateUDII } from '../utils/udii';
import { QRCodeSVG } from 'qrcode.react';
import {
  Shield,
  CheckCircle
} from 'lucide-react';

interface AdminDashboardProps {
  instruments: Instrument[];
  certificates: VerificationCertificate[];
  applications: VerificationApplication[];
  grievances: Grievance[];
  onAddNewInstrument: (inst: Instrument) => void;
}

export const AdminDashboard: React.FC<AdminDashboardProps> = ({
  instruments,
  certificates,
  grievances,
  onAddNewInstrument
}) => {
  const [activeSubTab, setActiveSubTab] = React.useState<'ANALYTICS' | 'UDII_GEN' | 'DIGILOCKER'>('ANALYTICS');

  // UDII Generator State
  const [dobInput, setDobInput] = React.useState('15-05-1990');
  const [seqInput, setSeqInput] = React.useState(4568);
  const [generatedUdii, setGeneratedUdii] = React.useState('');
  const [newFirmName, setNewFirmName] = React.useState('Sri Sai Traders');
  const [newInstType, setNewInstType] = React.useState('Electronic Platform Scale');
  const [newDenom, setNewDenom] = React.useState('101-500kg (300kg)');

  // DigiLocker Simulator state
  const [digiPushStatus, setDigiPushStatus] = React.useState<'IDLE' | 'PUSHING' | 'SUCCESS'>('IDLE');

  const handleGenerateUdii = () => {
    const udii = generateUDII(dobInput, seqInput);
    setGeneratedUdii(udii);
  };

  const handleRegisterNewMachine = () => {
    if (!generatedUdii) return;
    const newInst: Instrument = {
      udii: generatedUdii,
      ownerId: 'usr-shopkeeper-1',
      ownerName: 'Ramesh Kumar',
      businessName: newFirmName,
      businessAddress: 'Plot 45, Kukatpally Industrial Area, Hyderabad',
      mobile: '9876543210',
      email: 'ramesh@gmail.com',
      type: 'weighing_scale',
      subType: newInstType,
      denomination: newDenom,
      quantity: 1,
      manufacturer: 'Essae Scales',
      model: 'ES-2026',
      serialNumber: `SN-2026-${Math.floor(1000 + Math.random() * 9000)}`,
      registrationDate: new Date().toISOString().split('T')[0],
      status: 'ACTIVE'
    };
    onAddNewInstrument(newInst);
    alert(`Successfully Registered Instrument in e-Suraksha 2.0 Database with UDII: ${generatedUdii}`);
  };

  const handleSimulateDigiLockerPush = () => {
    setDigiPushStatus('PUSHING');
    setTimeout(() => {
      setDigiPushStatus('SUCCESS');
    }, 2000);
  };

  const totalFeeCollected = certificates.reduce((acc, c) => acc + (c.feePaid || 350), 0);

  return (
    <div className="space-y-6">
      {/* Admin Title Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 border border-slate-700 rounded-2xl p-5 shadow-xl text-white">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 bg-indigo-500/20 border border-indigo-400/40 rounded-xl flex items-center justify-center text-indigo-400">
              <Shield className="w-6 h-6" />
            </div>
            <div>
              <span className="text-[10px] font-bold tracking-widest text-indigo-300 uppercase">
                STATE ADMINISTRATOR ANALYTICS & SYSTEM MANAGEMENT
              </span>
              <h2 className="text-xl font-bold tracking-tight text-white">
                Legal Metrology Directorate &bull; SIH 26036 Control Room
              </h2>
              <p className="text-xs text-indigo-200">
                National eMaap Portal Sync &bull; DigiLocker Gateway &bull; UDII Master Identity Registry
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-2 bg-slate-950/80 p-1.5 rounded-xl border border-slate-800">
            <button
              onClick={() => setActiveSubTab('ANALYTICS')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition ${
                activeSubTab === 'ANALYTICS' ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:text-white'
              }`}
            >
              State Analytics
            </button>
            <button
              onClick={() => setActiveSubTab('UDII_GEN')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition ${
                activeSubTab === 'UDII_GEN' ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:text-white'
              }`}
            >
              UDII Generator
            </button>
            <button
              onClick={() => setActiveSubTab('DIGILOCKER')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition ${
                activeSubTab === 'DIGILOCKER' ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:text-white'
              }`}
            >
              DigiLocker Pipeline
            </button>
          </div>
        </div>
      </div>

      {/* ANALYTICS SUBTAB */}
      {activeSubTab === 'ANALYTICS' && (
        <div className="space-y-6">
          {/* Key Metrics Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <div className="bg-slate-900 border border-slate-800 p-4 rounded-2xl shadow-lg">
              <span className="text-xs text-slate-400 font-medium">Registered Instruments (UDII)</span>
              <div className="text-2xl font-black text-white mt-1">{instruments.length}</div>
              <span className="text-[10px] text-emerald-400 font-bold">100% Traceability</span>
            </div>
            <div className="bg-slate-900 border border-slate-800 p-4 rounded-2xl shadow-lg">
              <span className="text-xs text-slate-400 font-medium">Issued Certificates</span>
              <div className="text-2xl font-black text-indigo-400 mt-1">{certificates.length}</div>
              <span className="text-[10px] text-indigo-300 font-bold">DigiLocker Synced</span>
            </div>
            <div className="bg-slate-900 border border-slate-800 p-4 rounded-2xl shadow-lg">
              <span className="text-xs text-slate-400 font-medium">Total Fees Collected</span>
              <div className="text-2xl font-black text-emerald-400 mt-1">₹{totalFeeCollected}</div>
              <span className="text-[10px] text-emerald-300 font-bold">Online Gateway</span>
            </div>
            <div className="bg-slate-900 border border-slate-800 p-4 rounded-2xl shadow-lg">
              <span className="text-xs text-slate-400 font-medium">Active Grievances</span>
              <div className="text-2xl font-black text-amber-400 mt-1">{grievances.length}</div>
              <span className="text-[10px] text-amber-300 font-bold">Auto-Escalating</span>
            </div>
          </div>

          {/* Efficiency Comparison */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-xl space-y-3">
            <h3 className="font-bold text-sm text-white border-b border-slate-800 pb-2">
              PRESENT SYSTEM VS. e-SURAKSHA 2.0 IMPACT ANALYSIS (Page 49 Document)
            </h3>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs text-slate-300">
                <thead className="bg-slate-950 text-slate-400 uppercase text-[10px] font-bold">
                  <tr>
                    <th className="p-2.5">Feature</th>
                    <th className="p-2.5">Present System</th>
                    <th className="p-2.5 text-indigo-400">e-Suraksha 2.0</th>
                    <th className="p-2.5 text-emerald-400">Improvement Gain</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/60 font-medium">
                  <tr>
                    <td className="p-2.5 text-white font-bold">Instrument Identity</td>
                    <td className="p-2.5 text-slate-400">Temporary Certificate No.</td>
                    <td className="p-2.5 text-indigo-300 font-bold">Permanent UDII</td>
                    <td className="p-2.5 text-emerald-400 font-bold">100% Traceability</td>
                  </tr>
                  <tr>
                    <td className="p-2.5 text-white font-bold">Repairer Data Entry</td>
                    <td className="p-2.5 text-slate-400">Manual, error-prone</td>
                    <td className="p-2.5 text-indigo-300 font-bold">QR Auto-Fill</td>
                    <td className="p-2.5 text-emerald-400 font-bold">95% Time Saved</td>
                  </tr>
                  <tr>
                    <td className="p-2.5 text-white font-bold">LMO Approval Time</td>
                    <td className="p-2.5 text-slate-400">Physical file movement (15-30d)</td>
                    <td className="p-2.5 text-indigo-300 font-bold">Digital Mobile Approval</td>
                    <td className="p-2.5 text-emerald-400 font-bold">90% Faster</td>
                  </tr>
                  <tr>
                    <td className="p-2.5 text-white font-bold">Certificate Delivery</td>
                    <td className="p-2.5 text-slate-400">Physical pickup</td>
                    <td className="p-2.5 text-indigo-300 font-bold">DigiLocker + SMS Push</td>
                    <td className="p-2.5 text-emerald-400 font-bold">Instant (99% Faster)</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* UDII GENERATOR SUBTAB */}
      {activeSubTab === 'UDII_GEN' && (
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-4 shadow-xl">
          <div className="border-b border-slate-800 pb-3">
            <h3 className="font-bold text-sm text-white">UDII GENERATOR ALGORITHM (Luhn Variant Check Digit)</h3>
            <p className="text-xs text-slate-400">
              Format: <span className="font-mono text-amber-400">YYMMDD-DOB_DDMM-SEQ_6-CHECK</span>
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-300 mb-1">Owner DOB (DD-MM-YYYY):</label>
              <input
                type="text"
                value={dobInput}
                onChange={(e) => setDobInput(e.target.value)}
                className="w-full bg-slate-950 text-white text-xs rounded-lg p-2.5 border border-slate-700 font-mono"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-300 mb-1">Global Counter Seq:</label>
              <input
                type="number"
                value={seqInput}
                onChange={(e) => setSeqInput(Number(e.target.value))}
                className="w-full bg-slate-950 text-white text-xs rounded-lg p-2.5 border border-slate-700 font-mono"
              />
            </div>
            <div className="flex items-end">
              <button
                onClick={handleGenerateUdii}
                className="w-full bg-indigo-600 hover:bg-indigo-500 text-white font-bold py-2.5 rounded-lg text-xs transition"
              >
                Compute UDII & Check Digit
              </button>
            </div>
          </div>

          {generatedUdii && (
            <div className="bg-slate-950 p-5 rounded-xl border border-indigo-700/60 space-y-4">
              <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                <div>
                  <span className="text-[10px] text-indigo-400 font-bold uppercase block">Generated Permanent UDII</span>
                  <div className="text-xl font-mono font-black text-amber-400">{generatedUdii}</div>
                </div>
                <div className="bg-white p-2 rounded-lg border border-slate-300">
                  <QRCodeSVG value={`https://portal.lmd.gov.in/udii/${generatedUdii}`} size={70} />
                </div>
              </div>

              <div className="border-t border-slate-800 pt-3 space-y-3">
                <h4 className="font-bold text-xs text-white">Register New Machine with this UDII:</h4>
                <div className="grid grid-cols-1 sm:grid-cols-4 gap-3 text-xs">
                  <input
                    type="text"
                    placeholder="Shop / Firm Name"
                    value={newFirmName}
                    onChange={(e) => setNewFirmName(e.target.value)}
                    className="bg-slate-900 text-white p-2 rounded border border-slate-700"
                  />
                  <input
                    type="text"
                    placeholder="Instrument Type"
                    value={newInstType}
                    onChange={(e) => setNewInstType(e.target.value)}
                    className="bg-slate-900 text-white p-2 rounded border border-slate-700"
                  />
                  <input
                    type="text"
                    placeholder="Denomination"
                    value={newDenom}
                    onChange={(e) => setNewDenom(e.target.value)}
                    className="bg-slate-900 text-white p-2 rounded border border-slate-700 font-mono"
                  />
                  <button
                    onClick={handleRegisterNewMachine}
                    className="bg-emerald-600 hover:bg-emerald-500 text-white font-bold py-2 rounded text-xs transition"
                  >
                    Save to Database
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* DIGILOCKER PIPELINE SUBTAB */}
      {activeSubTab === 'DIGILOCKER' && (
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-4 shadow-xl">
          <div className="border-b border-slate-800 pb-3 flex items-center justify-between">
            <div>
              <h3 className="font-bold text-sm text-white">DIGILOCKER INTEGRATION PIPELINE SIMULATOR</h3>
              <p className="text-xs text-slate-400">Target Endpoint: https://api.digilocker.gov.in/v1/issue</p>
            </div>
            <button
              onClick={handleSimulateDigiLockerPush}
              className="bg-purple-600 hover:bg-purple-500 text-white text-xs font-bold px-4 py-2 rounded-lg transition"
            >
              Push Latest Certificate to DigiLocker
            </button>
          </div>

          <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 font-mono text-[11px] text-slate-300 space-y-2">
            <div className="text-purple-400 font-bold">// DigiLocker API JSON Payload Structure</div>
            <div>
              {`{
  "aadhaar": "e3b0c44298fc1c149afbf4c8996fb92427ae41e46...",
  "documentName": "Verification_Certificate_TG-HYD-2026-001234",
  "documentType": "Legal_Metrology_Certificate",
  "file": "BASE64_ENCODED_PDF_BINARY_STRING...",
  "expiry": "2028-08-25",
  "metadata": {
    "udii": "260826-1505-004567-X",
    "issuedBy": "Mr. S. Reddy",
    "issueDate": "2026-08-28"
  }
}`}
            </div>
          </div>

          {digiPushStatus === 'PUSHING' && (
            <div className="p-4 bg-purple-950/40 border border-purple-800 rounded-xl text-center text-xs text-purple-300">
              Pushing XML/PDF payload to National DigiLocker Repository...
            </div>
          )}

          {digiPushStatus === 'SUCCESS' && (
            <div className="p-4 bg-emerald-950/60 border border-emerald-700 rounded-xl text-xs text-emerald-300 font-bold flex items-center justify-center gap-2">
              <CheckCircle className="w-5 h-5 text-emerald-400" />
              <span>DigiLocker Push Status: SUCCESS (Status Code: 200 OK) - Certificate stored in Citizen Wallet!</span>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
