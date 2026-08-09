import React from 'react';
import { ShieldCheck, DollarSign, Clock, Tag, BarChart3, TrendingUp, AlertTriangle } from 'lucide-react';
import { WarrantyItem } from '../types';
import { calculateDaysRemaining, formatCurrency, getWarrantyStatus } from '../utils/dateUtils';

interface AnalyticsViewProps {
  items: WarrantyItem[];
  darkMode: boolean;
}

export const AnalyticsView: React.FC<AnalyticsViewProps> = ({ items, darkMode }) => {
  let totalValue = 0;
  let activeValue = 0;
  let expiringSoonValue = 0;
  let expiredValue = 0;

  const categoryTotals: Record<string, { count: number; value: number }> = {};

  items.forEach((item) => {
    totalValue += item.purchasePrice;
    const status = getWarrantyStatus(item.warrantyExpirationDate);

    if (status === 'active') {
      activeValue += item.purchasePrice;
    } else if (status === 'expiring_soon') {
      expiringSoonValue += item.purchasePrice;
    } else {
      expiredValue += item.purchasePrice;
    }

    if (!categoryTotals[item.category]) {
      categoryTotals[item.category] = { count: 0, value: 0 };
    }
    categoryTotals[item.category].count += 1;
    categoryTotals[item.category].value += item.purchasePrice;
  });

  const categoriesSorted = Object.entries(categoryTotals).sort((a, b) => b[1].value - a[1].value);

  return (
    <div className="max-w-6xl mx-auto space-y-6 my-6">
      {/* Header */}
      <div className={`p-6 rounded-3xl border ${
        darkMode ? 'bg-[#111622] border-slate-800' : 'bg-white border-slate-200 shadow-sm'
      }`}>
        <div className="flex items-center space-x-3">
          <div className="p-3 rounded-2xl bg-indigo-600/20 text-indigo-400 border border-indigo-500/30">
            <BarChart3 className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-xl font-bold">Value Protection & Lifecycle Analytics</h2>
            <p className="text-xs text-slate-400">Financial asset summary and warranty status breakdown</p>
          </div>
        </div>
      </div>

      {/* Primary KPI Ribbon */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {/* Total Value */}
        <div className={`p-5 rounded-2xl border ${
          darkMode ? 'bg-[#111622] border-slate-800' : 'bg-white border-slate-200'
        }`}>
          <div className="text-xs text-slate-400 font-semibold mb-1">Total Assets Protected</div>
          <div className="text-2xl font-bold text-indigo-400">
            {formatCurrency(totalValue)}
          </div>
          <div className="text-[11px] text-slate-500 mt-1">{items.length} items cataloged</div>
        </div>

        {/* Value at Risk */}
        <div className={`p-5 rounded-2xl border ${
          darkMode ? 'bg-[#111622] border-slate-800' : 'bg-white border-slate-200'
        }`}>
          <div className="text-xs text-slate-400 font-semibold mb-1">Value at Risk (&lt;30 days)</div>
          <div className="text-2xl font-bold text-amber-400">
            {formatCurrency(expiringSoonValue)}
          </div>
          <div className="text-[11px] text-amber-500/80 mt-1">Requires inspection or extension</div>
        </div>

        {/* Expired Value */}
        <div className={`p-5 rounded-2xl border ${
          darkMode ? 'bg-[#111622] border-slate-800' : 'bg-white border-slate-200'
        }`}>
          <div className="text-xs text-slate-400 font-semibold mb-1">Expired Coverage Value</div>
          <div className="text-2xl font-bold text-rose-400">
            {formatCurrency(expiredValue)}
          </div>
          <div className="text-[11px] text-slate-500 mt-1">Lapsed protection</div>
        </div>
      </div>

      {/* Category Breakdown & Progress Bars */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Category Distribution */}
        <div className={`p-6 rounded-3xl border space-y-4 ${
          darkMode ? 'bg-[#111622] border-slate-800' : 'bg-white border-slate-200'
        }`}>
          <h3 className="font-bold text-sm border-b pb-2 border-slate-800 flex items-center justify-between">
            <span>Asset Distribution by Category</span>
            <Tag className="w-4 h-4 text-indigo-400" />
          </h3>

          <div className="space-y-3">
            {categoriesSorted.map(([cat, info]) => {
              const percent = totalValue ? Math.round((info.value / totalValue) * 100) : 0;
              return (
                <div key={cat} className="space-y-1 text-xs">
                  <div className="flex items-center justify-between">
                    <span className="font-semibold text-slate-200">{cat} ({info.count})</span>
                    <span className="font-bold text-indigo-300">{formatCurrency(info.value)} ({percent}%)</span>
                  </div>
                  <div className="w-full h-2 rounded-full bg-slate-800 overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-indigo-500 to-violet-500 rounded-full"
                      style={{ width: `${percent}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Lifecycle Status Composition */}
        <div className={`p-6 rounded-3xl border space-y-4 ${
          darkMode ? 'bg-[#111622] border-slate-800' : 'bg-white border-slate-200'
        }`}>
          <h3 className="font-bold text-sm border-b pb-2 border-slate-800 flex items-center justify-between">
            <span>Warranty Health Ratio</span>
            <TrendingUp className="w-4 h-4 text-emerald-400" />
          </h3>

          <div className="space-y-4 text-xs">
            <div>
              <div className="flex justify-between mb-1">
                <span className="font-semibold text-emerald-400">Valid Active Protection</span>
                <span className="font-bold">{formatCurrency(activeValue)}</span>
              </div>
              <div className="w-full h-3 rounded-full bg-slate-800 overflow-hidden">
                <div
                  className="h-full bg-emerald-500 rounded-full"
                  style={{ width: `${totalValue ? (activeValue / totalValue) * 100 : 0}%` }}
                />
              </div>
            </div>

            <div>
              <div className="flex justify-between mb-1">
                <span className="font-semibold text-amber-400">Expiring Soon (&lt;30d)</span>
                <span className="font-bold">{formatCurrency(expiringSoonValue)}</span>
              </div>
              <div className="w-full h-3 rounded-full bg-slate-800 overflow-hidden">
                <div
                  className="h-full bg-amber-500 rounded-full"
                  style={{ width: `${totalValue ? (expiringSoonValue / totalValue) * 100 : 0}%` }}
                />
              </div>
            </div>

            <div>
              <div className="flex justify-between mb-1">
                <span className="font-semibold text-rose-400">Expired Coverage</span>
                <span className="font-bold">{formatCurrency(expiredValue)}</span>
              </div>
              <div className="w-full h-3 rounded-full bg-slate-800 overflow-hidden">
                <div
                  className="h-full bg-rose-500 rounded-full"
                  style={{ width: `${totalValue ? (expiredValue / totalValue) * 100 : 0}%` }}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
