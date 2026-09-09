'use client';

import React, { useState, useRef, useEffect } from 'react';
import { MoreVertical, Lock, Mail, Trash2, Loader2, Send } from 'lucide-react';
import { toast } from 'sonner';
import { ConfirmDialog } from '@/components/ui/ConfirmDialog';
import type { PlatformUser } from '@/lib/firestore-schema';
import { useRouter } from 'next/navigation';

export function UserQuickActionsMenu({ user, onRefresh }: { user: PlatformUser, onRefresh: () => void }) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  // Modals state
  const [showSetPassword, setShowSetPassword] = useState(false);
  const [customPassword, setCustomPassword] = useState('');
  const [settingPassword, setSettingPassword] = useState(false);

  const [showSetEmail, setShowSetEmail] = useState(false);
  const [customEmail, setCustomEmail] = useState('');
  const [settingEmail, setSettingEmail] = useState(false);

  const [showDelete, setShowDelete] = useState(false);
  const [actionLoading, setActionLoading] = useState(false);
  const [sendingCreds, setSendingCreds] = useState(false);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [menuRef]);

  const handleSetPassword = async (e: React.MouseEvent) => {
    e.stopPropagation();
    if (customPassword.length < 8) {
      toast.error("Password must be at least 8 characters");
      return;
    }
    setSettingPassword(true);
    try {
      const res = await fetch(`/api/admin/users/${user.id}/set-password`, { 
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ newPassword: customPassword }),
      });
      const d = await res.json();
      if (!res.ok) throw new Error(d.error || 'Failed');
      toast.success(d.message);
      setShowSetPassword(false);
      setCustomPassword('');
    } catch (err: any) {
      toast.error(err.message || 'Failed to set password');
    } finally {
      setSettingPassword(false);
    }
  };

  const handleSetEmail = async (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!customEmail || !customEmail.includes('@')) {
      toast.error("Please enter a valid email address");
      return;
    }
    setSettingEmail(true);
    try {
      const res = await fetch(`/api/admin/users/${user.id}/set-email`, { 
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ newEmail: customEmail }),
      });
      const d = await res.json();
      if (!res.ok) throw new Error(d.error || 'Failed');
      toast.success(d.message);
      setShowSetEmail(false);
      setCustomEmail('');
      onRefresh();
    } catch (err: any) {
      toast.error(err.message || 'Failed to update email');
    } finally {
      setSettingEmail(false);
    }
  };

  const handleDelete = async () => {
    setActionLoading(true);
    try {
      const res = await fetch(`/api/admin/users/${user.id}`, { method: 'DELETE' });
      const d = await res.json();
      if (!res.ok) throw new Error(d.error || 'Failed to delete');
      toast.success('User deleted successfully');
      setShowDelete(false);
      onRefresh();
    } catch (err: any) {
      toast.error(err.message || 'Failed to delete user');
      setShowDelete(false);
    } finally {
      setActionLoading(false);
    }
  };

  const handleSendCredentials = async (e: React.MouseEvent) => {
    e.stopPropagation();
    setSendingCreds(true);
    try {
      const res = await fetch(`/api/admin/users/${user.id}/send-credentials`, { method: 'POST' });
      const d = await res.json();
      if (!res.ok) throw new Error(d.error || 'Failed to send');
      toast.success(`✅ Credentials sent to ${d.email}`);
    } catch (err: any) {
      toast.error(err.message || 'Failed to send credentials');
    } finally {
      setSendingCreds(false);
    }
  };

  return (
    <div className="relative" ref={menuRef}>
      <button
        onClick={(e) => { e.stopPropagation(); setOpen(!open); }}
        className="p-1.5 text-slate-400 hover:text-slate-800 dark:hover:text-white transition-colors rounded-lg hover:bg-slate-100 dark:hover:bg-white/10"
      >
        <MoreVertical className="w-5 h-5" />
      </button>

      {open && (
        <div className="absolute right-0 mt-2 w-56 bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 rounded-xl shadow-xl z-50 overflow-hidden animate-in fade-in zoom-in-95">
          <div className="py-1">
            <button
              onClick={(e) => handleSendCredentials(e)}
              disabled={sendingCreds}
              className="w-full text-left px-4 py-2.5 text-sm font-semibold text-slate-700 dark:text-zinc-200 hover:bg-slate-50 dark:hover:bg-zinc-800 hover:text-slate-900 dark:hover:text-white flex items-center gap-2"
            >
              {sendingCreds ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4 text-cyan-600 dark:text-cyan-400" />}
              Send Login Credentials
            </button>
            <button
              onClick={(e) => { e.stopPropagation(); setOpen(false); setShowSetPassword(true); }}
              className="w-full text-left px-4 py-2.5 text-sm font-semibold text-slate-700 dark:text-zinc-200 hover:bg-slate-50 dark:hover:bg-zinc-800 hover:text-slate-900 dark:hover:text-white flex items-center gap-2"
            >
              <Lock className="w-4 h-4 text-amber-600 dark:text-amber-400" />
              Set Custom Password
            </button>
            <button
              onClick={(e) => { e.stopPropagation(); setOpen(false); setShowSetEmail(true); }}
              className="w-full text-left px-4 py-2.5 text-sm font-semibold text-slate-700 dark:text-zinc-200 hover:bg-slate-50 dark:hover:bg-zinc-800 hover:text-slate-900 dark:hover:text-white flex items-center gap-2"
            >
              <Mail className="w-4 h-4 text-blue-600 dark:text-blue-400" />
              Change Email Address
            </button>
            <div className="border-t border-slate-100 dark:border-zinc-800 my-1"></div>
            <button
              onClick={(e) => { e.stopPropagation(); setOpen(false); setShowDelete(true); }}
              className="w-full text-left px-4 py-2.5 text-sm font-semibold text-rose-600 dark:text-red-400 hover:bg-rose-50 dark:hover:bg-zinc-800 flex items-center gap-2"
            >
              <Trash2 className="w-4 h-4" />
              Delete User
            </button>
          </div>
        </div>
      )}

      {/* Set Password Modal */}
      {showSetPassword && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4" onClick={(e) => e.stopPropagation()}>
          <div className="w-full max-w-md bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 rounded-2xl overflow-hidden shadow-2xl">
            <div className="p-6">
              <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2">Set Custom Password</h3>
              <p className="text-sm text-slate-600 dark:text-zinc-400 mb-6">Manually override the password for <strong className="text-slate-900 dark:text-white font-bold">{user.email}</strong>.</p>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-semibold text-slate-700 dark:text-zinc-300 mb-1.5">New Password</label>
                  <input 
                    type="text" 
                    value={customPassword}
                    onChange={e => setCustomPassword(e.target.value)}
                    placeholder="e.g. TempPass123!"
                    className="w-full h-10 px-3 rounded-xl text-sm text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-zinc-500 bg-slate-50 dark:bg-zinc-800 border border-slate-200 dark:border-zinc-700 outline-none focus:ring-2 focus:ring-amber-500" 
                  />
                </div>
              </div>
            </div>
            <div className="px-6 py-4 bg-slate-50 dark:bg-zinc-900/50 border-t border-slate-100 dark:border-zinc-800 flex justify-end gap-3">
              <button 
                onClick={(e) => { e.stopPropagation(); setShowSetPassword(false); setCustomPassword(''); }}
                className="px-4 py-2 rounded-xl text-sm font-medium text-slate-600 dark:text-zinc-400 hover:text-slate-900 dark:hover:text-white transition-colors"
              >
                Cancel
              </button>
              <button 
                onClick={handleSetPassword}
                disabled={settingPassword || customPassword.length < 8}
                className="px-5 py-2 rounded-xl text-sm font-bold bg-amber-500 hover:bg-amber-400 text-slate-900 flex items-center gap-2 disabled:opacity-50 shadow-sm"
              >
                {settingPassword ? <Loader2 className="w-4 h-4 animate-spin" /> : <Lock className="w-4 h-4" />}
                {settingPassword ? 'Saving...' : 'Set Password'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Set Email Modal */}
      {showSetEmail && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4" onClick={(e) => e.stopPropagation()}>
          <div className="w-full max-w-md bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 rounded-2xl overflow-hidden shadow-2xl">
            <div className="p-6">
              <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2">Change Email Address</h3>
              <p className="text-sm text-slate-600 dark:text-zinc-400 mb-6">Update the primary email address for <strong className="text-slate-900 dark:text-white font-bold">{user.full_name}</strong>. Their old email is {user.email}.</p>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-semibold text-slate-700 dark:text-zinc-300 mb-1.5">New Email Address</label>
                  <input 
                    type="email" 
                    value={customEmail}
                    onChange={e => setCustomEmail(e.target.value)}
                    placeholder="new@example.com"
                    className="w-full h-10 px-3 rounded-xl text-sm text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-zinc-500 bg-slate-50 dark:bg-zinc-800 border border-slate-200 dark:border-zinc-700 outline-none focus:ring-2 focus:ring-blue-500" 
                  />
                </div>
              </div>
            </div>
            <div className="px-6 py-4 bg-slate-50 dark:bg-zinc-900/50 border-t border-slate-100 dark:border-zinc-800 flex justify-end gap-3">
              <button 
                onClick={(e) => { e.stopPropagation(); setShowSetEmail(false); setCustomEmail(''); }}
                className="px-4 py-2 rounded-xl text-sm font-medium text-slate-600 dark:text-zinc-400 hover:text-slate-900 dark:hover:text-white transition-colors"
              >
                Cancel
              </button>
              <button 
                onClick={handleSetEmail}
                disabled={settingEmail || !customEmail.includes('@')}
                className="px-5 py-2 rounded-xl text-sm font-bold bg-blue-600 hover:bg-blue-500 text-white flex items-center gap-2 disabled:opacity-50 shadow-sm"
              >
                {settingEmail ? <Loader2 className="w-4 h-4 animate-spin" /> : <Mail className="w-4 h-4" />}
                {settingEmail ? 'Updating...' : 'Update Email'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Dialog */}
      <ConfirmDialog
        open={showDelete}
        title="Delete Account"
        description={`Are you sure you want to permanently delete the account for ${user.full_name}? This action cannot be undone.`}
        onConfirm={handleDelete}
        onCancel={() => setShowDelete(false)}
        loading={actionLoading}
        confirmLabel="Yes, delete user"
        danger={true}
      />
    </div>
  );
}
