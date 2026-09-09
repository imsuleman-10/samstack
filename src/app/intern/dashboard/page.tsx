'use client';

import React, { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { PageHeader } from '@/components/ui/PageHeader';
import {
  Star, FileText, Award, Loader2, CheckCircle2,
  AlertCircle, ArrowRight, Lock, Trophy, CircleDashed, Clock,
  Send, Link as LinkIcon, Download, UserCircle, GraduationCap, Sparkles,
  Code2, Layers, CheckSquare, Lightbulb, ExternalLink, HelpCircle,
  MessageSquare, ChevronRight, ListChecks, ArrowUpRight,
} from 'lucide-react';
import Link from 'next/link';
import { tracks, getDetailedTask } from '@/lib/curriculum';
import type { Task, DetailedTask } from '@/lib/curriculum';
import { toast } from 'sonner';

// ─── Constants ──────────────────────────────────────────────────────────────
const TOTAL_TASKS = 5;
const REQUIRED_TASKS = 3;

// ─── Helpers ────────────────────────────────────────────────────────────────
function getProfileCompletionPercentage(user: any, intern: any) {
  if (!user) return 0;
  const hasAvatar = !!(user.avatar_url || user.image_url);
  const fields = [
    { done: !!user.full_name },
    { done: !!user.gender },
    { done: !!(user.age || user.date_of_birth) },
    { done: !!user.bio },
    { done: !!user.city },
    { done: Array.isArray(user.skills) && user.skills.length > 0 },
    { done: !!(user.social_links?.linkedin || user.social_links?.github || user.linkedin || user.github) },
    { done: !!(user.phone || user.phone_number) },
    { done: hasAvatar },
    { done: !!(intern?.track_selected || intern?.trackSelected || intern?.track || user?.track) },
    { done: !!intern?.university },
    { done: !!intern?.department },
    { done: !!intern?.semester },
  ];

  const done = fields.filter(f => f.done).length;
  return Math.round((done / fields.length) * 100);
}

function isProfileUnlockedForTasks(user: any, intern: any) {
  if (!user) return false;
  const pct = getProfileCompletionPercentage(user, intern);
  const hasAvatar = !!(user.avatar_url || user.image_url);
  return hasAvatar && pct >= 80;
}

// ─── QuickLinkCard ───────────────────────────────────────────────────────────
interface QuickLinkCardProps {
  href?: string;
  onClick?: () => void;
  icon: any;
  title: string;
  desc: string;
  color: string;
  locked?: boolean;
}

const QuickLinkCard = ({ href, onClick, icon: Icon, title, desc, color, locked }: QuickLinkCardProps) => {
  const content = (
    <div
      onClick={locked ? undefined : onClick}
      className={`p-6 rounded-xl border block transition-all duration-300 relative overflow-hidden group cursor-pointer ${
        locked ? 'opacity-70 cursor-not-allowed' : 'hover:-translate-y-1 hover:shadow-lg'
      }`}
      style={{ background: 'rgba(17,24,39,0.5)', borderColor: 'rgba(255,255,255,0.08)' }}
    >
      {locked && (
        <div className="absolute top-3 right-3 bg-yellow-500/10 border border-yellow-500/20 text-yellow-500 px-2 py-0.5 rounded-md text-[10px] font-bold uppercase tracking-wider flex items-center gap-1">
          <Lock className="w-2.5 h-2.5" /> Locked
        </div>
      )}
      <div className="w-12 h-12 rounded-xl flex items-center justify-center mb-4 transition-transform group-hover:scale-110" style={{ background: `${color}15` }}>
        <Icon className="w-6 h-6" style={{ color }} />
      </div>
      <h3 className="text-lg font-semibold text-white mb-2">{title}</h3>
      <p className="text-sm text-gray-400">{desc}</p>
    </div>
  );

  if (href && !locked) {
    return <Link href={href}>{content}</Link>;
  }
  return content;
};

// ─── Submit Task Tab Component ───────────────────────────────────────────────
function SubmitTasksTab({
  trackTasks,
  submissionsMap,
  trackKey,
  initialTaskId,
  onRefresh,
}: {
  trackTasks: Task[];
  submissionsMap: Record<string, any>;
  trackKey?: string;
  initialTaskId?: string | null;
  onRefresh: () => void;
}) {
  const [selectedTaskId, setSelectedTaskId] = useState<string>(initialTaskId || trackTasks[0]?.id || '');
  const [submissionLink, setSubmissionLink] = useState('');
  const [submissionNotes, setSubmissionNotes] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [activeTab, setActiveTab] = useState<'guide' | 'criteria' | 'deliverables' | 'tips'>('guide');

  // Sync if initialTaskId changes from outside
  useEffect(() => {
    if (initialTaskId && trackTasks.some(t => t.id === initialTaskId)) {
      setSelectedTaskId(initialTaskId);
    }
  }, [initialTaskId, trackTasks]);

  const selectedTaskIndex = trackTasks.findIndex(t => t.id === selectedTaskId);
  const selectedTask = trackTasks[selectedTaskIndex >= 0 ? selectedTaskIndex : 0] || trackTasks[0];
  const existingSubmission = selectedTask ? submissionsMap[selectedTask.id] : null;
  const detailedTask = selectedTask ? getDetailedTask(selectedTask, trackKey) : null;

  useEffect(() => {
    if (selectedTask) {
      const sub = submissionsMap[selectedTask.id];
      setSubmissionLink(sub?.submission_link || '');
      setSubmissionNotes(sub?.notes || '');
      setError('');
    }
  }, [selectedTaskId, submissionsMap]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedTask) return;
    if (!submissionLink.trim()) {
      setError('Please provide a valid submission link (GitHub, Figma, or Live Demo URL).');
      return;
    }
    if (!/^https?:\/\//i.test(submissionLink.trim())) {
      setError('Submission link must start with https:// or http://');
      return;
    }
    setSubmitting(true);
    setError('');
    try {
      const res = await fetch('/api/intern/tasks', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          taskId: selectedTask.id,
          title: selectedTask.title,
          submissionLink: submissionLink.trim(),
          notes: submissionNotes.trim(),
        }),
      });
      const json = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(json.error || 'Failed to submit task');
      toast.success(`Task ${selectedTask.id} submitted successfully!`);
      onRefresh();
    } catch (err: any) {
      setError(err.message);
      toast.error(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  if (!selectedTask || !detailedTask) {
    return (
      <div className="p-12 text-center text-gray-500 border rounded-2xl border-white/10 bg-slate-900/40">
        No tasks assigned to your track yet.
      </div>
    );
  }

  const completedCount = trackTasks.filter(t => submissionsMap[t.id]?.status === 'completed').length;
  const reviewingCount = trackTasks.filter(t => submissionsMap[t.id]?.status === 'reviewing').length;

  return (
    <div className="space-y-8">
      {/* Top Banner with Progress & Metrics */}
      <div className="p-6 sm:p-8 rounded-3xl border bg-gradient-to-br from-slate-900 via-slate-900/90 to-slate-950 border-white/10 shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-1.5">
            <div className="flex items-center gap-2.5">
              <span className="px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-cyan-500/10 text-cyan-400 border border-cyan-500/30">
                Practical Curriculum
              </span>
              <span className="text-xs text-gray-400 font-mono">
                {trackTasks.length} Assigned Mini Projects
              </span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
              Task Workstation & Guidelines
            </h2>
            <p className="text-xs sm:text-sm text-gray-400 max-w-2xl leading-relaxed">
              Follow the comprehensive step-by-step instructions, meet the acceptance criteria, and submit your public repository or project links for mentor review.
            </p>
          </div>

          <div className="flex items-center gap-3 shrink-0">
            <div className="p-3.5 rounded-2xl bg-slate-800/80 border border-white/10 text-center min-w-[90px]">
              <span className="text-lg font-extrabold text-emerald-400 block">{completedCount}</span>
              <span className="text-[10px] text-gray-400 uppercase font-semibold">Completed</span>
            </div>
            <div className="p-3.5 rounded-2xl bg-slate-800/80 border border-white/10 text-center min-w-[90px]">
              <span className="text-lg font-extrabold text-yellow-400 block">{reviewingCount}</span>
              <span className="text-[10px] text-gray-400 uppercase font-semibold">Reviewing</span>
            </div>
            <div className="p-3.5 rounded-2xl bg-slate-800/80 border border-white/10 text-center min-w-[90px]">
              <span className="text-lg font-extrabold text-cyan-400 block">{trackTasks.length - completedCount - reviewingCount}</span>
              <span className="text-[10px] text-gray-400 uppercase font-semibold">Pending</span>
            </div>
          </div>
        </div>
      </div>

      {/* Interactive Task Stepper / Switcher */}
      <div className="space-y-3">
        <div className="flex items-center justify-between text-xs font-semibold px-1">
          <span className="text-gray-300">Select Task to Work On:</span>
          <span className="text-cyan-400 font-mono">
            Active: Task #{selectedTaskIndex + 1} of {trackTasks.length} ({selectedTask.id})
          </span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
          {trackTasks.map((t, idx) => {
            const sub = submissionsMap[t.id];
            const isDone = sub?.status === 'completed';
            const isReviewing = sub?.status === 'reviewing';
            const isSelected = selectedTaskId === t.id;
            const det = getDetailedTask(t, trackKey);

            return (
              <button
                key={t.id}
                type="button"
                onClick={() => setSelectedTaskId(t.id)}
                className={`p-4 rounded-2xl border text-left transition-all duration-300 relative overflow-hidden flex flex-col justify-between gap-2.5 ${
                  isSelected
                    ? 'border-cyan-400 bg-cyan-500/15 shadow-lg shadow-cyan-500/20 ring-1 ring-cyan-400/50 -translate-y-0.5'
                    : 'border-white/10 bg-slate-900/60 hover:bg-slate-800/80 hover:border-white/20'
                }`}
              >
                <div className="flex items-center justify-between w-full">
                  <span className={`text-[11px] font-mono font-bold ${isSelected ? 'text-cyan-300' : 'text-gray-400'}`}>
                    Task #{idx + 1}
                  </span>
                  {isDone ? (
                    <span className="w-2 h-2 rounded-full bg-emerald-400 shadow-[0_0_8px_#34d399]" />
                  ) : isReviewing ? (
                    <span className="w-2 h-2 rounded-full bg-yellow-400 shadow-[0_0_8px_#facc15]" />
                  ) : (
                    <span className="w-2 h-2 rounded-full bg-gray-600" />
                  )}
                </div>

                <div>
                  <h4 className="text-xs font-bold text-white line-clamp-2 mb-0.5 leading-snug">
                    {t.title}
                  </h4>
                  <span className="text-[10px] text-gray-400 block font-mono">
                    {t.id} · {det.difficulty}
                  </span>
                </div>

                <div className="pt-1 text-[10px] font-semibold">
                  {isDone && <span className="text-emerald-400 flex items-center gap-1"><CheckCircle2 className="w-3 h-3" /> Approved</span>}
                  {isReviewing && <span className="text-yellow-400 flex items-center gap-1"><Clock className="w-3 h-3" /> In Review</span>}
                  {!isDone && !isReviewing && <span className="text-gray-500 flex items-center gap-1"><CircleDashed className="w-3 h-3" /> Pending</span>}
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Main Workspace Split: Detailed Guide + Submission Console */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left / Main Column: Task Deep Dive (8 Cols) */}
        <div className="lg:col-span-8 space-y-6">
          {/* Hero Task Information Card */}
          <div className="p-6 sm:p-8 rounded-3xl border bg-slate-900/70 border-white/10 shadow-xl space-y-6">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div className="flex items-center gap-2">
                <span className="px-3 py-1 rounded-xl text-xs font-mono font-bold bg-cyan-500/10 text-cyan-400 border border-cyan-500/30">
                  {selectedTask.id}
                </span>
                <span className="text-xs text-gray-400 font-semibold">
                  Task #{selectedTaskIndex + 1} of {trackTasks.length}
                </span>
              </div>

              <div className="flex items-center gap-2">
                <span className={`px-2.5 py-0.5 rounded-lg text-xs font-bold ${
                  detailedTask.difficulty === 'Beginner'
                    ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                    : detailedTask.difficulty === 'Intermediate'
                    ? 'bg-cyan-500/10 text-cyan-400 border border-cyan-500/20'
                    : 'bg-purple-500/10 text-purple-400 border border-purple-500/20'
                }`}>
                  {detailedTask.difficulty}
                </span>
                <span className="px-2.5 py-0.5 rounded-lg text-xs font-medium bg-slate-800 text-gray-300 border border-white/10 flex items-center gap-1">
                  <Clock className="w-3 h-3 text-cyan-400" /> {detailedTask.estimatedTime}
                </span>
              </div>
            </div>

            <div>
              <h3 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight mb-3">
                {selectedTask.title}
              </h3>
              
              {/* Skills tags */}
              <div className="flex flex-wrap items-center gap-1.5 mb-4">
                <span className="text-[11px] text-gray-500 font-semibold mr-1">Key Skills:</span>
                {detailedTask.skills.map(sk => (
                  <span
                    key={sk}
                    className="px-2.5 py-0.5 rounded-md text-[11px] font-semibold bg-white/5 text-gray-300 border border-white/10"
                  >
                    {sk}
                  </span>
                ))}
              </div>

              {/* Scope Box */}
              <div className="p-4 rounded-2xl bg-cyan-500/5 border border-cyan-500/20 space-y-1.5">
                <div className="flex items-center gap-2 text-cyan-400 font-bold text-xs uppercase tracking-wider">
                  <Lightbulb className="w-4 h-4" /> Project Objective & Scope
                </div>
                <p className="text-xs sm:text-sm text-gray-200 leading-relaxed">
                  {selectedTask.scope}
                </p>
              </div>
            </div>

            {/* Navigation tabs inside the task */}
            <div className="flex border-b border-white/10 gap-2 overflow-x-auto pb-1 text-xs">
              <button
                type="button"
                onClick={() => setActiveTab('guide')}
                className={`px-4 py-2 rounded-lg font-bold transition-all flex items-center gap-1.5 whitespace-nowrap ${
                  activeTab === 'guide'
                    ? 'bg-cyan-500/10 text-cyan-400 border border-cyan-500/30'
                    : 'text-gray-400 hover:text-white'
                }`}
              >
                <Code2 className="w-3.5 h-3.5" /> How-To Steps
              </button>
              <button
                type="button"
                onClick={() => setActiveTab('criteria')}
                className={`px-4 py-2 rounded-lg font-bold transition-all flex items-center gap-1.5 whitespace-nowrap ${
                  activeTab === 'criteria'
                    ? 'bg-cyan-500/10 text-cyan-400 border border-cyan-500/30'
                    : 'text-gray-400 hover:text-white'
                }`}
              >
                <ListChecks className="w-3.5 h-3.5" /> Acceptance Criteria
              </button>
              <button
                type="button"
                onClick={() => setActiveTab('deliverables')}
                className={`px-4 py-2 rounded-lg font-bold transition-all flex items-center gap-1.5 whitespace-nowrap ${
                  activeTab === 'deliverables'
                    ? 'bg-cyan-500/10 text-cyan-400 border border-cyan-500/30'
                    : 'text-gray-400 hover:text-white'
                }`}
              >
                <Layers className="w-3.5 h-3.5" /> Deliverables
              </button>
              <button
                type="button"
                onClick={() => setActiveTab('tips')}
                className={`px-4 py-2 rounded-lg font-bold transition-all flex items-center gap-1.5 whitespace-nowrap ${
                  activeTab === 'tips'
                    ? 'bg-cyan-500/10 text-cyan-400 border border-cyan-500/30'
                    : 'text-gray-400 hover:text-white'
                }`}
              >
                <Sparkles className="w-3.5 h-3.5" /> Pro Tips
              </button>
            </div>

            {/* TAB CONTENT */}
            {activeTab === 'guide' && (
              <div className="space-y-4">
                <h4 className="text-sm font-bold text-white flex items-center gap-2">
                  <Code2 className="w-4 h-4 text-cyan-400" /> Step-by-Step Implementation Workflow
                </h4>
                <div className="space-y-3.5">
                  {detailedTask.steps.map((st, idx) => (
                    <div
                      key={st.title}
                      className="p-4 rounded-2xl border border-white/10 bg-slate-800/40 hover:bg-slate-800/60 transition-all flex items-start gap-3.5"
                    >
                      <div className="w-7 h-7 rounded-xl bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 font-extrabold text-xs flex items-center justify-center shrink-0 mt-0.5">
                        {idx + 1}
                      </div>
                      <div className="space-y-1">
                        <h5 className="text-xs sm:text-sm font-bold text-white">
                          {st.title}
                        </h5>
                        <p className="text-xs text-gray-300 leading-relaxed">
                          {st.detail}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {activeTab === 'criteria' && (
              <div className="space-y-4">
                <h4 className="text-sm font-bold text-white flex items-center gap-2">
                  <ListChecks className="w-4 h-4 text-cyan-400" /> Evaluation Checklist
                </h4>
                <p className="text-xs text-gray-400">
                  Your mentor will inspect your submitted repository or link against the following requirements:
                </p>
                <div className="space-y-2.5">
                  <div className="p-4 rounded-2xl border border-white/10 bg-slate-800/40 flex items-start gap-3">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                    <div>
                      <span className="text-xs font-bold text-white block">Core Requirement</span>
                      <p className="text-xs text-gray-300 mt-0.5">{selectedTask.criteria}</p>
                    </div>
                  </div>
                  <div className="p-4 rounded-2xl border border-white/10 bg-slate-800/40 flex items-start gap-3">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                    <div>
                      <span className="text-xs font-bold text-white block">Code Quality & Clean Architecture</span>
                      <p className="text-xs text-gray-300 mt-0.5">Structured codebase, meaningful variable/function naming, proper indentation, and no dead code.</p>
                    </div>
                  </div>
                  <div className="p-4 rounded-2xl border border-white/10 bg-slate-800/40 flex items-start gap-3">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                    <div>
                      <span className="text-xs font-bold text-white block">Documentation in README</span>
                      <p className="text-xs text-gray-300 mt-0.5">Clear project description, setup commands, and screenshots of the finished work.</p>
                    </div>
                  </div>
                  <div className="p-4 rounded-2xl border border-white/10 bg-slate-800/40 flex items-start gap-3">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                    <div>
                      <span className="text-xs font-bold text-white block">Public Accessibility</span>
                      <p className="text-xs text-gray-300 mt-0.5">The repository or design file link opens without requiring private permissions.</p>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'deliverables' && (
              <div className="space-y-4">
                <h4 className="text-sm font-bold text-white flex items-center gap-2">
                  <Layers className="w-4 h-4 text-cyan-400" /> Required Deliverables
                </h4>
                <div className="space-y-2.5">
                  {detailedTask.deliverables.map((del, idx) => (
                    <div
                      key={idx}
                      className="p-3.5 rounded-xl border border-white/10 bg-slate-800/40 flex items-center gap-3 text-xs text-gray-200"
                    >
                      <span className="w-5 h-5 rounded-lg bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 flex items-center justify-center shrink-0 font-mono text-[10px]">
                        ✓
                      </span>
                      <span>{del}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {activeTab === 'tips' && (
              <div className="space-y-4">
                <h4 className="text-sm font-bold text-white flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-yellow-400" /> Mentor Pro Tips
                </h4>
                <div className="space-y-3">
                  {detailedTask.tips.map((tp, idx) => (
                    <div
                      key={idx}
                      className="p-4 rounded-2xl border border-yellow-500/20 bg-yellow-500/5 flex items-start gap-3 text-xs text-yellow-200/90 leading-relaxed"
                    >
                      <Lightbulb className="w-4 h-4 text-yellow-400 shrink-0 mt-0.5" />
                      <span>{tp}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Right Column: Submission & Review Console (4 Cols) */}
        <div className="lg:col-span-4 space-y-6">
          {/* Submission Status & Review Card */}
          <div className={`p-6 rounded-3xl border transition-all ${
            existingSubmission?.status === 'completed'
              ? 'bg-emerald-950/20 border-emerald-500/30'
              : existingSubmission?.status === 'reviewing'
              ? 'bg-yellow-950/20 border-yellow-500/30'
              : 'bg-slate-900/70 border-white/10'
          }`}>
            <div className="flex items-center justify-between mb-4">
              <span className="text-xs font-semibold text-gray-400">Current Status:</span>
              {existingSubmission?.status === 'completed' && (
                <span className="px-3 py-1 rounded-full text-xs font-bold text-emerald-300 bg-emerald-500/20 border border-emerald-500/40 flex items-center gap-1.5 shadow-[0_0_12px_rgba(16,185,129,0.3)]">
                  <CheckCircle2 className="w-3.5 h-3.5" /> Approved
                </span>
              )}
              {existingSubmission?.status === 'reviewing' && (
                <span className="px-3 py-1 rounded-full text-xs font-bold text-yellow-300 bg-yellow-500/20 border border-yellow-500/40 flex items-center gap-1.5">
                  <Clock className="w-3.5 h-3.5" /> Under Review
                </span>
              )}
              {(!existingSubmission || existingSubmission.status === 'not_started') && (
                <span className="px-3 py-1 rounded-full text-xs font-bold text-gray-400 bg-gray-500/10 border border-gray-500/20 flex items-center gap-1.5">
                  <CircleDashed className="w-3.5 h-3.5" /> Not Submitted
                </span>
              )}
            </div>

            {existingSubmission?.submission_link && (
              <div className="space-y-2 pt-2 border-t border-white/10">
                <span className="text-[11px] text-gray-400 block font-semibold">Submitted Link:</span>
                <a
                  href={existingSubmission.submission_link}
                  target="_blank"
                  rel="noreferrer"
                  className="p-3 rounded-xl bg-slate-800/90 border border-white/15 text-xs text-cyan-400 hover:text-cyan-300 flex items-center justify-between gap-2 break-all group transition-colors"
                >
                  <span className="truncate">{existingSubmission.submission_link}</span>
                  <ExternalLink className="w-3.5 h-3.5 shrink-0 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                </a>
              </div>
            )}

            {existingSubmission?.mentor_feedback && (
              <div className="mt-4 p-4 rounded-2xl bg-blue-500/10 border border-blue-500/30 space-y-1.5">
                <div className="flex items-center gap-1.5 text-blue-400 text-xs font-bold">
                  <MessageSquare className="w-3.5 h-3.5" /> Mentor Feedback:
                </div>
                <p className="text-xs text-blue-200 leading-relaxed italic">
                  "{existingSubmission.mentor_feedback}"
                </p>
              </div>
            )}
          </div>

          {/* Submission Form */}
          <div className="p-6 sm:p-7 rounded-3xl border bg-slate-900/70 border-white/10 shadow-xl space-y-5">
            <div>
              <h4 className="text-lg font-bold text-white mb-1">
                {existingSubmission ? 'Update Your Submission' : 'Submit Project Work'}
              </h4>
              <p className="text-xs text-gray-400">
                Provide your public GitHub repository, Figma link, or live deployment URL.
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-1.5">
                <label className="block text-xs font-semibold text-gray-300">
                  Project Link (GitHub / Figma / Live Demo) *
                </label>
                <div className="relative">
                  <LinkIcon className="w-4 h-4 text-gray-400 absolute left-3.5 top-3.5" />
                  <input
                    type="url"
                    value={submissionLink}
                    onChange={e => {
                      setSubmissionLink(e.target.value);
                      if (error) setError('');
                    }}
                    placeholder="https://github.com/username/project-repo"
                    className="w-full h-11 pl-10 pr-3.5 rounded-xl text-xs text-white bg-slate-800/80 border border-white/15 outline-none focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400/30 transition-all placeholder:text-gray-600"
                    required
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="block text-xs font-semibold text-gray-300">
                  Submission Notes / Comments (Optional)
                </label>
                <textarea
                  value={submissionNotes}
                  onChange={e => setSubmissionNotes(e.target.value)}
                  placeholder="Mention any extra features you built, frameworks used, or instructions for the mentor..."
                  rows={3}
                  className="w-full p-3 rounded-xl text-xs text-white bg-slate-800/80 border border-white/15 outline-none focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400/30 transition-all placeholder:text-gray-600 resize-none"
                />
              </div>

              {error && (
                <div className="p-3 rounded-xl bg-red-500/10 border border-red-500/30 text-xs text-red-400 flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  <span>{error}</span>
                </div>
              )}

              <button
                type="submit"
                disabled={submitting}
                className="w-full py-3 rounded-xl font-bold text-xs sm:text-sm text-slate-900 bg-cyan-400 hover:bg-cyan-300 transition-all shadow-lg shadow-cyan-400/20 disabled:opacity-50 flex items-center justify-center gap-2"
              >
                {submitting ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
                {existingSubmission ? 'Save & Update Work' : `Submit Task #${selectedTaskIndex + 1}`}
              </button>
            </form>

            <div className="pt-3 border-t border-white/10 space-y-1.5 text-[11px] text-gray-400">
              <span className="font-semibold text-gray-300 block">Pre-Submission Quality Checklist:</span>
              <div className="space-y-1">
                <div className="flex items-center gap-1.5 text-gray-400">
                  <CheckCircle2 className="w-3 h-3 text-emerald-400 shrink-0" />
                  <span>Repository is set to Public</span>
                </div>
                <div className="flex items-center gap-1.5 text-gray-400">
                  <CheckCircle2 className="w-3 h-3 text-emerald-400 shrink-0" />
                  <span>README.md includes screenshots</span>
                </div>
                <div className="flex items-center gap-1.5 text-gray-400">
                  <CheckCircle2 className="w-3 h-3 text-emerald-400 shrink-0" />
                  <span>Tested locally and working without errors</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── Track Selection Component ─────────────────────────────────────────────
function SelectTrackCard({ onSave }: { onSave: (track: string) => void }) {
  const [selectedTrack, setSelectedTrack] = useState('WEB_DEV');
  const [gender, setGender] = useState('Male');
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  const handleSelectTrack = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError('');
    try {
      const res = await fetch('/api/intern/select-track', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ track: selectedTrack, gender }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(data.error || 'Failed to select track');

      if (typeof window !== 'undefined') {
        localStorage.setItem('samstack_selected_track', selectedTrack);
      }

      toast.success('Track assigned successfully!');
      onSave(selectedTrack);
    } catch (err: any) {
      setError(err.message);
      toast.error(err.message);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="p-8 rounded-2xl border bg-gradient-to-r from-cyan-950/60 via-slate-900 to-indigo-950/60 border-cyan-500/40 shadow-xl space-y-6">
      <div className="flex items-start gap-4">
        <div className="w-12 h-12 rounded-2xl bg-cyan-500/20 border border-cyan-500/30 flex items-center justify-center shrink-0">
          <Trophy className="w-6 h-6 text-cyan-400" />
        </div>
        <div>
          <h3 className="text-2xl font-extrabold text-white tracking-tight">Select Your Internship Track</h3>
          <p className="text-xs text-cyan-200/80 mt-1">
            Choose your specialization track to unlock your mini-projects, offer letter, and certificate pathway.
          </p>
        </div>
      </div>

      <form onSubmit={handleSelectTrack} className="space-y-5">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-bold text-gray-300 uppercase tracking-wider mb-2">Specialization Track *</label>
            <select
              value={selectedTrack}
              onChange={e => setSelectedTrack(e.target.value)}
              className="w-full bg-slate-900/80 border border-cyan-500/30 rounded-xl px-4 py-3 text-sm font-semibold text-white focus:outline-none focus:border-cyan-400"
              required
            >
              <option value="WEB_DEV">Web Development Basics (HTML/CSS/JS)</option>
              <option value="REACT">React.js Basics</option>
              <option value="PYTHON">Python Development Basics</option>
              <option value="CPP">C++ Programming Basics</option>
              <option value="UI_UX">Basic UI/UX Design</option>
              <option value="NEXT_JS">Next.js Fundamentals</option>
              <option value="MERN">MERN Stack Introduction</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-bold text-gray-300 uppercase tracking-wider mb-2">Gender *</label>
            <select
              value={gender}
              onChange={e => setGender(e.target.value)}
              className="w-full bg-slate-900/80 border border-cyan-500/30 rounded-xl px-4 py-3 text-sm font-semibold text-white focus:outline-none focus:border-cyan-400"
              required
            >
              <option value="Male">Male</option>
              <option value="Female">Female</option>
            </select>
          </div>
        </div>

        {error && <p className="text-xs text-red-400 font-semibold">{error}</p>}

        <button
          type="submit"
          disabled={saving}
          className="px-8 py-3.5 rounded-xl font-bold text-sm text-slate-900 bg-cyan-400 hover:bg-cyan-300 transition-all shadow-lg shadow-cyan-400/30 flex items-center justify-center gap-2"
        >
          {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <CheckCircle2 className="w-4 h-4" />}
          Confirm & Save Track
        </button>
      </form>
    </div>
  );
}

// ─── Documents Tab Component ────────────────────────────────────────────────
function DocumentsTab({ completedCount = 0 }: { completedCount?: number }) {
  const [loadingType, setLoadingType] = useState<string | null>(null);
  const [profile, setProfile] = useState<any>(null);
  const [profileLoading, setProfileLoading] = useState(true);
  const [applying, setApplying] = useState(false);

  const reloadProfile = async () => {
    try {
      const res = await fetch('/api/profile');
      if (res.ok) {
        const data = await res.json().catch(() => ({}));
        setProfile(data.internProfile || {});
      }
    } catch (e) {
      console.error(e);
    } finally {
      setProfileLoading(false);
    }
  };

  useEffect(() => {
    reloadProfile();
  }, []);

  const handleDownload = async (type: string) => {
    setLoadingType(type);
    try {
      const endpoint = type === 'offer_letter' ? '/api/user/documents/offer-letter' : '/api/user/documents/certificate';
      const res = await fetch(endpoint);
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.error || 'Failed to download document');
      }
      const blob = await res.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${type}.pdf`;
      document.body.appendChild(a);
      a.click();
      a.remove();
      window.URL.revokeObjectURL(url);
      toast.success('Document downloaded successfully');
    } catch (err: any) {
      toast.error(err.message);
    } finally {
      setLoadingType(null);
    }
  };

  const handleApplyCertificate = async () => {
    setApplying(true);
    try {
      const res = await fetch('/api/intern/documents/apply', { method: 'POST' });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(data.error || 'Failed to apply');
      toast.success('Certificate requested successfully. An admin or mentor will review it.');
      setProfile((prev: any) => ({ ...prev, certificate_status: 'pending' }));
    } catch (err: any) {
      toast.error(err.message);
    } finally {
      setApplying(false);
    }
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {/* Offer Letter */}
      <div className="p-8 rounded-2xl border bg-slate-900/50 border-white/10 flex flex-col justify-between space-y-6">
        <div className="space-y-4">
          <div className="w-14 h-14 rounded-2xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center">
            <FileText className="w-7 h-7 text-blue-400" />
          </div>
          <h3 className="text-xl font-bold text-white">Offer Letter</h3>
          <p className="text-xs text-gray-400 leading-relaxed">
            Download your official Internship Offer Letter with roll number, track details, and terms.
          </p>
        </div>
        <button
          onClick={() => handleDownload('offer_letter')}
          disabled={!!loadingType}
          className="w-full py-3 rounded-xl text-xs font-bold text-white bg-blue-600 hover:bg-blue-500 transition-all disabled:opacity-50 flex items-center justify-center gap-2"
        >
          {loadingType === 'offer_letter' ? <Loader2 className="w-4 h-4 animate-spin" /> : <Download className="w-4 h-4" />}
          Download Offer Letter
        </button>
      </div>

      {/* Certificate */}
      <div className="p-8 rounded-2xl border bg-slate-900/50 border-white/10 flex flex-col justify-between space-y-6">
        <div className="space-y-4">
          <div className="w-14 h-14 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center">
            <Award className="w-7 h-7 text-emerald-400" />
          </div>
          <h3 className="text-xl font-bold text-white">Certificate of Completion</h3>
          <p className="text-xs text-gray-400 leading-relaxed">
            {profile?.certificate_status === 'approved' || profile?.certificate_status === 'issued'
              ? 'Your certificate is approved! Download it now.'
              : profile?.certificate_status === 'pending'
              ? 'Your certificate application is currently pending review by your mentor or admin.'
              : `Complete at least 3 mini projects to apply for your official certificate. (${completedCount}/3 tasks completed)`}
          </p>
        </div>

        <div>
          {(!profile?.certificate_status || profile?.certificate_status === 'rejected') && (
            <button
              onClick={handleApplyCertificate}
              disabled={applying || profileLoading}
              className="w-full py-3 rounded-xl text-xs font-bold text-slate-900 bg-amber-400 hover:bg-amber-300 transition-all disabled:opacity-50 flex items-center justify-center gap-2"
            >
              {applying ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
              Apply for Certificate (3 Tasks Required)
            </button>
          )}

          {profile?.certificate_status === 'pending' && (
            <div className="w-full py-3 rounded-xl text-xs font-bold text-amber-400 border border-amber-500/30 bg-amber-500/10 flex items-center justify-center gap-2">
              <Loader2 className="w-4 h-4 animate-spin" /> Application Under Review
            </div>
          )}

          {(profile?.certificate_status === 'approved' || profile?.certificate_status === 'issued') && (
            <button
              onClick={() => handleDownload('certificate')}
              disabled={!!loadingType}
              className="w-full py-3 rounded-xl text-xs font-bold text-slate-900 bg-emerald-400 hover:bg-emerald-300 transition-all disabled:opacity-50 flex items-center justify-center gap-2"
            >
              {loadingType === 'certificate' ? <Loader2 className="w-4 h-4 animate-spin" /> : <Download className="w-4 h-4" />}
              Download Certificate
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

// ─── Main Intern Dashboard Component ─────────────────────────────────────────
function InternDashboardContent() {
  const searchParams = useSearchParams();
  const tabFromUrl = searchParams.get('tab') as 'dashboard' | 'submit_task' | 'documents' | null;
  const [activeTab, setActiveTab] = useState<'dashboard' | 'submit_task' | 'documents'>(tabFromUrl || 'dashboard');
  const [targetTaskId, setTargetTaskId] = useState<string | null>(null);
  const [profileData, setProfileData] = useState<any>(null);
  const [taskTrack, setTaskTrack] = useState<string | null>(null);
  const [taskList, setTaskList] = useState<Task[]>([]);
  const [submissionsMap, setSubmissionsMap] = useState<Record<string, any>>({});
  const [loading, setLoading] = useState(true);
  const [persistedTrack, setPersistedTrack] = useState<string | null>(null);

  // Read localStorage after mount to avoid SSR hydration mismatch
  useEffect(() => {
    try {
      const stored = localStorage.getItem('samstack_selected_track');
      if (stored) setPersistedTrack(stored);
    } catch { /* ignore */ }
  }, []);

  // Sync tab from URL query param changes (sidebar clicks)
  useEffect(() => {
    if (tabFromUrl && ['dashboard', 'submit_task', 'documents'].includes(tabFromUrl)) {
      setActiveTab(tabFromUrl);
    }
  }, [tabFromUrl]);

  const fetchTasks = async (isMounted?: () => boolean) => {
    try {
      const tasksRes = await fetch('/api/intern/tasks');
      if (!tasksRes.ok) return;
      const text = await tasksRes.text();
      const tasksJson = text
        ? (() => { try { return JSON.parse(text); } catch { return {}; } })()
        : {};
      if (isMounted && !isMounted()) return;
      setTaskTrack(tasksJson.track || null);
      setSubmissionsMap(tasksJson.submissionsMap || {});
      // Use tasks from API (may come from DB or static curriculum fallback)
      const apiTasks: Task[] = (tasksJson.tasks || []).map((t: any) => ({
        id: t.id,
        title: t.title || t.id,
        scope: t.scope || '',
        criteria: t.criteria || '',
      }));
      setTaskList(apiTasks);
    } catch {
      // ignore
    }
  };

  const loadData = async (isMounted?: () => boolean) => {
    const fetchProfileWithRetry = async (retries = 1): Promise<any> => {
      try {
        const profileRes = await fetch('/api/profile');
        if (!profileRes.ok) return null;
        return await profileRes.json().catch(() => null);
      } catch {
        if (retries > 0) {
          await new Promise((r) => setTimeout(r, 600));
          return fetchProfileWithRetry(retries - 1);
        }
        return null;
      }
    };

    try {
      const profileJson = await fetchProfileWithRetry();
      if (isMounted && !isMounted()) return;
      if (profileJson) {
        setProfileData(profileJson);
        const resolvedTrack =
          profileJson.internProfile?.track_selected ||
          profileJson.internProfile?.trackSelected ||
          profileJson.internProfile?.track ||
          profileJson.user?.track;
        if (resolvedTrack) {
          setPersistedTrack(resolvedTrack);
          if (typeof window !== 'undefined') {
            localStorage.setItem('samstack_selected_track', resolvedTrack);
          }
        }

        const unlocked = isProfileUnlockedForTasks(profileJson.user, profileJson.internProfile);
        if (unlocked) {
          await fetchTasks(isMounted);
        }
      }
    } catch {
      // Gracefully prevent unhandled exceptions
    } finally {
      if (!isMounted || isMounted()) setLoading(false);
    }
  };

  useEffect(() => {
    let mounted = true;
    const isMounted = () => mounted;
    loadData(isMounted);
    return () => { mounted = false; };
  }, []);

  const handleTrackSaved = (trackName: string) => {
    setPersistedTrack(trackName);
    if (typeof window !== 'undefined') {
      localStorage.setItem('samstack_selected_track', trackName);
    }
    setProfileData((prev: any) => {
      if (!prev) {
        return {
          user: { role: 'intern', track: trackName },
          internProfile: { track_selected: trackName, track: trackName },
        };
      }
      return {
        ...prev,
        user: { ...prev.user, role: 'intern', track: trackName },
        internProfile: {
          ...(prev.internProfile || {}),
          track_selected: trackName,
          track: trackName,
        },
      };
    });
    // Refresh task list & data
    loadData();
  };

  if (loading) {
    return (
      <div className="py-24 text-center text-gray-500">
        <Loader2 className="w-8 h-8 animate-spin mx-auto mb-4 text-cyan-400" />
        <p className="text-sm">Loading your intern workspace...</p>
      </div>
    );
  }

  const user = profileData?.user;
  const intern = profileData?.internProfile;
  const pct = getProfileCompletionPercentage(user, intern);
  const hasAvatar = !!(user?.avatar_url || user?.image_url);
  const hasTrack = Boolean(
    intern?.track_selected ||
    intern?.trackSelected ||
    intern?.track ||
    user?.track ||
    taskTrack ||
    persistedTrack
  );
  const isUnlocked = isProfileUnlockedForTasks(user, intern);

  // Use tasks from API response (DB tasks or static fallback) — NOT the raw static curriculum
  const trackTasks: Task[] = taskList;
  const trackTitle = taskTrack ? (tracks[taskTrack]?.title || taskTrack) : null;
  const completedCount = trackTasks.filter(t => submissionsMap[t.id]?.status === 'completed').length;
  const isRequirementMet = completedCount >= REQUIRED_TASKS;

  const checklist = profileData && user ? [
    { label: 'Profile Picture (Compulsory)', done: !!(user.avatar_url || user.image_url), compulsory: true },
    { label: 'Full Name', done: !!user.full_name },
    { label: 'Gender', done: !!user.gender },
    { label: 'Age', done: !!(user.age || user.date_of_birth) },
    { label: 'Bio / Intro', done: !!user.bio },
    { label: 'City', done: !!user.city },
    { label: 'Skills Added', done: Array.isArray(user.skills) && user.skills.length > 0 },
    { label: 'LinkedIn or GitHub', done: !!(user.social_links?.linkedin || user.social_links?.github || user.linkedin || user.github) },
    { label: 'Phone Number', done: !!(user.phone || user.phone_number) },
    { label: 'Internship Track', done: hasTrack },
    { label: 'University Name', done: !!intern?.university },
    { label: 'Academic Department', done: !!intern?.department },
    { label: 'Current Semester', done: !!intern?.semester },
  ] : [];

  const missingFields = checklist.filter(item => !item.done);
  const remainingPct = Math.max(0, 100 - pct);

  return (
    <div className="space-y-8">
      <PageHeader
        title="Intern Workspace"
        description="Access your dashboard, submit your mini-project tasks, and manage official documents."
      />

      {/* Track Selection prompt — only show after data loaded and no track found anywhere */}
      {!loading && !hasTrack && (
        <SelectTrackCard onSave={handleTrackSaved} />
      )}

      {/* Navigation Tabs */}
      <div className="flex border-b border-white/10 overflow-x-auto gap-2 pb-1">
        <button
          onClick={() => setActiveTab('dashboard')}
          className={`px-5 py-2.5 rounded-t-xl text-sm font-bold transition-all flex items-center gap-2 border-b-2 whitespace-nowrap ${
            activeTab === 'dashboard'
              ? 'border-cyan-400 text-cyan-400 bg-cyan-500/10'
              : 'border-transparent text-gray-400 hover:text-white hover:bg-white/5'
          }`}
        >
          <Trophy className="w-4 h-4" /> Dashboard Overview
        </button>

        <button
          onClick={() => setActiveTab('submit_task')}
          className={`px-5 py-2.5 rounded-t-xl text-sm font-bold transition-all flex items-center gap-2 border-b-2 whitespace-nowrap ${
            activeTab === 'submit_task'
              ? 'border-cyan-400 text-cyan-400 bg-cyan-500/10'
              : 'border-transparent text-gray-400 hover:text-white hover:bg-white/5'
          }`}
        >
          <FileText className="w-4 h-4" /> Submit Tasks
        </button>

        <button
          onClick={() => setActiveTab('documents')}
          className={`px-5 py-2.5 rounded-t-xl text-sm font-bold transition-all flex items-center gap-2 border-b-2 whitespace-nowrap ${
            activeTab === 'documents'
              ? 'border-cyan-400 text-cyan-400 bg-cyan-500/10'
              : 'border-transparent text-gray-400 hover:text-white hover:bg-white/5'
          }`}
        >
          <Award className="w-4 h-4" /> My Documents
        </button>
      </div>

      {/* TAB 1: DASHBOARD OVERVIEW */}
      {activeTab === 'dashboard' && (
        <div className="space-y-8">
          {/* Quick Action Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <QuickLinkCard href="/intern/mentor" icon={Star} title="My Mentor" desc="View assigned mentor and connect." color="#a78bfa" />
            <QuickLinkCard onClick={() => setActiveTab('submit_task')} icon={FileText} title="Submit Tasks" desc="Select task # and submit link." color="#06b6d4" locked={!isUnlocked} />
            <QuickLinkCard onClick={() => setActiveTab('documents')} icon={Award} title="My Documents" desc="Offer Letter & Certificate." color="#10b981" />
            <QuickLinkCard href="/intern/leaderboard" icon={Trophy} title="Leaderboard" desc="Check your global ranking." color="#f59e0b" />
            <QuickLinkCard href="/profile" icon={UserCircle} title="My Profile" desc="Update details & profile picture." color="#ec4899" />
          </div>

          {/* Condition: Tasks unlocked only if profile >= 80% AND profile image uploaded! */}
          {/* Condition: Tasks unlocked only if profile >= 80% AND profile image uploaded! */}
          {!isUnlocked ? (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2 p-8 rounded-2xl border bg-slate-900/60 border-yellow-500/30 space-y-6">
                <div className="flex items-center gap-3 text-yellow-400">
                  <AlertCircle className="w-7 h-7 shrink-0" />
                  <div>
                    <h3 className="text-xl font-bold text-white">Profile Requirements to Unlock Tasks</h3>
                    <p className="text-xs text-yellow-300/80">At least 80% completion + Profile Picture Compulsory</p>
                  </div>
                </div>

                <div className="p-4 rounded-xl bg-slate-800/80 border border-white/10 space-y-3 text-xs text-gray-300">
                  <div className="flex items-center justify-between">
                    <span>Overall Completion:</span>
                    <strong className={pct >= 80 ? 'text-emerald-400' : 'text-yellow-400'}>{pct}% ({remainingPct}% Remaining)</strong>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>Profile Picture (Image):</span>
                    <strong className={hasAvatar ? 'text-emerald-400' : 'text-red-400 font-bold'}>
                      {hasAvatar ? 'Uploaded ✓' : 'COMPULSORY - Missing ✕'}
                    </strong>
                  </div>

                  {missingFields.length > 0 && (
                    <div className="pt-2 border-t border-white/10 space-y-2">
                      <span className="font-semibold text-yellow-300 block">
                        Remaining Items ({remainingPct}% remaining to complete):
                      </span>
                      <div className="flex flex-wrap gap-1.5">
                        {missingFields.map(f => (
                          <span
                            key={f.label}
                            className={`px-2.5 py-1 rounded-md text-[11px] font-medium flex items-center gap-1 ${
                              f.compulsory
                                ? 'bg-red-500/20 text-red-300 border border-red-500/40 font-bold'
                                : 'bg-yellow-500/10 text-yellow-300 border border-yellow-500/20'
                            }`}
                          >
                            <span>✕</span> {f.label}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                <p className="text-xs text-gray-400 leading-relaxed">
                  To view and submit your mini-projects, please ensure your profile is at least 80% filled and that you have uploaded a profile picture.
                </p>

                <div>
                  <Link
                    href="/profile/edit"
                    className="inline-flex items-center gap-2 px-6 py-3 rounded-xl font-bold text-sm text-slate-900 bg-cyan-400 hover:bg-cyan-300 transition-all shadow-lg shadow-cyan-400/20"
                  >
                    Update Profile & Photo <ArrowRight className="w-4 h-4" />
                  </Link>
                </div>
              </div>

              {/* Checklist */}
              <div className="p-6 rounded-2xl border bg-slate-900/60 border-white/10 space-y-4">
                <div className="flex items-center justify-between border-b border-white/10 pb-3">
                  <div>
                    <span className="text-sm font-semibold text-white block">Profile Strength</span>
                    <span className="text-[11px] text-gray-400">{remainingPct > 0 ? `${remainingPct}% remaining` : '100% complete'}</span>
                  </div>
                  <span className="text-lg font-extrabold text-cyan-400">{pct}%</span>
                </div>
                <ul className="space-y-2">
                  {checklist.map(item => (
                    <li key={item.label} className="flex items-center gap-2.5 text-xs">
                      {item.done ? (
                        <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                      ) : (
                        <span className={`w-4 h-4 rounded-full border shrink-0 ${item.compulsory ? 'border-red-500' : 'border-gray-600'}`} />
                      )}
                      <span className={item.done ? 'text-gray-300' : item.compulsory ? 'text-red-400 font-bold' : 'text-yellow-300/90 font-medium'}>
                        {item.label} {!item.done && <span className="text-[10px] opacity-75">(Missing)</span>}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          ) : (
            /* Dashboard Tasks Summary when unlocked */
            <div className="space-y-6">
              {/* Profile completion breakdown bar if not 100% */}
              {pct < 100 ? (
                <div className="p-5 rounded-2xl border bg-slate-900/60 border-cyan-500/30 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <Sparkles className="w-5 h-5 text-cyan-400 shrink-0" />
                      <h4 className="text-sm font-bold text-white">
                        Profile is {pct}% Complete ({remainingPct}% remaining to reach 100%)
                      </h4>
                    </div>
                    <div className="flex flex-wrap gap-1.5 pt-0.5">
                      <span className="text-xs text-gray-400 mr-1 self-center">Remaining items:</span>
                      {missingFields.map(f => (
                        <span
                          key={f.label}
                          className="px-2.5 py-0.5 rounded-md text-[11px] font-semibold bg-yellow-500/10 text-yellow-300 border border-yellow-500/20 flex items-center gap-1"
                        >
                          <span className="w-1.5 h-1.5 rounded-full bg-yellow-400" />
                          {f.label}
                        </span>
                      ))}
                    </div>
                  </div>
                  <Link
                    href="/profile/edit"
                    className="px-4 py-2 rounded-xl text-xs font-bold text-slate-900 bg-cyan-400 hover:bg-cyan-300 transition-all shrink-0 flex items-center gap-1.5 shadow-lg shadow-cyan-400/20"
                  >
                    Fill Remaining Info <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              ) : (
                <div className="p-4 rounded-2xl border bg-emerald-950/30 border-emerald-500/30 flex items-center justify-between gap-4">
                  <div className="flex items-center gap-3 text-emerald-400">
                    <CheckCircle2 className="w-5 h-5 shrink-0" />
                    <span className="text-xs font-bold text-emerald-300">Profile 100% Complete! All profile details and photo are up to date.</span>
                  </div>
                  <Link href="/profile/edit" className="text-xs text-cyan-400 hover:underline font-semibold">Edit Profile</Link>
                </div>
              )}

              <div className="p-6 rounded-2xl border bg-slate-900/60 border-white/10 space-y-6">
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                  <div>
                    <h3 className="text-lg font-bold text-white">Assigned Mini Projects</h3>
                    <p className="text-xs text-gray-400">
                      {trackTitle || 'No track selected'} · Complete at least {REQUIRED_TASKS} of {TOTAL_TASKS} tasks
                    </p>
                  </div>
                  <button
                    onClick={() => setActiveTab('submit_task')}
                    className="px-5 py-2.5 rounded-xl font-bold text-xs text-slate-900 bg-cyan-400 hover:bg-cyan-300 transition-all flex items-center gap-2"
                  >
                    Go to Submit Tasks <ArrowRight className="w-4 h-4" />
                  </button>
                </div>

                {/* Progress bar */}
                <div className="w-full h-2.5 rounded-full bg-white/5">
                  <div
                    className="h-2.5 rounded-full transition-all duration-700"
                    style={{
                      width: `${Math.round((completedCount / TOTAL_TASKS) * 100)}%`,
                      background: isRequirementMet ? '#10b981' : '#06b6d4',
                    }}
                  />
                </div>

                {/* Tasks list preview - 1 task per row (full-width list), full title and full details */}
                <div className="flex flex-col space-y-3.5">
                  {trackTasks.map((t, idx) => {
                    const sub = submissionsMap[t.id];
                    const status = sub?.status || 'not_started';
                    const detailed = getDetailedTask(t, taskTrack || undefined);
                    return (
                      <div
                        key={t.id}
                        onClick={() => {
                          setTargetTaskId(t.id);
                          setActiveTab('submit_task');
                        }}
                        className="p-5 rounded-2xl border border-white/10 bg-slate-900/70 hover:bg-slate-800/80 hover:border-cyan-500/50 transition-all duration-300 cursor-pointer group flex flex-col md:flex-row md:items-center justify-between gap-4 shadow-sm hover:shadow-lg hover:shadow-cyan-950/20"
                      >
                        <div className="flex-1 space-y-2">
                          <div className="flex flex-wrap items-center gap-2">
                            <span className="text-xs font-mono text-cyan-400 font-bold px-2.5 py-0.5 rounded-md bg-cyan-500/10 border border-cyan-500/20">
                              Task #{idx + 1} · {t.id}
                            </span>
                            {detailed?.difficulty && (
                              <span className="text-[11px] font-medium text-gray-300 bg-white/5 border border-white/10 px-2 py-0.5 rounded-md">
                                {detailed.difficulty}
                              </span>
                            )}
                            {detailed?.estimatedTime && (
                              <span className="text-[11px] font-medium text-gray-300 bg-white/5 border border-white/10 px-2 py-0.5 rounded-md flex items-center gap-1">
                                <Clock className="w-3 h-3 text-cyan-400" /> {detailed.estimatedTime}
                              </span>
                            )}
                            {status === 'completed' && (
                              <span className="text-[11px] font-bold text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-2.5 py-0.5 rounded-full flex items-center gap-1">
                                <CheckCircle2 className="w-3.5 h-3.5" /> Done
                              </span>
                            )}
                            {status === 'reviewing' && (
                              <span className="text-[11px] font-bold text-yellow-400 bg-yellow-500/10 border border-yellow-500/20 px-2.5 py-0.5 rounded-full flex items-center gap-1">
                                <Clock className="w-3.5 h-3.5" /> Reviewing
                              </span>
                            )}
                            {status === 'not_started' && (
                              <span className="text-[11px] font-bold text-gray-400 bg-gray-500/10 border border-gray-500/20 px-2.5 py-0.5 rounded-full flex items-center gap-1">
                                <CircleDashed className="w-3.5 h-3.5" /> Pending
                              </span>
                            )}
                          </div>

                          {/* Full Title without truncation */}
                          <h4 className="text-base font-bold text-white group-hover:text-cyan-300 transition-colors leading-relaxed">
                            {t.title}
                          </h4>

                          {/* Full Scope / Description */}
                          {t.scope && (
                            <p className="text-xs text-gray-300 leading-relaxed max-w-4xl">
                              {t.scope}
                            </p>
                          )}
                        </div>

                        <div className="shrink-0 flex items-center gap-2 pt-2 md:pt-0 border-t md:border-t-0 border-white/5">
                          <span className="text-xs font-bold text-cyan-400 group-hover:text-cyan-300 px-4 py-2.5 rounded-xl bg-cyan-500/10 border border-cyan-500/20 group-hover:bg-cyan-500/20 transition-all flex items-center gap-1.5 whitespace-nowrap">
                            View Guide & Submit <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                          </span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* TAB 2: SUBMIT TASKS */}
      {activeTab === 'submit_task' && (
        !isUnlocked ? (
          <div className="p-8 rounded-2xl border bg-slate-900/60 border-yellow-500/30 text-center space-y-4 max-w-2xl mx-auto">
            <AlertCircle className="w-10 h-10 text-yellow-400 mx-auto" />
            <h3 className="text-xl font-bold text-white">Task Submission Locked</h3>
            <p className="text-xs text-gray-300">
              You must complete at least 80% of your profile and upload a profile picture before submitting tasks.
            </p>
            {missingFields.length > 0 && (
              <div className="p-4 rounded-xl bg-slate-800/80 border border-white/10 text-left space-y-2 text-xs">
                <span className="text-yellow-300 font-bold block">
                  Remaining Items to Unlock ({remainingPct}% to go):
                </span>
                <div className="flex flex-wrap gap-1.5">
                  {missingFields.map(f => (
                    <span
                      key={f.label}
                      className={`px-2.5 py-1 rounded-md text-[11px] font-semibold ${
                        f.compulsory
                          ? 'bg-red-500/20 text-red-300 border border-red-500/30'
                          : 'bg-yellow-500/10 text-yellow-300 border border-yellow-500/20'
                      }`}
                    >
                      ✕ {f.label}
                    </span>
                  ))}
                </div>
              </div>
            )}
            <Link
              href="/profile/edit"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl font-bold text-xs text-slate-900 bg-cyan-400 hover:bg-cyan-300 transition-all"
            >
              Update Profile <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        ) : (
          <SubmitTasksTab
            trackTasks={trackTasks}
            submissionsMap={submissionsMap}
            trackKey={taskTrack || undefined}
            initialTaskId={targetTaskId}
            onRefresh={() => fetchTasks()}
          />
        )
      )}

      {/* TAB 3: DOCUMENTS */}
      {activeTab === 'documents' && <DocumentsTab completedCount={completedCount} />}
    </div>
  );
}

export default function InternDashboardPage() {
  return (
    <React.Suspense fallback={
      <div className="py-24 text-center text-gray-500">
        <Loader2 className="w-8 h-8 animate-spin mx-auto mb-4 text-cyan-400" />
        <p className="text-sm">Loading your intern workspace...</p>
      </div>
    }>
      <InternDashboardContent />
    </React.Suspense>
  );
}
