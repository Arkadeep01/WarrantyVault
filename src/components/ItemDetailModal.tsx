import React, { useState } from 'react';
import { 
  X, ShieldCheck, Clock, AlertTriangle, Download, FileText, 
  ZoomIn, ZoomOut, RotateCw, Copy, Check, ExternalLink, Calendar, 
  Store, DollarSign, Tag, Printer, Sparkles, Share2, Edit2, Save
} from 'lucide-react';
import { WarrantyItem } from '../types';
import { calculateDaysRemaining, formatCurrency, formatDate, getWarrantyStatus, getWarrantyProgressPercentage } from '../utils/dateUtils';

interface ItemDetailModalProps {
  item: WarrantyItem | null;
  onClose: () => void;
  onUpdateItem: (updatedItem: WarrantyItem) => void;
  onGenerateClaim: (item: WarrantyItem) => void;
  darkMode: boolean;
}

export const ItemDetailModal: React.FC<ItemDetailModalProps> = ({
  item,
  onClose,
  onUpdateItem,
  onGenerateClaim,
  darkMode
}) => {
  if (!item) return null;

  const [zoomLevel, setZoomLevel] = useState<number>(1);
  const [showRawOcr, setShowRawOcr] = useState<boolean>(false);
  const [copiedText, setCopiedText] = useState<boolean>(false);
  const [isEditingNotes, setIsEditingNotes] = useState<boolean>(false);
  const [notesText, setNotesText] = useState<string>(item.notes || '');

  const status = getWarrantyStatus(item.warrantyExpirationDate);
  const daysLeft = calculateDaysRemaining(item.warrantyExpirationDate);
  const progress = getWarrantyProgressPercentage(item.purchaseDate, item.warrantyExpirationDate);

  // Copy Serial #
  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedText(true);
    setTimeout(() => setCopiedText(false), 2000);
  };

  const saveNotes = () => {
    onUpdateItem({
      ...item,
      notes: notesText,
      updatedAt: new Date().toISOString()
    });
    setIsEditingNotes(false);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 overflow-y-auto bg-slate-950/85 backdrop-blur-md">
      <div className={`relative w-full max-w-6xl rounded-3xl border shadow-2xl overflow-hidden flex flex-col max-h-[94vh] ${
        darkMode ? 'bg-[#0B0F17] border-slate-800 text-slate-100' : 'bg-white border-slate-200 text-slate-900'
      }`}>
        {/* Top Header */}
        <div className={`px-6 py-4 border-b flex items-center justify-between ${
          darkMode ? 'border-slate-800/80 bg-slate-900/50' : 'border-slate-200 bg-slate-50'
        }`}>
          <div className="flex items-center space-x-3">
            <span className="px-2.5 py-1 rounded-full text-xs font-semibold bg-indigo-500/10 border border-indigo-500/30 text-indigo-400">
              {item.category}
            </span>
            <span className="text-xs text-slate-400 font-mono">
              ID: {item.id}
            </span>
          </div>

          <div className="flex items-center space-x-2">
            <button
              onClick={() => onGenerateClaim(item)}
              className="px-4 py-2 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-semibold text-xs flex items-center space-x-1.5 shadow-lg shadow-emerald-600/20"
            >
              <Download className="w-4 h-4" />
              <span>Generate Claim Package</span>
            </button>
            <button
              onClick={onClose}
              className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Modal Scrollable Body */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {/* Hero Section: Progress Timeline & Status Banner */}
          <div className={`p-6 rounded-3xl border ${
            darkMode ? 'bg-[#111622] border-slate-800' : 'bg-slate-50 border-slate-200'
          }`}>
            <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
              <div>
                <div className="flex items-center space-x-2 text-xs text-indigo-400 mb-1 font-medium">
                  <Store className="w-4 h-4" />
                  <span>Purchased at {item.merchant}</span>
                </div>
                <h1 className="text-xl sm:text-2xl font-bold tracking-tight line-clamp-2">
                  {item.productName}
                </h1>
              </div>

              {/* Status Badge */}
              <div className="flex items-center space-x-3">
                <div className="text-right hidden sm:block">
                  <div className="text-xs text-slate-400">Protected Value</div>
                  <div className="text-lg font-bold text-emerald-400">
                    {formatCurrency(item.purchasePrice, item.currency)}
                  </div>
                </div>

                <div className={`px-4 py-2.5 rounded-2xl border flex items-center space-x-2 font-bold text-sm shadow-md ${
                  status === 'active'
                    ? 'bg-emerald-500/15 border-emerald-500/40 text-emerald-400'
                    : status === 'expiring_soon'
                    ? 'bg-amber-500/20 border-amber-500/40 text-amber-400 animate-pulse'
                    : 'bg-rose-500/20 border-rose-500/40 text-rose-400'
                }`}>
                  {status === 'active' ? (
                    <ShieldCheck className="w-5 h-5" />
                  ) : status === 'expiring_soon' ? (
                    <Clock className="w-5 h-5" />
                  ) : (
                    <AlertTriangle className="w-5 h-5" />
                  )}
                  <span>
                    {status === 'active'
                      ? `${daysLeft} Days Protection Remaining`
                      : status === 'expiring_soon'
                      ? `Expiring Soon (${daysLeft}d)`
                      : 'Warranty Expired'}
                  </span>
                </div>
              </div>
            </div>

            {/* Consumed Warranty Timeline Bar */}
            <div className="mt-6">
              <div className="flex items-center justify-between text-xs mb-2 font-medium">
                <span className="text-slate-400 flex items-center">
                  <Calendar className="w-3.5 h-3.5 mr-1 text-indigo-400" />
                  Purchased {formatDate(item.purchaseDate)}
                </span>
                <span className="text-slate-200">
                  {progress.consumedPercent}% Consumed
                </span>
                <span className="text-slate-400 flex items-center">
                  Expires {formatDate(item.warrantyExpirationDate)}
                </span>
              </div>

              <div className="w-full h-3 rounded-full bg-slate-800/80 overflow-hidden p-0.5 border border-slate-700/50">
                <div
                  className={`h-full rounded-full transition-all duration-700 ${
                    status === 'active'
                      ? 'bg-gradient-to-r from-indigo-500 via-teal-400 to-emerald-400'
                      : status === 'expiring_soon'
                      ? 'bg-gradient-to-r from-amber-500 to-amber-400'
                      : 'bg-rose-500'
                  }`}
                  style={{ width: `${Math.min(100, progress.consumedPercent)}%` }}
                />
              </div>
            </div>
          </div>

          {/* Split Layout */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* Left Pane: High-Resolution Receipt Viewer */}
            <div className="lg:col-span-6 flex flex-col space-y-3">
              <div className="flex items-center justify-between text-xs font-semibold text-slate-300">
                <span className="flex items-center">
                  <FileText className="w-4 h-4 mr-1.5 text-indigo-400" />
                  Original Receipt & Document Proof
                </span>

                <div className="flex items-center space-x-1">
                  <button
                    onClick={() => setZoomLevel((z) => Math.max(0.8, z - 0.2))}
                    className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300"
                    title="Zoom Out"
                  >
                    <ZoomOut className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => setZoomLevel(1)}
                    className="px-2 py-1 rounded-lg bg-slate-800 text-[10px] font-mono"
                  >
                    {Math.round(zoomLevel * 100)}%
                  </button>
                  <button
                    onClick={() => setZoomLevel((z) => Math.min(2.5, z + 0.2))}
                    className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300"
                    title="Zoom In"
                  >
                    <ZoomIn className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => setShowRawOcr(!showRawOcr)}
                    className={`ml-2 px-2.5 py-1 rounded-lg text-xs font-semibold transition-all ${
                      showRawOcr ? 'bg-indigo-600 text-white' : 'bg-slate-800 text-indigo-300 hover:bg-slate-700'
                    }`}
                  >
                    {showRawOcr ? 'View Image' : 'OCR Transcript'}
                  </button>
                </div>
              </div>

              <div className="relative rounded-3xl overflow-hidden bg-slate-950 border border-slate-800 min-h-[420px] max-h-[500px] flex items-center justify-center p-4">
                {showRawOcr ? (
                  <div className="w-full h-full overflow-y-auto p-4 font-mono text-xs text-emerald-400 bg-slate-950 rounded-2xl whitespace-pre-wrap leading-relaxed border border-slate-800">
                    {item.rawOcrText || 'No raw OCR transcript recorded for this item.'}
                  </div>
                ) : (
                  <div className="overflow-auto max-h-[460px] w-full flex items-center justify-center">
                    <img
                      src={item.receiptImageUrl}
                      alt="Receipt Document"
                      style={{ transform: `scale(${zoomLevel})`, transformOrigin: 'center' }}
                      className="max-h-[440px] w-auto object-contain rounded-xl transition-transform duration-200"
                    />
                  </div>
                )}
              </div>
            </div>

            {/* Right Pane: Key Metadata Cards & Claim Actions */}
            <div className="lg:col-span-6 flex flex-col space-y-4">
              {/* Metadata Cards Grid */}
              <div className="grid grid-cols-2 gap-3 text-xs">
                {/* Serial Number Card */}
                <div className={`p-4 rounded-2xl border ${
                  darkMode ? 'bg-[#111622] border-slate-800' : 'bg-slate-50 border-slate-200'
                }`}>
                  <div className="text-[11px] text-slate-400 font-semibold mb-1">Serial Number</div>
                  <div className="flex items-center justify-between">
                    <span className="font-mono font-bold text-sm text-indigo-400">
                      {item.serialNumber || 'N/A'}
                    </span>
                    {item.serialNumber && (
                      <button
                        onClick={() => copyToClipboard(item.serialNumber!)}
                        className="p-1 rounded-md bg-indigo-500/10 text-indigo-400 hover:bg-indigo-500/20"
                        title="Copy Serial #"
                      >
                        {copiedText ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                      </button>
                    )}
                  </div>
                </div>

                {/* Model Number Card */}
                <div className={`p-4 rounded-2xl border ${
                  darkMode ? 'bg-[#111622] border-slate-800' : 'bg-slate-50 border-slate-200'
                }`}>
                  <div className="text-[11px] text-slate-400 font-semibold mb-1">Model / SKU</div>
                  <div className="font-mono font-bold text-sm text-slate-200">
                    {item.modelNumber || 'N/A'}
                  </div>
                </div>

                {/* Warranty Term Card */}
                <div className={`p-4 rounded-2xl border ${
                  darkMode ? 'bg-[#111622] border-slate-800' : 'bg-slate-50 border-slate-200'
                }`}>
                  <div className="text-[11px] text-slate-400 font-semibold mb-1">Warranty Term</div>
                  <div className="font-bold text-sm text-emerald-400">
                    {item.warrantyMonths} Months Included
                  </div>
                </div>

                {/* Return Window Card */}
                <div className={`p-4 rounded-2xl border ${
                  darkMode ? 'bg-[#111622] border-slate-800' : 'bg-slate-50 border-slate-200'
                }`}>
                  <div className="text-[11px] text-slate-400 font-semibold mb-1">Store Return Policy</div>
                  <div className="font-bold text-sm text-slate-200">
                    {item.returnWindowDays || 30} Days Return Window
                  </div>
                </div>
              </div>

              {/* Store Policy & Return Terms Box */}
              <div className={`p-4 rounded-2xl border text-xs space-y-1.5 ${
                darkMode ? 'bg-[#111622] border-slate-800' : 'bg-slate-50 border-slate-200'
              }`}>
                <h4 className="font-semibold text-slate-300">Store Return & Warranty Policy Notes</h4>
                <p className="text-slate-400 leading-relaxed">
                  {item.storeReturnPolicy || 'Standard 30-day merchant return window with original receipt.'}
                </p>
              </div>

              {/* Notes & Claim Log */}
              <div className={`p-4 rounded-2xl border text-xs space-y-2 ${
                darkMode ? 'bg-[#111622] border-slate-800' : 'bg-slate-50 border-slate-200'
              }`}>
                <div className="flex items-center justify-between">
                  <h4 className="font-semibold text-slate-300">Vault Notes & Registration Record</h4>
                  {!isEditingNotes ? (
                    <button
                      onClick={() => setIsEditingNotes(true)}
                      className="text-indigo-400 hover:text-indigo-300 flex items-center space-x-1"
                    >
                      <Edit2 className="w-3.5 h-3.5" />
                      <span>Edit</span>
                    </button>
                  ) : (
                    <button
                      onClick={saveNotes}
                      className="text-emerald-400 hover:text-emerald-300 flex items-center space-x-1 font-semibold"
                    >
                      <Save className="w-3.5 h-3.5" />
                      <span>Save</span>
                    </button>
                  )}
                </div>

                {!isEditingNotes ? (
                  <p className="text-slate-400 italic">
                    {item.notes || 'No user notes added. Click edit to add product registration or claim history.'}
                  </p>
                ) : (
                  <textarea
                    rows={3}
                    value={notesText}
                    onChange={(e) => setNotesText(e.target.value)}
                    className="w-full p-2.5 rounded-xl bg-slate-950 border border-slate-800 text-slate-200 outline-none text-xs"
                    placeholder="Add notes about manufacturer registration, support contact info, or repair claim tickets..."
                  />
                )}
              </div>

              {/* Primary Claim Assistant Box */}
              <div className="p-5 rounded-2xl bg-gradient-to-r from-indigo-900/40 via-violet-900/40 to-slate-900 border border-indigo-500/30 flex items-center justify-between">
                <div>
                  <h4 className="font-bold text-sm text-indigo-200 flex items-center">
                    <Sparkles className="w-4 h-4 mr-1.5 text-indigo-400" />
                    Claim Package Assistant
                  </h4>
                  <p className="text-xs text-slate-400 mt-0.5">
                    Bundle receipt proof, serial numbers, and warranty terms into a formal claim document.
                  </p>
                </div>
                <button
                  onClick={() => onGenerateClaim(item)}
                  className="px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-xs shadow-lg shadow-emerald-600/30 whitespace-nowrap"
                >
                  Download Package
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
