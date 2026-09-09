'use client';

import React, { useEffect, useState } from 'react';
import { PageHeader } from '@/components/ui/PageHeader';
import { DataTable } from '@/components/ui/DataTable';
import { UserAvatar } from '@/components/ui/UserAvatar';
import { Loader2, Link as LinkIcon, Trash2, Edit3 } from 'lucide-react';
import { ConfirmDialog } from '@/components/ui/ConfirmDialog';
import type { PlatformUser, MentorAssignment } from '@/lib/firestore-schema';

type EnrichedAssignment = MentorAssignment & { intern: PlatformUser | null; mentor: PlatformUser | null };

export default function AdminMentorAssignmentsPage() {
  const [assignments, setAssignments] = useState<EnrichedAssignment[]>([]);
  const [interns, setInterns] = useState<PlatformUser[]>([]);
  const [mentors, setMentors] = useState<PlatformUser[]>([]);
  
  const [loading, setLoading] = useState(true);
  const [showAssignModal, setShowAssignModal] = useState(false);
  const [assignForm, setAssignForm] = useState({ intern_id: '', mentor_id: '' });
  const [submitting, setSubmitting] = useState(false);
  
  const [deleteId, setDeleteId] = useState<string | null>(null);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [assRes, internsRes, mentorsRes] = await Promise.all([
        fetch('/api/admin/mentor-assignments'),
        fetch('/api/admin/users?role=intern&limit=500'), // For a real app, use a searchable select component instead of limit=500
        fetch('/api/admin/users?role=mentor&limit=500'),
      ]);
      
      const [assData, internsData, mentorsData]: any[] = await Promise.all([
        assRes.ok ? assRes.json() : {},
        internsRes.ok ? internsRes.json() : {},
        mentorsRes.ok ? mentorsRes.json() : {}
      ]);
      
      setAssignments(assData?.assignments || []);
      setInterns(internsData?.users || []);
      setMentors(mentorsData?.users || []);
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleAssign = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const res = await fetch('/api/admin/mentor-assignments', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(assignForm),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to assign');
      setShowAssignModal(false);
      setAssignForm({ intern_id: '', mentor_id: '' });
      fetchData();
    } catch (err: any) {
      alert(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async () => {
    if (!deleteId) return;
    setSubmitting(true);
    try {
      const res = await fetch(`/api/admin/mentor-assignments/${deleteId}`, { method: 'DELETE' });
      if (!res.ok) throw new Error('Failed to remove assignment');
      fetchData();
    } catch (err: any) {
      alert(err.message);
    } finally {
      setSubmitting(false);
      setDeleteId(null);
    }
  };

  return (
    <div>
      <PageHeader
        title="Mentor Assignments"
        description="Manage intern and mentor relationships."
        action={
          <button
            onClick={() => setShowAssignModal(true)}
            className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold text-white bg-cyan-600 hover:bg-cyan-500 transition-colors"
          >
            <LinkIcon className="w-4 h-4" />
            New Assignment
          </button>
        }
      />

      <DataTable
        data={assignments}
        isLoading={loading}
        keyExtractor={(a) => a.id}
        columns={[
          {
            key: 'intern',
            label: 'Intern',
            render: (a) => a.intern ? (
              <div className="flex items-center gap-3">
                <UserAvatar name={a.intern.full_name} src={a.intern.avatar_url} size="sm" />
                <div>
                  <p className="font-bold text-slate-900 dark:text-white">{a.intern.full_name}</p>
                  <p className="text-xs text-slate-500 dark:text-zinc-400">{a.intern.email}</p>
                </div>
              </div>
            ) : <span className="text-rose-600 dark:text-red-400 font-medium">Unknown Intern</span>,
          },
          {
            key: 'mentor',
            label: 'Assigned Mentor',
            render: (a) => a.mentor ? (
              <div className="flex items-center gap-3">
                <UserAvatar name={a.mentor.full_name} src={a.mentor.avatar_url} size="sm" />
                <div>
                  <p className="font-bold text-slate-900 dark:text-white">{a.mentor.full_name}</p>
                  <p className="text-xs text-slate-500 dark:text-zinc-400">{a.mentor.email}</p>
                </div>
              </div>
            ) : <span className="text-rose-600 dark:text-red-400 font-medium">Unknown Mentor</span>,
          },
          {
            key: 'assigned_at',
            label: 'Assigned Date',
            render: (a) => <span className="text-slate-500 dark:text-zinc-400 font-medium text-sm">{new Date(a.assigned_at).toLocaleDateString()}</span>,
          },
          {
            key: 'actions',
            label: '',
            render: (a) => (
              <div className="flex justify-end gap-2">
                <button
                  onClick={() => { setAssignForm({ intern_id: a.intern_id, mentor_id: '' }); setShowAssignModal(true); }}
                  className="p-1.5 text-cyan-600 dark:text-cyan-400 hover:bg-cyan-50 dark:hover:bg-cyan-500/10 rounded-lg transition-colors"
                  title="Reassign"
                >
                  <Edit3 className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setDeleteId(a.id)}
                  className="p-1.5 text-rose-600 dark:text-red-400 hover:bg-rose-50 dark:hover:bg-red-500/10 rounded-lg transition-colors"
                  title="Remove Assignment"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ),
          },
        ]}
      />

      {/* Assign Modal */}
      {showAssignModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="w-full max-w-md rounded-2xl p-6 bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 shadow-2xl">
            <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-4">Assign Mentor</h3>
            <form onSubmit={handleAssign} className="space-y-4">
              <div>
                <label className="block text-sm font-semibold text-slate-700 dark:text-zinc-300 mb-1.5">Select Intern</label>
                <select
                  required
                  value={assignForm.intern_id}
                  onChange={e => setAssignForm({ ...assignForm, intern_id: e.target.value })}
                  className="w-full h-10 px-3 rounded-xl text-sm text-slate-900 dark:text-white bg-slate-50 dark:bg-zinc-800 border border-slate-200 dark:border-zinc-700 outline-none focus:ring-2 focus:ring-cyan-500"
                >
                  <option value="">-- Choose Intern --</option>
                  {interns.map(i => <option key={i.id} value={i.id}>{i.full_name}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-sm font-semibold text-slate-700 dark:text-zinc-300 mb-1.5">Select Mentor</label>
                <select
                  required
                  value={assignForm.mentor_id}
                  onChange={e => setAssignForm({ ...assignForm, mentor_id: e.target.value })}
                  className="w-full h-10 px-3 rounded-xl text-sm text-slate-900 dark:text-white bg-slate-50 dark:bg-zinc-800 border border-slate-200 dark:border-zinc-700 outline-none focus:ring-2 focus:ring-cyan-500"
                >
                  <option value="">-- Choose Mentor --</option>
                  {mentors.map(m => <option key={m.id} value={m.id}>{m.full_name}</option>)}
                </select>
              </div>
              <div className="flex justify-end gap-3 pt-4">
                <button type="button" onClick={() => setShowAssignModal(false)} className="px-4 py-2 text-sm font-medium text-slate-600 dark:text-zinc-400 hover:text-slate-900 dark:hover:text-white transition-colors">Cancel</button>
                <button type="submit" disabled={submitting} className="px-4 py-2 text-sm font-bold bg-cyan-600 hover:bg-cyan-500 text-white rounded-xl flex items-center gap-2 shadow-sm">
                  {submitting && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
                  Confirm Assignment
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <ConfirmDialog
        open={!!deleteId}
        title="Remove Assignment"
        description="Are you sure you want to remove this mentor assignment? The intern will no longer have a mentor."
        confirmLabel="Remove"
        danger
        loading={submitting}
        onConfirm={handleDelete}
        onCancel={() => setDeleteId(null)}
      />
    </div>
  );
}
