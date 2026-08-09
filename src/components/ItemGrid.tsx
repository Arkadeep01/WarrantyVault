import React from 'react';
import { Eye, Download, ShieldCheck, Clock, AlertTriangle, Trash2, Calendar, DollarSign, Store, Tag, FileText } from 'lucide-react';
import { WarrantyItem } from '../types';
import { calculateDaysRemaining, formatCurrency, formatDate, getWarrantyStatus, getWarrantyProgressPercentage } from '../utils/dateUtils';

interface ItemGridProps {
  items: WarrantyItem[];
  onSelectItem: (item: WarrantyItem) => void;
  onGenerateClaim: (item: WarrantyItem) => void;
  onDeleteItem: (id: string) => void;
  darkMode: boolean;
}

export const ItemGrid: React.FC<ItemGridProps> = ({
  items,
  onSelectItem,
  onGenerateClaim,
  onDeleteItem,
  darkMode
}) => {
  if (items.length === 0) {
    return (
      <div className={`p-12 text-center rounded-3xl border ${
        darkMode ? 'bg-[#111622]/60 border-slate-800' : 'bg-slate-50 border-slate-200'
      }`}>
        <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-indigo-500/10 text-indigo-400 flex items-center justify-center">
          <ShieldCheck className="w-8 h-8" />
        </div>
        <h3 className={`text-base font-bold ${darkMode ? 'text-white' : 'text-slate-900'}`}>
          No receipts or warranties match your filter
        </h3>
        <p className={`mt-1 text-xs max-w-md mx-auto ${darkMode ? 'text-slate-400' : 'text-slate-500'}`}>
          Try clearing your search query or uploading a new receipt to protect your valuable purchases.
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 my-6">
      {items.map((item) => {
        const status = getWarrantyStatus(item.warrantyExpirationDate);
        const daysLeft = calculateDaysRemaining(item.warrantyExpirationDate);
        const progress = getWarrantyProgressPercentage(item.purchaseDate, item.warrantyExpirationDate);

        // Status badge styling
        let badgeBg = 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30';
        let badgeIcon = <ShieldCheck className="w-3.5 h-3.5 mr-1" />;
        let statusLabel = `${daysLeft} Days Remaining`;

        if (status === 'expiring_soon') {
          badgeBg = 'bg-amber-500/15 text-amber-400 border-amber-500/40 animate-pulse';
          badgeIcon = <Clock className="w-3.5 h-3.5 mr-1 text-amber-400" />;
          statusLabel = daysLeft === 0 ? 'Expires Today!' : `Expiring in ${daysLeft}d`;
        } else if (status === 'expired') {
          badgeBg = 'bg-rose-500/15 text-rose-400 border-rose-500/30';
          badgeIcon = <AlertTriangle className="w-3.5 h-3.5 mr-1 text-rose-400" />;
          statusLabel = `Expired (${Math.abs(daysLeft)}d ago)`;
        }

        return (
          <div
            key={item.id}
            className={`group relative rounded-2xl border transition-all duration-300 hover:-translate-y-1 overflow-hidden flex flex-col ${
              darkMode
                ? 'bg-slate-900/40 border-slate-800 hover:border-slate-700 hover:shadow-2xl hover:shadow-indigo-500/10'
                : 'bg-slate-900/40 border-slate-800 hover:border-slate-700 hover:shadow-xl'
            }`}
          >
            {/* Top Preview Image & Badges */}
            <div className="relative h-44 w-full bg-slate-950/80 overflow-hidden">
              <img
                src={item.receiptImageUrl}
                alt={item.productName}
                className="w-full h-full object-cover opacity-80 group-hover:opacity-95 group-hover:scale-105 transition-all duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#111622] via-[#111622]/30 to-transparent" />

              {/* Status Badge */}
              <div className="absolute top-3 right-3 z-10">
                <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-[11px] font-semibold border backdrop-blur-md shadow-md ${badgeBg}`}>
                  {badgeIcon}
                  {statusLabel}
                </span>
              </div>

              {/* Category Badge */}
              <div className="absolute top-3 left-3 z-10">
                <span className="inline-flex items-center px-2.5 py-1 rounded-full text-[11px] font-medium bg-slate-900/80 text-slate-300 border border-slate-700/60 backdrop-blur-md">
                  <Tag className="w-3 h-3 mr-1 text-indigo-400" />
                  {item.category}
                </span>
              </div>

              {/* Quick Actions Overlay on Hover */}
              <div className="absolute inset-0 bg-slate-950/70 backdrop-blur-xs opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex items-center justify-center space-x-2 z-20">
                <button
                  onClick={() => onSelectItem(item)}
                  className="px-3 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold flex items-center space-x-1.5 shadow-lg shadow-indigo-600/30 transition-all transform hover:scale-105"
                >
                  <Eye className="w-4 h-4" />
                  <span>Inspect</span>
                </button>
                <button
                  onClick={() => onGenerateClaim(item)}
                  className="px-3 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-emerald-400 border border-emerald-500/30 text-xs font-semibold flex items-center space-x-1.5 shadow-lg transition-all transform hover:scale-105"
                >
                  <Download className="w-4 h-4" />
                  <span>Claim Pkg</span>
                </button>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    if (confirm(`Remove "${item.productName}" from vault?`)) {
                      onDeleteItem(item.id);
                    }
                  }}
                  title="Delete item"
                  className="p-2 rounded-xl bg-rose-500/20 hover:bg-rose-500/40 text-rose-400 border border-rose-500/30 text-xs transition-all transform hover:scale-105"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Card Details */}
            <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
              <div>
                {/* Merchant & Price */}
                <div className="flex items-center justify-between text-xs mb-1.5">
                  <span className="flex items-center font-medium text-indigo-400">
                    <Store className="w-3.5 h-3.5 mr-1" />
                    {item.merchant}
                  </span>
                  <span className={`font-bold text-sm ${darkMode ? 'text-white' : 'text-slate-900'}`}>
                    {formatCurrency(item.purchasePrice, item.currency)}
                  </span>
                </div>

                {/* Product Title */}
                <h4 
                  onClick={() => onSelectItem(item)}
                  className={`font-semibold text-sm line-clamp-2 cursor-pointer transition-colors ${
                    darkMode ? 'text-slate-100 hover:text-indigo-400' : 'text-slate-900 hover:text-indigo-600'
                  }`}
                >
                  {item.productName}
                </h4>
              </div>

              {/* Progress timeline bar */}
              <div>
                <div className="flex items-center justify-between text-[11px] mb-1">
                  <span className={darkMode ? 'text-slate-400' : 'text-slate-500'}>
                    Purchased {formatDate(item.purchaseDate)}
                  </span>
                  <span className={`font-medium ${
                    status === 'active' ? 'text-emerald-400' : status === 'expiring_soon' ? 'text-amber-400' : 'text-rose-400'
                  }`}>
                    {item.warrantyMonths}m Warranty
                  </span>
                </div>

                <div className="w-full h-1.5 rounded-full bg-slate-800 overflow-hidden">
                  <div
                    className={`h-full rounded-full transition-all duration-500 ${
                      status === 'active'
                        ? 'bg-gradient-to-r from-indigo-500 to-emerald-400'
                        : status === 'expiring_soon'
                        ? 'bg-gradient-to-r from-amber-500 to-amber-400'
                        : 'bg-rose-500'
                    }`}
                    style={{ width: `${Math.min(100, progress.consumedPercent)}%` }}
                  />
                </div>

                <div className="flex items-center justify-between text-[10px] mt-1 text-slate-500">
                  <span>Serial: {item.serialNumber || 'N/A'}</span>
                  <span>Expires {formatDate(item.warrantyExpirationDate)}</span>
                </div>
              </div>

              {/* Bottom Quick Bar */}
              <div className="pt-3 border-t border-slate-800/60 flex items-center justify-between text-xs">
                <button
                  onClick={() => onSelectItem(item)}
                  className="text-indigo-400 hover:text-indigo-300 font-medium flex items-center space-x-1 text-[11px]"
                >
                  <FileText className="w-3.5 h-3.5 mr-1" />
                  <span>View Details & OCR</span>
                </button>

                <button
                  onClick={() => onGenerateClaim(item)}
                  className="px-2.5 py-1 rounded-lg bg-indigo-500/10 hover:bg-indigo-500/20 text-indigo-300 border border-indigo-500/20 text-[11px] font-medium transition-all"
                >
                  Claim Pkg
                </button>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};
