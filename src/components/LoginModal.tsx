import React, { useState } from 'react';
import { User } from '../types';
import { Lock, User as UserIcon, BookOpen, AlertCircle, KeyRound, ShieldCheck } from 'lucide-react';

interface LoginModalProps {
  users: User[];
  onLogin: (user: User) => void;
}

export const LoginModal: React.FC<LoginModalProps> = ({ users, onLogin }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    const found = users.find(
      (u) => u.username.toLowerCase() === username.trim().toLowerCase() && u.isActive
    );

    if (!found) {
      setError('Invalid username or account is deactivated.');
      return;
    }

    if (found.password && found.password !== password) {
      setError('Incorrect password.');
      return;
    }

    onLogin(found);
  };

  const handleDemoLogin = (demoUser: User) => {
    setUsername(demoUser.username);
    setPassword(demoUser.password || '');
    onLogin(demoUser);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/90 backdrop-blur-md animate-fadeIn">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-md overflow-hidden shadow-2xl">
        {/* Header */}
        <div className="p-8 text-center bg-gradient-to-b from-slate-900 to-slate-950 border-b border-slate-800">
          <div className="w-14 h-14 rounded-2xl bg-cyan-600 flex items-center justify-center text-white font-bold mx-auto shadow-lg shadow-cyan-900/40 mb-4">
            <BookOpen className="w-7 h-7" />
          </div>
          <h2 className="text-xl font-bold text-white tracking-tight">BookWMS Portal</h2>
          <p className="text-xs text-slate-400 mt-1">Sign in with your assigned username and password</p>
        </div>

        {/* Form */}
        <div className="p-8 space-y-6">
          {error && (
            <div className="flex items-center gap-3 p-3.5 bg-rose-950/50 border border-rose-900/60 rounded-xl text-rose-300 text-xs">
              <AlertCircle className="w-4 h-4 shrink-0 text-rose-400" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1.5">Username</label>
              <div className="relative">
                <UserIcon className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                <input
                  type="text"
                  required
                  placeholder="e.g. admin or manager"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl pl-10 pr-4 py-2.5 text-xs text-white placeholder-slate-600 focus:outline-none focus:border-cyan-500 font-mono"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1.5">Password</label>
              <div className="relative">
                <KeyRound className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                <input
                  type="password"
                  required
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl pl-10 pr-4 py-2.5 text-xs text-white placeholder-slate-600 focus:outline-none focus:border-cyan-500"
                />
              </div>
            </div>

            <button
              type="submit"
              className="w-full py-3 bg-cyan-600 hover:bg-cyan-500 text-white text-xs font-semibold rounded-xl shadow-lg shadow-cyan-900/30 transition-all flex items-center justify-center gap-2"
            >
              <Lock className="w-4 h-4" />
              <span>Sign In to WMS</span>
            </button>
          </form>

          {/* Quick Demo Accounts */}
          <div className="pt-4 border-t border-slate-800">
            <p className="text-[11px] text-slate-400 font-medium mb-3 flex items-center gap-1.5">
              <ShieldCheck className="w-3.5 h-3.5 text-cyan-400" />
              <span>Quick Login Demo Accounts (Pre-configured):</span>
            </p>
            <div className="grid grid-cols-2 gap-2">
              {users.map((u) => (
                <button
                  key={u.id}
                  type="button"
                  onClick={() => handleDemoLogin(u)}
                  className="p-2.5 bg-slate-950 hover:bg-slate-800 border border-slate-800 hover:border-slate-700 rounded-xl text-left transition-colors group"
                >
                  <p className="text-xs font-semibold text-white group-hover:text-cyan-400 flex items-center justify-between">
                    <span>{u.username}</span>
                    <span className="text-[10px] px-1.5 py-0.5 rounded bg-slate-800 text-slate-300 font-normal">
                      {u.role.split(' ')[0]}
                    </span>
                  </p>
                  <p className="text-[10px] text-slate-400 truncate mt-0.5">{u.fullName}</p>
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
