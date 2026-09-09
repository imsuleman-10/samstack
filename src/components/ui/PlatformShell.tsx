'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  Menu, ChevronRight, ExternalLink, Activity, ShieldCheck,
  Bell, LayoutDashboard, Sparkles, LogOut
} from 'lucide-react';
import type { UserRole } from '@/lib/firestore-schema';
import { AppSidebar } from '@/components/ui/Sidebar';
import { ThemeToggle } from '@/components/ui/ThemeToggle';
import { useNotifications } from '@/context/NotificationContext';

interface PlatformShellProps {
  children: React.ReactNode;
  role: UserRole;
  userName: string;
  userAvatar?: string | null;
}

const ROUTE_LABELS: Record<string, { parent: string; title: string }> = {
  '/admin': { parent: 'Admin Console', title: 'Dashboard Overview' },
  '/admin/users': { parent: 'Admin Console', title: 'User Management' },
  '/admin/interns': { parent: 'Admin Console', title: 'Intern Profiles & Directory' },
  '/admin/interns/create': { parent: 'Interns', title: 'Create Intern Profile' },
  '/admin/interns/certify': { parent: 'Interns', title: 'Instant Certification' },
  '/admin/mentors': { parent: 'Admin Console', title: 'Mentors Management' },
  '/admin/staff': { parent: 'Admin Console', title: 'Staff Team' },
  '/admin/mentor-assignments': { parent: 'Admin Console', title: 'Mentor Assignments' },
  '/admin/tasks': { parent: 'Admin Console', title: 'Tasks & Curriculum' },
  '/admin/certificates': { parent: 'Admin Console', title: 'Certificates & Verification' },
  '/admin/audit-logs': { parent: 'Admin Console', title: 'System Audit Logs' },
  '/admin/settings': { parent: 'Admin Console', title: 'Platform Settings' },
  '/mentor/dashboard': { parent: 'Mentor Hub', title: 'Dashboard' },
  '/mentor/interns': { parent: 'Mentor Hub', title: 'My Interns' },
  '/mentor/tasks': { parent: 'Mentor Hub', title: 'Tasks' },
  '/mentor/tools': { parent: 'Mentor Hub', title: 'Tools' },
  '/intern/dashboard': { parent: 'Intern Portal', title: 'Dashboard' },
  '/intern/mentor': { parent: 'Intern Portal', title: 'My Mentor' },
  '/intern/tasks': { parent: 'Intern Portal', title: 'My Tasks' },
  '/intern/documents': { parent: 'Intern Portal', title: 'Documents' },
  '/intern/leaderboard': { parent: 'Intern Portal', title: 'Leaderboard' },
  '/staff/dashboard': { parent: 'Staff Portal', title: 'Dashboard' },
  '/dashboard': { parent: 'User Portal', title: 'Dashboard' },
  '/community': { parent: 'Network', title: 'Community Feed' },
  '/notifications': { parent: 'Account', title: 'Notifications' },
  '/profile': { parent: 'Account', title: 'Profile Settings' },
};

