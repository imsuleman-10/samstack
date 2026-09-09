'use client';

import React, { useEffect, useState } from 'react';
import { PageHeader } from '@/components/ui/PageHeader';
import { DataTable } from '@/components/ui/DataTable';
import { UserAvatar } from '@/components/ui/UserAvatar';
import { StatusBadge } from '@/components/ui/StatusBadge';
import { Award, UserPlus, Mail, Loader2 } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import type { RichIntern } from '@/lib/firestore-schema';

export default function AdminInternsPage() {
  const router = useRouter();
  const [interns, setInterns] = useState<RichIntern[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [sendingMailId, setSendingMailId] = useState<string | null>(null);

  const fetchInterns = async (p = 1, s = '') => {
    setLoading(true);
    try {
      // Re-using the users endpoint with role filter
      const url = new URL('/api/admin/users', window.location.origin);
      url.searchParams.set('role', 'intern');
      url.searchParams.set('page', p.toString());
      if (s) url.searchParams.set('search', s);
      
      const res = await fetch(url);
      if (!res.ok) return;
      const data = await res.json();
      if (data.users) {
        setInterns(data.users);
        setTotalPages(data.pages);
        setPage(data.page);
      }
    } catch (error) {
      console.error('Error fetching interns:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const timeoutId = setTimeout(() => fetchInterns(1, search), 300);
    return () => clearTimeout(timeoutId);
  }, [search]);

  const handleSendCredentials = async (e: React.MouseEvent, internId: string) => {
    e.stopPropagation();
    setSendingMailId(internId);
    try {
      const res = await fetch(`/api/admin/users/${internId}/send-credentials`, { method: 'POST' });
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
        title="Interns Management"
        description="View and manage all intern profiles."
        action={
          <div className="flex items-center gap-3">
            <Link
              href="/admin/interns/create"
              className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold text-white bg-cyan-600 hover:bg-cyan-500 transition-colors"
            >
              <UserPlus className="w-4 h-4" />
              Add Intern
            </Link>
            <Link
              href="/admin/interns/certify"
              className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold text-white bg-emerald-600 hover:bg-emerald-500 transition-colors"
            >
              <Award className="w-4 h-4" />
              Instant Certify
            </Link>
          </div>
        }
      />

      <DataTable
        data={interns}
        isLoading={loading}
        keyExtractor={(i) => i.id}
        onRowClick={(i) => router.push(`/admin/users/${i.id}`)}
        searchValue={search}
        onSearchChange={setSearch}
        searchPlaceholder="Search interns..."
        page={page}
        totalPages={totalPages}
        onPageChange={(p) => fetchInterns(p, search)}
        columns={[
          {
            key: 'user',
            label: 'Intern',
            render: (i) => (
              <div className="flex items-center gap-3">
                <UserAvatar name={i.full_name} src={i.avatar_url} size="sm" />
                <div>
                  <p className="font-bold text-slate-900 dark:text-white">{i.full_name}</p>
                  <p className="text-xs text-slate-500 dark:text-zinc-400">{i.email}</p>
                </div>
              </div>
            ),
          },
          {
            key: 'track',
            label: 'Track',
            render: (i: any) => (
              <span className="text-sm font-semibold text-slate-700 dark:text-zinc-300">
                {i.track_selected || i.internProfile?.track_selected || '—'}
              </span>
            ),
          },
          {
            key: 'roll',
            label: 'Roll No.',
            render: (i: any) => (
              <span className="text-xs font-mono font-bold text-slate-600 dark:text-zinc-400">
                {i.roll_number || i.internProfile?.roll_number || '—'}
              </span>
            ),
          },
          {
            key: 'status',
            label: 'Status',
            render: (i: any) => <StatusBadge status={i.status} />,
          },
          {
            key: 'joined',
            label: 'Joined',
            render: (i: any) => <span className="text-slate-500 dark:text-zinc-400 text-xs font-medium">{new Date(i.created_at).toLocaleDateString()}</span>,
          },
          {
            key: 'actions',
            label: 'Actions',
            render: (i: any) => (
              <div className="flex items-center justify-end gap-2">
                <button
                  title="Send Login Credentials via Email"
                  onClick={(e) => handleSendCredentials(e, i.id)}
                  disabled={sendingMailId === i.id}
                  className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-medium text-cyan-400 bg-cyan-500/10 hover:bg-cyan-500/20 border border-cyan-500/20 transition-colors disabled:opacity-50"
                >
                  {sendingMailId === i.id
                    ? <Loader2 className="w-3.5 h-3.5 animate-spin" />
                    : <Mail className="w-3.5 h-3.5" />}
                  {sendingMailId === i.id ? 'Sending...' : 'Send Mail'}
                </button>
              </div>
            ),
          },
        ]}
      />
    </div>
  );
}
