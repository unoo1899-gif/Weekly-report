# WMS Phase 1 - Order Management & Stock Replenishment

## Overview & Core Concept
This application implements **Phase 1** of the Warehouse Management System (WMS), focusing on automated **Order Management and Stock Replenishment Calculations**. It allows warehouse operators and procurement managers to:
1. View and edit **Minimum Required Stock (Par Levels)** preset in the system.
2. Use **2 prominent upload buttons/icons** to import **Stock Balance** and **Extra PO Stock** files (with CSV file parsing and mock sample data generators).
3. Run a real-time calculation engine for each SKU:
   $$\text{Net Deficit / Order Quantity} = \text{Minimum Required Stock} - \text{Stock Balance} - \text{Extra PO Stock}$$
4. Instantly identify SKUs where $\text{Result} > 0$ with clear alert badges stating **"Qty not sufficient and need to order from supplier"** along with exact reorder quantities.
5. Export purchase orders and replenishment summaries as CSV or printable reports.

---

## User Experience & Visual Design
- **Aesthetic Direction**: Clean enterprise SaaS dashboard inspired by `references/3_saas_dashboard.md`. Neutral slate background (`#0F172A` / `#F8FAFC`), crisp typography (`Plus Jakarta Sans` + `JetBrains Mono` for tabular numerals), and semantic status signaling (Green for sufficient, Crimson for insufficient stock).
- **Core Layout & Navigation**:
  - **Top Bar**: Clean wordmark, quick stats overview, and primary export/reset actions.
  - **Summary Metric Cards**: Total SKUs, Sufficient Items, Items Needing Order, Total Deficit Quantity.
  - **Data Management Hub**:
    - **Preset Minimum Stock Table**: Inline editable Par levels and SKU details.
    - **Upload Hub**: 2 dedicated file upload widgets (Stock Balance & Extra PO Stock) with drag-and-drop, sample CSV download, and instant parsing.
  - **Replenishment Results Table**: Live calculated data grid with sorting, search, status badges (`Qty not sufficient, need to order from supplier`), and supplier order generation.

---

## Key Product Decisions & Trade-Offs
- **Client-Side CSV Parsing**: Built-in CSV parser supporting standard headers (`sku`, `name`, `qty` / `balance` / `po`) with robust fallback sample data for immediate testing without requiring external file setup.
- **Persistent State**: Utilizes `localStorage` to preserve inventory adjustments, minimum stock presets, and uploaded balances across page reloads.

---

## Technical Architecture & Data Strategy

```
┌────────────────────────────────────────────────────────┐
│                      WMS App                           │
│  (State: SKUs, Balances, PO Stock, Filters, Uploads)   │
└───────────┬───────────────────┬────────────────────┬───┘
            │                   │                    │
            ▼                   ▼                    ▼
   ┌─────────────────┐ ┌──────────────────┐ ┌─────────────────┐
   │ Preset Min      │ │ Upload Hub (2    │ │ Replenishment   │
   │ Stock Table     │ │ Icons: Balance   │ │ Calculation     │
   │ (Inline Edit)   │ │ & Extra PO)      │ │ Engine & Status │
   └─────────────────┘ └──────────────────┘ └─────────────────┘
                                                     │
                                                     ▼
                                            ┌─────────────────┐
                                            │ Supplier Order  │
                                            │ Export & Action │
                                            └─────────────────┘
```

- **Data Model**:
  - `SKU`: `{ id: string; name: string; category: string; minRequiredStock: number; stockBalance: number; extraPoStock: number; unitCost?: number; supplier?: string }`
- **Calculation Formula**:
  - `deficit = Math.max(0, sku.minRequiredStock - sku.stockBalance - sku.extraPoStock)`
  - `status = deficit > 0 ? 'Insufficient - Order Required' : 'Sufficient'`
