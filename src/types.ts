export interface InventoryItem {
  id: string; // SKU Code
  name: string; // Item Name / Description
  category: string;
  minRequiredStock: number; // Preset Minimum Required Stock
  stockBalance: number; // Current physical inventory
  extraPoStock: number; // Outstanding PO stock in transit
  unitCost: number; // Unit cost in USD
  supplier: string; // Supplier name
  lastStockUpdate?: string;
  lastPoUpdate?: string;
}

export type ActiveTab = 'replenishment' | 'preset-stock' | 'inventory-ledger';

export type UploadType = 'balance' | 'po';
