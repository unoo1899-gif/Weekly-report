import { useState, useEffect } from 'react';
import { InventoryItem, ActiveTab, UploadType, User } from './types';
import { INITIAL_INVENTORY_ITEMS } from './data/initialData';
import { INITIAL_USERS } from './data/usersData';
import { Navbar } from './components/Navbar';
import { MetricCards } from './components/MetricCards';
import { ReplenishmentTable } from './components/ReplenishmentTable';
import { MinStockTable } from './components/MinStockTable';
import { InventoryLedger } from './components/InventoryLedger';
import { UserManagement } from './components/UserManagement';
import { UploadModal } from './components/UploadModal';
import { ExportModal } from './components/ExportModal';
import { LoginModal } from './components/LoginModal';

export default function App() {
  const [items, setItems] = useState<InventoryItem[]>(() => {
    const saved = localStorage.getItem('book_wms_phase1_inventory');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error('Failed to load saved inventory', e);
      }
    }
    return INITIAL_INVENTORY_ITEMS;
  });

  const [users, setUsers] = useState<User[]>(() => {
    const saved = localStorage.getItem('book_wms_phase1_users');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error('Failed to load saved users', e);
      }
    }
    return INITIAL_USERS;
  });

  const [currentUser, setCurrentUser] = useState<User | null>(() => {
    const saved = localStorage.getItem('book_wms_phase1_current_user');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error('Failed to load current user', e);
      }
    }
    return null; // Force login if not authenticated
  });

  const [activeTab, setActiveTab] = useState<ActiveTab>('replenishment');
  const [uploadModalOpen, setUploadModalOpen] = useState(false);
  const [uploadType, setUploadType] = useState<UploadType>('balance');
  const [exportModalOpen, setExportModalOpen] = useState(false);

  useEffect(() => {
    localStorage.setItem('book_wms_phase1_inventory', JSON.stringify(items));
  }, [items]);

  useEffect(() => {
    localStorage.setItem('book_wms_phase1_users', JSON.stringify(users));
  }, [users]);

  useEffect(() => {
    if (currentUser) {
      localStorage.setItem('book_wms_phase1_current_user', JSON.stringify(currentUser));
    } else {
      localStorage.removeItem('book_wms_phase1_current_user');
    }
  }, [currentUser]);

  const handleLogin = (user: User) => {
    setCurrentUser(user);
    setActiveTab('replenishment');
  };

  const handleLogout = () => {
    setCurrentUser(null);
  };

  const handleAddUser = (newUser: User) => {
    setUsers((prev) => [...prev, newUser]);
  };

  const handleUpdateUser = (updatedUser: User) => {
    setUsers((prev) => prev.map((u) => (u.id === updatedUser.id ? updatedUser : u)));
    if (currentUser && currentUser.id === updatedUser.id) {
      setCurrentUser(updatedUser);
    }
  };

  const handleDeleteUser = (userId: string) => {
    setUsers((prev) => prev.filter((u) => u.id !== userId));
  };

  const handleOpenUploadModal = (type: UploadType) => {
    if (!currentUser?.permissions.canUploadStock) {
      alert('Your user role does not have permission to upload stock balances or POs.');
      return;
    }
    setUploadType(type);
    setUploadModalOpen(true);
  };

  const handleUpdateStock = (type: UploadType, updates: { isbn: string; qty: number }[]) => {
    setItems((prevItems) => {
      return prevItems.map((item) => {
        const found = updates.find((u) => u.isbn.toLowerCase() === item.isbn.toLowerCase());
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

  const handleUpdateMinStock = (isbn: string, newMinStock: number) => {
    if (!currentUser?.permissions.canEditMinStock) {
      alert('Your user role does not have permission to edit minimum required stock par levels.');
      return;
    }
    setItems((prevItems) =>
      prevItems.map((item) => (item.isbn === isbn ? { ...item, minRequiredStock: newMinStock } : item))
    );
  };

  const handleAddItem = (newItem: InventoryItem) => {
    if (!currentUser?.permissions.canManageCatalog) {
      alert('Your user role does not have permission to manage the book catalog.');
      return;
    }
    setItems((prev) => [newItem, ...prev]);
  };

  const handleUpdateItem = (updatedItem: InventoryItem) => {
    if (!currentUser?.permissions.canManageCatalog) {
      alert('Your user role does not have permission to edit book catalog items.');
      return;
    }
    setItems((prev) => prev.map((item) => (item.isbn === updatedItem.isbn ? updatedItem : item)));
  };

  const handleDeleteItem = (isbn: string) => {
    if (!currentUser?.permissions.canManageCatalog) {
      alert('Your user role does not have permission to delete book catalog items.');
      return;
    }
    setItems((prev) => prev.filter((item) => item.isbn !== isbn));
  };

  const handleResetData = () => {
    if (!currentUser?.permissions.canManageCatalog) {
      alert('Only administrators or managers can reset catalog data.');
      return;
    }
    if (window.confirm('Reset all book inventory data and minimum stock presets to initial demo state?')) {
      setItems(INITIAL_INVENTORY_ITEMS);
      localStorage.removeItem('book_wms_phase1_inventory');
    }
  };

  if (!currentUser) {
    return <LoginModal users={users} onLogin={handleLogin} />;
  }

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans">
      {/* Top Navigation */}
      <Navbar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        onOpenUploadModal={handleOpenUploadModal}
        onOpenExportModal={() => setExportModalOpen(true)}
        onResetData={handleResetData}
        currentUser={currentUser}
        onLogout={handleLogout}
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
            onOpenExportModal={() => {
              if (!currentUser.permissions.canExportReports) {
                alert('Your user role does not have permission to export PO reports.');
                return;
              }
              setExportModalOpen(true);
            }}
          />
        )}

        {activeTab === 'preset-stock' && currentUser.permissions.canEditMinStock && (
          <MinStockTable items={items} onUpdateMinStock={handleUpdateMinStock} />
        )}

        {activeTab === 'inventory-ledger' && currentUser.permissions.canManageCatalog && (
          <InventoryLedger
            items={items}
            onAddItem={handleAddItem}
            onUpdateItem={handleUpdateItem}
            onDeleteItem={handleDeleteItem}
          />
        )}

        {activeTab === 'user-management' && (currentUser.permissions.canManageUsers || currentUser.role === 'Administrator') && (
          <UserManagement
            users={users}
            onAddUser={handleAddUser}
            onUpdateUser={handleUpdateUser}
            onDeleteUser={handleDeleteUser}
            currentUser={currentUser}
          />
        )}
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-800/80 bg-slate-900/40 py-6 text-center text-xs text-slate-400">
        <p>BookWMS Phase 1 ISBN Order Management & Stock Replenishment Engine · Built with Google AI Studio</p>
      </footer>

      {/* Modals */}
      {uploadModalOpen && currentUser.permissions.canUploadStock && (
        <UploadModal
          isOpen={uploadModalOpen}
          onClose={() => setUploadModalOpen(false)}
          uploadType={uploadType}
          items={items}
          onUpdateStock={handleUpdateStock}
        />
      )}

      {exportModalOpen && currentUser.permissions.canExportReports && (
        <ExportModal
          isOpen={exportModalOpen}
          onClose={() => setExportModalOpen(false)}
          items={items}
        />
      )}
    </div>
  );
}
