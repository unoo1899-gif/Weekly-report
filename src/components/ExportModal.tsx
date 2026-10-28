import React from 'react';
import { InventoryItem } from '../types';
import { X, Download, FileText, CheckCircle, AlertTriangle } from 'lucide-react';

interface ExportModalProps {
  isOpen: boolean;
  onClose: () => void;
  items: InventoryItem[];
}

export const ExportModal: React.FC<ExportModalProps> = ({ isOpen, onClose, items }) => {
  if (!isOpen) return null;

  const reorderList = items
    .map((item) => {
      const deficit = item.minRequiredStock - item.stockBalance - item.extraPoStock;
      return {
        ...item,
        orderQty: Math.max(0, deficit),
      };
    })
    .filter((item) => item.orderQty > 0);

  const totalCost = reorderList.reduce((acc, item) => acc + item.orderQty * item.unitCost, 0);

  const handleDownloadCSV = () => {
    const headers = 'ISBN,Book Title,Publisher,Min Required,Stock Balance,Extra PO,Order Quantity,Unit Cost,Total Cost\n';
    const rows = reorderList
      .map(
        (i) =>
          `"${i.isbn}","${i.title}","${i.supplier}",${i.minRequiredStock},${i.stockBalance},${i.extraPoStock},${i.orderQty},${i.unitCost},${(i.orderQty * i.unitCost).toFixed(2)}`
      )
      .join('\n');

    const blob = new Blob([headers + rows], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `supplier_book_purchase_orders_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-fadeIn">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-2xl overflow-hidden shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800 bg-slate-950/50">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-cyan-950/60 text-cyan-400 border border-cyan-800/50 flex items-center justify-center">
              <FileText className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-semibold text-white">Supplier Purchase Order Report</h3>
              <p className="text-xs text-slate-400">Generated from BookWMS Phase 1 Replenishment Engine</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body */}
        <div className="p-6 space-y-6">
          {reorderList.length === 0 ? (
            <div className="text-center py-8 space-y-3">
              <div className="w-12 h-12 rounded-full bg-emerald-950/60 text-emerald-400 border border-emerald-800 mx-auto flex items-center justify-center">
                <CheckCircle className="w-6 h-6" />
              </div>
              <h4 className="text-sm font-semibold text-white">All Book Stock Levels Sufficient</h4>
              <p className="text-xs text-slate-400">No purchase orders are required at this time. All book titles meet par levels.</p>
            </div>
          ) : (
            <>
              <div className="flex items-center justify-between p-4 bg-amber-950/20 border border-amber-900/50 rounded-xl">
                <div className="flex items-center gap-3">
                  <AlertTriangle className="w-5 h-5 text-amber-400 shrink-0" />
                  <div>
                    <p className="text-xs font-semibold text-amber-300">
                      {reorderList.length} Book Titles require immediate supplier reordering
                    </p>
                    <p className="text-[11px] text-slate-400">Total estimated order cost: ${totalCost.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</p>
                  </div>
                </div>
              </div>

              {/* Preview table */}
              <div className="max-h-64 overflow-y-auto border border-slate-800 rounded-xl">
                <table className="w-full text-left border-collapse text-xs">
                  <thead className="bg-slate-950 sticky top-0 text-[11px] font-mono text-slate-400 uppercase">
                    <tr>
                      <th className="p-3">ISBN</th>
                      <th className="p-3">Book Title</th>
                      <th className="p-3">Publisher</th>
                      <th className="p-3 text-right">Order Qty</th>
                      <th className="p-3 text-right">Est. Cost</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800/60 font-mono">
                    {reorderList.map((item) => (
                      <tr key={item.isbn} className="hover:bg-slate-800/40">
                        <td className="p-3 text-cyan-400 font-semibold">{item.isbn}</td>
                        <td className="p-3 text-slate-200 font-sans">{item.title}</td>
                        <td className="p-3 text-slate-400 font-sans">{item.supplier}</td>
                        <td className="p-3 text-right font-bold text-amber-400">{item.orderQty.toLocaleString()}</td>
                        <td className="p-3 text-right text-slate-200">${(item.orderQty * item.unitCost).toFixed(2)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </>
          )}

          {/* Action buttons */}
          <div className="flex justify-end gap-3 pt-2">
            <button
              onClick={onClose}
              className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-medium rounded-xl transition-colors"
            >
              Close
            </button>
            {reorderList.length > 0 && (
              <>
                <button
                  onClick={handlePrint}
                  className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-cyan-300 border border-slate-700 text-xs font-medium rounded-xl transition-colors"
                >
                  Print Report
                </button>
                <button
                  onClick={handleDownloadCSV}
                  className="flex items-center gap-2 px-5 py-2 bg-cyan-600 hover:bg-cyan-500 text-white text-xs font-semibold rounded-xl shadow-lg shadow-cyan-900/30 transition-colors"
                >
                  <Download className="w-4 h-4" />
                  <span>Download CSV PO</span>
                </button>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
