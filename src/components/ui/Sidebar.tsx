'use client';

import React, { useState, createContext, useContext, useEffect, useRef } from 'react';
import Link from 'next/link';
import { usePathname, useSearchParams } from 'next/navigation';
import Image from 'next/image';
import {
  LayoutDashboard, Users, GraduationCap, Star, Briefcase,
  UserCircle, Link2, Bell, Settings, LogOut,
  ChevronLeft, ChevronRight, FileText, Users2, Award, Menu, X,
  TrendingUp, ShieldCheck, Activity, BookOpen, Trophy
} from 'lucide-react';
import type { UserRole } from '@/lib/firestore-schema';
import { ThemeToggle } from '@/components/ui/ThemeToggle';
import { useNotifications } from '@/context/NotificationContext';

// ─── Sidebar Context (share collapsed state) ─────────────────────────────────
const SidebarContext = createContext<{ collapsed: boolean; setCollapsed: (v: boolean) => void }>({
  collapsed: false,
  setCollapsed: () => {},
});
export const useSidebar = () => useContext(SidebarContext);

interface NavItem {
  label: string;
  href: string;
  icon: React.ElementType;
  badge?: number;
}

const NAV_BY_ROLE: Record<UserRole, NavItem[]> = {
  admin: [
    { label: 'Dashboard',   href: '/admin',                    icon: LayoutDashboard },
    { label: 'Users',       href: '/admin/users',              icon: Users },
    { label: 'Interns',     href: '/admin/interns',            icon: GraduationCap },
    { label: 'Mentors',     href: '/admin/mentors',            icon: Star },
    { label: 'Staff',       href: '/admin/staff',              icon: Briefcase },
    { label: 'Assignments', href: '/admin/mentor-assignments', icon: Link2 },
    { label: 'Tasks',       href: '/admin/tasks',              icon: BookOpen },
    { label: 'Certificates',href: '/admin/certificates',       icon: Award },
    { label: 'Audit Logs',  href: '/admin/audit-logs',         icon: FileText },
    { label: 'Settings',    href: '/admin/settings',           icon: Settings },
  ],
  mentor: [
    { label: 'Dashboard',        href: '/mentor/dashboard',  icon: LayoutDashboard },
    { label: 'My Interns',       href: '/mentor/interns',    icon: GraduationCap },
    { label: 'Manage Tasks',     href: '/mentor/tasks',      icon: BookOpen },
    { label: 'Certificates',     href: '/admin/certificates', icon: Award },
    { label: 'Intern Directory', href: '/interns',           icon: Users },
    { label: 'Tools',            href: '/mentor/tools',      icon: Award },
    { label: 'Profile',          href: '/profile',           icon: UserCircle },
    { label: 'Notifications',    href: '/notifications',     icon: Bell },
  ],
  intern: [
    { label: 'Dashboard',        href: '/intern/dashboard',                 icon: LayoutDashboard },
    { label: 'My Mentor',        href: '/intern/mentor',                    icon: Star },
    { label: 'Submit Tasks',     href: '/intern/dashboard?tab=submit_task', icon: FileText },
    { label: 'My Documents',     href: '/intern/dashboard?tab=documents',   icon: Award },
    { label: 'Leaderboard',      href: '/intern/leaderboard',               icon: Trophy },
    { label: 'Intern Directory', href: '/interns',                          icon: Users },
    { label: 'Profile',          href: '/profile',                          icon: UserCircle },
    { label: 'Notifications',    href: '/notifications',                    icon: Bell },
  ],
  staff: [
    { label: 'Dashboard',     href: '/staff/dashboard',  icon: LayoutDashboard },
    { label: 'Users',         href: '/admin/users',       icon: Users },
    { label: 'Tools',         href: '/staff/tools',       icon: Award },
    { label: 'Profile',       href: '/profile',           icon: UserCircle },
    { label: 'Notifications', href: '/notifications',     icon: Bell },
  ],
  member: [
    { label: 'Dashboard',     href: '/dashboard',         icon: LayoutDashboard },
    { label: 'Directory',     href: '/interns',           icon: Users },
    { label: 'Profile',       href: '/profile',           icon: UserCircle },
    { label: 'Notifications', href: '/notifications',     icon: Bell },
  ],
  user: [
    { label: 'Dashboard',        href: '/intern/dashboard',                 icon: LayoutDashboard },
    { label: 'My Mentor',        href: '/intern/mentor',                    icon: Star },
    { label: 'Submit Tasks',     href: '/intern/dashboard?tab=submit_task', icon: FileText },
    { label: 'My Documents',     href: '/intern/dashboard?tab=documents',   icon: Award },
    { label: 'Leaderboard',      href: '/intern/leaderboard',               icon: Trophy },
    { label: 'Profile',          href: '/profile',                          icon: UserCircle },
    { label: 'Notifications',    href: '/notifications',                    icon: Bell },
  ],
};

