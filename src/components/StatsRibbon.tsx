import React from 'react';
import { ShieldCheck, AlertTriangle, Clock, DollarSign, ArrowUpRight, Sparkles } from 'lucide-react';
import { WarrantyItem } from '../types';
import { calculateDaysRemaining, formatCurrency, getWarrantyStatus } from '../utils/dateUtils';

interface StatsRibbonProps {
  items: WarrantyItem[];
  darkMode: boolean;
  onFilterStatus?: (status: string) => void;
}

export const StatsRibbon: React.FC<StatsRibbonProps> = ({ items, darkMode, onFilterStatus }) => {
  const totalItems = items.length;
  
  let activeCount = 0;
  let expiringSoonCount = 0;
  let expiredCount = 0;
  let totalValueProtected = 0;
  let valueAtRisk = 0;

  items.forEach((item) => {
    const status = getWarrantyStatus(item.warrantyExpirationDate);
    const daysLeft = calculateDaysRemaining(item.warrantyExpirationDate);
    
    totalValueProtected += item.purchasePrice;

    if (status === 'active') {
      activeCount++;
      if (daysLeft <= 60 && daysLeft > 0) {
        valueAtRisk += item.purchasePrice;
      }
    } else if (status === 'expiring_soon') {
      expiringSoonCount++;
      valueAtRisk += item.purchasePrice;
    } else {
      expiredCount++;
    }
  });

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
      {/* 1. Active Warranties */}
      <div 
        onClick={() => onFilterStatus && onFilterStatus('active')}
        className={`bg-slate-900/40 border border-slate-800 p-4 rounded-2xl cursor-pointer hover:border-slate-700 transition-colors group`}
      >
        <p className="text-xs text-slate-500 uppercase font-bold tracking-wider mb-1">Active Warranties</p>
        <div className="flex items-baseline justify-between">
          <p className="text-2xl font-semibold text-white">{activeCount}</p>
          <span className="text-[10px] font-bold px-2 py-0.5 rounded uppercase bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
            {totalItems ? Math.round((activeCount / totalItems) * 100) : 0}% Active
          </span>
        </div>
      </div>

      {/* 2. Expiring Soon */}
      <div 
        onClick={() => onFilterStatus && onFilterStatus('expiring_soon')}
        className={`bg-slate-900/40 border border-slate-800 p-4 rounded-2xl cursor-pointer hover:border-slate-700 transition-colors group`}
      >
        <p className="text-xs text-slate-500 uppercase font-bold tracking-wider mb-1">Expiring Soon (&lt;30d)</p>
        <div className="flex items-baseline justify-between">
          <p className="text-2xl font-semibold text-amber-500">{expiringSoonCount}</p>
          <span className="text-[10px] font-bold px-2 py-0.5 rounded uppercase bg-amber-500/10 text-amber-400 border border-amber-500/20">
            Action Needed
          </span>
        </div>
      </div>

      {/* 3. Value At Risk */}
      <div 
        onClick={() => onFilterStatus && onFilterStatus('expiring_soon')}
        className={`bg-slate-900/40 border border-slate-800 p-4 rounded-2xl cursor-pointer hover:border-slate-700 transition-colors group`}
      >
        <p className="text-xs text-slate-500 uppercase font-bold tracking-wider mb-1">Value At Risk</p>
        <div className="flex items-baseline justify-between">
          <p className="text-2xl font-semibold text-white">{formatCurrency(valueAtRisk)}</p>
          <span className="text-[10px] text-slate-400 font-mono">
            {expiringSoonCount} item{expiringSoonCount !== 1 ? 's' : ''}
          </span>
        </div>
      </div>

      {/* 4. Processing AI / Vault Total */}
      <div 
        className={`bg-slate-900/40 border border-slate-800 p-4 rounded-2xl border-l-4 border-l-indigo-500`}
      >
        <p className="text-xs text-slate-500 uppercase font-bold tracking-wider mb-1 flex items-center justify-between">
          <span>AI OCR Parser</span>
          <Sparkles className="w-3.5 h-3.5 text-indigo-400 animate-pulse" />
        </p>
        <div className="flex items-baseline justify-between">
          <p className="text-2xl font-semibold text-indigo-400 animate-pulse">Gemini 2.5</p>
          <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-indigo-500/10 text-indigo-300 border border-indigo-500/30">
            Active
          </span>
        </div>
      </div>
    </div>
  );
};

