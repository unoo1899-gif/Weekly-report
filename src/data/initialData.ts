import { InventoryItem } from '../types';

export const INITIAL_INVENTORY_ITEMS: InventoryItem[] = [
  {
    id: 'SKU-001',
    name: 'Industrial Widget A (Standard)',
    category: 'Assembly Components',
    minRequiredStock: 500,
    stockBalance: 200,
    extraPoStock: 100,
    unitCost: 12.50,
    supplier: 'Apex Manufacturing Corp',
    lastStockUpdate: '2026-10-25 08:30',
    lastPoUpdate: '2026-10-26 14:15'
  },
  {
    id: 'SKU-002',
    name: 'Industrial Widget B (Heavy Duty)',
    category: 'Assembly Components',
    minRequiredStock: 300,
    stockBalance: 350,
    extraPoStock: 50,
    unitCost: 24.00,
    supplier: 'Apex Manufacturing Corp',
    lastStockUpdate: '2026-10-25 08:30',
    lastPoUpdate: '2026-10-24 11:00'
  },
  {
    id: 'SKU-003',
    name: 'Titanium Bolt M8x40',
    category: 'Fasteners',
    minRequiredStock: 2000,
    stockBalance: 1200,
    extraPoStock: 300,
    unitCost: 0.85,
    supplier: 'Global Fastener Supply',
    lastStockUpdate: '2026-10-26 09:10',
    lastPoUpdate: '2026-10-26 09:15'
  },
  {
    id: 'SKU-004',
    name: 'Servo Motor Actuator 24V',
    category: 'Electronics',
    minRequiredStock: 150,
    stockBalance: 40,
    extraPoStock: 0,
    unitCost: 145.00,
    supplier: 'ElectroTech Systems',
    lastStockUpdate: '2026-10-25 16:45',
    lastPoUpdate: '2026-10-20 10:00'
  },
  {
    id: 'SKU-005',
    name: 'Hydraulic Seal O-Ring Kit',
    category: 'Maintenance',
    minRequiredStock: 800,
    stockBalance: 650,
    extraPoStock: 200,
    unitCost: 4.20,
    supplier: 'Precision Seals Inc',
    lastStockUpdate: '2026-10-26 12:00',
    lastPoUpdate: '2026-10-25 15:30'
  },
  {
    id: 'SKU-006',
    name: 'Control Panel Display Unit OLED',
    category: 'Electronics',
    minRequiredStock: 100,
    stockBalance: 95,
    extraPoStock: 50,
    unitCost: 88.50,
    supplier: 'ElectroTech Systems',
    lastStockUpdate: '2026-10-26 14:00',
    lastPoUpdate: '2026-10-26 14:00'
  },
  {
    id: 'SKU-007',
    name: 'Aluminium Structural Profile 40x40',
    category: 'Raw Materials',
    minRequiredStock: 600,
    stockBalance: 250,
    extraPoStock: 150,
    unitCost: 18.75,
    supplier: 'Metals Direct Ltd',
    lastStockUpdate: '2026-10-24 17:00',
    lastPoUpdate: '2026-10-25 09:00'
  },
  {
    id: 'SKU-008',
    name: 'Lithium Battery Pack 48V 20Ah',
    category: 'Power Systems',
    minRequiredStock: 120,
    stockBalance: 30,
    extraPoStock: 40,
    unitCost: 260.00,
    supplier: 'VoltCraft Energy',
    lastStockUpdate: '2026-10-26 10:30',
    lastPoUpdate: '2026-10-22 13:20'
  }
];
