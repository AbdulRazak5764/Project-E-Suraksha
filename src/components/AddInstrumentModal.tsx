import React from 'react';
import type { Instrument, InstrumentType, UserProfile } from '../types';
import { generateUDII } from '../utils/udii';
import { PlusCircle, X, CheckCircle } from 'lucide-react';
import { QRCodeSVG } from 'qrcode.react';

interface AddInstrumentModalProps {
  currentUser: UserProfile;
  onClose: () => void;
  onAddInstrument: (newInst: Instrument) => void;
}

export const AddInstrumentModal: React.FC<AddInstrumentModalProps> = ({
  currentUser,
  onClose,
  onAddInstrument
}) => {
  const [type, setType] = React.useState<InstrumentType>('weighing_scale');
  const [subType, setSubType] = React.useState('Electronic Tabletop Scale');
  const [denomination, setDenomination] = React.useState('51-100kg (100kg)');
  const [quantity, setQuantity] = React.useState(1);
  const [manufacturer, setManufacturer] = React.useState('Essae-Teraoka Pvt. Ltd.');
  const [model, setModel] = React.useState('DS-852');
  const [serialNumber, setSerialNumber] = React.useState(`SN-2026-${Math.floor(1000 + Math.random() * 9000)}`);
  const [ownerDob, setOwnerDob] = React.useState('15-05-1990');
  const [generatedUdii, setGeneratedUdii] = React.useState('');

  React.useEffect(() => {
    const seq = Math.floor(100000 + Math.random() * 899999);
    const udii = generateUDII(ownerDob, seq);
    setGeneratedUdii(udii);
  }, [type, denomination, ownerDob]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!generatedUdii) return;

    const newInst: Instrument = {
      udii: generatedUdii,
      ownerId: currentUser.id,
      ownerName: currentUser.name,
      businessName: currentUser.businessName || `${currentUser.name} Store`,
      businessAddress: currentUser.address,
      mobile: currentUser.mobile,
      email: currentUser.email,
      type,
      subType,
      denomination,
      quantity,
      manufacturer,
      model,
      serialNumber,
      registrationDate: new Date().toISOString().split('T')[0],
      status: 'ACTIVE'
    };

    onAddInstrument(newInst);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-slate-950/85 backdrop-blur-md z-50 flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-slate-900 border border-slate-700 text-white rounded-2xl max-w-lg w-full shadow-2xl overflow-hidden my-auto space-y-4">
        {/* Header */}
        <div className="bg-gradient-to-r from-amber-900 via-slate-900 to-slate-900 px-5 py-4 flex items-center justify-between border-b border-amber-800/60">
          <div className="flex items-center space-x-2">
            <PlusCircle className="w-5 h-5 text-amber-400" />
            <h3 className="font-bold text-sm">REGISTER NEW WEIGHING / MEASURING MACHINE</h3>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-white transition">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-5 space-y-4 text-xs">
          {/* Permanent UDII Preview Box */}
          <div className="bg-slate-950 p-4 rounded-xl border border-indigo-700/60 flex items-center justify-between gap-3">
            <div>
              <span className="text-[10px] text-indigo-400 font-bold uppercase tracking-wider block">
                Generated Lifetime UDII Number:
              </span>
              <div className="font-mono font-black text-amber-400 text-base">{generatedUdii}</div>
              <span className="text-[9px] text-slate-400 block mt-0.5">Luhn Check Digit Algorithm Verified</span>
            </div>
            <div className="bg-white p-1 rounded">
              <QRCodeSVG value={`https://portal.lmd.gov.in/udii/${generatedUdii}`} size={48} />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block font-bold text-slate-300 mb-1">Instrument Category *</label>
              <select
                value={type}
                onChange={(e) => setType(e.target.value as InstrumentType)}
                className="w-full bg-slate-950 text-white p-2.5 rounded-lg border border-slate-700 font-semibold"
              >
                <option value="weighing_scale">Weighing Scale</option>
                <option value="capacity_measure">Capacity Measure (Litre)</option>
                <option value="length_measure">Length Measure (Metres/Tape)</option>
                <option value="storage_tank">Storage Tank</option>
                <option value="tank_lorry">Tank Lorry</option>
              </select>
            </div>

            <div>
              <label className="block font-bold text-slate-300 mb-1">Sub-Type Description *</label>
              <input
                type="text"
                required
                value={subType}
                onChange={(e) => setSubType(e.target.value)}
                className="w-full bg-slate-950 text-white p-2 rounded-lg border border-slate-700"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block font-bold text-slate-300 mb-1">Denomination / Capacity *</label>
              <input
                type="text"
                required
                value={denomination}
                onChange={(e) => setDenomination(e.target.value)}
                className="w-full bg-slate-950 text-white p-2 rounded-lg border border-slate-700 font-mono"
              />
            </div>

            <div>
              <label className="block font-bold text-slate-300 mb-1">Quantity (Units)</label>
              <input
                type="number"
                min={1}
                value={quantity}
                onChange={(e) => setQuantity(Number(e.target.value))}
                className="w-full bg-slate-950 text-white p-2 rounded-lg border border-slate-700"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block font-bold text-slate-300 mb-1">Manufacturer Name</label>
              <input
                type="text"
                value={manufacturer}
                onChange={(e) => setManufacturer(e.target.value)}
                className="w-full bg-slate-950 text-white p-2 rounded-lg border border-slate-700"
              />
            </div>

            <div>
              <label className="block font-bold text-slate-300 mb-1">Model Name / Number</label>
              <input
                type="text"
                value={model}
                onChange={(e) => setModel(e.target.value)}
                className="w-full bg-slate-950 text-white p-2 rounded-lg border border-slate-700"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block font-bold text-slate-300 mb-1">Machine Serial Number *</label>
              <input
                type="text"
                required
                value={serialNumber}
                onChange={(e) => setSerialNumber(e.target.value)}
                className="w-full bg-slate-950 text-white p-2 rounded-lg border border-slate-700 font-mono"
              />
            </div>

            <div>
              <label className="block font-bold text-slate-300 mb-1">Owner DOB (for UDII encoding)</label>
              <input
                type="text"
                value={ownerDob}
                onChange={(e) => setOwnerDob(e.target.value)}
                className="w-full bg-slate-950 text-white p-2 rounded-lg border border-slate-700 font-mono"
              />
            </div>
          </div>

          <div className="pt-2 flex justify-end space-x-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-slate-800 text-slate-300 font-semibold rounded-lg"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 bg-amber-500 hover:bg-amber-400 text-slate-950 font-black rounded-lg shadow-lg flex items-center space-x-1.5"
            >
              <CheckCircle className="w-4 h-4" />
              <span>REGISTER MACHINE & ASSIGN UDII</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
