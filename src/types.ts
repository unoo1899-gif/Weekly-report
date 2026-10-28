export interface InventoryItem {
  isbn: string; // ISBN Code
  title: string; // Book Title
  category: string;
  imprint?: string; // Publisher Imprint (CAMBRIDGE, MARSHALL CAVENDISH, OXFORD)
  minRequiredStock: number; // Preset Minimum Required Stock
  stockBalance: number; // Current physical inventory
  extraPoStock: number; // Outstanding PO stock in transit
  unitCost: number; // Unit cost in USD
  supplier: string; // Publisher / Supplier name
  lastStockUpdate?: string;
  lastPoUpdate?: string;
}

export type UserRole = 'Administrator' | 'Warehouse Manager' | 'Inventory Operator' | 'Viewer';

export interface User {
  id: string;
  username: string;
  password?: string;
  fullName: string;
  role: UserRole;
  permissions: {
    canEditMinStock: boolean;
    canUploadStock: boolean;
    canManageCatalog: boolean;
    canManageUsers: boolean;
    canExportReports: boolean;
  };
  isActive: boolean;
}

export type ActiveTab = 'replenishment' | 'preset-stock' | 'inventory-ledger' | 'user-management';

export type UploadType = 'balance' | 'po';
