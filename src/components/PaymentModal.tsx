import React from 'react';
import type { Instrument, VerificationCertificate } from '../types';
import { calculateVerificationFee } from '../utils/feeCalculator';
import confetti from 'canvas-confetti';
import {
  CreditCard,
  QrCode,
  ShieldCheck,
  CheckCircle,
  X,
  Receipt,
  Lock,
  Building2
} from 'lucide-react';

interface PaymentModalProps {
  udiiList: string[];
  instruments: Instrument[];
  certificates: VerificationCertificate[];
  onClose: () => void;
  onPaymentSuccess: (udiiList: string[], totalAmount: number) => void;
}

export const PaymentModal: React.FC<PaymentModalProps> = ({
  udiiList,
  instruments,
  certificates,
  onClose,
  onPaymentSuccess
}) => {
  const [paymentMethod, setPaymentMethod] = React.useState<'UPI' | 'NET_BANKING' | 'CARD'>('UPI');
  const [isProcessing, setIsProcessing] = React.useState(false);
  const [isCompleted, setIsCompleted] = React.useState(false);

  const itemsFee = udiiList.map((udii) => {
    const inst = instruments.find((i) => i.udii === udii);
    const cert = certificates
      .filter((c) => c.udii === udii)
      .sort((a, b) => new Date(b.issueDate).getTime() - new Date(a.issueDate).getTime())[0];

    const isLate = cert ? new Date(cert.expiryDate).getTime() < new Date().getTime() : false;
    const feeObj = calculateVerificationFee(
      inst?.type || 'weighing_scale',
      inst?.denomination || '51-100kg',
      inst?.quantity || 1,
      isLate
    );

    return {
      udii,
      inst,
      cert,
      isLate,
      feeObj
    };
  });

  const totalBaseFee = itemsFee.reduce((acc, curr) => acc + curr.feeObj.baseFee, 0);
  const totalStatutoryFee = itemsFee.reduce((acc, curr) => acc + curr.feeObj.statutoryFee, 0);
  const totalLateFee = itemsFee.reduce((acc, curr) => acc + curr.feeObj.lateFee, 0);
  const totalGst = itemsFee.reduce((acc, curr) => acc + curr.feeObj.gst, 0);
  const totalAmount = Math.round(itemsFee.reduce((acc, curr) => acc + curr.feeObj.total, 0) * 100) / 100;

  const handlePayNow = () => {
    setIsProcessing(true);
    setTimeout(() => {
      setIsProcessing(false);
      setIsCompleted(true);
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 }
      });
      setTimeout(() => {
        onPaymentSuccess(udiiList, totalAmount);
      }, 2500);
    }, 2000);
  };

  return (
    <div className="fixed inset-0 bg-slate-950/85 backdrop-blur-md z-50 flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-slate-900 border border-slate-700 text-white rounded-2xl max-w-xl w-full shadow-2xl overflow-hidden my-auto space-y-4">
        {/* Modal Top Header */}
        <div className="bg-gradient-to-r from-indigo-900 to-slate-900 px-5 py-4 flex items-center justify-between border-b border-indigo-800/60">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-emerald-500/20 border border-emerald-400/40 rounded-xl flex items-center justify-center text-emerald-400">
              <CreditCard className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-black text-sm text-white tracking-wide">
                LEGAL METROLOGY PAYMENT GATEWAY
              </h3>
              <p className="text-xs text-indigo-200">
                {udiiList.length > 1 ? `Bulk Renewal Payment (${udiiList.length} Instruments)` : `Verification Renewal Payment`}
              </p>
            </div>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-white transition">
            <X className="w-5 h-5" />
          </button>
        </div>

        {isCompleted ? (
          <div className="p-8 text-center space-y-3">
            <div className="w-16 h-16 bg-emerald-500/20 text-emerald-400 rounded-full flex items-center justify-center mx-auto border-2 border-emerald-500 animate-bounce">
              <CheckCircle className="w-10 h-10" />
            </div>
            <h3 className="text-xl font-black text-white">Payment Successful!</h3>
            <p className="text-xs text-emerald-300">
              Transaction ID: <span className="font-mono font-bold text-white">TXN-TG-LM-{Math.floor(100000 + Math.random() * 900000)}</span>
            </p>
            <p className="text-xs text-slate-300">
              Digital Verification Certificate generated and pushed to DigiLocker wallet!
            </p>
          </div>
        ) : (
          <div className="p-5 space-y-4">
            {/* Selected Instruments List */}
            <div className="bg-slate-950 p-3.5 rounded-xl border border-slate-800 space-y-2 max-h-36 overflow-y-auto">
              <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block">
                Selected Instruments ({udiiList.length}):
              </span>
              {itemsFee.map((item) => (
                <div key={item.udii} className="flex items-center justify-between text-xs border-b border-slate-900 pb-1">
                  <div>
                    <span className="font-mono font-semibold text-amber-400">{item.udii}</span>
                    <span className="text-slate-300 ml-2">{item.inst?.subType}</span>
                  </div>
                  <span className="font-bold text-white">₹{item.feeObj.total}</span>
                </div>
              ))}
            </div>

            {/* Itemized Legal Metrology Fee Structure */}
            <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-2 text-xs">
              <div className="font-bold text-indigo-300 border-b border-slate-800 pb-1.5 flex items-center justify-between">
                <span>Fee Breakdown (Legal Metrology Rules 2011)</span>
                <Receipt className="w-4 h-4 text-indigo-400" />
              </div>
              <div className="flex justify-between text-slate-300">
                <span>Base Verification Fee:</span>
                <span>₹{totalBaseFee.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-slate-300">
                <span>Statutory Compliance Fee (5%):</span>
                <span>₹{totalStatutoryFee.toFixed(2)}</span>
              </div>
              {totalLateFee > 0 && (
                <div className="flex justify-between text-red-400 font-semibold">
                  <span>Late Fee Penalty (30% expired):</span>
                  <span>₹{totalLateFee.toFixed(2)}</span>
                </div>
              )}
              <div className="flex justify-between text-slate-300">
                <span>GST (18% on subtotal):</span>
                <span>₹{totalGst.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-base font-black text-emerald-400 border-t border-slate-800 pt-2 mt-1">
                <span>Total Payable Amount:</span>
                <span>₹{totalAmount.toFixed(2)}</span>
              </div>
            </div>

            {/* Payment Method Selector */}
            <div className="space-y-2">
              <label className="block text-xs font-bold text-slate-300">Select Payment Method:</label>
              <div className="grid grid-cols-3 gap-2">
                <button
                  onClick={() => setPaymentMethod('UPI')}
                  className={`p-2.5 rounded-xl border text-xs font-bold transition flex flex-col items-center gap-1 ${
                    paymentMethod === 'UPI'
                      ? 'bg-indigo-950 border-indigo-500 text-white'
                      : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-white'
                  }`}
                >
                  <QrCode className="w-5 h-5 text-indigo-400" />
                  <span>UPI / BHIM QR</span>
                </button>
                <button
                  onClick={() => setPaymentMethod('NET_BANKING')}
                  className={`p-2.5 rounded-xl border text-xs font-bold transition flex flex-col items-center gap-1 ${
                    paymentMethod === 'NET_BANKING'
                      ? 'bg-indigo-950 border-indigo-500 text-white'
                      : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-white'
                  }`}
                >
                  <Building2 className="w-5 h-5 text-indigo-400" />
                  <span>Net Banking</span>
                </button>
                <button
                  onClick={() => setPaymentMethod('CARD')}
                  className={`p-2.5 rounded-xl border text-xs font-bold transition flex flex-col items-center gap-1 ${
                    paymentMethod === 'CARD'
                      ? 'bg-indigo-950 border-indigo-500 text-white'
                      : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-white'
                  }`}
                >
                  <CreditCard className="w-5 h-5 text-indigo-400" />
                  <span>Debit / Credit Card</span>
                </button>
              </div>
            </div>

            {/* Pay Button */}
            <button
              onClick={handlePayNow}
              disabled={isProcessing}
              className="w-full bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-black py-3 rounded-xl text-sm shadow-xl shadow-emerald-600/20 active:scale-95 transition flex items-center justify-center space-x-2"
            >
              {isProcessing ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  <span>Processing Payment via NPCI Gateway...</span>
                </>
              ) : (
                <>
                  <Lock className="w-4 h-4" />
                  <span>PAY NOW ₹{totalAmount.toFixed(2)}</span>
                </>
              )}
            </button>

            <div className="text-center text-[10px] text-slate-500 flex items-center justify-center space-x-2">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" />
              <span>256-Bit Encrypted Secure Government Payment Gateway</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
