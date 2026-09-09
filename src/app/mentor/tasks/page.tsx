'use client';

import React, { useEffect, useState } from 'react';
import { PageHeader } from '@/components/ui/PageHeader';
import { tracks } from '@/lib/curriculum';
import {
  Plus, Pencil, Trash2, Loader2, Save, X,
  BookOpen, AlertCircle, Check
} from 'lucide-react';

interface Task {
  id: string;
  track_id: string;
  title: string;
  scope: string;
  criteria: string;
  week_number: number;
  mentor_id?: string;
  isDefault?: boolean;
}

const TRACKS = Object.values(tracks).map(t => ({ id: t.id, title: t.title }));
const EMPTY_FORM = { title: '', scope: '', criteria: '', week_number: 1 };

function TaskForm({
  initial,
  onSave,
  onCancel,
  saving,
}: {
  initial?: Partial<Task>;
  onSave: (data: typeof EMPTY_FORM) => void;
  onCancel: () => void;
  saving: boolean;
}) {
  const [form, setForm] = useState({ ...EMPTY_FORM, ...initial });

  return (
    <div className="rounded-2xl border border-white/10 bg-[#0f1724] p-6 space-y-4">
      <div className="grid grid-cols-1 gap-4">
        <div>
          <label className="block text-xs text-gray-400 font-semibold mb-1.5">Task Title <span className="text-red-400">*</span></label>
          <input
            value={form.title}
            onChange={e => setForm(f => ({ ...f, title: e.target.value }))}
            placeholder="e.g. Variables & Data Types"
            className="w-full h-10 px-4 rounded-xl text-sm text-white bg-white/5 border border-white/10 focus:ring-2 focus:ring-cyan-500 outline-none"
          />
        </div>
        <div>
          <label className="block text-xs text-gray-400 font-semibold mb-1.5">Scope <span className="text-red-400">*</span></label>
          <textarea
            value={form.scope}
            onChange={e => setForm(f => ({ ...f, scope: e.target.value }))}
            rows={2}
            placeholder="Brief description of what the student should build..."
            className="w-full px-4 py-2.5 rounded-xl text-sm text-white bg-white/5 border border-white/10 focus:ring-2 focus:ring-cyan-500 outline-none resize-none"
          />
        </div>
        <div>
          <label className="block text-xs text-gray-400 font-semibold mb-1.5">Acceptance Criteria <span className="text-red-400">*</span></label>
          <textarea
            value={form.criteria}
            onChange={e => setForm(f => ({ ...f, criteria: e.target.value }))}
            rows={3}
            placeholder="What must be included for the task to be approved..."
            className="w-full px-4 py-2.5 rounded-xl text-sm text-white bg-white/5 border border-white/10 focus:ring-2 focus:ring-cyan-500 outline-none resize-none"
          />
        </div>
        <div className="w-32">
          <label className="block text-xs text-gray-400 font-semibold mb-1.5">Week #</label>
          <input
            type="number"
            min={1}
            max={20}
            value={form.week_number}
            onChange={e => setForm(f => ({ ...f, week_number: parseInt(e.target.value) || 1 }))}
            className="w-full h-10 px-4 rounded-xl text-sm text-white bg-white/5 border border-white/10 focus:ring-2 focus:ring-cyan-500 outline-none"
          />
        </div>
      </div>
      <div className="flex items-center gap-3 pt-2">
        <button
          onClick={() => onSave(form)}
          disabled={saving || !form.title || !form.scope || !form.criteria}
          className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-bold text-slate-900 bg-cyan-400 hover:bg-cyan-300 disabled:opacity-50 transition-all"
        >
          {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
          Save Task
        </button>
        <button
          onClick={onCancel}
          className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-medium text-gray-400 hover:text-white transition-colors"
        >
          <X className="w-4 h-4" /> Cancel
        </button>
      </div>
    </div>
  );
}

function TaskRow({
  task,
  onEdit,
  onDelete,
  canEdit,
}: {
  task: Task;
  onEdit: () => void;
  onDelete: () => void;
  canEdit: boolean;
}) {
  return (
    <div className="flex items-start gap-4 p-4 rounded-xl border border-white/7 bg-white/2 hover:border-white/12 transition-all group">
      <div className="w-8 h-8 rounded-lg bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center text-cyan-400 text-xs font-bold shrink-0">
        {task.week_number}
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 flex-wrap">
          <p className="text-sm font-semibold text-white">{task.title}</p>
          {task.isDefault && (
            <span className="text-[10px] px-2 py-0.5 rounded-full bg-yellow-500/10 border border-yellow-500/20 text-yellow-400 font-mono">
              default
            </span>
          )}
        </div>
        <p className="text-xs text-gray-500 mt-1 leading-relaxed line-clamp-2">{task.scope}</p>
        <p className="text-xs text-gray-600 mt-0.5 leading-relaxed line-clamp-1 italic">{task.criteria}</p>
      </div>
      {canEdit && (
        <div className="flex items-center gap-1.5 shrink-0 opacity-0 group-hover:opacity-100 transition-opacity">
          <button
            onClick={onEdit}
            className="p-1.5 rounded-lg text-gray-500 hover:text-cyan-400 hover:bg-cyan-400/10 transition-all"
          >
            <Pencil className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={onDelete}
            className="p-1.5 rounded-lg text-gray-500 hover:text-red-400 hover:bg-red-400/10 transition-all"
          >
            <Trash2 className="w-3.5 h-3.5" />
          </button>
        </div>
      )}
      {!canEdit && (
        <div className="shrink-0 opacity-0 group-hover:opacity-100">
          <span className="text-[10px] text-gray-600 font-mono">read-only</span>
        </div>
      )}
    </div>
  );
}

export default function MentorTasksPage() {
  const [selectedTrack, setSelectedTrack] = useState(TRACKS[0].id);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [showAddForm, setShowAddForm] = useState(false);
  const [myId, setMyId] = useState<string | null>(null);
  const [toast, setToast] = useState<{ msg: string; ok: boolean } | null>(null);

  const showToast = (msg: string, ok = true) => {
    setToast({ msg, ok });
    setTimeout(() => setToast(null), 3000);
  };

  // Get my session ID for ownership checks
  useEffect(() => {
    fetch('/api/dashboard')
      .then(r => (r.ok ? r.json() : null))
      .then(d => {
        if (d?.user?.id) setMyId(d.user.id);
      })
      .catch(() => {});
  }, []);

  const fetchTasks = async (track: string) => {
    setLoading(true);
    try {
      const res = await fetch(`/api/mentor/tasks?track=${track}`);
      const data = await res.json().catch(() => ({}));
      setTasks(data.tasks || []);
    } catch {
      showToast('Failed to load tasks', false);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTasks(selectedTrack);
    setEditingId(null);
    setShowAddForm(false);
  }, [selectedTrack]);

  const handleAdd = async (form: typeof EMPTY_FORM) => {
    setSaving(true);
    try {
      const res = await fetch('/api/mentor/tasks', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...form, track_id: selectedTrack }),
      });
      if (!res.ok) {
        const errData = await res.json().catch(() => ({}));
        throw new Error(errData.error || 'Failed to add task');
      }
      showToast('Task added!');
      setShowAddForm(false);
      fetchTasks(selectedTrack);
    } catch (e: any) {
      showToast(e.message, false);
    } finally {
      setSaving(false);
    }
  };

  const handleEdit = async (taskId: string, form: typeof EMPTY_FORM) => {
    setSaving(true);
    try {
      const res = await fetch('/api/mentor/tasks', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ taskId, ...form }),
      });
      if (!res.ok) {
        const errData = await res.json().catch(() => ({}));
        throw new Error(errData.error || 'Failed to update task');
      }
      showToast('Task updated!');
      setEditingId(null);
      fetchTasks(selectedTrack);
    } catch (e: any) {
      showToast(e.message, false);
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (taskId: string) => {
    if (!confirm('Delete this task?')) return;
    try {
      const res = await fetch(`/api/mentor/tasks?taskId=${taskId}`, { method: 'DELETE' });
      if (!res.ok) {
        const errData = await res.json().catch(() => ({}));
        throw new Error(errData.error || 'Failed to delete task');
      }
      showToast('Task deleted');
      fetchTasks(selectedTrack);
    } catch (e: any) {
      showToast(e.message, false);
    }
  };

  const trackInfo = tracks[selectedTrack];

  return (
    <div className="space-y-6">
      <PageHeader
        title="Manage Tasks"
        description="Add and edit internship tasks for each track. You can only edit tasks you created."
      />

      {toast && (
        <div className={`fixed top-4 right-4 z-50 flex items-center gap-2 px-4 py-3 rounded-xl text-sm font-medium shadow-xl border ${toast.ok ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-300' : 'bg-red-500/10 border-red-500/30 text-red-300'}`}>
          {toast.ok ? <Check className="w-4 h-4" /> : <AlertCircle className="w-4 h-4" />}
          {toast.msg}
        </div>
      )}

      {/* Track selector */}
      <div className="flex flex-wrap gap-2">
        {TRACKS.map(t => (
          <button
            key={t.id}
            onClick={() => setSelectedTrack(t.id)}
            className={`px-4 py-2 rounded-xl text-xs font-semibold transition-all border ${
              selectedTrack === t.id
                ? 'bg-purple-400/10 border-purple-400/30 text-purple-300'
                : 'bg-white/3 border-white/8 text-gray-500 hover:text-white hover:border-white/15'
            }`}
          >
            {t.title.split(' ')[0]}
          </button>
        ))}
      </div>

      <div className="p-5 rounded-2xl border border-white/8 bg-[#0d1117] flex items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-purple-500/10 border border-purple-500/20 flex items-center justify-center">
            <BookOpen className="w-5 h-5 text-purple-400" />
          </div>
          <div>
            <p className="text-sm font-bold text-white">{trackInfo?.title}</p>
            <p className="text-xs text-gray-500 mt-0.5">{tasks.length} task{tasks.length !== 1 ? 's' : ''} defined</p>
          </div>
        </div>
        <button
          onClick={() => { setShowAddForm(true); setEditingId(null); }}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-bold text-white bg-purple-600 hover:bg-purple-500 transition-all shrink-0"
        >
          <Plus className="w-4 h-4" /> Add Task
        </button>
      </div>

      {showAddForm && (
        <TaskForm
          onSave={handleAdd}
          onCancel={() => setShowAddForm(false)}
          saving={saving}
        />
      )}

      {loading ? (
        <div className="py-16 text-center">
          <Loader2 className="w-8 h-8 animate-spin mx-auto text-purple-400" />
        </div>
      ) : tasks.length === 0 ? (
        <div className="py-16 text-center text-gray-500">
          <BookOpen className="w-10 h-10 mx-auto mb-3 opacity-30" />
          <p className="text-sm">No tasks yet for this track.</p>
        </div>
      ) : (
        <div className="space-y-2">
          {tasks.map(task => (
            editingId === task.id ? (
              <TaskForm
                key={task.id}
                initial={task}
                onSave={(form) => handleEdit(task.id, form)}
                onCancel={() => setEditingId(null)}
                saving={saving}
              />
            ) : (
              <TaskRow
                key={task.id}
                task={task}
                canEdit={!task.isDefault && (task.mentor_id === myId || !task.mentor_id)}
                onEdit={() => { setEditingId(task.id); setShowAddForm(false); }}
                onDelete={() => handleDelete(task.id)}
              />
            )
          ))}
        </div>
      )}
    </div>
  );
}
