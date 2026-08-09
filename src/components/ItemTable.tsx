import React from 'react';
import { Eye, Download, ShieldCheck, Clock, AlertTriangle, Trash2, Store, Tag } from 'lucide-react';
import { WarrantyItem } from '../types';
import { calculateDaysRemaining, formatCurrency, formatDate, getWarrantyStatus } from '../utils/dateUtils';

interface ItemTableProps {
  items: WarrantyItem[];
  onSelectItem: (item: WarrantyItem) => void;
  onGenerateClaim: (item: WarrantyItem) => void;
  onDeleteItem: (id: string) => void;
  darkMode: boolean;
}

export const ItemTable: React.FC<ItemTableProps> = ({
  items,
  onSelectItem,
  onGenerateClaim,
  onDeleteItem,
  darkMode
}) => {
  if (items.length === 0) {
    return (
      <div className={`p-8 text-center rounded-2xl border ${
        darkMode ? 'bg-[#111622]/60 border-slate-800 text-slate-400' : 'bg-slate-50 border-slate-200 text-slate-600'
      }`}>
        No items found in data table view.
      </div>
    );
  }

  return (
    <div className={`my-6 rounded-2xl border overflow-x-auto ${
      darkMode ? 'bg-[#111622] border-slate-800' : 'bg-white border-slate-200 shadow-sm'
    }`}>
      <table className="w-full text-left border-collapse text-xs">
        <thead>
          <tr className={`border-b font-semibold ${
            darkMode ? 'border-slate-800 bg-slate-900/80 text-slate-400' : 'border-slate-200 bg-slate-50 text-slate-600'
          }`}>
            <th className="py-3.5 px-4">Product Name</th>
            <th className="py-3.5 px-4">Merchant</th>
            <th className="py-3.5 px-4">Category</th>
            <th className="py-3.5 px-4">Purchase Date</th>
            <th className="py-3.5 px-4">Expiration</th>
            <th className="py-3.5 px-4">Value</th>
            <th className="py-3.5 px-4">Status</th>
            <th className="py-3.5 px-4 text-right">Actions</th>
          </tr>
        </thead>
        <tbody className={`divide-y ${darkMode ? 'divide-slate-800/80 text-slate-200' : 'divide-slate-200 text-slate-800'}`}>
          {items.map((item) => {
            const status = getWarrantyStatus(item.warrantyExpirationDate);
            const daysLeft = calculateDaysRemaining(item.warrantyExpirationDate);

            let statusBadge = (
              <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
                <ShieldCheck className="w-3 h-3 mr-1" />
                {daysLeft}d left
              </span>
            );

            if (status === 'expiring_soon') {
              statusBadge = (
                <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-semibold bg-amber-500/15 text-amber-400 border border-amber-500/40">
                  <Clock className="w-3 h-3 mr-1" />
                  {daysLeft <= 0 ? 'Expires Today' : `${daysLeft}d left`}
                </span>
              );
            } else if (status === 'expired') {
              statusBadge = (
                <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-semibold bg-rose-500/15 text-rose-400 border border-rose-500/30">
                  <AlertTriangle className="w-3 h-3 mr-1" />
                  Expired
                </span>
              );
            }

            return (
              <tr
                key={item.id}
                className={`transition-colors ${
                  darkMode ? 'hover:bg-slate-800/40' : 'hover:bg-slate-50'
                }`}
              >
                {/* Product Name & Serial */}
                <td className="py-3 px-4 max-w-xs">
                  <div 
                    onClick={() => onSelectItem(item)}
                    className="font-semibold cursor-pointer hover:text-indigo-400 transition-colors line-clamp-1"
                  >
                    {item.productName}
                  </div>
                  <div className="text-[10px] text-slate-500 font-mono">
                    S/N: {item.serialNumber || 'N/A'}
                  </div>
                </td>

                {/* Merchant */}
                <td className="py-3 px-4 whitespace-nowrap">
                  <span className="font-medium text-indigo-400">{item.merchant}</span>
                </td>

                {/* Category */}
                <td className="py-3 px-4 whitespace-nowrap">
                  <span className={`px-2 py-0.5 rounded-md text-[10px] font-medium border ${
                    darkMode ? 'bg-slate-900 border-slate-800 text-slate-300' : 'bg-slate-100 border-slate-200 text-slate-700'
                  }`}>
                    {item.category}
                  </span>
                </td>

                {/* Purchase Date */}
                <td className="py-3 px-4 whitespace-nowrap text-slate-400">
                  {formatDate(item.purchaseDate)}
                </td>

                {/* Expiration Date */}
                <td className="py-3 px-4 whitespace-nowrap font-medium">
                  {formatDate(item.warrantyExpirationDate)}
                </td>

                {/* Price */}
                <td className="py-3 px-4 whitespace-nowrap font-bold">
                  {formatCurrency(item.purchasePrice, item.currency)}
                </td>

                {/* Status */}
                <td className="py-3 px-4 whitespace-nowrap">
                  {statusBadge}
                </td>

                {/* Actions */}
                <td className="py-3 px-4 whitespace-nowrap text-right">
                  <div className="flex items-center justify-end space-x-1.5">
                    <button
                      onClick={() => onSelectItem(item)}
                      title="Inspect Details"
                      className="p-1.5 rounded-lg bg-indigo-600/20 text-indigo-300 hover:bg-indigo-600 hover:text-white transition-all"
                    >
                      <Eye className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => onGenerateClaim(item)}
                      title="Generate Claim Package"
                      className="p-1.5 rounded-lg bg-emerald-500/15 text-emerald-400 hover:bg-emerald-600 hover:text-white transition-all"
                    >
                      <Download className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => {
                        if (confirm(`Remove "${item.productName}"?`)) {
                          onDeleteItem(item.id);
                        }
                      }}
                      title="Delete"
                      className="p-1.5 rounded-lg bg-rose-500/15 text-rose-400 hover:bg-rose-600 hover:text-white transition-all"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};
