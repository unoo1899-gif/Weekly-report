import React from 'react';
import { ActiveTab, User } from '../types';
import { BookOpen, RefreshCw, FileSpreadsheet, Download, LogOut, Shield, User as UserIcon } from 'lucide-react';

interface NavbarProps {
  activeTab: ActiveTab;
  setActiveTab: (tab: ActiveTab) => void;
  onOpenUploadModal: (type: 'balance' | 'po') => void;
  onOpenExportModal: () => void;
  onResetData: () => void;
  currentUser: User;
  onLogout: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeTab,
  setActiveTab,
  onOpenUploadModal,
  onOpenExportModal,
  onResetData,
  currentUser,
  onLogout,
}) => {
  return (
    <header className="sticky top-0 z-40 bg-slate-900/90 backdrop-blur-md border-b border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 gap-8">
          {/* Zone 1: Single text element wordmark */}
          <div className="flex items-center gap-3 shrink-0">
            <div className="w-9 h-9 rounded-lg bg-cyan-600 flex items-center justify-center text-white font-bold shadow-lg shadow-cyan-900/20">
              <BookOpen className="w-5 h-5" />
            </div>
            <div>
              <span className="text-lg font-bold tracking-tight text-white whitespace-nowrap">
                BookWMS <span className="text-cyan-400 font-normal">Phase 1</span>
              </span>
              <p className="text-[10px] text-slate-400 tracking-wider uppercase font-mono">ISBN Order Management</p>
            </div>
          </div>

          {/* Zone 2: Navigation Links */}
          <nav className="hidden md:flex items-center gap-1 bg-slate-950/50 p-1 rounded-xl border border-slate-800">
            <button
              onClick={() => setActiveTab('replenishment')}
              className={`px-4 py-1.5 text-xs font-medium rounded-lg transition-all whitespace-nowrap ${
                activeTab === 'replenishment'
                  ? 'bg-cyan-500 text-white shadow-sm'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
              }`}
            >
              Replenishment Dashboard
            </button>

            {currentUser.permissions.canEditMinStock && (
              <button
                onClick={() => setActiveTab('preset-stock')}
                className={`px-4 py-1.5 text-xs font-medium rounded-lg transition-all whitespace-nowrap ${
                  activeTab === 'preset-stock'
                    ? 'bg-cyan-500 text-white shadow-sm'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
                }`}
              >
                Preset Min Stock
              </button>
            )}

            {currentUser.permissions.canManageCatalog && (
              <button
                onClick={() => setActiveTab('inventory-ledger')}
                className={`px-4 py-1.5 text-xs font-medium rounded-lg transition-all whitespace-nowrap ${
                  activeTab === 'inventory-ledger'
                    ? 'bg-cyan-500 text-white shadow-sm'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
                }`}
              >
                Book Catalog Ledger
              </button>
            )}

            {(currentUser.permissions.canManageUsers || currentUser.role === 'Administrator') && (
              <button
                onClick={() => setActiveTab('user-management')}
                className={`px-4 py-1.5 text-xs font-medium rounded-lg transition-all whitespace-nowrap flex items-center gap-1.5 ${
                  activeTab === 'user-management'
                    ? 'bg-cyan-500 text-white shadow-sm'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
                }`}
              >
                <Shield className="w-3.5 h-3.5" />
                <span>User Management</span>
              </button>
            )}
          </nav>

          {/* Zone 3: Primary Action & User Profile / Logout */}
          <div className="flex items-center gap-2.5 shrink-0">
            {currentUser.permissions.canUploadStock && (
              <>
                <button
                  onClick={() => onOpenUploadModal('balance')}
                  className="hidden sm:flex items-center gap-2 px-3 py-2 bg-slate-800 hover:bg-slate-700 text-cyan-300 border border-slate-700 text-xs font-medium rounded-lg transition-all shadow-sm whitespace-nowrap group"
                  title="Upload Stock Balance File"
                >
                  <FileSpreadsheet className="w-4 h-4 text-cyan-400 group-hover:scale-110 transition-transform" />
                  <span>Upload Balance</span>
                </button>

                <button
                  onClick={() => onOpenUploadModal('po')}
                  className="hidden sm:flex items-center gap-2 px-3 py-2 bg-slate-800 hover:bg-slate-700 text-emerald-300 border border-slate-700 text-xs font-medium rounded-lg transition-all shadow-sm whitespace-nowrap group"
                  title="Upload Extra PO Stock File"
                >
                  <FileSpreadsheet className="w-4 h-4 text-emerald-400 group-hover:scale-110 transition-transform" />
                  <span>Upload Extra PO</span>
                </button>
              </>
            )}

            {currentUser.permissions.canExportReports && (
              <button
                onClick={onOpenExportModal}
                className="flex items-center gap-2 px-3 py-2 bg-cyan-600 hover:bg-cyan-500 text-white text-xs font-medium rounded-lg transition-all shadow-lg shadow-cyan-900/30 whitespace-nowrap"
              >
                <Download className="w-4 h-4" />
                <span className="hidden lg:inline">Export PO</span>
              </button>
            )}

            {currentUser.permissions.canManageCatalog && (
              <button
                onClick={onResetData}
                className="p-2 bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white rounded-lg transition-colors border border-slate-700"
                title="Reset Demo Data"
              >
                <RefreshCw className="w-4 h-4" />
              </button>
            )}

            {/* User Profile Badge & Logout */}
            <div className="flex items-center gap-2 pl-3 border-l border-slate-800">
              <div className="text-right hidden sm:block">
                <p className="text-xs font-semibold text-white">{currentUser.fullName}</p>
                <p className="text-[10px] text-cyan-400 font-mono">{currentUser.role}</p>
              </div>
              <button
                onClick={onLogout}
                className="p-2 bg-slate-800 hover:bg-rose-950/60 text-slate-300 hover:text-rose-300 border border-slate-700 hover:border-rose-800/80 rounded-lg transition-colors"
                title="Sign Out"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};
