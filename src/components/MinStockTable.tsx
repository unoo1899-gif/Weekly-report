import React, { useState } from 'react';
import { InventoryItem } from '../types';
import { Sliders, Search, Edit2, Check, X } from 'lucide-react';

interface MinStockTableProps {
  items: InventoryItem[];
  onUpdateMinStock: (id: string, newMinStock: number) => void;
}

export const MinStockTable: React.FC<MinStockTableProps> = ({ items, onUpdateMinStock }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editValue, setEditValue] = useState<number>(0);

  const filteredItems = items.filter(
    (item) =>
      item.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleStartEdit = (item: InventoryItem) => {
    setEditingId(item.id);
    setEditValue(item.minRequiredStock);
  };

  const handleSaveEdit = (id: string) => {
    if (!isNaN(editValue) && editValue >= 0) {
      onUpdateMinStock(id, editValue);
    }
    setEditingId(null);
  };

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-2xl shadow-sm overflow-hidden">
      {/* Header toolbar */}
      <div className="p-6 border-b border-slate-800 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-cyan-950/60 text-cyan-400 border border-cyan-800/50 flex items-center justify-center">
            <Sliders className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-white">Preset Minimum Required Stock</h2>
            <p className="text-xs text-slate-400">Configure safety par levels for automated replenishment calculations.</p>
          </div>
        </div>

        <div className="relative w-full sm:w-72">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type="text"
            placeholder="Search SKU or item name..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-slate-950 border border-slate-700 rounded-xl pl-10 pr-4 py-2 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-cyan-500"
          />
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-slate-950/60 text-[11px] font-mono text-slate-400 uppercase tracking-wider border-b border-slate-800">
              <th className="py-3 px-6">SKU Code</th>
              <th className="py-3 px-6">Item Description</th>
              <th className="py-3 px-6">Category</th>
              <th className="py-3 px-6 text-right">Min Required Stock (Par)</th>
              <th className="py-3 px-6 text-center">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800/60 text-xs">
            {filteredItems.map((item) => {
              const isEditing = editingId === item.id;
              return (
                <tr key={item.id} className="hover:bg-slate-800/40 transition-colors">
                  <td className="py-4 px-6 font-mono text-cyan-400 font-medium">{item.id}</td>
                  <td className="py-4 px-6 text-slate-100 font-medium">{item.name}</td>
                  <td className="py-4 px-6 text-slate-400">
                    <span className="px-2 py-0.5 rounded bg-slate-800 border border-slate-700/60 text-slate-300 text-[11px]">
                      {item.category}
                    </span>
                  </td>
                  <td className="py-4 px-6 text-right font-mono tabular-nums">
                    {isEditing ? (
                      <input
                        type="number"
                        min="0"
                        value={editValue}
                        onChange={(e) => setEditValue(parseInt(e.target.value) || 0)}
                        className="w-24 bg-slate-950 border border-cyan-500 rounded-lg px-2 py-1 text-right text-white font-mono text-xs focus:outline-none"
                        autoFocus
                      />
                    ) : (
                      <span className="text-white font-semibold text-sm">{item.minRequiredStock.toLocaleString()}</span>
                    )}
                  </td>
                  <td className="py-4 px-6 text-center">
                    {isEditing ? (
                      <div className="flex items-center justify-center gap-1.5">
                        <button
                          onClick={() => handleSaveEdit(item.id)}
                          className="p-1.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg transition-colors"
                          title="Save"
                        >
                          <Check className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => setEditingId(null)}
                          className="p-1.5 bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white rounded-lg transition-colors"
                          title="Cancel"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </div>
                    ) : (
                      <button
                        onClick={() => handleStartEdit(item)}
                        className="inline-flex items-center gap-1 px-3 py-1 bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white rounded-lg transition-colors border border-slate-700"
                      >
                        <Edit2 className="w-3.5 h-3.5 text-cyan-400" />
                        <span>Edit Par</span>
                      </button>
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};
