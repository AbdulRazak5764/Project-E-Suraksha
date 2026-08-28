import React from 'react';
import type { Instrument } from '../types';
import { QrCode, X, Camera, CheckCircle } from 'lucide-react';

interface QRScanModalProps {
  instruments: Instrument[];
  onClose: () => void;
  onSelectUDII: (udii: string) => void;
}

export const QRScanModal: React.FC<QRScanModalProps> = ({
  instruments,
  onClose,
  onSelectUDII
}) => {
  const [manualInput, setManualInput] = React.useState('');

  const handleSelect = (udii: string) => {
    onSelectUDII(udii);
    onClose();
  };

  const handleManualSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (manualInput.trim()) {
      onSelectUDII(manualInput.trim());
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 bg-slate-950/85 backdrop-blur-md z-50 flex items-center justify-center p-4">
      <div className="bg-slate-900 border border-slate-700 text-white rounded-2xl max-w-md w-full shadow-2xl overflow-hidden my-auto space-y-4">
        {/* Header */}
        <div className="bg-slate-950 px-5 py-3.5 flex items-center justify-between border-b border-slate-800">
          <div className="flex items-center space-x-2 text-xs font-bold text-indigo-400">
            <QrCode className="w-4 h-4" />
            <span>ROLE-BASED QR CODE SCANNER</span>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-white transition">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-5 space-y-4">
          {/* Simulated Camera Scanner View */}
          <div className="relative bg-slate-950 rounded-xl border-2 border-dashed border-indigo-500/60 p-6 text-center space-y-3 overflow-hidden">
            <div className="w-16 h-16 rounded-2xl bg-indigo-500/10 border border-indigo-500/30 flex items-center justify-center mx-auto text-indigo-400 animate-pulse">
              <Camera className="w-8 h-8" />
            </div>
            <div>
              <p className="text-xs font-bold text-white">Point Camera at Machine UDII QR Code</p>
              <p className="text-[11px] text-slate-400">
                Or select a sample instrument below to test role-based response
              </p>
            </div>
          </div>

          {/* Quick Sample Selector */}
          <div className="space-y-2">
            <label className="block text-xs font-bold text-slate-300">
              Sample Instruments in Database:
            </label>
            <div className="space-y-1.5 max-h-48 overflow-y-auto">
              {instruments.map((inst) => (
                <button
                  key={inst.udii}
                  onClick={() => handleSelect(inst.udii)}
                  className="w-full text-left bg-slate-950 hover:bg-slate-800 p-2.5 rounded-xl border border-slate-800 hover:border-indigo-500 transition flex items-center justify-between text-xs"
                >
                  <div>
                    <span className="font-mono font-bold text-amber-400">{inst.udii}</span>
                    <span className="text-slate-300 block text-[11px]">
                      {inst.subType} ({inst.denomination})
                    </span>
                  </div>
                  <CheckCircle className="w-4 h-4 text-indigo-400 opacity-50" />
                </button>
              ))}
            </div>
          </div>

          {/* Manual Input */}
          <form onSubmit={handleManualSubmit} className="pt-2 border-t border-slate-800 space-y-2">
            <label className="block text-xs font-bold text-slate-300">Enter UDII Manually:</label>
            <div className="flex space-x-2">
              <input
                type="text"
                placeholder="260826-1505-004567-X"
                value={manualInput}
                onChange={(e) => setManualInput(e.target.value)}
                className="flex-1 bg-slate-950 text-white text-xs rounded-lg px-3 py-2 border border-slate-700 font-mono"
              />
              <button
                type="submit"
                className="bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold px-4 py-2 rounded-lg transition"
              >
                Scan
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};
