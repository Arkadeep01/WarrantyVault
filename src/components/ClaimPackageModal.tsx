import React, { useState } from 'react';
import { 
  X, Download, Printer, ShieldCheck, FileText, Check, Copy, Share2, Sparkles, Building2, Calendar, Hash, DollarSign 
} from 'lucide-react';
import { WarrantyItem } from '../types';
import { formatCurrency, formatDate } from '../utils/dateUtils';

interface ClaimPackageModalProps {
  item: WarrantyItem | null;
  onClose: () => void;
  darkMode: boolean;
}

export const ClaimPackageModal: React.FC<ClaimPackageModalProps> = ({
  item,
  onClose,
  darkMode
}) => {
  if (!item) return null;

  const [copiedLetter, setCopiedLetter] = useState<boolean>(false);

  const claimLetterText = `WARRANTY REPAIR & REPLACEMENT CLAIM

Date: ${new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}

To: ${item.merchant} Customer Support / Warranty Claims Department
Subject: Official Warranty Repair & Replacement Claim for ${item.productName}

PRODUCT DETAILS:
- Product Title: ${item.productName}
- Merchant/Store: ${item.merchant}
- Serial Number: ${item.serialNumber || 'N/A'}
- Model / SKU: ${item.modelNumber || 'N/A'}
- Purchase Date: ${formatDate(item.purchaseDate)}
- Total Purchase Price: ${formatCurrency(item.purchasePrice, item.currency)}
- Warranty Period: ${item.warrantyMonths} Months
- Warranty Expiration Date: ${formatDate(item.warrantyExpirationDate)}

CLAIM DESCRIPTION:
I am submitting a formal claim for repair/replacement coverage under the active warranty terms.
Enclosed with this notice is the original proof of purchase receipt image, serial verification, and purchase records.

Kindly confirm receipt of this package and provide instructions for return merchandise authorization (RMA) or warranty service dispatch.

Sincerely,
Vault Owner / Registered Product Holder
Attachment: Verified Receipt Image & Metadata Certificate`;

  const handlePrint = () => {
    window.print();
  };

  const copyLetter = () => {
    navigator.clipboard.writeText(claimLetterText);
    setCopiedLetter(true);
    setTimeout(() => setCopiedLetter(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 overflow-y-auto bg-slate-950/85 backdrop-blur-md">
      <div className={`relative w-full max-w-4xl rounded-3xl border shadow-2xl overflow-hidden flex flex-col max-h-[92vh] ${
        darkMode ? 'bg-[#0B0F17] border-slate-800 text-slate-100' : 'bg-white border-slate-200 text-slate-900'
      }`}>
        {/* Header */}
        <div className={`px-6 py-4 border-b flex items-center justify-between ${
          darkMode ? 'border-slate-800 bg-slate-900/50' : 'border-slate-200 bg-slate-50'
        }`}>
          <div className="flex items-center space-x-2">
            <div className="p-2 rounded-xl bg-emerald-500/15 text-emerald-400 border border-emerald-500/30">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <h2 className="font-bold text-base">Warranty Claim Package</h2>
              <p className="text-xs text-slate-400">Official proof-of-purchase & claim bundle ready for submission</p>
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <button
              onClick={handlePrint}
              className="px-3.5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-xs flex items-center space-x-1.5 shadow-md"
            >
              <Printer className="w-4 h-4" />
              <span>Print / Export PDF</span>
            </button>
            <button
              onClick={onClose}
              className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Claim Document Body */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {/* Official Printable Claim Certificate */}
          <div className="p-8 rounded-3xl bg-white text-slate-900 border border-slate-200 shadow-xl space-y-6 print:shadow-none print:border-none print:p-0">
            {/* Header branding on certificate */}
            <div className="flex items-start justify-between border-b pb-6 border-slate-200">
              <div>
                <div className="flex items-center space-x-2">
                  <ShieldCheck className="w-6 h-6 text-indigo-600" />
                  <span className="font-bold text-lg tracking-tight text-indigo-950">
                    WARRANTY CLAIM CERTIFICATE
                  </span>
                </div>
                <p className="text-xs text-slate-500 mt-1">
                  Issued by WarrantyVault Digital Locker • Verified Proof of Purchase
                </p>
              </div>

              <div className="text-right text-xs text-slate-500">
                <div className="font-bold text-slate-900">CLAIM CERTIFICATE #</div>
                <div className="font-mono text-indigo-600 font-semibold">CLM-{item.id.toUpperCase()}</div>
                <div>{new Date().toLocaleDateString('en-US')}</div>
              </div>
            </div>

            {/* Product & Store Summary Box */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 p-4 rounded-2xl bg-slate-50 border border-slate-200 text-xs">
              <div>
                <div className="text-slate-500 font-medium">STORE / MERCHANT</div>
                <div className="font-bold text-slate-900">{item.merchant}</div>
              </div>
              <div>
                <div className="text-slate-500 font-medium">PURCHASE DATE</div>
                <div className="font-bold text-slate-900">{formatDate(item.purchaseDate)}</div>
              </div>
              <div>
                <div className="text-slate-500 font-medium">TOTAL PAID</div>
                <div className="font-bold text-emerald-600">{formatCurrency(item.purchasePrice, item.currency)}</div>
              </div>
              <div>
                <div className="text-slate-500 font-medium">WARRANTY EXPIRES</div>
                <div className="font-bold text-indigo-600">{formatDate(item.warrantyExpirationDate)}</div>
              </div>
            </div>

            {/* Serial and Model Verification */}
            <div className="space-y-3">
              <h4 className="font-bold text-sm text-slate-900 border-b pb-1">Equipment Identification</h4>
              <div className="grid grid-cols-2 gap-4 text-xs font-mono">
                <div className="p-3 rounded-xl bg-slate-100 border border-slate-200">
                  <span className="text-slate-500 font-sans block text-[10px] uppercase font-semibold">Product Title</span>
                  <span className="font-bold text-slate-900 font-sans text-sm">{item.productName}</span>
                </div>
                <div className="p-3 rounded-xl bg-slate-100 border border-slate-200">
                  <span className="text-slate-500 font-sans block text-[10px] uppercase font-semibold">Serial Number (S/N)</span>
                  <span className="font-bold text-indigo-600 text-sm">{item.serialNumber || 'N/A'}</span>
                </div>
              </div>
            </div>

            {/* Formal Claim Letter Text */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <h4 className="font-bold text-sm text-slate-900">Claim Letter Text</h4>
                <button
                  onClick={copyLetter}
                  className="px-3 py-1 rounded-lg bg-indigo-50 hover:bg-indigo-100 text-indigo-600 text-xs font-semibold flex items-center space-x-1"
                >
                  {copiedLetter ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copiedLetter ? 'Copied Letter' : 'Copy Text'}</span>
                </button>
              </div>

              <textarea
                readOnly
                rows={7}
                value={claimLetterText}
                className="w-full p-4 rounded-xl bg-slate-50 border border-slate-200 text-slate-800 text-xs font-mono leading-relaxed"
              />
            </div>

            {/* Enclosed Receipt Proof Preview */}
            <div className="space-y-2">
              <h4 className="font-bold text-sm text-slate-900 border-b pb-1">Enclosed Receipt Document</h4>
              <div className="h-48 w-full bg-slate-100 rounded-2xl overflow-hidden border border-slate-200 flex items-center justify-center p-2">
                <img
                  src={item.receiptImageUrl}
                  alt="Enclosed Receipt"
                  className="max-h-full w-auto object-contain rounded-lg"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
