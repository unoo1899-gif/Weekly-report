import React, { useState } from 'react';
import { UploadType, InventoryItem } from '../types';
import { X, Upload, FileSpreadsheet, AlertCircle, CheckCircle, Download } from 'lucide-react';

interface UploadModalProps {
  isOpen: boolean;
  onClose: () => void;
  uploadType: UploadType;
  items: InventoryItem[];
  onUpdateStock: (type: UploadType, updates: { isbn: string; qty: number }[]) => void;
}

export const UploadModal: React.FC<UploadModalProps> = ({
  isOpen,
  onClose,
  uploadType,
  items,
  onUpdateStock,
}) => {
  const [csvText, setCsvText] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  if (!isOpen) return null;

  const title = uploadType === 'balance' ? 'Upload Stock Balance (Physical Count)' : 'Upload Extra PO Stock (In Transit)';
  const description =
    uploadType === 'balance'
      ? 'Upload or paste CSV file with ISBN and current physical stock balance counts.'
      : 'Upload or paste CSV file with ISBN and pending purchase order stock quantities in transit.';

  const handleDownloadSample = () => {
    const header = 'isbn,title,quantity\n';
    const rows = items
      .map((item) => `${item.isbn},"${item.title}",${uploadType === 'balance' ? item.stockBalance : item.extraPoStock}`)
      .join('\n');
    const blob = new Blob([header + rows], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `sample_${uploadType === 'balance' ? 'stock_balance' : 'extra_po_stock'}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      const text = event.target?.result as string;
      if (text) {
        setCsvText(text);
        parseAndApply(text);
      }
    };
    reader.readAsText(file);
  };

  const parseAndApply = (text: string) => {
    try {
      setError(null);
      const lines = text.split(/\r?\n/).filter((l) => l.trim().length > 0);
      if (lines.length < 2) {
        throw new Error('CSV file must have a header row and at least one data row.');
      }

      const updates: { isbn: string; qty: number }[] = [];

      for (let i = 1; i < lines.length; i++) {
        const line = lines[i];
        const parts = line.split(/,(?=(?:(?:[^"]*"){2})*[^"]*$)/).map((p) => p.replace(/^"|"$/g, '').trim());
        if (parts.length >= 2) {
          const isbn = parts[0];
          const qtyStr = parts[parts.length - 1];
          const qty = parseInt(qtyStr, 10);

          if (isbn && !isNaN(qty)) {
            updates.push({ isbn, qty: Math.max(0, qty) });
          }
        }
      }

      if (updates.length === 0) {
        throw new Error('No valid ISBN and quantity records found in CSV.');
      }

      onUpdateStock(uploadType, updates);
      setSuccessMsg(`Successfully updated ${updates.length} book titles from uploaded file.`);
      setTimeout(() => {
        setSuccessMsg(null);
        onClose();
      }, 1200);
    } catch (err: any) {
      setError(err.message || 'Failed to parse CSV file.');
    }
  };

  const handlePasteSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    parseAndApply(csvText);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-fadeIn">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-xl overflow-hidden shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800 bg-slate-950/50">
          <div className="flex items-center gap-3">
            <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${uploadType === 'balance' ? 'bg-cyan-950/60 text-cyan-400 border border-cyan-800/50' : 'bg-emerald-950/60 text-emerald-400 border border-emerald-800/50'}`}>
              <FileSpreadsheet className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-semibold text-white">{title}</h3>
              <p className="text-xs text-slate-400">{description}</p>
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
          {error && (
            <div className="flex items-center gap-3 p-4 bg-rose-950/40 border border-rose-900/60 rounded-xl text-rose-300 text-xs">
              <AlertCircle className="w-5 h-5 shrink-0 text-rose-400" />
              <span>{error}</span>
            </div>
          )}

          {successMsg && (
            <div className="flex items-center gap-3 p-4 bg-emerald-950/40 border border-emerald-900/60 rounded-xl text-emerald-300 text-xs">
              <CheckCircle className="w-5 h-5 shrink-0 text-emerald-400" />
              <span>{successMsg}</span>
            </div>
          )}

          {/* Drag & Drop File Input */}
          <div className="border-2 border-dashed border-slate-700 hover:border-cyan-500 rounded-xl p-8 text-center transition-colors bg-slate-950/30 relative">
            <input
              type="file"
              accept=".csv,.txt,.xlsx"
              onChange={handleFileUpload}
              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
            />
            <div className="flex flex-col items-center justify-center gap-3">
              <div className="w-12 h-12 rounded-full bg-slate-800 flex items-center justify-center text-cyan-400">
                <Upload className="w-6 h-6" />
              </div>
              <div>
                <p className="text-sm font-medium text-white">Click to browse or drag and drop your file</p>
                <p className="text-xs text-slate-400 mt-1">Supports CSV format (ISBN, Title, Quantity)</p>
              </div>
              <button
                type="button"
                onClick={handleDownloadSample}
                className="mt-2 flex items-center gap-1.5 px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-cyan-300 text-xs font-medium rounded-lg border border-slate-700 transition-colors"
              >
                <Download className="w-3.5 h-3.5" />
                Download Sample CSV Template
              </button>
            </div>
          </div>

          {/* Or Paste CSV text */}
          <form onSubmit={handlePasteSubmit} className="space-y-3">
            <label className="block text-xs font-medium text-slate-300">Or Paste CSV Data Directly:</label>
            <textarea
              rows={4}
              value={csvText}
              onChange={(e) => setCsvText(e.target.value)}
              placeholder="isbn,title,quantity&#10;978-0132350884,Clean Code,200&#10;978-0201633610,Design Patterns,350"
              className="w-full bg-slate-950 border border-slate-700 rounded-xl p-3 text-xs text-slate-200 font-mono focus:outline-none focus:border-cyan-500"
            />
            <div className="flex justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-medium rounded-xl transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-5 py-2 bg-cyan-600 hover:bg-cyan-500 text-white text-xs font-medium rounded-xl shadow-lg shadow-cyan-900/30 transition-colors"
              >
                Process Upload
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};