export function PlatformShell({
  children,
  role,
  userName,
  userAvatar,
}: PlatformShellProps) {
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const pathname = usePathname();
  const { unreadCount } = useNotifications();

  // Determine breadcrumb labels
  const matchedRoute = ROUTE_LABELS[pathname] || {
    parent: role === 'admin' ? 'Admin Console' : 'Portal',
    title: pathname.split('/').filter(Boolean).pop()?.replace(/-/g, ' ') || 'Overview',
  };

  return (
    <div className="flex h-screen overflow-hidden bg-slate-50 dark:bg-zinc-950 text-slate-900 dark:text-zinc-100 transition-colors duration-200">
      {/* ── Sidebar Component ────────────────────────── */}
      <AppSidebar
        role={role}
        userName={userName}
        userAvatar={userAvatar}
        collapsed={collapsed}
        setCollapsed={setCollapsed}
        mobileOpen={mobileOpen}
        setMobileOpen={setMobileOpen}
      />

      {/* ── Main Content Area ────────────────────────── */}
      <div className="flex-1 flex flex-col min-w-0 h-full overflow-hidden">
        {/* ── Executive Topbar ───────────────────────── */}
        <header className="h-16 shrink-0 z-30 bg-white/80 dark:bg-zinc-900/80 backdrop-blur-md border-b border-slate-200/80 dark:border-zinc-800/80 px-4 sm:px-6 flex items-center justify-between gap-4 transition-colors duration-200 shadow-xs">
          {/* Left: Mobile Trigger & Breadcrumbs */}
          <div className="flex items-center gap-3 min-w-0">
            <button
              onClick={() => setMobileOpen(true)}
              className="lg:hidden p-2 rounded-xl text-slate-600 dark:text-zinc-300 hover:bg-slate-100 dark:hover:bg-zinc-800 hover:text-slate-900 dark:hover:text-white transition-colors"
              aria-label="Open sidebar"
            >
              <Menu className="w-5 h-5" />
            </button>

            {/* Breadcrumb path */}
            <div className="flex items-center gap-2 text-xs sm:text-sm overflow-hidden">
              <span className="font-semibold text-slate-500 dark:text-zinc-400 capitalize hidden sm:inline">
                {matchedRoute.parent}
              </span>
              <ChevronRight className="w-3.5 h-3.5 text-slate-400 dark:text-zinc-600 hidden sm:inline shrink-0" />
              <span className="font-bold text-slate-900 dark:text-white truncate capitalize">
                {matchedRoute.title}
              </span>
            </div>
          </div>

          {/* Right: Actions & User Meta */}
          <div className="flex items-center gap-2 sm:gap-3 shrink-0">
            {/* Live Operational Status */}
            <div className="hidden md:flex items-center gap-2 px-2.5 py-1 rounded-full text-[11px] font-medium bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
              </span>
              <span>System Online</span>
            </div>

            {/* View Live Site Shortcut */}
            <Link
              href="/"
              target="_blank"
              className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold text-slate-600 dark:text-zinc-300 hover:text-brand-600 dark:hover:text-brand-400 bg-slate-100 dark:bg-zinc-800/80 hover:bg-slate-200/70 dark:hover:bg-zinc-700/70 transition-all border border-slate-200/60 dark:border-zinc-700/60"
            >
              <Sparkles className="w-3.5 h-3.5 text-brand-500" />
              <span>Live Site</span>
              <ExternalLink className="w-3 h-3 opacity-60" />
            </Link>

            {/* Notifications Button */}
            <Link
              href="/notifications"
              className="relative p-2 rounded-xl text-slate-500 dark:text-zinc-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-zinc-800 transition-colors"
              title="Notifications"
            >
              <Bell className="w-4 h-4" />
              {unreadCount > 0 && (
                <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-brand-500 ring-2 ring-white dark:ring-zinc-900" />
              )}
            </Link>

            {/* Dark/Light Theme Toggle */}
            <ThemeToggle />

            {/* Topbar User Pill */}
            <div className="hidden sm:flex items-center gap-2 pl-2 border-l border-slate-200 dark:border-zinc-800">
              <div className="w-8 h-8 rounded-lg flex items-center justify-center text-xs font-bold text-white bg-gradient-to-br from-brand-600 to-brand-800 shadow-xs">
                {userAvatar ? (
                  <img src={userAvatar} className="w-full h-full rounded-lg object-cover" alt="" />
                ) : (
                  (userName || 'A').charAt(0).toUpperCase()
                )}
              </div>
            </div>
          </div>
        </header>

        {/* ── Scrollable Content Area ──────────────────── */}
        <main className="flex-1 overflow-y-auto bg-slate-50/70 dark:bg-zinc-950/70 transition-colors duration-200" style={{ scrollbarWidth: 'thin' }}>
          <div className="max-w-7xl mx-auto p-4 sm:p-6 lg:p-8 w-full animate-in fade-in duration-200">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}
