# WMS Phase 1 - Book Inventory & ISBN Replenishment Update

## Overview & Core Changes
This update adapts the Warehouse Management System (WMS) Phase 1 application for a bookstore / publication inventory workflow:
1. **SKU Code** $\rightarrow$ **ISBN**: Unique book identifier (e.g., 978-0132350884).
2. **Item Name / Description** $\rightarrow$ **Title**: Book title and subtitle.
3. **Preset Minimum Stock**: Maintained with par levels for each book title.
4. **Upload & Export Hubs**: Updated to parse and export ISBN and Title headers.

---

## Technical & UI Adjustments
- **Types (`src/types.ts`)**: Rename `id` to `isbn` and `name` to `title`.
- **Initial Data (`src/data/initialData.ts`)**: Replace sample industrial widgets with popular book titles and valid ISBN-13 numbers.
- **Components**:
  - `Navbar.tsx`: Update subtitle to "Book Inventory & ISBN Replenishment".
  - `MinStockTable.tsx`: Display ISBN and Book Title with inline par level editing.
  - `ReplenishmentTable.tsx`: Display ISBN, Book Title, Supplier/Publisher, Min Required, Balance, Extra PO, and Deficit Calculation with supplier order badge.
  - `InventoryLedger.tsx`: Full CRUD for book inventory items using ISBN and Title.
  - `UploadModal.tsx`: Support CSV upload for ISBN, Title, and Quantities.
  - `ExportModal.tsx`: Generate supplier purchase order reports with ISBN and Title headers.
