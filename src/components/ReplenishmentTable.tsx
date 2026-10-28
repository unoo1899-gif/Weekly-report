import React, { useState } from 'react';
import { InventoryItem } from '../types';
import { Search, AlertTriangle, CheckCircle2, FileSpreadsheet, Download, Filter, Flame } from 'lucide-react';

interface ReplenishmentTableProps {
  items: InventoryItem[];
  onOpenUploadModal: (type: 'balance' | 'po') => void;
  onOpenExportModal: () => void;
}

export const ReplenishmentTable: React.FC<ReplenishmentTableProps> = ({
  items,
  onOpenUploadModal,
  onOpenExportModal,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState<'all' | 'insufficient' | 'sufficient' | 'critical'>('all');

  // Core calculation engine
  const evaluatedItems = items.map((item) => {
    // Formula: Required Stock - Stock Balance - Extra PO Stock
    const deficit = item.minRequiredStock - item.stockBalance - item.extraPoStock;
    const isInsufficient = deficit > 0;
    const orderQty = Math.max(0, deficit);
    // Critical Low Stock: stock balance is below 20% of Minimum Required Stock
    const isCriticalLow = item.stockBalance < 0.2 * item.minRequiredStock;

    return {
      ...item,
      deficit,
      isInsufficient,
      orderQty,
      isCriticalLow,
    };
  });

  const filteredItems = evaluatedItems.filter((item) => {
    const matchesSearch =
      item.isbn.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.supplier.toLowerCase().includes(searchTerm.toLowerCase());

    if (filterStatus === 'insufficient') return matchesSearch && item.isInsufficient;
    if (filterStatus === 'sufficient') return matchesSearch && !item.isInsufficient;
    if (filterStatus === 'critical') return matchesSearch && item.isCriticalLow;
    return matchesSearch;
  });

  const criticalCount = evaluatedItems.filter(i => i.isCriticalLow).length;

  return (
    <div className="space-y-6">
      {/* Upload Hub Banner */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Upload Stock Balance Box */}
        <div className="bg-gradient-to-br from-slate-900 to-cyan-950/30 border border-cyan-900/40 rounded-2xl p-6 shadow-sm flex items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-cyan-950 flex items-center justify-center text-cyan-400 border border-cyan-800 shrink-0 shadow-inner">
              <FileSpreadsheet className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-sm font-semibold text-white">Current Stock Balance</h3>
              <p className="text-xs text-slate-400 mt-0.5">Upload latest warehouse physical count data by ISBN.</p>
            </div>
          </div>
          <button
            onClick={() => onOpenUploadModal('balance')}
            className="flex items-center gap-2 px-4 py-2.5 bg-cyan-600 hover:bg-cyan-500 text-white text-xs font-semibold rounded-xl shadow-lg shadow-cyan-900/30 transition-all whitespace-nowrap shrink-0"
          >
            <FileSpreadsheet className="w-4 h-4" />
            <span>Upload Balance</span>
          </button>
        </div>

        {/* Upload Extra PO Stock Box */}
        <div className="bg-gradient-to-br from-slate-900 to-emerald-950/30 border border-emerald-900/40 rounded-2xl p-6 shadow-sm flex items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-emerald-950 flex items-center justify-center text-emerald-400 border border-emerald-800 shrink-0 shadow-inner">
              <FileSpreadsheet className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-sm font-semibold text-white">Extra PO Stock (In Transit)</h3>
              <p className="text-xs text-slate-400 mt-0.5">Upload active purchase order deliveries by ISBN.</p>
            </div>
          </div>
          <button
            onClick={() => onOpenUploadModal('po')}
            className="flex items-center gap-2 px-4 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold rounded-xl shadow-lg shadow-emerald-900/30 transition-all whitespace-nowrap shrink-0"
          >
            <FileSpreadsheet className="w-4 h-4" />
            <span>Upload Extra PO</span>
          </button>
        </div>
      </div>

      {/* Main Results Table Card */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl shadow-sm overflow-hidden">
        {/* Table Controls */}
        <div className="p-6 border-b border-slate-800 flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-slate-800 text-cyan-400 border border-slate-700 flex items-center justify-center">
              <Filter className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-white">Book Replenishment & Order Management</h2>
              <p className="text-xs text-slate-400">Formula: Min Required Stock - Stock Balance - Extra PO Stock</p>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
            {/* Status Filter Tabs */}
            <div className="flex items-center bg-slate-950 p-1 rounded-xl border border-slate-800 overflow-x-auto">
              <button
                onClick={() => setFilterStatus('all')}
                className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-colors whitespace-nowrap ${
                  filterStatus === 'all' ? 'bg-slate-800 text-white shadow-sm' : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                All ({evaluatedItems.length})
              </button>
              <button
                onClick={() => setFilterStatus('critical')}
                className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-colors whitespace-nowrap flex items-center gap-1.5 ${
                  filterStatus === 'critical' ? 'bg-rose-950/80 text-rose-300 border border-rose-900' : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                <Flame className="w-3.5 h-3.5 text-rose-400 animate-pulse" />
                <span>Critical (&lt;20%) ({criticalCount})</span>
              </button>
              <button
                onClick={() => setFilterStatus('insufficient')}
                className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-colors whitespace-nowrap ${
                  filterStatus === 'insufficient' ? 'bg-amber-950/60 text-amber-300 border border-amber-900/60' : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                Needs Order ({evaluatedItems.filter(i => i.isInsufficient).length})
              </button>
              <button
                onClick={() => setFilterStatus('sufficient')}
                className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-colors whitespace-nowrap ${
                  filterStatus === 'sufficient' ? 'bg-emerald-950/60 text-emerald-300 border border-emerald-900/60' : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                Sufficient ({evaluatedItems.filter(i => !i.isInsufficient).length})
              </button>
            </div>

            {/* Search Input */}
            <div className="relative">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input
                type="text"
                placeholder="Search ISBN or title..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full sm:w-64 bg-slate-950 border border-slate-700 rounded-xl pl-10 pr-4 py-2 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-cyan-500"
              />
            </div>
          </div>
        </div>

        {/* Results Data Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-950/60 text-[11px] font-mono text-slate-400 uppercase tracking-wider border-b border-slate-800">
                <th className="py-3 px-6">ISBN / Title</th>
                <th className="py-3 px-6 text-right">Min Required</th>
                <th className="py-3 px-6 text-right">Stock Balance</th>
                <th className="py-3 px-6 text-right">Extra PO Stock</th>
                <th className="py-3 px-6 text-right font-semibold text-cyan-400">Calculation Result</th>
                <th className="py-3 px-6">Publisher / Action Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 text-xs">
              {filteredItems.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-12 text-center text-slate-500">
                    No matching book inventory records found.
                  </td>
                </tr>
              ) : (
                filteredItems.map((item) => {
                  return (
                    <tr
                      key={item.isbn}
                      className={`transition-colors hover:bg-slate-800/40 ${
                        item.isCriticalLow
                          ? 'bg-rose-950/25 border-l-4 border-rose-500'
                          : item.isInsufficient
                          ? 'bg-amber-950/10'
                          : ''
                      }`}
                    >
                      {/* ISBN / Title */}
                      <td className="py-4 px-6">
                        <div className="flex items-center gap-2">
                          <div className="font-mono text-cyan-400 font-semibold">{item.isbn}</div>
                          {item.isCriticalLow && (
                            <span
                              className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-rose-950 text-rose-400 text-[10px] font-bold uppercase tracking-wider border border-rose-800 shadow-sm animate-pulse"
                              title="Critical Stock: Below 20% of Minimum Required Stock"
                            >
                              <Flame className="w-3 h-3" /> Critical &lt;20%
                            </span>
                          )}
                        </div>
                        <div className="text-slate-100 font-medium mt-0.5">{item.title}</div>
                        <div className="text-[11px] text-slate-400 mt-0.5">Publisher: {item.supplier}</div>
                      </td>

                      {/* Min Required Stock */}
                      <td className="py-4 px-6 text-right font-mono tabular-nums text-slate-200 font-medium">
                        {item.minRequiredStock.toLocaleString()}
                      </td>

                      {/* Stock Balance */}
                      <td className="py-4 px-6 text-right font-mono tabular-nums">
                        <div className="flex items-center justify-end gap-1.5">
                          {item.isCriticalLow && (
                            <span title="Stock balance is below 20% of Minimum Required Stock">
                              <AlertTriangle className="w-4 h-4 text-rose-500 shrink-0" />
                            </span>
                          )}
                          <span className={item.isCriticalLow ? 'text-rose-400 font-bold' : 'text-slate-300'}>
                            {item.stockBalance.toLocaleString()}
                          </span>
                        </div>
                        <div className="text-[10px] text-slate-500 mt-0.5 font-mono">
                          {((item.stockBalance / (item.minRequiredStock || 1)) * 100).toFixed(0)}% of par
                        </div>
                      </td>

                      {/* Extra PO Stock */}
                      <td className="py-4 px-6 text-right font-mono tabular-nums text-slate-300">
                        {item.extraPoStock.toLocaleString()}
                      </td>

                      {/* Calculation Result */}
                      <td className="py-4 px-6 text-right font-mono tabular-nums font-bold">
                        <span className={item.isInsufficient ? 'text-amber-400 text-sm' : 'text-emerald-400 text-sm'}>
                          {item.deficit > 0 ? `+${item.deficit.toLocaleString()}` : item.deficit.toLocaleString()}
                        </span>
                      </td>

                      {/* Status & Action */}
                      <td className="py-4 px-6">
                        {item.isInsufficient ? (
                          <div className="inline-flex flex-col gap-1">
                            <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-semibold shadow-sm ${
                              item.isCriticalLow
                                ? 'bg-rose-950/90 border border-rose-800 text-rose-300'
                                : 'bg-amber-950/80 border border-amber-800 text-amber-300'
                            }`}>
                              <AlertTriangle className={`w-3.5 h-3.5 shrink-0 ${item.isCriticalLow ? 'text-rose-400' : 'text-amber-400'}`} />
                              <span>
                                {item.isCriticalLow ? 'Critical Low Stock (<20%) - Order Required' : 'Qty not sufficient and need to order from supplier'}
                              </span>
                            </span>
                            <span className="text-[11px] text-slate-300 font-mono pl-1">
                              Recommended PO: <strong className="underline">{item.orderQty.toLocaleString()} units</strong> (${(item.orderQty * item.unitCost).toFixed(2)})
                            </span>
                          </div>
                        ) : (
                          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-emerald-950/60 border border-emerald-800/80 text-emerald-300 text-xs font-medium">
                            <CheckCircle2 className="w-3.5 h-3.5 shrink-0 text-emerald-400" />
                            <span>Sufficient Stock (0 needed)</span>
                          </span>
                        )}
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        {/* Footer actions */}
        <div className="p-6 border-t border-slate-800 bg-slate-950/40 flex items-center justify-between">
          <div className="text-xs text-slate-400">
            Showing <strong className="text-white">{filteredItems.length}</strong> of{' '}
            <strong className="text-white">{items.length}</strong> Book Titles
          </div>
          <button
            onClick={onOpenExportModal}
            className="flex items-center gap-2 px-4 py-2 bg-slate-800 hover:bg-slate-700 text-cyan-300 border border-slate-700 text-xs font-medium rounded-xl transition-colors"
          >
            <Download className="w-4 h-4" />
            <span>Export Supplier Purchase Orders</span>
          </button>
        </div>
      </div>
    </div>
  );
};
