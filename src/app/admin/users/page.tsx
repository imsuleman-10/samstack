'use client';

import React, { useEffect, useState } from 'react';
import { PageHeader } from '@/components/ui/PageHeader';
import { DataTable } from '@/components/ui/DataTable';
import { UserAvatar } from '@/components/ui/UserAvatar';
import { RoleBadge } from '@/components/ui/RoleBadge';
import { StatusBadge } from '@/components/ui/StatusBadge';
import { UserPlus, Shield, Activity, Trash2, X, Loader2, Send, Mail } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import type { PlatformUser } from '@/lib/firestore-schema';
import { UserQuickActionsMenu } from './components/UserQuickActionsMenu';

export default function AdminUsersPage() {
  const router = useRouter();
  const [users, setUsers] = useState<PlatformUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [bulkAction, setBulkAction] = useState<{ type: string; loading: boolean } | null>(null);
  const [sendingMailId, setSendingMailId] = useState<string | null>(null);

  const fetchUsers = async (p = 1, s = '') => {
    setLoading(true);
    try {
      const url = new URL('/api/admin/users', window.location.origin);
      url.searchParams.set('page', p.toString());
      if (s) url.searchParams.set('search', s);
      
      const res = await fetch(url);
      if (!res.ok) return;
      const data = await res.json();
      if (data.users) {
        setUsers(data.users);
        setTotalPages(data.pages);
        setPage(data.page);
      }
    } catch (error: any) {
      console.error('Error fetching users:', error);
      toast.error(error.message || 'Failed to load users');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      fetchUsers(1, search);
    }, 300);
    return () => clearTimeout(timeoutId);
  }, [search]);

  const handleRowClick = (user: PlatformUser) => {
    router.push(`/admin/users/${user.id}`);
  };

  const handleBulkAction = async (action: 'CHANGE_ROLE' | 'CHANGE_STATUS' | 'DELETE', payload?: string) => {
    if (!selectedIds.length) return;
    if (action === 'DELETE' && !confirm(`Are you sure you want to delete ${selectedIds.length} users? This cannot be undone.`)) return;
    
    setBulkAction({ type: action, loading: true });
    try {
      const res = await fetch('/api/admin/users/bulk', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userIds: selectedIds, action, payload })
      });
      
      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error || 'Bulk action failed');
      }
      
      setSelectedIds([]);
      fetchUsers(page, search);
      toast.success(`Successfully applied bulk action to ${selectedIds.length} users`);
    } catch (err: any) {
      toast.error(err.message || 'An error occurred during bulk action');
    } finally {
      setBulkAction(null);
    }
  };

  const handleSendCredentials = async (e: React.MouseEvent, userId: string) => {
    e.stopPropagation(); // Prevent row click
    setSendingMailId(userId);
    try {
      const res = await fetch(`/api/admin/users/${userId}/send-credentials`, { method: 'POST' });
      const d = await res.json();
      if (!res.ok) throw new Error(d.error || 'Failed to send');
      toast.success(`✅ Credentials sent to ${d.email}`);
    } catch (err: any) {
      toast.error(err.message || 'Failed to send credentials');
    } finally {
      setSendingMailId(null);
    }
  };

  return (
    <div>
      <PageHeader
        title="User Management"
        description="Manage all users across the platform."
        action={
          <Link
            href="/admin/users/create"
            className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold text-white bg-cyan-600 hover:bg-cyan-500 transition-colors"
          >
            <UserPlus className="w-4 h-4" />
            Add User
          </Link>
        }
      />

      {/* Bulk Actions Bar */}
      {selectedIds.length > 0 && (
        <div className="mb-6 p-4 rounded-2xl border bg-cyan-50 border-cyan-200 dark:bg-cyan-950/40 dark:border-cyan-800/60 flex flex-wrap items-center justify-between gap-4 shadow-xs animate-in fade-in slide-in-from-top-4 duration-300">
          <div className="flex items-center gap-3 text-sm text-cyan-900 dark:text-cyan-100 font-bold">
            <span className="flex items-center justify-center w-6 h-6 rounded-full bg-cyan-600 text-white dark:bg-cyan-500/20 dark:text-cyan-400 text-xs">
              {selectedIds.length}
            </span>
            Users Selected
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <button
              onClick={() => handleBulkAction('CHANGE_ROLE', 'intern')}
              disabled={!!bulkAction}
              className="px-3 py-1.5 rounded-xl text-sm font-semibold bg-cyan-600 text-white hover:bg-cyan-500 dark:bg-cyan-500/10 dark:text-cyan-400 dark:hover:bg-cyan-500/20 border border-cyan-600/30 dark:border-cyan-500/20 transition-colors flex items-center gap-1.5 disabled:opacity-50"
            >
              {bulkAction?.type === 'CHANGE_ROLE' ? <Loader2 className="w-4 h-4 animate-spin" /> : <Shield className="w-4 h-4" />}
              Role: Intern
            </button>

            <div className="flex items-center gap-1 px-3 py-1.5 rounded-xl bg-white dark:bg-zinc-800 border border-slate-200 dark:border-zinc-700 shadow-xs">
              <Shield className="w-4 h-4 text-slate-400 dark:text-zinc-400" />
              <select 
                className="bg-transparent text-sm text-slate-700 dark:text-zinc-200 outline-none font-medium cursor-pointer"
                onChange={(e) => { if(e.target.value) { handleBulkAction('CHANGE_ROLE', e.target.value); e.target.value = ''; } }}
                disabled={!!bulkAction}
              >
                <option value="" className="bg-white dark:bg-zinc-900 text-slate-800 dark:text-zinc-200">Change Role...</option>
                <option value="admin" className="bg-white dark:bg-zinc-900 text-slate-800 dark:text-zinc-200">Admin</option>
                <option value="mentor" className="bg-white dark:bg-zinc-900 text-slate-800 dark:text-zinc-200">Mentor</option>
                <option value="intern" className="bg-white dark:bg-zinc-900 text-slate-800 dark:text-zinc-200">Intern</option>
                <option value="staff" className="bg-white dark:bg-zinc-900 text-slate-800 dark:text-zinc-200">Staff</option>
                <option value="member" className="bg-white dark:bg-zinc-900 text-slate-800 dark:text-zinc-200">Member</option>
              </select>
            </div>

            <div className="flex items-center gap-1 px-3 py-1.5 rounded-xl bg-white dark:bg-zinc-800 border border-slate-200 dark:border-zinc-700 shadow-xs">
              <Activity className="w-4 h-4 text-slate-400 dark:text-zinc-400" />
              <select 
                className="bg-transparent text-sm text-slate-700 dark:text-zinc-200 outline-none font-medium cursor-pointer"
                onChange={(e) => { if(e.target.value) { handleBulkAction('CHANGE_STATUS', e.target.value); e.target.value = ''; } }}
                disabled={!!bulkAction}
              >
                <option value="" className="bg-white dark:bg-zinc-900 text-slate-800 dark:text-zinc-200">Change Status...</option>
                <option value="active" className="bg-white dark:bg-zinc-900 text-slate-800 dark:text-zinc-200">Active</option>
                <option value="suspended" className="bg-white dark:bg-zinc-900 text-slate-800 dark:text-zinc-200">Suspended</option>
                <option value="inactive" className="bg-white dark:bg-zinc-900 text-slate-800 dark:text-zinc-200">Inactive</option>
              </select>
            </div>

            <button
              onClick={() => handleBulkAction('DELETE')}
              disabled={!!bulkAction}
              className="px-3 py-1.5 rounded-xl text-sm font-semibold bg-rose-50 text-rose-600 hover:bg-rose-100 dark:bg-rose-500/10 dark:text-rose-400 dark:hover:bg-rose-500/20 border border-rose-200 dark:border-rose-500/20 transition-colors flex items-center gap-1.5 disabled:opacity-50"
            >
              {bulkAction?.type === 'DELETE' ? <Loader2 className="w-4 h-4 animate-spin" /> : <Trash2 className="w-4 h-4" />}
              Delete
            </button>

            <button
              onClick={() => setSelectedIds([])}
              disabled={!!bulkAction}
              className="p-1.5 ml-2 rounded-xl text-slate-400 hover:text-slate-700 dark:hover:text-white hover:bg-slate-200/50 dark:hover:bg-zinc-800 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>
      )}

      <DataTable
        data={users}
        isLoading={loading}
        keyExtractor={(u) => u.id}
        onRowClick={handleRowClick}
        searchValue={search}
        onSearchChange={setSearch}
        searchPlaceholder="Search by name, email or username..."
        page={page}
        totalPages={totalPages}
        onPageChange={(p) => fetchUsers(p, search)}
        selectable={true}
        selectedIds={selectedIds}
        onSelectionChange={setSelectedIds}
        columns={[
          {
            key: 'user',
            label: 'User',
            render: (u) => (
              <div className="flex items-center gap-3">
                <UserAvatar name={u.full_name} src={u.avatar_url} size="sm" />
                <div>
                  <p className="font-bold text-slate-900 dark:text-white">{u.full_name}</p>
                  <p className="text-xs text-slate-500 dark:text-zinc-400">{u.email}</p>
                </div>
              </div>
            ),
          },
          {
            key: 'role',
            label: 'Role',
            render: (u) => <RoleBadge role={u.role} />,
          },
          {
            key: 'status',
            label: 'Status',
            render: (u) => <StatusBadge status={u.status} />,
          },
          {
            key: 'joined',
            label: 'Joined',
            render: (u) => <span className="text-slate-500 dark:text-zinc-400 text-xs font-medium">{new Date(u.created_at).toLocaleDateString()}</span>,
          },
          {
            key: 'actions',
            label: 'Actions',
            render: (u) => (
              <div className="flex items-center justify-end gap-2">
                <UserQuickActionsMenu user={u} onRefresh={() => fetchUsers(page, search)} />
              </div>
            ),
          },
        ]}
      />
    </div>
  );
}

function ChevronRightIcon(props: any) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="m9 18 6-6-6-6" />
    </svg>
  );
}
