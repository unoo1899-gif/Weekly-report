import { User } from '../types';

export const INITIAL_USERS: User[] = [
  {
    id: 'usr-1',
    username: 'admin',
    password: 'admin123',
    fullName: 'System Administrator',
    role: 'Administrator',
    permissions: {
      canEditMinStock: true,
      canUploadStock: true,
      canManageCatalog: true,
      canManageUsers: true,
      canExportReports: true,
    },
    isActive: true,
  },
  {
    id: 'usr-2',
    username: 'manager',
    password: 'manager123',
    fullName: 'Warehouse Manager',
    role: 'Warehouse Manager',
    permissions: {
      canEditMinStock: true,
      canUploadStock: true,
      canManageCatalog: true,
      canManageUsers: false,
      canExportReports: true,
    },
    isActive: true,
  },
  {
    id: 'usr-3',
    username: 'operator',
    password: 'operator123',
    fullName: 'Inventory Operator',
    role: 'Inventory Operator',
    permissions: {
      canEditMinStock: false,
      canUploadStock: true,
      canManageCatalog: false,
      canManageUsers: false,
      canExportReports: true,
    },
    isActive: true,
  },
  {
    id: 'usr-4',
    username: 'viewer',
    password: 'viewer123',
    fullName: 'Auditor / Viewer',
    role: 'Viewer',
    permissions: {
      canEditMinStock: false,
      canUploadStock: false,
      canManageCatalog: false,
      canManageUsers: false,
      canExportReports: true,
    },
    isActive: true,
  },
];
