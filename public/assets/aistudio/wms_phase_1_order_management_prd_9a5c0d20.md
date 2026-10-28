# Product Requirements Document (PRD): WMS Phase 1 - Order Management & Stock Replenishment

## 1. Executive Summary & Objective
This document outlines the specifications for **Phase 1** of the Warehouse Management System (WMS) application, built using Google AI Studio. The primary goal of this phase is to automate **Order Management and Stock Replenishment Calculations** by comparing preset minimum stock levels against uploaded current inventory balances and incoming purchase orders.

---

## 2. Core Data Entities & Schema
The system tracks the following core fields per SKU / Item:
1. **SKU Code / Item ID:** Unique identifier for the product.
2. **Item Name / Description:** Name of the inventory item.
3. **Minimum Required Stock (Par Level):** Preset threshold defined in the system.
4. **Stock Balance:** Current physical inventory quantity (uploaded via CSV/Excel or file interface).
5. **Extra PO Stock:** Outstanding Purchase Order quantity currently in transit or pending delivery (uploaded via CSV/Excel or file interface).

---

## 3. UI/UX Interface Specifications
The application dashboard will feature a clean, intuitive layout designed for warehouse operators and procurement managers:

* **Preset Management Panel:** View and edit preset Minimum Required Stock levels.
* **Upload Hub (2 Main Icons/Buttons):**
  1. **Upload Stock Balance Icon:** Interface to drag-and-drop or browse files (CSV/Excel) containing current warehouse stock counts.
  2. **Upload Extra PO Stock Icon:** Interface to drag-and-drop or browse files (CSV/Excel) containing active purchase order quantities.
* **Replenishment Calculation Dashboard / Results Table:** Displays real-time calculations and supplier order recommendations.

---

## 4. Core Business Logic & Calculation Formula

For each SKU, the system executes the following formula:

$$\text{Net Deficit / Order Quantity} = \text{Minimum Required Stock} - \text{Stock Balance} - \text{Extra PO Stock}$$

### Evaluation Rules:
* If $\text{Result} \le 0$: Stock is sufficient. No action required.
* If $\text{Result} > 0$: **Quantity is not sufficient, need to order from supplier.** The exact deficit quantity is flagged as the recommended purchase quantity.

---

## 5. Sample Data Structure & Output Preview

| SKU ID | Item Name | Min Required Stock | Stock Balance | Extra PO Stock | Calculation Result | Status / Action |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| SKU-001 | Widget A | 500 | 200 | 100 | $500 - 200 - 100 = 200$ | **Qty not sufficient, need to order from supplier (200 units)** |
| SKU-002 | Widget B | 300 | 350 | 50 | $300 - 350 - 50 = -100$ | Sufficient Stock (0 units needed) |

---

## 6. Implementation Prompt for Google AI Studio
When prompting the model in Google AI Studio to build the app, use the following context wrapper:

> *"Act as an expert full-stack developer building a WMS Phase 1 Order Management app. Create a single-page interactive web application using HTML, Tailwind CSS, and JavaScript. Include a configuration table for Minimum Required Stock, two prominent upload buttons/icons for 'Stock Balance' and 'Extra PO Stock' with mock file parsing capability, and a dynamic calculation engine using the formula: Required Stock minus Stock Balance minus Extra PO Stock. Highlight rows where the result is greater than zero with a clear alert badge stating 'Qty not sufficient and need to order from supplier'."*