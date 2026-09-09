'use client';

import React, { useEffect, useState } from 'react';
import { PageHeader } from '@/components/ui/PageHeader';
import { Users, FileText, Bell, Loader2, Shield } from 'lucide-react';
import Link from 'next/link';
import type { PlatformUser } from '@/lib/firestore-schema';

const QuickLinkCard = ({ href, icon: Icon, title, desc, color }: { href: string; icon: any; title: string; desc: string; color: string }) => (
  <Link
    href={href}
    className="p-6 rounded-xl border block transition-all duration-300 hover:-translate-y-1 hover:shadow-lg group"
    style={{ background: 'rgba(17,24,39,0.5)', borderColor: 'rgba(255,255,255,0.08)' }}
  >
    <div className="w-12 h-12 rounded-xl flex items-center justify-center mb-4 transition-transform group-hover:scale-110" style={{ background: `${color}18` }}>
      <Icon className="w-6 h-6" style={{ color }} />
    </div>
    <h3 className="text-lg font-semibold text-white mb-1">{title}</h3>
    <p className="text-sm text-gray-400">{desc}</p>
  </Link>
);

const StatPill = ({ label, value, color }: { label: string; value: string | number; color: string }) => (
  <div className="flex flex-col items-center justify-center p-4 rounded-xl border" style={{ background: 'rgba(17,24,39,0.4)', borderColor: 'rgba(255,255,255,0.06)' }}>
    <span className="text-2xl font-bold" style={{ color }}>{value}</span>
    <span className="text-xs text-gray-500 mt-1">{label}</span>
  </div>
);

export default function StaffDashboardPage() {
  const [user, setUser] = useState<PlatformUser | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/profile')
      .then(r => (r.ok ? r.json() : null))
      .then(d => { if (d?.user) setUser(d.user); })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const greeting = () => {
    const h = new Date().getHours();
    if (h < 12) return 'Good morning';
    if (h < 18) return 'Good afternoon';
    return 'Good evening';
  };

  return (
    <div>
      <PageHeader
        title={loading ? 'Staff Dashboard' : `${greeting()}, ${user?.full_name?.split(' ')[0] ?? 'Staff'}!`}
        description="Your staff workspace — user directory and profile tools."
      />

      {/* Quick Stats */}
      {!loading && user && (
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
          <StatPill label="Role" value="Staff" color="#34d399" />
          <StatPill label="Status" value={user.status.charAt(0).toUpperCase() + user.status.slice(1)} color="#10b981" />
          <StatPill label="Member Since" value={new Date(user.created_at).toLocaleDateString('en-US', { month: 'short', year: 'numeric' })} color="#a78bfa" />
          <StatPill label="Skills" value={user.skills?.length ?? 0} color="#fbbf24" />
        </div>
      )}

      {loading && (
        <div className="flex items-center justify-center py-12 mb-8">
          <Loader2 className="w-6 h-6 animate-spin text-cyan-400" />
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <QuickLinkCard href="/admin/users"   icon={Users}    title="User Directory"  desc="Browse platform users and profiles."    color="#3b82f6" />
        <QuickLinkCard href="/profile"       icon={FileText} title="My Profile"      desc="Update your professional details."      color="#10b981" />
        <QuickLinkCard href="/notifications" icon={Bell}     title="Notifications"   desc="Check your latest updates."            color="#f59e0b" />
      </div>

      {!loading && user && !user.bio && (
        <div className="p-5 rounded-xl border border-amber-500/20 bg-amber-500/5 flex items-start gap-4">
          <Shield className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
          <div>
            <p className="text-sm font-semibold text-amber-300">Complete your profile</p>
            <p className="text-xs text-amber-400/70 mt-0.5">Add a bio, skills and social links to make yourself discoverable.</p>
            <Link href="/profile/edit" className="inline-block mt-2 text-xs font-bold text-amber-400 hover:text-amber-300 underline underline-offset-2">
              Edit Profile →
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}
