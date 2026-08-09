import React, { useState, useMemo } from 'react';
import { Navbar } from './components/Navbar';
import { StatsRibbon } from './components/StatsRibbon';
import { SearchAndFilterBar } from './components/SearchAndFilterBar';
import { ItemGrid } from './components/ItemGrid';
import { ItemTable } from './components/ItemTable';
import { UploadModal } from './components/UploadModal';
import { ItemDetailModal } from './components/ItemDetailModal';
import { ClaimPackageModal } from './components/ClaimPackageModal';
import { NotificationSettingsView } from './components/NotificationSettings';
import { AnalyticsView } from './components/AnalyticsView';

import { WarrantyItem, NotificationSettings, ItemCategory } from './types';
import { INITIAL_WARRANTY_ITEMS, INITIAL_SETTINGS } from './data/mockData';
import { calculateDaysRemaining, formatCurrency, getWarrantyStatus } from './utils/dateUtils';
import { Plus, ShieldCheck, Sparkles, Download, Check, X } from 'lucide-react';

export default function App() {
  // Global Theme & Tab state
  const [darkMode, setDarkMode] = useState<boolean>(true);
  const [activeTab, setActiveTab] = useState<'dashboard' | 'ocr' | 'settings' | 'analytics'>('dashboard');

  // Vault Items & Settings
  const [items, setItems] = useState<WarrantyItem[]>(INITIAL_WARRANTY_ITEMS);
  const [settings, setSettings] = useState<NotificationSettings>(INITIAL_SETTINGS);

  // Search & Filter state
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedStatus, setSelectedStatus] = useState<string>('all');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [sortBy, setSortBy] = useState<'expiration' | 'newest' | 'price_desc' | 'price_asc'>('expiration');
  const [viewMode, setViewMode] = useState<'grid' | 'table'>('grid');

  // Modal States
  const [isUploadOpen, setIsUploadOpen] = useState<boolean>(false);
  const [selectedItem, setSelectedItem] = useState<WarrantyItem | null>(null);
  const [claimItem, setClaimItem] = useState<WarrantyItem | null>(null);

  // Recent scan status toast control
  const [showScanToast, setShowScanToast] = useState<boolean>(true);

  // Calculated totals
  const totalVaultValue = useMemo(() => {
    return items.reduce((sum, item) => sum + item.purchasePrice, 0);
  }, [items]);

  // Filter & Sort Logic
  const filteredItems = useMemo(() => {
    return items
      .filter((item) => {
        // Search query match
        if (searchQuery.trim() !== '') {
          const q = searchQuery.toLowerCase();
          const nameMatch = item.productName.toLowerCase().includes(q);
          const storeMatch = item.merchant.toLowerCase().includes(q);
          const catMatch = item.category.toLowerCase().includes(q);
          const serialMatch = item.serialNumber?.toLowerCase().includes(q) || false;
          const modelMatch = item.modelNumber?.toLowerCase().includes(q) || false;
          if (!nameMatch && !storeMatch && !catMatch && !serialMatch && !modelMatch) {
            return false;
          }
        }

        // Status match
        if (selectedStatus !== 'all') {
          const status = getWarrantyStatus(item.warrantyExpirationDate);
          if (status !== selectedStatus) return false;
        }

        // Category match
        if (selectedCategory !== 'All') {
          if (item.category !== selectedCategory) return false;
        }

        return true;
      })
      .sort((a, b) => {
        if (sortBy === 'expiration') {
          return new Date(a.warrantyExpirationDate).getTime() - new Date(b.warrantyExpirationDate).getTime();
        }
        if (sortBy === 'newest') {
          return new Date(b.purchaseDate).getTime() - new Date(a.purchaseDate).getTime();
        }
        if (sortBy === 'price_desc') {
          return b.purchasePrice - a.purchasePrice;
        }
        if (sortBy === 'price_asc') {
          return a.purchasePrice - b.purchasePrice;
        }
        return 0;
      });
  }, [items, searchQuery, selectedStatus, selectedCategory, sortBy]);

  // Handlers
  const handleSaveItem = (newItem: WarrantyItem) => {
    setItems((prev) => [newItem, ...prev]);
  };

  const handleUpdateItem = (updatedItem: WarrantyItem) => {
    setItems((prev) => prev.map((it) => (it.id === updatedItem.id ? updatedItem : it)));
    if (selectedItem?.id === updatedItem.id) {
      setSelectedItem(updatedItem);
    }
  };

  const handleDeleteItem = (id: string) => {
    setItems((prev) => prev.filter((it) => it.id !== id));
    if (selectedItem?.id === id) setSelectedItem(null);
    if (claimItem?.id === id) setClaimItem(null);
  };

  const exportVaultJson = () => {
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(items, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute("href", dataStr);
    downloadAnchor.setAttribute("download", `warranty-vault-export-${new Date().toISOString().slice(0,10)}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  return (
    <div className={`min-h-screen flex flex-col md:flex-row transition-colors font-sans antialiased overflow-x-hidden ${
      darkMode ? 'bg-[#0B0F17] text-slate-300' : 'bg-slate-900 text-slate-100'
    }`}>
      {/* Immersive Left Sidebar Navigation */}
      <Navbar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        onOpenUpload={() => setIsUploadOpen(true)}
        darkMode={darkMode}
        setDarkMode={setDarkMode}
        itemCount={items.length}
      />

      {/* Main Workspace Container */}
      <main className="flex-1 flex flex-col min-w-0 relative overflow-y-auto">
        {/* Immersive UI Header */}
        <header className="p-6 flex flex-col gap-6 bg-[#0B0F17]/60 border-b border-slate-800/80 backdrop-blur-md">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h1 className="text-2xl font-bold text-white tracking-tight">
                {activeTab === 'dashboard' && 'Vault Dashboard'}
                {activeTab === 'ocr' && 'AI Capture & OCR Studio'}
                {activeTab === 'analytics' && 'Value & Protection Analytics'}
                {activeTab === 'settings' && 'Calendar Sync & Alert Engine'}
              </h1>
              <p className="text-slate-400 text-xs sm:text-sm mt-0.5">
                Managing {items.length} cataloged item{items.length !== 1 ? 's' : ''} worth {formatCurrency(totalVaultValue)}
              </p>
            </div>

            <div className="flex items-center gap-3">
              <button
                onClick={exportVaultJson}
                className="bg-slate-800/90 border border-slate-700/80 hover:bg-slate-700 px-4 py-2 rounded-xl text-xs font-semibold text-slate-200 transition-all flex items-center space-x-1.5 shadow-md"
              >
                <Download className="w-3.5 h-3.5 text-indigo-400" />
                <span>Export Data</span>
              </button>
              <button
                onClick={() => setIsUploadOpen(true)}
                className="bg-indigo-600 hover:bg-indigo-500 px-4 py-2 rounded-xl text-xs font-semibold text-white shadow-lg shadow-indigo-500/20 transition-all flex items-center space-x-1.5"
              >
                <Plus className="w-4 h-4" />
                <span>+ New Receipt</span>
              </button>
            </div>
          </div>

          {/* Quick Stats Ribbon (Header 4-Grid Cards) */}
          <StatsRibbon
            items={items}
            darkMode={darkMode}
            onFilterStatus={(st) => setSelectedStatus(st)}
          />
        </header>

        {/* Dynamic Workspace Content */}
        <section className="p-4 sm:p-6 flex-1 bg-[#0B0F17]">
          {/* TAB 1: Dashboard View */}
          {activeTab === 'dashboard' && (
            <div className="space-y-6">
              {/* Search & Multi-Filter Bar */}
              <SearchAndFilterBar
                searchQuery={searchQuery}
                setSearchQuery={setSearchQuery}
                selectedStatus={selectedStatus}
                setSelectedStatus={setSelectedStatus}
                selectedCategory={selectedCategory}
                setSelectedCategory={setSelectedCategory}
                sortBy={sortBy}
                setSortBy={setSortBy}
                viewMode={viewMode}
                setViewMode={setViewMode}
                darkMode={darkMode}
                totalCount={items.length}
                filteredCount={filteredItems.length}
              />

              {/* Item Display (Grid vs Data Table) */}
              {viewMode === 'grid' ? (
                <ItemGrid
                  items={filteredItems}
                  onSelectItem={(item) => setSelectedItem(item)}
                  onGenerateClaim={(item) => setClaimItem(item)}
                  onDeleteItem={handleDeleteItem}
                  darkMode={darkMode}
                />
              ) : (
                <ItemTable
                  items={filteredItems}
                  onSelectItem={(item) => setSelectedItem(item)}
                  onGenerateClaim={(item) => setClaimItem(item)}
                  onDeleteItem={handleDeleteItem}
                  darkMode={darkMode}
                />
              )}
            </div>
          )}

          {/* TAB 2: AI Capture & OCR Workflow */}
          {activeTab === 'ocr' && (
            <div className="space-y-6 max-w-4xl mx-auto my-6">
              <div className="p-8 rounded-3xl bg-slate-900/40 border border-slate-800 text-center space-y-4">
                <div className="w-16 h-16 mx-auto rounded-2xl bg-indigo-600/20 text-indigo-400 flex items-center justify-center border border-indigo-500/30">
                  <Sparkles className="w-8 h-8" />
                </div>
                <h2 className="text-2xl font-bold tracking-tight text-white">AI Receipt OCR & Warranty Parser</h2>
                <p className="text-xs text-slate-400 max-w-md mx-auto leading-relaxed">
                  Scan physical receipts with your camera or upload digital invoices. Gemini AI extracts merchant names, purchase totals, itemized lists, serial numbers, and calculates warranty expiration schedules.
                </p>

                <button
                  onClick={() => setIsUploadOpen(true)}
                  className="px-6 py-3 rounded-2xl bg-gradient-to-r from-indigo-600 via-violet-600 to-emerald-600 hover:from-indigo-500 hover:to-emerald-500 text-white font-semibold text-xs shadow-xl shadow-indigo-600/30 inline-flex items-center space-x-2"
                >
                  <Plus className="w-4 h-4" />
                  <span>Open Receipt Capture Studio</span>
                </button>
              </div>
            </div>
          )}

          {/* TAB 3: Insights & Analytics */}
          {activeTab === 'analytics' && (
            <AnalyticsView items={items} darkMode={darkMode} />
          )}

          {/* TAB 4: Alerts & Calendar Sync Settings */}
          {activeTab === 'settings' && (
            <NotificationSettingsView
              settings={settings}
              onUpdateSettings={setSettings}
              items={items}
              darkMode={darkMode}
            />
          )}
        </section>

        {/* Immersive UI Bottom-Right Floating AI Toast / Widget */}
        {showScanToast && items.length > 0 && (
          <div className="fixed bottom-6 right-6 z-40 w-80 bg-slate-900/95 border border-slate-800 rounded-2xl p-4 shadow-2xl backdrop-blur-md hidden sm:block">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 bg-emerald-500/20 rounded-xl flex items-center justify-center text-emerald-400 border border-emerald-500/30">
                  <Check className="w-4 h-4" />
                </div>
                <div>
                  <p className="text-xs font-bold text-white uppercase tracking-wider">Latest OCR Verification</p>
                  <p className="text-[10px] text-slate-400 truncate max-w-[170px]">{items[0].productName}</p>
                </div>
              </div>
              <button
                onClick={() => setShowScanToast(false)}
                className="text-slate-500 hover:text-slate-300 p-1"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>

            <div className="grid grid-cols-2 gap-2 text-[11px] mb-3">
              <div className="bg-slate-800/60 p-2 rounded-xl border border-slate-700/50">
                <p className="text-slate-500 mb-0.5">Confidence</p>
                <p className="text-emerald-400 font-bold font-mono">99.4%</p>
              </div>
              <div className="bg-slate-800/60 p-2 rounded-xl border border-slate-700/50">
                <p className="text-slate-500 mb-0.5">Coverage</p>
                <p className="text-white font-bold">{items[0].warrantyMonths} Months</p>
              </div>
            </div>

            <button
              onClick={() => setSelectedItem(items[0])}
              className="w-full bg-indigo-600 hover:bg-indigo-500 py-2 rounded-xl text-xs font-bold text-white shadow-md shadow-indigo-600/30 transition-all"
            >
              Review Details & Certificate
            </button>
          </div>
        )}
      </main>

      {/* Modals */}
      <UploadModal
        isOpen={isUploadOpen}
        onClose={() => setIsUploadOpen(false)}
        onSaveItem={handleSaveItem}
        darkMode={darkMode}
      />

      <ItemDetailModal
        item={selectedItem}
        onClose={() => setSelectedItem(null)}
        onUpdateItem={handleUpdateItem}
        onGenerateClaim={(item) => setClaimItem(item)}
        darkMode={darkMode}
      />

      <ClaimPackageModal
        item={claimItem}
        onClose={() => setClaimItem(null)}
        darkMode={darkMode}
      />
    </div>
  );
}

