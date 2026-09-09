'use client';

import React, { useEffect, useState } from 'react';
import { PageHeader } from '@/components/ui/PageHeader';
import { Users, GraduationCap, Star, Briefcase, Activity, TrendingUp, Award, CheckCircle2, Clock, XCircle, Loader2 } from 'lucide-react';
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

  const StatCard = ({ title, value, icon: Icon, color, href }: any) => (
    <Link href={href || '#'} className="block group">
      <div
        className="p-5 rounded-2xl border transition-all duration-200 group-hover:scale-[1.02]"
        style={{
          background: 'rgba(17,24,39,0.6)',
          borderColor: 'rgba(255,255,255,0.08)',
          backdropFilter: 'blur(12px)',
        }}
      >
        <div className="flex items-center justify-between mb-3">
          <div className="p-2.5 rounded-xl" style={{ background: `${color}18` }}>
            <Icon className="w-5 h-5" style={{ color }} />
          </div>
          <TrendingUp className="w-3.5 h-3.5 text-gray-600 group-hover:text-gray-400 transition-colors" />
        </div>
        <p className="text-3xl font-bold text-white mb-1">
          {loading ? <span className="inline-block w-10 h-7 rounded bg-white/10 animate-pulse" /> : value}
        </p>
        <p className="text-xs text-gray-500 font-medium">{title}</p>
      </div>
    </Link>
  );

  return (
    <div>
      <PageHeader
        title="Admin Dashboard"
        description="Platform analytics, user stats and real-time activity."
      />

      {/* ── Stat Cards ─────────────────────────────────────────────── */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3 mb-8">
        <StatCard title="Total Users"      value={stats.total}   icon={Users}        color="#3b82f6" href="/admin/users" />
        <StatCard title="Interns"          value={stats.interns} icon={GraduationCap} color="#22d3ee" href="/admin/interns" />
        <StatCard title="Mentors"          value={stats.mentors} icon={Star}          color="#a78bfa" href="/admin/mentors" />
        <StatCard title="Staff"            value={stats.staff}   icon={Briefcase}    color="#34d399" href="/admin/staff" />
        <StatCard title="Active Accounts"  value={stats.active}  icon={Activity}     color="#10b981" />
      </div>

      {/* ── Charts Row 1 ───────────────────────────────────────────── */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mb-4">
        {/* Weekly Registrations takes 2/3 */}
        <div className="lg:col-span-2">
          <WeeklyRegistrationsChart data={stats.weeklyRegistrations} />
        </div>
        {/* Role Distribution takes 1/3 */}
        <div>
          <RoleDistributionChart data={stats.roleDistribution} />
        </div>
      </div>

      {/* ── Charts Row 2 ───────────────────────────────────────────── */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-8">
        <TrackDistributionChart data={stats.trackDistribution} />
        <TaskStatusChart data={stats.taskStats} />
      </div>

      {/* ── Pending Certificate Requests ────────────────────────────── */}
      {(certsLoading || pendingCerts.length > 0) && (
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-xl" style={{ background: 'rgba(245,158,11,0.1)', border: '1px solid rgba(245,158,11,0.2)' }}>
                <Award className="w-4 h-4 text-amber-400" />
              </div>
              <div>
                <h2 className="text-lg font-semibold text-white">Pending Certificate Requests</h2>
                <p className="text-xs text-gray-500">Interns awaiting certificate approval</p>
              </div>
              {pendingCerts.length > 0 && (
                <span className="px-2.5 py-0.5 rounded-full text-xs font-bold text-amber-400 bg-amber-400/10 border border-amber-400/20">
                  {pendingCerts.length}
                </span>
              )}
            </div>
            <Link href="/admin/certificates" className="text-sm font-medium text-cyan-400 hover:text-cyan-300">
              View All →
            </Link>
          </div>

          <div className="rounded-2xl border overflow-hidden" style={{ background: 'rgba(17,24,39,0.6)', borderColor: 'rgba(255,255,255,0.08)' }}>
            {certsLoading ? (
              <div className="py-10 flex items-center justify-center gap-2 text-gray-500">
                <Loader2 className="w-5 h-5 animate-spin" />
                <span className="text-sm">Loading requests...</span>
              </div>
            ) : (
              <div className="divide-y" style={{ borderColor: 'rgba(255,255,255,0.06)' }}>
                {pendingCerts.map(req => (
                  <div key={req.intern_id} className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 px-6 py-4 hover:bg-white/[0.02] transition-colors">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl flex items-center justify-center text-sm font-bold text-white shrink-0"
                        style={{ background: 'linear-gradient(135deg, rgba(245,158,11,0.3), rgba(245,158,11,0.1))', border: '1px solid rgba(245,158,11,0.2)' }}>
                        {req.full_name?.charAt(0).toUpperCase()}
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-white">{req.full_name}</p>
                        <p className="text-xs text-gray-500">{req.email} · {req.roll_number || 'No roll number'}</p>
                      </div>
                    </div>

                    <div className="flex items-center gap-3">
                      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-bold" style={{ background: 'rgba(245,158,11,0.1)', color: '#f59e0b', border: '1px solid rgba(245,158,11,0.25)' }}>
                        <Clock className="w-3 h-3" /> Pending
                      </span>
                      <span className="text-xs text-gray-500">{new Date(req.updated_at).toLocaleDateString('en-US', { day: 'numeric', month: 'short' })}</span>
                      <button
                        onClick={() => handleApproveCert(req.intern_id, req.full_name)}
                        disabled={!!processingId}
                        className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold text-white transition-all disabled:opacity-50"
                        style={{ background: 'linear-gradient(135deg, #10b981, #059669)', boxShadow: '0 0 12px rgba(16,185,129,0.3)' }}
                      >
                        {processingId === req.intern_id
                          ? <Loader2 className="w-3.5 h-3.5 animate-spin" />
                          : <CheckCircle2 className="w-3.5 h-3.5" />}
                        Approve
                      </button>
                      <Link href={`/admin/users/${req.intern_id}`}
                        className="px-3 py-2 rounded-xl text-xs font-medium text-gray-400 hover:text-white transition-colors"
                        style={{ border: '1px solid rgba(255,255,255,0.1)' }}>
                        View
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
      <div className="mb-8">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-white">Recent Registrations</h2>
          <Link href="/admin/users" className="text-sm font-medium text-cyan-400 hover:text-cyan-300">
            View All Users →
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
                    <p className="font-medium text-white">{u.full_name}</p>
                    <p className="text-xs text-gray-400">{u.email}</p>
                  </div>
                </div>
              ),
            },
            { key: 'role',    label: 'Role',    render: (u) => <RoleBadge role={u.role} /> },
            { key: 'status',  label: 'Status',  render: (u) => <StatusBadge status={u.status} /> },
            { key: 'created', label: 'Joined',  render: (u) => <span className="text-gray-400 text-sm">{new Date(u.created_at).toLocaleDateString()}</span> },
          ]}
        />
      </div>
    </div>
  );
}