const ROLE_ACCENT: Record<UserRole, { color: string; bg: string; label: string }> = {
  admin:  { color: '#fbbf24', bg: 'rgba(251,191,36,0.1)',  label: 'Administrator' },
  mentor: { color: '#a78bfa', bg: 'rgba(167,139,250,0.1)', label: 'Mentor' },
  intern: { color: '#22d3ee', bg: 'rgba(34,211,238,0.1)',  label: 'Intern' },
  staff:  { color: '#34d399', bg: 'rgba(52,211,153,0.1)',  label: 'Staff Member' },
  member: { color: '#fb923c', bg: 'rgba(251,146,60,0.1)',  label: 'Member' },
  user:   { color: '#22d3ee', bg: 'rgba(34,211,238,0.1)',  label: 'Intern' },
};

interface AppSidebarProps {
  role: UserRole;
  userName: string;
  userAvatar?: string | null;
}

export function AppSidebar({ role, userName, userAvatar }: AppSidebarProps) {
  const { unreadCount } = useNotifications();
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  // Defer active-state to client only to avoid SSR/client hydration mismatch
  const [mounted, setMounted] = useState(false);
  const pathname = usePathname();
  const nav = NAV_BY_ROLE[role] ?? NAV_BY_ROLE.user;
  const accent = ROLE_ACCENT[role];

  useEffect(() => {
    setMounted(true);
  }, []);

  const handleLogout = async () => {
    await fetch('/api/auth/logout', { method: 'POST' });
    window.location.href = '/login';
  };

  const searchParams = useSearchParams();
  const isActive = (href: string): boolean => {
    if (!mounted) return false; // SSR: no active state — prevents hydration mismatch
    const [basePath, queryStr] = href.split('?');
    if (queryStr) {
      // Match both path AND query param (e.g. ?tab=submit_task)
      const hrefParams = new URLSearchParams(queryStr);
      const currentParams = searchParams;
      const pathMatches = pathname === basePath;
      const paramsMatch = Array.from(hrefParams.entries()).every(
        ([k, v]) => currentParams.get(k) === v
      );
      return pathMatches && paramsMatch;
    }
    // Exact match for dashboard roots, prefix match for sub-pages
    const dashboardRoots = ['/admin', '/dashboard', '/mentor/dashboard', '/intern/dashboard', '/staff/dashboard'];
    return dashboardRoots.includes(basePath)
      ? pathname === basePath
      : pathname.startsWith(basePath);
  };

  const renderSidebarContent = () => (
    <aside
      className="flex flex-col h-full bg-[var(--card)] border-r border-[var(--border)] transition-colors duration-300"
    >
      {/* ── Logo Header ─────────────────────────────── */}
      <div
        className="flex items-center shrink-0 h-16 px-4 border-b border-[var(--border)] transition-colors duration-300"
      >
        <button
          onClick={() => { setCollapsed(!collapsed); setMobileOpen(false); }}
          className="flex items-center gap-3 w-full group focus:outline-none"
          title="Toggle Sidebar"
        >
          <div className="w-9 h-9 rounded-xl overflow-hidden flex-shrink-0 relative flex items-center justify-center"
            style={{ background: accent.bg, border: `1px solid ${accent.color}30` }}>
            <img
              src="/logo.png"
              alt="SAMStack"
              className="w-8 h-8 object-contain"
              onError={(e) => {
                (e.target as HTMLImageElement).style.display = 'none';
              }}
            />
          </div>

          {!collapsed && (
            <div className="flex-1 text-left overflow-hidden">
              <p className="text-sm font-bold text-[var(--foreground)] tracking-tight leading-none">SAMStack</p>
              <p className="text-[10px] mt-0.5 font-medium" style={{ color: accent.color }}>Tech Platform</p>
            </div>
          )}

          <div
            className="w-7 h-7 rounded-lg flex items-center justify-center shrink-0 ml-auto transition-colors bg-[var(--border)]/30"
          >
            {collapsed
              ? <ChevronRight className="w-3.5 h-3.5 text-gray-500" />
              : <ChevronLeft className="w-3.5 h-3.5 text-gray-500" />}
          </div>
        </button>
      </div>

      {/* ── Navigation ──────────────────────────────── */}
      <nav className="flex-1 overflow-y-auto py-3 px-2 space-y-0.5" style={{ scrollbarWidth: 'none' }}>
        {nav.map(item => {
          const active = isActive(item.href);
          const Icon = item.icon;
          return (
            <Link
              key={item.href + item.label}
              href={item.href}
              onClick={() => setMobileOpen(false)}
              title={collapsed ? item.label : undefined}
              className="flex items-center gap-3 rounded-xl px-3 py-2.5 transition-all duration-200 group relative"
              suppressHydrationWarning
              style={{
                background: active ? accent.bg : 'transparent',
                color: active ? 'var(--foreground)' : 'var(--input-text)',
                borderLeft: active ? `3px solid ${accent.color}` : '3px solid transparent',
              }}
            >
              <Icon
                className="w-[18px] h-[18px] shrink-0 transition-colors"
                style={{ color: active ? accent.color : undefined }}
              />
              {!collapsed && (
                <span className="text-sm font-medium whitespace-nowrap">{item.label}</span>
              )}
              {!collapsed && item.badge && item.badge > 0 && (
                <span
                  className="ml-auto text-[10px] font-bold px-1.5 py-0.5 rounded-full"
                  style={{ background: accent.color, color: '#000' }}
                >
                  {item.badge}
                </span>
              )}
              {!collapsed && item.label === 'Notifications' && unreadCount > 0 && (
                <span
                  className="ml-auto text-[10px] font-bold px-1.5 py-0.5 rounded-full"
                  style={{ background: accent.color, color: '#000' }}
                >
                  {unreadCount > 99 ? '99+' : unreadCount}
                </span>
              )}
              {/* Tooltip when collapsed */}
              {collapsed && (
                <div
                  className="absolute left-14 bg-[var(--card)] text-[var(--foreground)] text-xs px-3 py-1.5 rounded-lg whitespace-nowrap opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity z-50 border border-[var(--border)] shadow-xl"
                >
                  {item.label}
                </div>
              )}
            </Link>
          );
        })}
      </nav>

      {/* ── User Footer ─────────────────────────────── */}
      <div className="shrink-0 p-2 border-t border-[var(--border)] transition-colors duration-300">
        <div
          className={`flex items-center gap-2.5 p-2 rounded-xl bg-[var(--border)]/20 ${collapsed ? 'justify-center' : ''}`}
        >
          {/* Avatar */}
          <div
            className="w-8 h-8 rounded-lg shrink-0 flex items-center justify-center text-xs font-bold text-white"
            style={{ background: `linear-gradient(135deg, ${accent.color}, ${accent.color}88)` }}
          >
            {userAvatar
              ? <img src={userAvatar} className="w-full h-full rounded-lg object-cover" alt="" />
              : (userName || "U").charAt(0).toUpperCase()}
          </div>

          {!collapsed && (
            <div className="flex-1 min-w-0">
              <p className="text-xs font-semibold text-[var(--foreground)] truncate">{userName}</p>
              <p className="text-[10px] mt-0.5" style={{ color: accent.color }}>{accent.label}</p>
            </div>
          )}

          <button
            onClick={handleLogout}
            title="Sign out"
            className="text-gray-600 hover:text-red-400 transition-colors shrink-0 p-1 rounded-lg hover:bg-red-400/10"
          >
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      </div>
    </aside>
  );

  return (
    <>
      {/* ── Mobile Overlay ──────────────────────────── */}
      {mobileOpen && (
        <div
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 lg:hidden"
          onClick={() => setMobileOpen(false)}
        />
      )}

      {/* ── Mobile Drawer ───────────────────────────── */}
      <div
        className={`fixed top-0 left-0 h-full z-50 transition-transform duration-300 lg:hidden w-64`}
        style={{ transform: mobileOpen ? 'translateX(0)' : 'translateX(-100%)' }}
      >
        {renderSidebarContent()}
      </div>

      {/* ── Desktop Sidebar ─────────────────────────── */}
      <aside
        className="hidden lg:flex flex-col h-full shrink-0 transition-all duration-300"
        style={{ width: collapsed ? 68 : 240 }}
      >
        {renderSidebarContent()}
      </aside>

      {/* ── Mobile Top Bar ──────────────────────────── */}
      <div
        className="lg:hidden fixed top-0 left-0 right-0 z-30 h-14 flex items-center px-4 gap-4 bg-[var(--card)] border-b border-[var(--border)] transition-colors duration-300"
      >
        <button
          onClick={() => setMobileOpen(true)}
          className="text-gray-400 hover:text-white transition-colors"
        >
          <Menu className="w-5 h-5" />
        </button>
        <div className="flex items-center gap-2">
          <img src="/logo.png" alt="SAMStack" className="w-7 h-7 object-contain" />
          <span className="font-bold text-[var(--foreground)] text-sm">SAMStack</span>
        </div>
        <div className="ml-auto flex items-center">
          <ThemeToggle />
        </div>
      </div>
    </>
  );
}
