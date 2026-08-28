import React from 'react';
import type { Grievance, Instrument } from '../types';
import {
  ShieldAlert,
  Camera,
  Send,
  CheckCircle,
  MapPin
} from 'lucide-react';

interface GrievanceModuleProps {
  grievances: Grievance[];
  instruments: Instrument[];
  onFileGrievance: (grievance: Partial<Grievance>) => void;
}

export const GrievanceModule: React.FC<GrievanceModuleProps> = ({
  grievances,
  instruments,
  onFileGrievance
}) => {
  const [activeTab, setActiveTab] = React.useState<'FILE' | 'TRACK'>('TRACK');
  const [selectedUdii, setSelectedUdii] = React.useState(instruments[0]?.udii || '');
  const [category, setCategory] = React.useState<Grievance['category']>(
    'Incorrect Measurement (Overcharging)'
  );
  const [description, setDescription] = React.useState(
    'The shopkeeper weighing scale showed 500g weight for 450g of rice during my purchase. I suspect calibration tampering.'
  );
  const [submittedMessage, setSubmittedMessage] = React.useState<string | null>(null);

  const selectedInst = instruments.find((i) => i.udii === selectedUdii);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const grvNum = `GRV-2026-${Math.floor(100000 + Math.random() * 900000)}`;

    onFileGrievance({
      grievanceNumber: grvNum,
      udii: selectedUdii,
      complainantName: 'Ramesh Kumar',
      complainantMobile: '9876543210',
      complainantEmail: 'ramesh@gmail.com',
      category,
      description,
      status: 'Submitted',
      escalationLevel: 0,
      photos: [
        'https://images.unsplash.com/photo-1581092160607-ee22621dd758?w=500&auto=format&fit=crop'
      ],
      locationLat: 17.385,
      locationLng: 78.4867,
      submittedAt: new Date().toISOString()
    });

    setSubmittedMessage(grvNum);
    setActiveTab('TRACK');
  };

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      {/* Module Banner */}
      <div className="bg-gradient-to-r from-emerald-950 via-teal-950 to-slate-900 border border-emerald-800/60 rounded-2xl p-5 shadow-xl text-white">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 bg-emerald-500/20 border border-emerald-400/40 rounded-xl flex items-center justify-center text-emerald-400">
              <ShieldAlert className="w-6 h-6" />
            </div>
            <div>
              <span className="text-[10px] font-bold tracking-widest text-emerald-400 uppercase">
                CONSUMER PROTECTION & SMART GRIEVANCE SYSTEM
              </span>
              <h2 className="text-xl font-bold tracking-tight text-white">
                Legal Metrology Public Grievance Portal
              </h2>
              <p className="text-xs text-emerald-200">
                QR-Based Instant Filing &bull; Geotagged Evidence &bull; 7-Day Auto-Escalation to District Inspector
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-2 bg-slate-900/80 p-1 rounded-xl border border-slate-800">
            <button
              onClick={() => setActiveTab('TRACK')}
              className={`px-4 py-1.5 rounded-lg text-xs font-bold transition ${
                activeTab === 'TRACK'
                  ? 'bg-emerald-600 text-white shadow'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              Track Grievances ({grievances.length})
            </button>
            <button
              onClick={() => setActiveTab('FILE')}
              className={`px-4 py-1.5 rounded-lg text-xs font-bold transition ${
                activeTab === 'FILE'
                  ? 'bg-emerald-600 text-white shadow'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              File New Grievance
            </button>
          </div>
        </div>
      </div>

      {submittedMessage && (
        <div className="bg-emerald-950/90 border-2 border-emerald-500 text-emerald-200 p-4 rounded-xl flex items-center justify-between shadow-xl">
          <div className="flex items-center space-x-3">
            <CheckCircle className="w-6 h-6 text-emerald-400 flex-shrink-0" />
            <div>
              <h4 className="font-bold text-sm">Grievance Registered Successfully!</h4>
              <p className="text-xs text-emerald-300">
                Ticket Number: <span className="font-mono font-bold text-white text-sm">{submittedMessage}</span>. Assigned to District LMO Officer Mr. S. Reddy. SMS update sent.
              </p>
            </div>
          </div>
          <button
            onClick={() => setSubmittedMessage(null)}
            className="text-xs font-bold text-emerald-400 hover:underline"
          >
            Dismiss
          </button>
        </div>
      )}

      {/* TRACK TAB */}
      {activeTab === 'TRACK' && (
        <div className="space-y-4">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-lg space-y-4">
            <h3 className="font-bold text-sm text-white flex items-center justify-between border-b border-slate-800 pb-3">
              <span>MY GRIEVANCES (Consumer Dashboard)</span>
              <span className="text-xs text-emerald-400">Real-Time Auto-Escalation Engine</span>
            </h3>

            <div className="space-y-4">
              {grievances.map((grv) => {
                const inst = instruments.find((i) => i.udii === grv.udii);
                return (
                  <div
                    key={grv.id}
                    className="bg-slate-950 border border-slate-800 rounded-xl p-4 space-y-3 hover:border-emerald-700/50 transition"
                  >
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-800/80 pb-2">
                      <div className="flex items-center space-x-2">
                        <span className="font-mono font-bold text-emerald-400 text-sm">{grv.grievanceNumber}</span>
                        <span
                          className={`text-[10px] px-2 py-0.5 rounded font-bold uppercase ${
                            grv.status === 'Resolved'
                              ? 'bg-emerald-950 text-emerald-400 border border-emerald-800'
                              : 'bg-amber-950 text-amber-400 border border-amber-800'
                          }`}
                        >
                          {grv.status}
                        </span>
                      </div>
                      <span className="text-xs text-slate-400 font-mono">UDII: {grv.udii}</span>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs">
                      <div>
                        <span className="text-[10px] text-slate-500 block">Category:</span>
                        <span className="font-bold text-white">{grv.category}</span>
                      </div>
                      <div>
                        <span className="text-[10px] text-slate-500 block">Shop / Business:</span>
                        <span className="font-semibold text-slate-300">{inst?.businessName || 'Ramesh Grocery Store'}</span>
                      </div>
                      <div>
                        <span className="text-[10px] text-slate-500 block">Assigned Officer:</span>
                        <span className="font-semibold text-indigo-300">{grv.assignedLmoName || 'Mr. S. Reddy (LMO)'}</span>
                      </div>
                    </div>

                    <p className="text-xs text-slate-300 bg-slate-900 p-2.5 rounded-lg border border-slate-800 italic">
                      "{grv.description}"
                    </p>

                    {/* Timeline Progression */}
                    <div className="pt-2">
                      <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block mb-2">
                        Escalation Timeline & Status Tracker:
                      </span>
                      <div className="grid grid-cols-4 gap-2 text-center text-[10px]">
                        <div className="bg-emerald-950/60 border border-emerald-700/60 p-2 rounded-lg text-emerald-300 font-bold">
                          1. Submitted
                          <div className="text-[8px] text-slate-400 font-normal mt-0.5">24h SLA</div>
                        </div>
                        <div className="bg-emerald-950/60 border border-emerald-700/60 p-2 rounded-lg text-emerald-300 font-bold">
                          2. LMO Assigned
                          <div className="text-[8px] text-slate-400 font-normal mt-0.5">Mr. S. Reddy</div>
                        </div>
                        <div className={`p-2 rounded-lg font-bold border ${
                          grv.status === 'Under Investigation' || grv.status === 'Resolved'
                            ? 'bg-amber-950/60 border-amber-700/60 text-amber-300'
                            : 'bg-slate-900 border-slate-800 text-slate-500'
                        }`}>
                          3. Investigation
                          <div className="text-[8px] text-slate-400 font-normal mt-0.5">Field Inspection</div>
                        </div>
                        <div className={`p-2 rounded-lg font-bold border ${
                          grv.status === 'Resolved'
                            ? 'bg-emerald-950/60 border-emerald-700/60 text-emerald-300'
                            : 'bg-slate-900 border-slate-800 text-slate-500'
                        }`}>
                          4. Resolution
                          <div className="text-[8px] text-slate-400 font-normal mt-0.5">Final Action</div>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* FILE NEW GRIEVANCE FORM */}
      {activeTab === 'FILE' && (
        <form onSubmit={handleSubmit} className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-4 shadow-xl">
          <h3 className="font-bold text-sm text-white border-b border-slate-800 pb-3 flex items-center justify-between">
            <span>FILE COMPLAINT AGAINST WEIGHING SCALE / MEASURE</span>
            <span className="text-xs text-amber-400 font-normal">Section 43 Penalties Applicable</span>
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-300 mb-1">
                Select Instrument UDII (Scanned from Machine QR):
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

            <div>
              <label className="block text-xs font-bold text-slate-300 mb-1">Complaint Category:</label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value as Grievance['category'])}
                className="w-full bg-slate-950 text-white text-xs rounded-lg p-2.5 border border-slate-700 font-semibold"
              >
                <option value="Incorrect Measurement (Overcharging)">Incorrect Measurement (Short-weighing)</option>
                <option value="Expired Verification Certificate">Expired Verification Certificate</option>
                <option value="No Verification Stamp on Instrument">No Verification Stamp on Instrument</option>
                <option value="Tampered / Broken Seal">Tampered / Broken Lead Seal</option>
                <option value="Unlicensed Repairer">Unlicensed Repairer Operating</option>
                <option value="Other">Other Violation</option>
              </select>
            </div>
          </div>

          {selectedInst && (
            <div className="bg-slate-950 p-3 rounded-xl border border-slate-800 text-xs grid grid-cols-2 sm:grid-cols-3 gap-2">
              <div>
                <span className="text-[10px] text-slate-500 block">Auto-captured Shop:</span>
                <span className="font-bold text-white">{selectedInst.businessName}</span>
              </div>
              <div>
                <span className="text-[10px] text-slate-500 block">Shop Address:</span>
                <span className="font-semibold text-slate-300 truncate block">{selectedInst.businessAddress}</span>
              </div>
              <div>
                <span className="text-[10px] text-slate-500 block">Machine Type:</span>
                <span className="font-semibold text-amber-400">{selectedInst.subType}</span>
              </div>
            </div>
          )}

          <div>
            <label className="block text-xs font-bold text-slate-300 mb-1">
              Detailed Description of Incident / Violation:
            </label>
            <textarea
              rows={3}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full bg-slate-950 text-white text-xs rounded-lg p-3 border border-slate-700 focus:ring-2 focus:ring-emerald-500"
            />
          </div>

          <div className="bg-slate-950 p-3.5 rounded-xl border border-slate-800 space-y-2">
            <label className="block text-xs font-bold text-white flex items-center justify-between">
              <span>Geotagged Photo / Video Evidence</span>
              <span className="text-[10px] text-emerald-400 flex items-center gap-1">
                <MapPin className="w-3 h-3" /> Auto-Captured GPS: 17.3850 N, 78.4867 E
              </span>
            </label>
            <div className="flex items-center space-x-3 text-xs text-slate-400 bg-slate-900 p-2.5 rounded-lg border border-slate-800">
              <Camera className="w-5 h-5 text-emerald-400" />
              <span>1 Evidence Image attached (scale_photo_evidence.jpg)</span>
            </div>
          </div>

          <div className="flex justify-end pt-2">
            <button
              type="submit"
              className="bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-bold px-6 py-2.5 rounded-xl text-xs shadow-lg shadow-emerald-600/20 active:scale-95 transition flex items-center space-x-2"
            >
              <Send className="w-4 h-4" />
              <span>Submit Grievance to Legal Metrology Department</span>
            </button>
          </div>
        </form>
      )}
    </div>
  );
};
