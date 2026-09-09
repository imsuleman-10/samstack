'use client';

import React, { useEffect, useState } from 'react';
import { PageHeader } from '@/components/ui/PageHeader';
import {
  Users, GraduationCap, Star, Briefcase, Activity, TrendingUp,
  Award, CheckCircle2, Clock, Loader2, ArrowUpRight, ShieldCheck
} from 'lucide-react';
import { toast } from 'sonner';
import Link from 'next/link';
import { DataTable } from '@/components/ui/DataTable';
import { UserAvatar } from '@/components/ui/UserAvatar';
import { RoleBadge } from '@/components/ui/RoleBadge';
import { StatusBadge } from '@/components/ui/StatusBadge';
import type { PlatformUser } from '@/lib/firestore-schema';
import {
  WeeklyRegistrationsChart,
  RoleDistributionChart,
  TrackDistributionChart,
  TaskStatusChart,
} from './components/AnalyticsCharts';

interface StatsData {
  total: number;
  interns: number;
  mentors: number;
  staff: number;
  active: number;
  trackDistribution: { name: string; value: number }[];
  roleDistribution: { name: string; value: number; color: string }[];
  weeklyRegistrations: { week: string; users: number }[];
  taskStats: { name: string; value: number; color: string }[];
}

export default function AdminDashboardPage() {
  const [stats, setStats] = useState<StatsData>({
    total: 0, interns: 0, mentors: 0, staff: 0, active: 0,
    trackDistribution: [], roleDistribution: [], weeklyRegistrations: [], taskStats: [],
  });
  const [recentUsers, setRecentUsers] = useState<PlatformUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [pendingCerts, setPendingCerts] = useState<any[]>([]);
  const [certsLoading, setCertsLoading] = useState(true);
  const [processingId, setProcessingId] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    async function safeFetch(url: string, retries = 1): Promise<Response | null> {
      try {
        return await fetch(url);
      } catch {
        if (retries > 0 && !cancelled) {
          await new Promise(r => setTimeout(r, 800));
          return safeFetch(url, retries - 1);
        }
        return null;
      }
    }

    async function fetchData() {
      try {
        // Fetch independently so one failure doesn't block the other
        const [statsRes, usersRes] = await Promise.all([
          safeFetch('/api/admin/stats'),
          safeFetch('/api/admin/users?limit=10'),
        ]);

        if (cancelled) return;

        if (statsRes?.ok) {
          try {
            const statsData = await statsRes.json();
            if (!cancelled && statsData.total !== undefined) setStats(statsData);
          } catch { /* ignore parse error */ }
        }

        if (usersRes?.ok) {
          try {
            const usersData = await usersRes.json();
            if (!cancelled && usersData?.users) setRecentUsers(usersData.users);
          } catch { /* ignore parse error */ }
        }
      } catch (error) {
        if (!cancelled) console.error('Error fetching dashboard data:', error);
      } finally {
        if (!cancelled) setLoading(false);
      }
    }
    fetchData();
    return () => { cancelled = true; };
  }, []);

  // Fetch pending certificate requests
  useEffect(() => {
    async function fetchCerts() {
      try {
        const res = await fetch('/api/admin/certificates?status=pending');
        if (res.ok) {
          const data = await res.json();
          setPendingCerts(data.requests || []);
        }
      } catch (e) { /* silent */ }
      finally { setCertsLoading(false); }
    }
    fetchCerts();
  }, []);

  const handleApproveCert = async (internId: string, name: string) => {
    if (!confirm(`Approve certificate for ${name}?`)) return;
    setProcessingId(internId);
    try {
      const res = await fetch(`/api/admin/users/${internId}/certificate`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'approve' }),
      });
      const d = await res.json();
      if (!res.ok) throw new Error(d.error || 'Failed');
      toast.success(`✓ Certificate approved for ${name}`);
      setPendingCerts(prev => prev.filter(r => r.intern_id !== internId));
    } catch (err: any) {
      toast.error(err.message);
    } finally {
      setProcessingId(null);
    }
  };

  const StatCard = ({ title, value, icon: Icon, color, href, subtitle }: any) => (
    <Link href={href || '#'} className="block group">
      <div className="p-5 rounded-2xl bg-white dark:bg-zinc-900 border border-slate-200/80 dark:border-zinc-800 shadow-xs hover:shadow-md hover:border-slate-300 dark:hover:border-zinc-700 transition-all duration-200 flex flex-col justify-between h-full">
        <div className="flex items-center justify-between mb-3">
          <div
            className="w-10 h-10 rounded-xl flex items-center justify-center transition-transform group-hover:scale-105"
            style={{ background: `${color}15`, color }}
          >
            <Icon className="w-5 h-5" />
          </div>
          {href ? (
            <div className="w-6 h-6 rounded-lg flex items-center justify-center text-slate-400 group-hover:text-brand-600 dark:group-hover:text-brand-400 group-hover:bg-brand-500/10 transition-colors">
              <ArrowUpRight className="w-4 h-4" />
            </div>
          ) : (
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
          )}
        </div>
        <div>
          <p className="text-3xl font-black text-slate-900 dark:text-white tracking-tight mb-0.5">
            {loading ? <span className="inline-block w-12 h-8 rounded-lg bg-slate-200 dark:bg-zinc-800 animate-pulse" /> : value}
          </p>
          <p className="text-xs font-semibold text-slate-500 dark:text-zinc-400">{title}</p>
        </div>
      </div>
    </Link>
  );

  return (
    <div className="space-y-8 pb-10">
      <PageHeader
        title="Admin Console"
        description="Unified system analytics, user accounts, and real-time operations."
      />

      {/* ── Metric Stat Cards ───────────────────────────────────────── */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3.5 sm:gap-4">
        <StatCard title="Total Users"      value={stats.total}   icon={Users}        color="#0284c7" href="/admin/users" />
        <StatCard title="Active Interns"  value={stats.interns} icon={GraduationCap} color="#06b6d4" href="/admin/interns" />
        <StatCard title="Mentors"         value={stats.mentors} icon={Star}          color="#8b5cf6" href="/admin/mentors" />
        <StatCard title="Staff Members"   value={stats.staff}   icon={Briefcase}    color="#10b981" href="/admin/staff" />
        <StatCard title="Active Accounts" value={stats.active}  icon={Activity}     color="#16a34a" />
      </div>

      {/* ── Charts Row 1 ───────────────────────────────────────────── */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <div className="lg:col-span-2">
          <WeeklyRegistrationsChart data={stats.weeklyRegistrations} />
        </div>
        <div>
          <RoleDistributionChart data={stats.roleDistribution} />
        </div>
      </div>

      {/* ── Charts Row 2 ───────────────────────────────────────────── */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <TrackDistributionChart data={stats.trackDistribution} />
        <TaskStatusChart data={stats.taskStats} />
      </div>

      {/* ── Pending Certificate Requests ────────────────────────────── */}
      {(certsLoading || pendingCerts.length > 0) && (
        <div>
          <div className="flex items-center justify-between mb-3.5">
            <div className="flex items-center gap-2.5">
              <div className="p-2 rounded-xl bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20">
                <Award className="w-4 h-4" />
              </div>
              <div>
                <h2 className="text-base font-bold text-slate-900 dark:text-white">
                  Pending Certificate Requests
                </h2>
                <p className="text-xs text-slate-500 dark:text-zinc-400">
                  Interns awaiting administrative verification and issuance
                </p>
              </div>
              {pendingCerts.length > 0 && (
                <span className="ml-2 px-2.5 py-0.5 rounded-full text-xs font-bold text-amber-600 dark:text-amber-400 bg-amber-500/10 border border-amber-500/20">
                  {pendingCerts.length}
                </span>
              )}
            </div>
            <Link
              href="/admin/certificates"
              className="text-xs font-bold text-brand-600 dark:text-brand-400 hover:underline flex items-center gap-1"
            >
              View All Certificates →
            </Link>
          </div>

          <div className="rounded-2xl bg-white dark:bg-zinc-900 border border-slate-200/80 dark:border-zinc-800 shadow-xs overflow-hidden">
            {certsLoading ? (
              <div className="py-12 flex items-center justify-center gap-2 text-slate-400 dark:text-zinc-500">
                <Loader2 className="w-5 h-5 animate-spin text-brand-500" />
                <span className="text-xs font-medium">Loading pending requests...</span>
              </div>
            ) : (
              <div className="divide-y divide-slate-100 dark:divide-zinc-800/70">
                {pendingCerts.map(req => (
                  <div
                    key={req.intern_id}
                    className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 px-5 py-4 hover:bg-slate-50/60 dark:hover:bg-zinc-800/40 transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl flex items-center justify-center text-sm font-bold text-amber-700 dark:text-amber-300 bg-amber-500/15 border border-amber-500/25 shrink-0">
                        {req.full_name?.charAt(0).toUpperCase()}
                      </div>
                      <div>
                        <p className="text-sm font-bold text-slate-900 dark:text-white">{req.full_name}</p>
                        <p className="text-xs text-slate-500 dark:text-zinc-400">
                          {req.email} · <span className="font-mono text-[11px] font-semibold">{req.roll_number || 'No roll number'}</span>
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-3 self-end sm:self-center">
                      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-bold bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20">
                        <Clock className="w-3 h-3" /> Awaiting Review
                      </span>
                      <button
                        onClick={() => handleApproveCert(req.intern_id, req.full_name)}
                        disabled={!!processingId}
                        className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-500 transition-all shadow-xs disabled:opacity-50"
                      >
                        {processingId === req.intern_id ? (
                          <Loader2 className="w-3.5 h-3.5 animate-spin" />
                        ) : (
                          <CheckCircle2 className="w-3.5 h-3.5" />
                        )}
                        Approve
                      </button>
                      <Link
                        href={`/admin/users/${req.intern_id}`}
                        className="px-3 py-1.5 rounded-xl text-xs font-medium text-slate-600 dark:text-zinc-300 hover:text-slate-900 dark:hover:text-white border border-slate-200 dark:border-zinc-700 hover:bg-slate-100 dark:hover:bg-zinc-800 transition-colors"
                      >
                        Details
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* ── Recent Registrations Table ─────────────────────────────── */}
      <div>
        <div className="flex items-center justify-between mb-3.5">
          <div>
            <h2 className="text-base font-bold text-slate-900 dark:text-white">Recent Registrations</h2>
            <p className="text-xs text-slate-500 dark:text-zinc-400">Recently created user accounts across all roles</p>
          </div>
          <Link
            href="/admin/users"
            className="text-xs font-bold text-brand-600 dark:text-brand-400 hover:underline flex items-center gap-1"
          >
            All Accounts →
          </Link>
        </div>
        <DataTable
          data={recentUsers}
          isLoading={loading}
          keyExtractor={(u) => u.id}
          columns={[
            {
              key: 'user',
              label: 'User',
              render: (u) => (
                <div className="flex items-center gap-3">
                  <UserAvatar name={u.full_name} src={u.avatar_url} size="sm" />
                  <div>
                    <p className="font-bold text-slate-900 dark:text-white text-sm">{u.full_name}</p>
                    <p className="text-xs text-slate-500 dark:text-zinc-400">{u.email}</p>
                  </div>
                </div>
              ),
            },
            { key: 'role',    label: 'Role',    render: (u) => <RoleBadge role={u.role} /> },
            { key: 'status',  label: 'Status',  render: (u) => <StatusBadge status={u.status} /> },
            {
              key: 'created',
              label: 'Joined',
              render: (u) => (
                <span className="text-slate-500 dark:text-zinc-400 text-xs font-medium">
                  {new Date(u.created_at).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}
                </span>
              ),
            },
          ]}
        />
      </div>
    </div>
  );
}
