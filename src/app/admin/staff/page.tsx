'use client';

import React, { useEffect, useState } from 'react';
import { PageHeader } from '@/components/ui/PageHeader';
import { DataTable } from '@/components/ui/DataTable';
import { UserAvatar } from '@/components/ui/UserAvatar';
import { StatusBadge } from '@/components/ui/StatusBadge';
import { Briefcase, UserPlus, Loader2, Mail } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import type { PlatformUser, StaffProfile } from '@/lib/firestore-schema';

type StaffWithProfile = PlatformUser & { department?: string | null; position?: string | null; };

export default function AdminStaffPage() {
  const router = useRouter();
  const [staff, setStaff] = useState<StaffWithProfile[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [sendingMailId, setSendingMailId] = useState<string | null>(null);

  const fetchStaff = async (p = 1, s = '') => {
    setLoading(true);
    try {
      const url = new URL('/api/admin/users', window.location.origin);
      url.searchParams.set('role', 'staff');
      url.searchParams.set('page', p.toString());
      if (s) url.searchParams.set('search', s);

      const res = await fetch(url);
      if (!res.ok) return;
      const data = await res.json();
      if (data.users) {
        // Fetch staff profiles to get department info
        const staffUsers: StaffWithProfile[] = data.users;
        const profileFetches = await Promise.all(
          staffUsers.map((u: PlatformUser) =>
            fetch(`/api/admin/users/${u.id}`)
              .then(r => r.ok ? r.json() : null)
              .catch(() => null)
          )
        );
        const enriched: StaffWithProfile[] = staffUsers.map((u, i) => ({
          ...u,
          department: profileFetches[i]?.staffProfile?.department || null,
          position: profileFetches[i]?.staffProfile?.position || null,
        }));
        setStaff(enriched);
        setTotalPages(data.pages ?? 1);
        setPage(data.page ?? 1);
      }
    } catch (error) {
      console.error('Error fetching staff:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const t = setTimeout(() => fetchStaff(1, search), 300);
    return () => clearTimeout(t);
  }, [search]);

  const handleSendCredentials = async (e: React.MouseEvent, staffId: string) => {
    e.stopPropagation();
    setSendingMailId(staffId);
    try {
      const res = await fetch(`/api/admin/users/${staffId}/send-credentials`, { method: 'POST' });
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
        title="Staff Management"
        description="View and manage all staff members on the platform."
        action={
          <Link
            href="/admin/users/create"
            className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold text-white bg-emerald-600 hover:bg-emerald-500 transition-colors"
          >
            <UserPlus className="w-4 h-4" />
            Add Staff
          </Link>
        }
      />

      <DataTable
        data={staff}
        isLoading={loading}
        keyExtractor={(u) => u.id}
        onRowClick={(u) => router.push(`/admin/users/${u.id}`)}
        searchValue={search}
        onSearchChange={setSearch}
        searchPlaceholder="Search staff members..."
        page={page}
        totalPages={totalPages}
        onPageChange={(p) => fetchStaff(p, search)}
        columns={[
          {
            key: 'user',
            label: 'Staff Member',
            render: (u) => (
              <div className="flex items-center gap-3">
                <UserAvatar name={u.full_name} src={u.avatar_url} size="sm" />
                <div>
                  <p className="font-medium text-white">{u.full_name}</p>
                  <p className="text-xs text-gray-400">{u.email}</p>
                </div>
              </div>
            ),
          },
          {
            key: 'department',
            label: 'Department',
            render: (u: StaffWithProfile) => (
              <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                u.department === 'Support + Marketing'
                  ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                  : u.department
                  ? 'bg-blue-500/10 text-blue-400 border border-blue-500/20'
                  : 'bg-gray-500/10 text-gray-500 border border-gray-500/20'
              }`}>
                {u.department || 'Unassigned'}
              </span>
            ),
          },
          {
            key: 'position',
            label: 'Position',
            render: (u: StaffWithProfile) => (
              <span className="text-gray-300 text-sm">{u.position || <span className="text-gray-600 italic">—</span>}</span>
            ),
          },
          {
            key: 'status',
            label: 'Status',
            render: (u) => <StatusBadge status={u.status} />,
          },
          {
            key: 'joined',
            label: 'Joined',
            render: (u) => (
              <span suppressHydrationWarning className="text-gray-400 text-sm">
                {u.created_at ? new Date(u.created_at).toLocaleDateString() : 'N/A'}
              </span>
            ),
          },
          {
            key: 'actions',
            label: 'Actions',
            render: (u: any) => (
              <div className="flex items-center justify-end gap-2">
                <button
                  title="Send Login Credentials via Email"
                  onClick={(e) => handleSendCredentials(e, u.id)}
                  disabled={sendingMailId === u.id}
                  className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-medium text-cyan-400 bg-cyan-500/10 hover:bg-cyan-500/20 border border-cyan-500/20 transition-colors disabled:opacity-50"
                >
                  {sendingMailId === u.id
                    ? <Loader2 className="w-3.5 h-3.5 animate-spin" />
                    : <Mail className="w-3.5 h-3.5" />}
                  {sendingMailId === u.id ? 'Sending...' : 'Send Mail'}
                </button>
              </div>
            ),
          },
        ]}
      />
    </div>
  );
}
