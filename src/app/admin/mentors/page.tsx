'use client';

import React, { useEffect, useState } from 'react';
import { PageHeader } from '@/components/ui/PageHeader';
import { DataTable } from '@/components/ui/DataTable';
import { UserAvatar } from '@/components/ui/UserAvatar';
import { StatusBadge } from '@/components/ui/StatusBadge';
import { useRouter } from 'next/navigation';
import type { RichMentor } from '@/lib/firestore-schema';

export default function AdminMentorsPage() {
  const router = useRouter();
  const [mentors, setMentors] = useState<RichMentor[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const fetchMentors = async (p = 1, s = '') => {
    setLoading(true);
    try {
      const url = new URL('/api/admin/users', window.location.origin);
      url.searchParams.set('role', 'mentor');
      url.searchParams.set('page', p.toString());
      if (s) url.searchParams.set('search', s);
      
      const res = await fetch(url);
      if (!res.ok) return;
      const data = await res.json();
      if (data.users) {
        setMentors(data.users);
        setTotalPages(data.pages);
        setPage(data.page);
      }
    } catch (error) {
      console.error('Error fetching mentors:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const timeoutId = setTimeout(() => fetchMentors(1, search), 300);
    return () => clearTimeout(timeoutId);
  }, [search]);

  return (
    <div>
      <PageHeader
        title="Mentors Management"
        description="View and manage all mentor profiles."
      />

      <DataTable
        data={mentors}
        isLoading={loading}
        keyExtractor={(m) => m.id}
        onRowClick={(m) => router.push(`/admin/users/${m.id}`)}
        searchValue={search}
        onSearchChange={setSearch}
        searchPlaceholder="Search mentors..."
        page={page}
        totalPages={totalPages}
        onPageChange={(p) => fetchMentors(p, search)}
        columns={[
          {
            key: 'user',
            label: 'Mentor',
            render: (m) => (
              <div className="flex items-center gap-3">
                <UserAvatar name={m.full_name} src={m.avatar_url} size="sm" />
                <div>
                  <p className="font-bold text-slate-900 dark:text-white">{m.full_name}</p>
                  <p className="text-xs text-slate-500 dark:text-zinc-400">{m.email}</p>
                </div>
              </div>
            ),
          },
          {
            key: 'status',
            label: 'Account Status',
            render: (m) => <StatusBadge status={m.status} />,
          },
          {
            key: 'joined',
            label: 'Joined',
            render: (m) => <span className="text-slate-500 dark:text-zinc-400 font-medium text-sm">{new Date(m.created_at).toLocaleDateString()}</span>,
          },
        ]}
      />
    </div>
  );
}
