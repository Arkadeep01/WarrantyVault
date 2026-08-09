import React from 'react';
import { ShieldCheck, ScanLine, BellRing, BarChart3, Plus, Moon, Sun, Lock } from 'lucide-react';

interface NavbarProps {
  activeTab: 'dashboard' | 'ocr' | 'settings' | 'analytics';
  setActiveTab: (tab: 'dashboard' | 'ocr' | 'settings' | 'analytics') => void;
  onOpenUpload: () => void;
  darkMode: boolean;
  setDarkMode: (val: boolean) => void;
  itemCount: number;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeTab,
  setActiveTab,
  onOpenUpload,
  darkMode,
  setDarkMode,
  itemCount
}) => {
  return (
    <>
      {/* Desktop Left Vertical Sidebar (Immersive UI Style) */}
      <aside className={`hidden md:flex w-20 border-r flex-col items-center py-8 justify-between z-30 shrink-0 sticky top-0 h-screen transition-colors ${
        darkMode ? 'bg-[#0B0F17]/80 border-slate-800/80 text-slate-300' : 'bg-slate-900 border-slate-800 text-slate-300'
      } backdrop-blur-xl`}>
        <div className="flex flex-col items-center gap-10">
          {/* Logo Badge */}
          <div 
            onClick={() => setActiveTab('dashboard')}
            className="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center shadow-lg shadow-indigo-500/20 cursor-pointer hover:scale-105 transition-transform"
            title="WarrantyVault Dashboard"
          >
            <ShieldCheck className="w-6 h-6 text-white" />
          </div>

          {/* Navigation Icon Links */}
          <nav className="flex flex-col gap-5">
            {/* 1. Vault Dashboard */}
            <button
              onClick={() => setActiveTab('dashboard')}
              title={`Vault Dashboard (${itemCount} items)`}
              className={`p-3 rounded-xl transition-all relative group ${
                activeTab === 'dashboard'
                  ? 'text-indigo-400 bg-indigo-500/10 border border-indigo-500/30 shadow-md shadow-indigo-500/10'
                  : 'text-slate-400 hover:text-white hover:bg-slate-800/80'
              }`}
            >
              <Lock className="w-6 h-6" />
              <span className="absolute left-16 bg-slate-900 text-slate-200 text-xs px-2.5 py-1 rounded-lg border border-slate-800 whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-50 shadow-xl">
                Vault ({itemCount})
              </span>
            </button>

            {/* 2. AI Scan & Capture */}
            <button
              onClick={() => setActiveTab('ocr')}
              title="AI Receipt Scan & Parser"
              className={`p-3 rounded-xl transition-all relative group ${
                activeTab === 'ocr'
                  ? 'text-indigo-400 bg-indigo-500/10 border border-indigo-500/30 shadow-md shadow-indigo-500/10'
                  : 'text-slate-400 hover:text-white hover:bg-slate-800/80'
              }`}
            >
              <ScanLine className="w-6 h-6" />
              <span className="absolute left-16 bg-slate-900 text-slate-200 text-xs px-2.5 py-1 rounded-lg border border-slate-800 whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-50 shadow-xl">
                AI Scan
              </span>
            </button>

            {/* 3. Analytics */}
            <button
              onClick={() => setActiveTab('analytics')}
              title="Value & Protection Analytics"
              className={`p-3 rounded-xl transition-all relative group ${
                activeTab === 'analytics'
                  ? 'text-indigo-400 bg-indigo-500/10 border border-indigo-500/30 shadow-md shadow-indigo-500/10'
                  : 'text-slate-400 hover:text-white hover:bg-slate-800/80'
              }`}
            >
              <BarChart3 className="w-6 h-6" />
              <span className="absolute left-16 bg-slate-900 text-slate-200 text-xs px-2.5 py-1 rounded-lg border border-slate-800 whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-50 shadow-xl">
                Analytics
              </span>
            </button>

            {/* 4. Settings & Alerts */}
            <button
              onClick={() => setActiveTab('settings')}
              title="Sync & Notification Alerts"
              className={`p-3 rounded-xl transition-all relative group ${
                activeTab === 'settings'
                  ? 'text-indigo-400 bg-indigo-500/10 border border-indigo-500/30 shadow-md shadow-indigo-500/10'
                  : 'text-slate-400 hover:text-white hover:bg-slate-800/80'
              }`}
            >
              <BellRing className="w-6 h-6" />
              <span className="absolute left-16 bg-slate-900 text-slate-200 text-xs px-2.5 py-1 rounded-lg border border-slate-800 whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-50 shadow-xl">
                Sync & Alerts
              </span>
            </button>
          </nav>
        </div>

        {/* Sidebar Footer Controls */}
        <div className="flex flex-col items-center gap-4">
          <button
            onClick={() => setDarkMode(!darkMode)}
            title={darkMode ? 'Switch Theme' : 'Switch Theme'}
            className="p-3 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            {darkMode ? <Sun className="w-5 h-5 text-amber-400" /> : <Moon className="w-5 h-5 text-indigo-400" />}
          </button>

          <button
            onClick={onOpenUpload}
            title="Upload New Receipt"
            className="w-10 h-10 bg-indigo-600 hover:bg-indigo-500 rounded-xl flex items-center justify-center text-white shadow-lg shadow-indigo-500/20 transition-all hover:scale-105"
          >
            <Plus className="w-5 h-5" />
          </button>
        </div>
      </aside>

      {/* Mobile Top Header */}
      <header className={`md:hidden sticky top-0 z-40 border-b backdrop-blur-md transition-colors ${
        darkMode ? 'bg-[#0B0F17]/90 border-slate-800 text-slate-100' : 'bg-slate-900 border-slate-800 text-slate-100'
      }`}>
        <div className="px-4 py-3 flex items-center justify-between">
          <div className="flex items-center space-x-3" onClick={() => setActiveTab('dashboard')}>
            <div className="w-9 h-9 bg-indigo-600 rounded-xl flex items-center justify-center shadow-lg shadow-indigo-500/20">
              <ShieldCheck className="w-5 h-5 text-white" />
            </div>
            <div>
              <h1 className="font-bold text-base bg-gradient-to-r from-indigo-400 via-violet-300 to-indigo-200 bg-clip-text text-transparent">
                WarrantyVault
              </h1>
              <p className="text-[10px] text-slate-400">Digital Receipt Locker</p>
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <button
              onClick={() => setDarkMode(!darkMode)}
              className="p-2 rounded-xl bg-slate-800 text-slate-300"
            >
              {darkMode ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-indigo-400" />}
            </button>
            <button
              onClick={onOpenUpload}
              className="px-3 py-1.5 rounded-xl bg-indigo-600 text-white font-medium text-xs flex items-center space-x-1 shadow-md shadow-indigo-500/20"
            >
              <Plus className="w-4 h-4" />
              <span>Receipt</span>
            </button>
          </div>
        </div>

        {/* Mobile Subnav Bar */}
        <div className="flex items-center justify-around py-2 border-t border-slate-800/80 bg-[#0B0F17] text-xs font-medium text-slate-400">
          <button
            onClick={() => setActiveTab('dashboard')}
            className={`flex flex-col items-center py-1 px-3 rounded-lg ${
              activeTab === 'dashboard' ? 'text-indigo-400 font-semibold' : ''
            }`}
          >
            <Lock className="w-4 h-4 mb-0.5" />
            <span>Vault</span>
          </button>
          <button
            onClick={() => setActiveTab('ocr')}
            className={`flex flex-col items-center py-1 px-3 rounded-lg ${
              activeTab === 'ocr' ? 'text-indigo-400 font-semibold' : ''
            }`}
          >
            <ScanLine className="w-4 h-4 mb-0.5" />
            <span>Scan</span>
          </button>
          <button
            onClick={() => setActiveTab('analytics')}
            className={`flex flex-col items-center py-1 px-3 rounded-lg ${
              activeTab === 'analytics' ? 'text-indigo-400 font-semibold' : ''
            }`}
          >
            <BarChart3 className="w-4 h-4 mb-0.5" />
            <span>Analytics</span>
          </button>
          <button
            onClick={() => setActiveTab('settings')}
            className={`flex flex-col items-center py-1 px-3 rounded-lg ${
              activeTab === 'settings' ? 'text-indigo-400 font-semibold' : ''
            }`}
          >
            <BellRing className="w-4 h-4 mb-0.5" />
            <span>Alerts</span>
          </button>
        </div>
      </header>
    </>
  );
};

