import { useState, useEffect } from 'react';
import { InventoryItem, ActiveTab, UploadType } from './types';
import { INITIAL_INVENTORY_ITEMS } from './data/initialData';
import { Navbar } from './components/Navbar';
import { MetricCards } from './components/MetricCards';
import { ReplenishmentTable } from './components/ReplenishmentTable';
import { MinStockTable } from './components/MinStockTable';
import { InventoryLedger } from './components/InventoryLedger';
import { UploadModal } from './components/UploadModal';
import { ExportModal } from './components/ExportModal';

export default function App() {
  const [items, setItems] = useState<InventoryItem[]>(() => {
    const saved = localStorage.getItem('wms_phase1_inventory');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error('Failed to load saved inventory', e);
      }
    }
    return INITIAL_INVENTORY_ITEMS;
  });

  const [activeTab, setActiveTab] = useState<ActiveTab>('replenishment');
  const [uploadModalOpen, setUploadModalOpen] = useState(false);
  const [uploadType, setUploadType] = useState<UploadType>('balance');
  const [exportModalOpen, setExportModalOpen] = useState(false);

  useEffect(() => {
    localStorage.setItem('wms_phase1_inventory', JSON.stringify(items));
  }, [items]);

  const handleOpenUploadModal = (type: UploadType) => {
    setUploadType(type);
    setUploadModalOpen(true);
  };

  const handleUpdateStock = (type: UploadType, updates: { id: string; qty: number }[]) => {
    setItems((prevItems) => {
      return prevItems.map((item) => {
        const found = updates.find((u) => u.id.toLowerCase() === item.id.toLowerCase());
        if (found) {
          if (type === 'balance') {
            return { ...item, stockBalance: found.qty, lastStockUpdate: new Date().toISOString().slice(0, 16).replace('T', ' ') };
          } else {
            return { ...item, extraPoStock: found.qty, lastPoUpdate: new Date().toISOString().slice(0, 16).replace('T', ' ') };
          }
        }
        return item;
      });
    });
  };

  const handleUpdateMinStock = (id: string, newMinStock: number) => {
    setItems((prevItems) =>
      prevItems.map((item) => (item.id === id ? { ...item, minRequiredStock: newMinStock } : item))
    );
  };

  const handleAddItem = (newItem: InventoryItem) => {
    setItems((prev) => [newItem, ...prev]);
  };

  const handleUpdateItem = (updatedItem: InventoryItem) => {
    setItems((prev) => prev.map((item) => (item.id === updatedItem.id ? updatedItem : item)));
  };

  const handleDeleteItem = (id: string) => {
    setItems((prev) => prev.filter((item) => item.id !== id));
  };

  const handleResetData = () => {
    if (window.confirm('Reset all inventory data and minimum stock presets to initial demo state?')) {
      setItems(INITIAL_INVENTORY_ITEMS);
      localStorage.removeItem('wms_phase1_inventory');
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans">
      {/* Top Navigation */}
      <Navbar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        onOpenUploadModal={handleOpenUploadModal}
        onOpenExportModal={() => setExportModalOpen(true)}
        onResetData={handleResetData}
      />

      {/* Main Content Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* KPI Summary Cards */}
        <MetricCards items={items} />

        {/* Tab Content */}
        {activeTab === 'replenishment' && (
          <ReplenishmentTable
            items={items}
            onOpenUploadModal={handleOpenUploadModal}
            onOpenExportModal={() => setExportModalOpen(true)}
          />
        )}

        {activeTab === 'preset-stock' && (
          <MinStockTable items={items} onUpdateMinStock={handleUpdateMinStock} />
        )}

        {activeTab === 'inventory-ledger' && (
          <InventoryLedger
            items={items}
            onAddItem={handleAddItem}
            onUpdateItem={handleUpdateItem}
            onDeleteItem={handleDeleteItem}
          />
        )}
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-800/80 bg-slate-900/40 py-6 text-center text-xs text-slate-400">
        <p>WMS Phase 1 Order Management & Stock Replenishment Engine · Built with Google AI Studio</p>
      </footer>

      {/* Modals */}
      <UploadModal
        isOpen={uploadModalOpen}
        onClose={() => setUploadModalOpen(false)}
        uploadType={uploadType}
        items={items}
        onUpdateStock={handleUpdateStock}
      />

      <ExportModal
        isOpen={exportModalOpen}
        onClose={() => setExportModalOpen(false)}
        items={items}
      />
    </div>
  );
}
