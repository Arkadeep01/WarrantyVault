import React from 'react';
import { Search, Filter, LayoutGrid, Table, X, ArrowUpDown, Tag } from 'lucide-react';
import { ItemCategory } from '../types';

interface SearchAndFilterBarProps {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  selectedStatus: string;
  setSelectedStatus: (status: string) => void;
  selectedCategory: string;
  setSelectedCategory: (category: string) => void;
  sortBy: 'expiration' | 'newest' | 'price_desc' | 'price_asc';
  setSortBy: (sort: 'expiration' | 'newest' | 'price_desc' | 'price_asc') => void;
  viewMode: 'grid' | 'table';
  setViewMode: (mode: 'grid' | 'table') => void;
  darkMode: boolean;
  totalCount: number;
  filteredCount: number;
}

const CATEGORIES: Array<ItemCategory | 'All'> = [
  'All',
  'Electronics',
  'Appliances',
  'Home & Garden',
  'Apparel',
  'Tools',
  'Automotive',
  'Office',
  'Fitness',
  'Other'
];

export const SearchAndFilterBar: React.FC<SearchAndFilterBarProps> = ({
  searchQuery,
  setSearchQuery,
  selectedStatus,
  setSelectedStatus,
  selectedCategory,
  setSelectedCategory,
  sortBy,
  setSortBy,
  viewMode,
  setViewMode,
  darkMode,
  totalCount,
  filteredCount
}) => {
  const hasActiveFilters = searchQuery !== '' || selectedStatus !== 'all' || selectedCategory !== 'All';

  const clearFilters = () => {
    setSearchQuery('');
    setSelectedStatus('all');
    setSelectedCategory('All');
  };

  return (
    <div className={`p-4 rounded-2xl border transition-all ${
      darkMode ? 'bg-slate-900/40 border-slate-800' : 'bg-slate-900/40 border-slate-800 shadow-sm'
    }`}>
      <div className="flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-3">
        {/* Full-text search input */}
        <div className="relative flex-1">
          <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Search by product, store, serial #, or model..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className={`w-full pl-10 pr-9 py-2 rounded-xl text-xs font-medium border outline-none transition-all ${
              darkMode
                ? 'bg-slate-900 border-slate-800 text-slate-100 placeholder-slate-500 focus:border-indigo-500'
                : 'bg-slate-900 border-slate-800 text-slate-100 placeholder-slate-500 focus:border-indigo-500'
            }`}
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-200"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

        {/* Filter controls */}
        <div className="flex flex-wrap items-center gap-2">
          {/* Status selector */}
          <div className="flex items-center p-1 rounded-xl bg-slate-900/60 border border-slate-800/80 text-xs font-medium">
            <button
              onClick={() => setSelectedStatus('all')}
              className={`px-3 py-1 rounded-lg transition-all ${
                selectedStatus === 'all'
                  ? 'bg-indigo-600 text-white font-semibold shadow-sm'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              All
            </button>
            <button
              onClick={() => setSelectedStatus('active')}
              className={`px-3 py-1 rounded-lg transition-all flex items-center space-x-1 ${
                selectedStatus === 'active'
                  ? 'bg-emerald-600 text-white font-semibold shadow-sm'
                  : 'text-emerald-400/80 hover:text-emerald-300'
              }`}
            >
              <span>Valid</span>
            </button>
            <button
              onClick={() => setSelectedStatus('expiring_soon')}
              className={`px-3 py-1 rounded-lg transition-all flex items-center space-x-1 ${
                selectedStatus === 'expiring_soon'
                  ? 'bg-amber-600 text-white font-semibold shadow-sm'
                  : 'text-amber-400/80 hover:text-amber-300'
              }`}
            >
              <span>Expiring &lt;30d</span>
            </button>
            <button
              onClick={() => setSelectedStatus('expired')}
              className={`px-3 py-1 rounded-lg transition-all flex items-center space-x-1 ${
                selectedStatus === 'expired'
                  ? 'bg-rose-600 text-white font-semibold shadow-sm'
                  : 'text-rose-400/80 hover:text-rose-300'
              }`}
            >
              <span>Expired</span>
            </button>
          </div>

          {/* Category Dropdown */}
          <div className="relative">
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className={`px-3 py-2 rounded-xl text-xs font-medium border outline-none cursor-pointer transition-all ${
                darkMode
                  ? 'bg-slate-900 border-slate-800 text-slate-200 hover:border-slate-700'
                  : 'bg-slate-50 border-slate-200 text-slate-800 hover:border-slate-300'
              }`}
            >
              {CATEGORIES.map((cat) => (
                <option key={cat} value={cat}>
                  {cat === 'All' ? 'All Categories' : cat}
                </option>
              ))}
            </select>
          </div>

          {/* Sort By Dropdown */}
          <div className="relative">
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className={`px-3 py-2 rounded-xl text-xs font-medium border outline-none cursor-pointer transition-all ${
                darkMode
                  ? 'bg-slate-900 border-slate-800 text-slate-200 hover:border-slate-700'
                  : 'bg-slate-50 border-slate-200 text-slate-800 hover:border-slate-300'
              }`}
            >
              <option value="expiration">Sort: Expiration Date</option>
              <option value="newest">Sort: Purchase Date (Newest)</option>
              <option value="price_desc">Sort: Value (High to Low)</option>
              <option value="price_asc">Sort: Value (Low to High)</option>
            </select>
          </div>

          {/* Clear Filters button */}
          {hasActiveFilters && (
            <button
              onClick={clearFilters}
              className="px-2.5 py-1.5 rounded-xl text-xs text-rose-400 hover:text-rose-300 bg-rose-500/10 hover:bg-rose-500/20 transition-all flex items-center space-x-1 font-medium"
            >
              <X className="w-3 h-3" />
              <span>Reset</span>
            </button>
          )}

          {/* View Mode Switcher (Grid vs Table) */}
          <div className="flex items-center p-1 rounded-xl bg-slate-900/60 border border-slate-800/80 ml-auto">
            <button
              onClick={() => setViewMode('grid')}
              title="Grid View"
              className={`p-1.5 rounded-lg transition-all ${
                viewMode === 'grid'
                  ? 'bg-indigo-600 text-white shadow-sm'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <LayoutGrid className="w-4 h-4" />
            </button>
            <button
              onClick={() => setViewMode('table')}
              title="Data Table View"
              className={`p-1.5 rounded-lg transition-all ${
                viewMode === 'table'
                  ? 'bg-indigo-600 text-white shadow-sm'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <Table className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Active Filter Badges */}
      {hasActiveFilters && (
        <div className="mt-3 pt-3 border-t border-slate-800/50 flex flex-wrap items-center gap-2 text-xs">
          <span className="text-slate-400 font-medium">Active Filters:</span>
          {searchQuery && (
            <span className="px-2.5 py-0.5 rounded-md bg-indigo-500/15 border border-indigo-500/30 text-indigo-300 flex items-center space-x-1">
              <span>Query: "{searchQuery}"</span>
            </span>
          )}
          {selectedStatus !== 'all' && (
            <span className="px-2.5 py-0.5 rounded-md bg-violet-500/15 border border-violet-500/30 text-violet-300 flex items-center space-x-1">
              <span>Status: {selectedStatus.replace('_', ' ')}</span>
            </span>
          )}
          {selectedCategory !== 'All' && (
            <span className="px-2.5 py-0.5 rounded-md bg-emerald-500/15 border border-emerald-500/30 text-emerald-300 flex items-center space-x-1">
              <span>Category: {selectedCategory}</span>
            </span>
          )}
          <span className="text-slate-500 ml-auto">
            Showing {filteredCount} of {totalCount} items
          </span>
        </div>
      )}
    </div>
  );
};
