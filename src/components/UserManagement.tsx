import React, { useState } from 'react';
import { User, UserRole } from '../types';
import { Users, Shield, Plus, Edit2, Trash2, Check, X, UserCheck, UserX } from 'lucide-react';

interface UserManagementProps {
  users: User[];
  onAddUser: (user: User) => void;
  onUpdateUser: (user: User) => void;
  onDeleteUser: (userId: string) => void;
  currentUser: User;
}

export const UserManagement: React.FC<UserManagementProps> = ({
  users,
  onAddUser,
  onUpdateUser,
  onDeleteUser,
  currentUser,
}) => {
  const [isAdding, setIsAdding] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);

  const [newUser, setNewUser] = useState<Omit<User, 'id'>>({
    username: '',
    password: '',
    fullName: '',
    role: 'Inventory Operator',
    permissions: {
      canEditMinStock: false,
      canUploadStock: true,
      canManageCatalog: false,
      canManageUsers: false,
      canExportReports: true,
    },
    isActive: true,
  });

  const [editUserState, setEditUserState] = useState<User | null>(null);

  const handleRoleChange = (role: UserRole, isNew: boolean) => {
    let defaultPerms = {
      canEditMinStock: false,
      canUploadStock: true,
      canManageCatalog: false,
      canManageUsers: false,
      canExportReports: true,
    };

    if (role === 'Administrator') {
      defaultPerms = {
        canEditMinStock: true,
        canUploadStock: true,
        canManageCatalog: true,
        canManageUsers: true,
        canExportReports: true,
      };
    } else if (role === 'Warehouse Manager') {
      defaultPerms = {
        canEditMinStock: true,
        canUploadStock: true,
        canManageCatalog: true,
        canManageUsers: false,
        canExportReports: true,
      };
    } else if (role === 'Inventory Operator') {
      defaultPerms = {
        canEditMinStock: false,
        canUploadStock: true,
        canManageCatalog: false,
        canManageUsers: false,
        canExportReports: true,
      };
    } else if (role === 'Viewer') {
      defaultPerms = {
        canEditMinStock: false,
        canUploadStock: false,
        canManageCatalog: false,
        canManageUsers: false,
        canExportReports: true,
      };
    }

    if (isNew) {
      setNewUser({ ...newUser, role, permissions: defaultPerms });
    } else if (editUserState) {
      setEditUserState({ ...editUserState, role, permissions: defaultPerms });
    }
  };

  const handleCreateSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newUser.username || !newUser.fullName) return;

    const created: User = {
      id: `usr-${Date.now()}`,
      ...newUser,
    };

    onAddUser(created);
    setIsAdding(false);
    setNewUser({
      username: '',
      password: '',
      fullName: '',
      role: 'Inventory Operator',
      permissions: {
        canEditMinStock: false,
        canUploadStock: true,
        canManageCatalog: false,
        canManageUsers: false,
        canExportReports: true,
      },
      isActive: true,
    });
  };

  const handleStartEdit = (user: User) => {
    setEditingId(user.id);
    setEditUserState({ ...user });
  };

  const handleSaveEdit = () => {
    if (editUserState) {
      onUpdateUser(editUserState);
      setEditingId(null);
      setEditUserState(null);
    }
  };

  return (
    <div className="space-y-6">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl shadow-sm overflow-hidden">
        {/* Header */}
        <div className="p-6 border-b border-slate-800 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-cyan-950/60 text-cyan-400 border border-cyan-800/50 flex items-center justify-center">
              <Users className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-white">User & Role Management</h2>
              <p className="text-xs text-slate-400">Admin panel to create user accounts, passwords, and determine user permissions.</p>
            </div>
          </div>

          {currentUser.permissions.canManageUsers && (
            <button
              onClick={() => setIsAdding(true)}
              className="flex items-center gap-2 px-4 py-2 bg-cyan-600 hover:bg-cyan-500 text-white text-xs font-semibold rounded-xl shadow-lg shadow-cyan-900/30 transition-all whitespace-nowrap"
            >
              <Plus className="w-4 h-4" />
              <span>Add New User</span>
            </button>
          )}
        </div>

        {/* Add User Form */}
        {isAdding && (
          <form onSubmit={handleCreateSubmit} className="p-6 bg-slate-950/80 border-b border-slate-800 space-y-4">
            <h3 className="text-sm font-semibold text-white flex items-center gap-2">
              <Shield className="w-4 h-4 text-cyan-400" />
              <span>Create User Account & Configure Role Options</span>
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <div>
                <label className="block text-[11px] font-medium text-slate-400 mb-1">Username</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. jdoe"
                  value={newUser.username}
                  onChange={(e) => setNewUser({ ...newUser, username: e.target.value })}
                  className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-xs text-white font-mono"
                />
              </div>
              <div>
                <label className="block text-[11px] font-medium text-slate-400 mb-1">Password</label>
                <input
                  type="text"
                  required
                  placeholder="secure password"
                  value={newUser.password}
                  onChange={(e) => setNewUser({ ...newUser, password: e.target.value })}
                  className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-xs text-white font-mono"
                />
              </div>
              <div>
                <label className="block text-[11px] font-medium text-slate-400 mb-1">Full Name</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. John Doe"
                  value={newUser.fullName}
                  onChange={(e) => setNewUser({ ...newUser, fullName: e.target.value })}
                  className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-xs text-white"
                />
              </div>
              <div>
                <label className="block text-[11px] font-medium text-slate-400 mb-1">User Role</label>
                <select
                  value={newUser.role}
                  onChange={(e) => handleRoleChange(e.target.value as UserRole, true)}
                  className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-xs text-white"
                >
                  <option value="Administrator">Administrator</option>
                  <option value="Warehouse Manager">Warehouse Manager</option>
                  <option value="Inventory Operator">Inventory Operator</option>
                  <option value="Viewer">Viewer</option>
                </select>
              </div>
            </div>

            {/* Permissions checkboxes */}
            <div className="pt-2">
              <p className="text-[11px] font-medium text-slate-400 mb-2">Role Permissions & Options:</p>
              <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
                <label className="flex items-center gap-2 text-xs text-slate-300">
                  <input
                    type="checkbox"
                    checked={newUser.permissions.canEditMinStock}
                    onChange={(e) =>
                      setNewUser({
                        ...newUser,
                        permissions: { ...newUser.permissions, canEditMinStock: e.target.checked },
                      })
                    }
                    className="rounded bg-slate-900 border-slate-700 text-cyan-600 focus:ring-0"
                  />
                  <span>Edit Min Stock</span>
                </label>

                <label className="flex items-center gap-2 text-xs text-slate-300">
                  <input
                    type="checkbox"
                    checked={newUser.permissions.canUploadStock}
                    onChange={(e) =>
                      setNewUser({
                        ...newUser,
                        permissions: { ...newUser.permissions, canUploadStock: e.target.checked },
                      })
                    }
                    className="rounded bg-slate-900 border-slate-700 text-cyan-600 focus:ring-0"
                  />
                  <span>Upload Balance/PO</span>
                </label>

                <label className="flex items-center gap-2 text-xs text-slate-300">
                  <input
                    type="checkbox"
                    checked={newUser.permissions.canManageCatalog}
                    onChange={(e) =>
                      setNewUser({
                        ...newUser,
                        permissions: { ...newUser.permissions, canManageCatalog: e.target.checked },
                      })
                    }
                    className="rounded bg-slate-900 border-slate-700 text-cyan-600 focus:ring-0"
                  />
                  <span>Manage Catalog</span>
                </label>

                <label className="flex items-center gap-2 text-xs text-slate-300">
                  <input
                    type="checkbox"
                    checked={newUser.permissions.canManageUsers}
                    onChange={(e) =>
                      setNewUser({
                        ...newUser,
                        permissions: { ...newUser.permissions, canManageUsers: e.target.checked },
                      })
                    }
                    className="rounded bg-slate-900 border-slate-700 text-cyan-600 focus:ring-0"
                  />
                  <span>Manage Users</span>
                </label>

                <label className="flex items-center gap-2 text-xs text-slate-300">
                  <input
                    type="checkbox"
                    checked={newUser.permissions.canExportReports}
                    onChange={(e) =>
                      setNewUser({
                        ...newUser,
                        permissions: { ...newUser.permissions, canExportReports: e.target.checked },
                      })
                    }
                    className="rounded bg-slate-900 border-slate-700 text-cyan-600 focus:ring-0"
                  />
                  <span>Export Reports</span>
                </label>
              </div>
            </div>

            <div className="flex justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={() => setIsAdding(false)}
                className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-medium rounded-xl"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-5 py-2 bg-cyan-600 hover:bg-cyan-500 text-white text-xs font-semibold rounded-xl shadow-lg shadow-cyan-900/30"
              >
                Create Account
              </button>
            </div>
          </form>
        )}

        {/* Users Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-950/60 text-[11px] font-mono text-slate-400 uppercase tracking-wider border-b border-slate-800">
                <th className="py-3 px-6">Username</th>
                <th className="py-3 px-6">Full Name</th>
                <th className="py-3 px-6">Role</th>
                <th className="py-3 px-6">Permissions / Options</th>
                <th className="py-3 px-6 text-center">Status</th>
                <th className="py-3 px-6 text-center">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 text-xs">
              {users.map((user) => {
                const isEditing = editingId === user.id;
                return (
                  <tr key={user.id} className="hover:bg-slate-800/40 transition-colors">
                    <td className="py-4 px-6 font-mono text-cyan-400 font-semibold">{user.username}</td>
                    <td className="py-4 px-6 text-slate-100 font-medium">
                      {isEditing && editUserState ? (
                        <input
                          type="text"
                          value={editUserState.fullName}
                          onChange={(e) => setEditUserState({ ...editUserState, fullName: e.target.value })}
                          className="w-full bg-slate-950 border border-cyan-500 rounded px-2 py-1 text-white text-xs"
                        />
                      ) : (
                        user.fullName
                      )}
                    </td>
                    <td className="py-4 px-6">
                      {isEditing && editUserState ? (
                        <select
                          value={editUserState.role}
                          onChange={(e) => handleRoleChange(e.target.value as UserRole, false)}
                          className="bg-slate-950 border border-cyan-500 rounded px-2 py-1 text-white text-xs"
                        >
                          <option value="Administrator">Administrator</option>
                          <option value="Warehouse Manager">Warehouse Manager</option>
                          <option value="Inventory Operator">Inventory Operator</option>
                          <option value="Viewer">Viewer</option>
                        </select>
                      ) : (
                        <span className="px-2.5 py-1 rounded-lg bg-slate-800 border border-slate-700 text-slate-200 text-[11px] font-medium">
                          {user.role}
                        </span>
                      )}
                    </td>
                    <td className="py-4 px-6">
                      <div className="flex flex-wrap gap-1">
                        {user.permissions.canEditMinStock && (
                          <span className="px-1.5 py-0.5 rounded bg-cyan-950/60 text-cyan-300 text-[10px] border border-cyan-900">Edit Par</span>
                        )}
                        {user.permissions.canUploadStock && (
                          <span className="px-1.5 py-0.5 rounded bg-emerald-950/60 text-emerald-300 text-[10px] border border-emerald-900">Upload</span>
                        )}
                        {user.permissions.canManageCatalog && (
                          <span className="px-1.5 py-0.5 rounded bg-purple-950/60 text-purple-300 text-[10px] border border-purple-900">Catalog</span>
                        )}
                        {user.permissions.canManageUsers && (
                          <span className="px-1.5 py-0.5 rounded bg-amber-950/60 text-amber-300 text-[10px] border border-amber-900">Users</span>
                        )}
                        {user.permissions.canExportReports && (
                          <span className="px-1.5 py-0.5 rounded bg-blue-950/60 text-blue-300 text-[10px] border border-blue-900">Export</span>
                        )}
                      </div>
                    </td>
                    <td className="py-4 px-6 text-center">
                      {user.isActive ? (
                        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-emerald-950/60 text-emerald-400 text-[11px] border border-emerald-900">
                          <UserCheck className="w-3 h-3" /> Active
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-rose-950/60 text-rose-400 text-[11px] border border-rose-900">
                          <UserX className="w-3 h-3" /> Inactive
                        </span>
                      )}
                    </td>
                    <td className="py-4 px-6 text-center">
                      {currentUser.permissions.canManageUsers ? (
                        isEditing ? (
                          <div className="flex items-center justify-center gap-1">
                            <button
                              onClick={handleSaveEdit}
                              className="p-1.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg transition-colors"
                              title="Save"
                            >
                              <Check className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => setEditingId(null)}
                              className="p-1.5 bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white rounded-lg transition-colors"
                              title="Cancel"
                            >
                              <X className="w-4 h-4" />
                            </button>
                          </div>
                        ) : (
                          <div className="flex items-center justify-center gap-1.5">
                            <button
                              onClick={() => handleStartEdit(user)}
                              className="p-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white rounded-lg transition-colors border border-slate-700"
                              title="Edit User"
                            >
                              <Edit2 className="w-3.5 h-3.5 text-cyan-400" />
                            </button>
                            {user.username !== 'admin' && (
                              <button
                                onClick={() => onDeleteUser(user.id)}
                                className="p-1.5 bg-slate-800 hover:bg-slate-700 text-rose-400 rounded-lg transition-colors border border-slate-700"
                                title="Delete User"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            )}
                          </div>
                        )
                      ) : (
                        <span className="text-slate-500 text-[11px]">View Only</span>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
