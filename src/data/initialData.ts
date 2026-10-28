import { InventoryItem } from '../types';

export const INITIAL_INVENTORY_ITEMS: InventoryItem[] = [
  {
    isbn: '978-0132350884',
    title: 'Clean Code: A Handbook of Agile Software Craftsmanship',
    category: 'Computer Science',
    minRequiredStock: 500,
    stockBalance: 200,
    extraPoStock: 100,
    unitCost: 35.50,
    supplier: 'Pearson Education',
    lastStockUpdate: '2026-10-25 08:30',
    lastPoUpdate: '2026-10-26 14:15'
  },
  {
    isbn: '978-0201633610',
    title: 'Design Patterns: Elements of Reusable Object-Oriented Software',
    category: 'Computer Science',
    minRequiredStock: 300,
    stockBalance: 350,
    extraPoStock: 50,
    unitCost: 45.00,
    supplier: 'Addison-Wesley Professional',
    lastStockUpdate: '2026-10-25 08:30',
    lastPoUpdate: '2026-10-24 11:00'
  },
  {
    isbn: '978-0134494166',
    title: 'Clean Architecture: A Craftsman Guide to Software Structure',
    category: 'Computer Science',
    minRequiredStock: 400,
    stockBalance: 150,
    extraPoStock: 100,
    unitCost: 32.00,
    supplier: 'Pearson Education',
    lastStockUpdate: '2026-10-26 09:10',
    lastPoUpdate: '2026-10-26 09:15'
  },
  {
    isbn: '978-0596007126',
    title: 'Head First Design Patterns',
    category: 'Computer Science',
    minRequiredStock: 250,
    stockBalance: 80,
    extraPoStock: 0,
    unitCost: 39.99,
    supplier: 'O Reilly Media',
    lastStockUpdate: '2026-10-25 16:45',
    lastPoUpdate: '2026-10-20 10:00'
  },
  {
    isbn: '978-0321125217',
    title: 'Domain-Driven Design: Tackling Complexity in the Heart of Software',
    category: 'Software Engineering',
    minRequiredStock: 200,
    stockBalance: 120,
    extraPoStock: 50,
    unitCost: 52.00,
    supplier: 'Addison-Wesley Professional',
    lastStockUpdate: '2026-10-26 12:00',
    lastPoUpdate: '2026-10-25 15:30'
  },
  {
    isbn: '978-0998478807',
    title: 'Accelerate: The Science of Lean Software and DevOps',
    category: 'DevOps & Management',
    minRequiredStock: 350,
    stockBalance: 290,
    extraPoStock: 100,
    unitCost: 29.99,
    supplier: 'IT Revolution Press',
    lastStockUpdate: '2026-10-26 14:00',
    lastPoUpdate: '2026-10-26 14:00'
  },
  {
    isbn: '978-1449373323',
    title: 'Designing Data-Intensive Applications',
    category: 'Databases & System Design',
    minRequiredStock: 600,
    stockBalance: 250,
    extraPoStock: 150,
    unitCost: 44.50,
    supplier: 'O Reilly Media',
    lastStockUpdate: '2026-10-24 17:00',
    lastPoUpdate: '2026-10-25 09:00'
  },
  {
    isbn: '978-0201633856',
    title: 'The Pragmatic Programmer: Your Journey to Mastery',
    category: 'Software Engineering',
    minRequiredStock: 500,
    stockBalance: 180,
    extraPoStock: 200,
    unitCost: 38.00,
    supplier: 'Addison-Wesley Professional',
    lastStockUpdate: '2026-10-26 10:30',
    lastPoUpdate: '2026-10-22 13:20'
  }
];
