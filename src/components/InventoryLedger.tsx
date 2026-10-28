import React, { useState } from 'react';
import { InventoryItem } from '../types';
import { Layers, Search, Plus, Edit2, Trash2, Check, X } from 'lucide-react';

interface InventoryLedgerProps {
  items: InventoryItem[];
  onAddItem: (item: InventoryItem) => void;
  onUpdateItem: (item: InventoryItem) => void;
  onDeleteItem: (isbn: string) => void;
}

export const InventoryLedger: React.FC<InventoryLedgerProps> = ({
  items,
  onAddItem,
  onUpdateItem,
  onDeleteItem,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [isAdding, setIsAdding] = useState(false);
  const [editingIsbn, setEditingIsbn] = useState<string | null>(null);

  // New item form state
  const [newItem, setNewItem] = useState<InventoryItem>({
    isbn: '978-0134000000',
    title: '',
    category: 'Computer Science',
    minRequiredStock: 100,
    stockBalance: 50,
    extraPoStock: 0,
    unitCost: 29.99,
    supplier: 'Publisher Name'
  });

  const [editItemState, setEditItemState] = useState<InventoryItem | null>(null);

  const filteredItems = items.filter(
    (item) =>
      item.isbn.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.supplier.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleCreateSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newItem.isbn || !newItem.title) return;
    onAddItem(newItem);
    setIsAdding(false);
    setNewItem({
      isbn: `978-0134${Math.floor(100000 + Math.random() * 900000)}`,
      title: '',
      category: 'Computer Science',
      minRequiredStock: 100,
      stockBalance: 50,
      extraPoStock: 0,
      unitCost: 29.99,
      supplier: 'Publisher Name'
    });
  };

  const handleStartEdit = (item: InventoryItem) => {
    setEditingIsbn(item.isbn);
    setEditItemState({ ...item });
  };

  const handleSaveEdit = () => {
    if (editItemState) {
      onUpdateItem(editItemState);
      setEditingIsbn(null);
      setEditItemState(null);
    }
  };

  return (
    <div className="space-y-6">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl shadow-sm overflow-hidden">
        {/* Header */}
        <div className="p-6 border-b border-slate-800 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-cyan-950/60 text-cyan-400 border border-cyan-800/50 flex items-center justify-center">
              <Layers className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-white">Full Book Catalog Ledger</h2>
              <p className="text-xs text-slate-400">Manage all ISBN attributes, unit costs, and publisher details.</p>
            </div>
          </div>

          <div className="flex items-center gap-3 w-full sm:w-auto">
            <div className="relative flex-1 sm:w-64">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input
                type="text"
                placeholder="Search catalog..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full bg-slate-950 border border-slate-700 rounded-xl pl-10 pr-4 py-2 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-cyan-500"
              />
            </div>
            <button
              onClick={() => setIsAdding(true)}
              className="flex items-center gap-2 px-4 py-2 bg-cyan-600 hover:bg-cyan-500 text-white text-xs font-semibold rounded-xl shadow-lg shadow-cyan-900/30 transition-all whitespace-nowrap"
            >
              <Plus className="w-4 h-4" />
              <span>Add Book</span>
            </button>
          </div>
        </div>

        {/* Add Book Modal / Form Row */}
        {isAdding && (
          <form onSubmit={handleCreateSubmit} className="p-6 bg-slate-950/80 border-b border-slate-800 space-y-4">
            <h3 className="text-sm font-semibold text-white">Add New Book to Catalog</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <div>
                <label className="block text-[11px] font-medium text-slate-400 mb-1">ISBN</label>
                <input
                  type="text"
                  required
                  value={newItem.isbn}
                  onChange={(e) => setNewItem({ ...newItem, isbn: e.target.value })}
                  className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-xs text-white font-mono"
                />
              </div>
              <div>
                <label className="block text-[11px] font-medium text-slate-400 mb-1">Book Title</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Clean Architecture"
                  value={newItem.title}
                  onChange={(e) => setNewItem({ ...newItem, title: e.target.value })}
                  className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-xs text-white"
                />
              </div>
              <div>
                <label className="block text-[11px] font-medium text-slate-400 mb-1">Category</label>
                <input
                  type="text"
                  value={newItem.category}
                  onChange={(e) => setNewItem({ ...newItem, category: e.target.value })}
                  className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-xs text-white"
                />
              </div>
              <div>
                <label className="block text-[11px] font-medium text-slate-400 mb-1">Publisher / Supplier</label>
                <input
                  type="text"
                  value={newItem.supplier}
                  onChange={(e) => setNewItem({ ...newItem, supplier: e.target.value })}
                  className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-xs text-white"
                />
              </div>
              <div>
                <label className="block text-[11px] font-medium text-slate-400 mb-1">Min Required Stock</label>
                <input
                  type="number"
                  min="0"
                  value={newItem.minRequiredStock}
                  onChange={(e) => setNewItem({ ...newItem, minRequiredStock: parseInt(e.target.value) || 0 })}
                  className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-xs text-white font-mono"
                />
              </div>
              <div>
                <label className="block text-[11px] font-medium text-slate-400 mb-1">Stock Balance</label>
                <input
                  type="number"
                  min="0"
                  value={newItem.stockBalance}
                  onChange={(e) => setNewItem({ ...newItem, stockBalance: parseInt(e.target.value) || 0 })}
                  className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-xs text-white font-mono"
                />
              </div>
              <div>
                <label className="block text-[11px] font-medium text-slate-400 mb-1">Extra PO Stock</label>
                <input
                  type="number"
                  min="0"
                  value={newItem.extraPoStock}
                  onChange={(e) => setNewItem({ ...newItem, extraPoStock: parseInt(e.target.value) || 0 })}
                  className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-xs text-white font-mono"
                />
              </div>
              <div>
                <label className="block text-[11px] font-medium text-slate-400 mb-1">Unit Cost ($)</label>
                <input
                  type="number"
                  step="0.01"
                  min="0"
                  value={newItem.unitCost}
                  onChange={(e) => setNewItem({ ...newItem, unitCost: parseFloat(e.target.value) || 0 })}
                  className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-xs text-white font-mono"
                />
              </div>
            </div>
            <div className="flex justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={() => setIsAdding(false)}
                className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-medium rounded-xl"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-5 py-2 bg-cyan-600 hover:bg-cyan-500 text-white text-xs font-semibold rounded-xl shadow-lg shadow-cyan-900/30"
              >
                Save Book
              </button>
            </div>
          </form>
        )}

        {/* Ledger Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-950/60 text-[11px] font-mono text-slate-400 uppercase tracking-wider border-b border-slate-800">
                <th className="py-3 px-6">ISBN</th>
                <th className="py-3 px-6">Book Title</th>
                <th className="py-3 px-6">Category</th>
                <th className="py-3 px-6 text-right">Min Stock</th>
                <th className="py-3 px-6 text-right">Balance</th>
                <th className="py-3 px-6 text-right">Extra PO</th>
                <th className="py-3 px-6 text-right">Unit Cost</th>
                <th className="py-3 px-6">Publisher</th>
                <th className="py-3 px-6 text-center">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 text-xs">
              {filteredItems.map((item) => {
                const isEditing = editingIsbn === item.isbn;
                return (
                  <tr key={item.isbn} className="hover:bg-slate-800/40 transition-colors">
                    <td className="py-4 px-6 font-mono text-cyan-400 font-medium">{item.isbn}</td>
                    <td className="py-4 px-6 text-slate-100 font-medium">
                      {isEditing && editItemState ? (
                        <input
                          type="text"
                          value={editItemState.title}
                          onChange={(e) => setEditItemState({ ...editItemState, title: e.target.value })}
                          className="w-full bg-slate-950 border border-cyan-500 rounded px-2 py-1 text-white text-xs"
                        />
                      ) : (
                        item.title
                      )}
                    </td>
                    <td className="py-4 px-6 text-slate-400">
                      {isEditing && editItemState ? (
                        <input
                          type="text"
                          value={editItemState.category}
                          onChange={(e) => setEditItemState({ ...editItemState, category: e.target.value })}
                          className="w-full bg-slate-950 border border-cyan-500 rounded px-2 py-1 text-white text-xs"
                        />
                      ) : (
                        item.category
                      )}
                    </td>
                    <td className="py-4 px-6 text-right font-mono tabular-nums">
                      {isEditing && editItemState ? (
                        <input
                          type="number"
                          value={editItemState.minRequiredStock}
                          onChange={(e) => setEditItemState({ ...editItemState, minRequiredStock: parseInt(e.target.value) || 0 })}
                          className="w-20 bg-slate-950 border border-cyan-500 rounded px-2 py-1 text-right text-white font-mono text-xs"
                        />
                      ) : (
                        item.minRequiredStock.toLocaleString()
                      )}
                    </td>
                    <td className="py-4 px-6 text-right font-mono tabular-nums">
                      {isEditing && editItemState ? (
                        <input
                          type="number"
                          value={editItemState.stockBalance}
                          onChange={(e) => setEditItemState({ ...editItemState, stockBalance: parseInt(e.target.value) || 0 })}
                          className="w-20 bg-slate-950 border border-cyan-500 rounded px-2 py-1 text-right text-white font-mono text-xs"
                        />
                      ) : (
                        item.stockBalance.toLocaleString()
                      )}
                    </td>
                    <td className="py-4 px-6 text-right font-mono tabular-nums">
                      {isEditing && editItemState ? (
                        <input
                          type="number"
                          value={editItemState.extraPoStock}
                          onChange={(e) => setEditItemState({ ...editItemState, extraPoStock: parseInt(e.target.value) || 0 })}
                          className="w-20 bg-slate-950 border border-cyan-500 rounded px-2 py-1 text-right text-white font-mono text-xs"
                        />
                      ) : (
                        item.extraPoStock.toLocaleString()
                      )}
                    </td>
                    <td className="py-4 px-6 text-right font-mono tabular-nums">
                      {isEditing && editItemState ? (
                        <input
                          type="number"
                          step="0.01"
                          value={editItemState.unitCost}
                          onChange={(e) => setEditItemState({ ...editItemState, unitCost: parseFloat(e.target.value) || 0 })}
                          className="w-20 bg-slate-950 border border-cyan-500 rounded px-2 py-1 text-right text-white font-mono text-xs"
                        />
                      ) : (
                        `$${item.unitCost.toFixed(2)}`
                      )}
                    </td>
                    <td className="py-4 px-6 text-slate-300">
                      {isEditing && editItemState ? (
                        <input
                          type="text"
                          value={editItemState.supplier}
                          onChange={(e) => setEditItemState({ ...editItemState, supplier: e.target.value })}
                          className="w-full bg-slate-950 border border-cyan-500 rounded px-2 py-1 text-white text-xs"
                        />
                      ) : (
                        item.supplier
                      )}
                    </td>
                    <td className="py-4 px-6 text-center">
                      {isEditing ? (
                        <div className="flex items-center justify-center gap-1">
                          <button
                            onClick={handleSaveEdit}
                            className="p-1.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg transition-colors"
                            title="Save"
                          >
                            <Check className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => setEditingIsbn(null)}
                            className="p-1.5 bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white rounded-lg transition-colors"
                            title="Cancel"
                          >
                            <X className="w-4 h-4" />
                          </button>
                        </div>
                      ) : (
                        <div className="flex items-center justify-center gap-1.5">
                          <button
                            onClick={() => handleStartEdit(item)}
                            className="p-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white rounded-lg transition-colors border border-slate-700"
                            title="Edit"
                          >
                            <Edit2 className="w-3.5 h-3.5 text-cyan-400" />
                          </button>
                          <button
                            onClick={() => onDeleteItem(item.isbn)}
                            className="p-1.5 bg-slate-800 hover:bg-slate-700 text-rose-400 rounded-lg transition-colors border border-slate-700"
                            title="Delete"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
