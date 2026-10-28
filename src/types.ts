export interface InventoryItem {
  isbn: string; // ISBN Code
  title: string; // Book Title
  category: string;
  minRequiredStock: number; // Preset Minimum Required Stock
  stockBalance: number; // Current physical inventory
  extraPoStock: number; // Outstanding PO stock in transit
  unitCost: number; // Unit cost in USD
  supplier: string; // Publisher / Supplier name
  lastStockUpdate?: string;
  lastPoUpdate?: string;
}

export type ActiveTab = 'replenishment' | 'preset-stock' | 'inventory-ledger';

export type UploadType = 'balance' | 'po';
