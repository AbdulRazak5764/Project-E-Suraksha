import React from 'react';
import type { VerificationCertificate } from '../types';
import { QRCodeSVG } from 'qrcode.react';
import { X, Printer, Download, ShieldCheck, CheckCircle2 } from 'lucide-react';

interface CertificateModalProps {
  certificate: VerificationCertificate;
  onClose: () => void;
}

export const CertificateModal: React.FC<CertificateModalProps> = ({ certificate, onClose }) => {
  const handlePrint = () => {
    window.print();
  };

  const handleDownload = () => {
    alert(`Downloading Official Verification Certificate: ${certificate.certificateNumber}.pdf`);
  };

  return (
    <div className="fixed inset-0 bg-slate-950/85 backdrop-blur-md z-50 flex items-center justify-center p-2 sm:p-4 overflow-y-auto">
      <div className="relative bg-white text-slate-900 rounded-2xl max-w-3xl w-full shadow-2xl overflow-hidden my-auto print:shadow-none print:w-full print:max-w-none">
        {/* Modal Top Actions */}
        <div className="bg-slate-900 text-white px-4 py-2.5 flex items-center justify-between print:hidden">
          <div className="flex items-center space-x-2 text-xs font-bold">
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            <span>Digital Verification Certificate &bull; e-Suraksha 2.0</span>
          </div>
          <div className="flex items-center space-x-2">
            <button
              onClick={handlePrint}
              className="bg-indigo-600 hover:bg-indigo-500 text-white px-3 py-1 rounded text-xs font-semibold flex items-center space-x-1 transition"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Print Certificate</span>
            </button>
            <button
              onClick={handleDownload}
              className="bg-slate-800 hover:bg-slate-700 text-slate-200 px-3 py-1 rounded text-xs font-semibold flex items-center space-x-1 transition"
            >
              <Download className="w-3.5 h-3.5 text-emerald-400" />
              <span>Download PDF</span>
            </button>
            <button
              onClick={onClose}
              className="text-slate-400 hover:text-white p-1 rounded transition"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Certificate Document Content */}
        <div className="p-6 border-[8px] border-indigo-900/90 m-2 rounded-lg bg-gradient-to-b from-amber-50/40 via-white to-amber-50/20 text-slate-900 font-sans relative">
          {/* Watermark Logo */}
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-5">
            <ShieldCheck className="w-96 h-96 text-indigo-900" />
          </div>

          {/* Header */}
          <div className="text-center space-y-1 border-b-2 border-indigo-900/80 pb-4">
            <div className="flex items-center justify-center space-x-2">
              <div className="w-12 h-12 rounded-full bg-amber-500/20 border border-amber-600 flex items-center justify-center text-amber-700 font-black text-xs">
                GOVT
              </div>
              <div>
                <h2 className="text-sm font-black tracking-widest text-indigo-950 uppercase">
                  GOVERNMENT OF TELANGANA
                </h2>
                <h3 className="text-lg font-black tracking-tight text-indigo-900 uppercase">
                  DEPARTMENT OF LEGAL METROLOGY
                </h3>
              </div>
            </div>
            <div className="inline-block bg-indigo-900 text-white px-6 py-1 rounded-md text-base font-black tracking-widest uppercase shadow mt-2">
              VERIFICATION CERTIFICATE
            </div>
            <p className="text-[10px] text-slate-600 font-semibold pt-0.5">
              Issued under Section 24 of the Legal Metrology Act, 2009 & Rule 27 of General Rules, 2011
            </p>
          </div>

          {/* Top Bar with Cert Number, UDII and QR */}
          <div className="grid grid-cols-3 gap-2 my-4 bg-indigo-50/80 p-3 rounded-lg border border-indigo-200 text-xs">
            <div>
              <span className="text-[10px] text-slate-500 font-bold block uppercase">Certificate No:</span>
              <span className="font-mono font-bold text-red-700 text-xs sm:text-sm">{certificate.certificateNumber}</span>
            </div>
            <div className="text-center">
              <span className="text-[10px] text-slate-500 font-bold block uppercase">Permanent UDII:</span>
              <span className="font-mono font-bold text-emerald-800 text-xs sm:text-sm">{certificate.udii}</span>
            </div>
            <div className="flex justify-end items-center">
              <div className="bg-white p-1 rounded border border-indigo-300 shadow-sm">
                <QRCodeSVG
                  value={`https://portal.lmd.gov.in/verify/${certificate.certificateNumber}?udii=${certificate.udii}`}
                  size={54}
                />
              </div>
            </div>
          </div>

          {/* Issued To Grid */}
          <div className="space-y-2 text-xs border-b border-indigo-200 pb-3">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              <div>
                <span className="font-bold text-indigo-950">Issued To (Owner / Shop):</span>
                <div className="font-semibold text-slate-900">{certificate.businessName}</div>
                <div className="text-slate-600 text-[11px]">{certificate.businessAddress}</div>
              </div>
              <div className="space-y-0.5 text-[11px]">
                <div><span className="font-semibold">Owner Name:</span> {certificate.ownerName}</div>
                <div><span className="font-semibold">Mobile:</span> {certificate.ownerMobile}</div>
                <div><span className="font-semibold">Email:</span> {certificate.ownerEmail}</div>
              </div>
            </div>
          </div>

          {/* Instrument & Verification Details */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 my-3 text-xs">
            <div className="border border-indigo-200 rounded-lg p-3 bg-white space-y-1.5 shadow-sm">
              <div className="font-bold text-indigo-900 border-b border-indigo-100 pb-1 uppercase text-[11px]">
                Instrument Details
              </div>
              <div className="grid grid-cols-2 gap-1 text-[11px]">
                <span className="text-slate-500">Type:</span>
                <span className="font-semibold text-slate-900">{certificate.instrumentType}</span>
                <span className="text-slate-500">Sub-Type:</span>
                <span className="font-semibold text-slate-900">{certificate.subType}</span>
                <span className="text-slate-500">Denomination:</span>
                <span className="font-semibold text-slate-900">{certificate.denomination}</span>
                <span className="text-slate-500">Quantity:</span>
                <span className="font-semibold text-slate-900">{certificate.quantity} No.</span>
                <span className="text-slate-500">Manufacturer:</span>
                <span className="font-semibold text-slate-900">{certificate.manufacturer}</span>
                <span className="text-slate-500">Serial No:</span>
                <span className="font-mono font-semibold text-slate-900">{certificate.serialNumber}</span>
              </div>
            </div>

            <div className="border border-indigo-200 rounded-lg p-3 bg-white space-y-1.5 shadow-sm">
              <div className="font-bold text-indigo-900 border-b border-indigo-100 pb-1 uppercase text-[11px]">
                Verification Validity
              </div>
              <div className="grid grid-cols-2 gap-1 text-[11px]">
                <span className="text-slate-500">Issue Date:</span>
                <span className="font-semibold text-slate-900">{certificate.issueDate}</span>
                <span className="text-slate-500">Valid Until:</span>
                <span className="font-bold text-emerald-700">{certificate.expiryDate}</span>
                <span className="text-slate-500">Verified By:</span>
                <span className="font-semibold text-slate-900">{certificate.lmoName}</span>
                <span className="text-slate-500">Designation:</span>
                <span className="font-semibold text-slate-900">{certificate.lmoDesignation}</span>
                <span className="text-slate-500">Jurisdiction:</span>
                <span className="font-semibold text-slate-900">{certificate.lmoDistrict}</span>
              </div>
            </div>
          </div>

          {/* Repairer Details Box */}
          <div className="bg-slate-50 p-2.5 rounded-lg border border-slate-200 text-[11px] grid grid-cols-1 sm:grid-cols-3 gap-2 my-3">
            <div>
              <span className="text-slate-500 font-semibold block">Repairer Name:</span>
              <span className="font-bold text-slate-800">{certificate.repairerName}</span>
            </div>
            <div>
              <span className="text-slate-500 font-semibold block">License Number:</span>
              <span className="font-mono font-bold text-slate-800">{certificate.repairerLicense}</span>
            </div>
            <div>
              <span className="text-slate-500 font-semibold block">Total Statutory Fee Paid:</span>
              <span className="font-bold text-emerald-700">₹{certificate.feePaid} (Paid Online)</span>
            </div>
          </div>

          {/* Bottom Footer & Digital Signature */}
          <div className="pt-2 border-t-2 border-indigo-900/80 flex items-center justify-between text-xs">
            <div className="text-[10px] text-slate-500 space-y-0.5 max-w-sm">
              <div className="font-bold text-indigo-900">Digital Authenticity Notice</div>
              <p>
                Verify the authenticity of this certificate by scanning the QR code or visiting{' '}
                <span className="underline font-mono">https://portal.lmd.gov.in/verify</span>
              </p>
            </div>

            <div className="border border-indigo-300 rounded-lg p-2 bg-indigo-50/60 text-center min-w-[200px]">
              <div className="text-xs font-serif italic font-bold text-indigo-950 border-b border-indigo-200 pb-0.5">
                S. Reddy
              </div>
              <div className="text-[9px] font-bold text-indigo-900 mt-0.5">Digitally Signed (DSC)</div>
              <div className="text-[8px] text-slate-600 font-mono">Mr. S. Reddy, LMO Officer</div>
              <div className="text-[7px] text-emerald-700 font-mono font-bold flex items-center justify-center gap-1 mt-0.5">
                <CheckCircle2 className="w-2.5 h-2.5" /> CCA India Verified Stamp
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
