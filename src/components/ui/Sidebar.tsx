'use client';

import React, { useState, createContext, useContext } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  LayoutDashboard, Users, GraduationCap, Star, Briefcase,
  UserCircle, Link2, Globe, Bell, Settings, LogOut,
  ChevronLeft, ChevronRight, FileText, Award, Menu, X,
  ShieldCheck, Activity, BookOpen, Trophy, ExternalLink, Sparkles
} from 'lucide-react';
import type { UserRole } from '@/lib/firestore-schema';
import { ThemeToggle } from '@/components/ui/ThemeToggle';
import { useNotifications } from '@/context/NotificationContext';

// ─── Sidebar Context ─────────────────────────────────────────────────────────
export interface SidebarContextType {
  collapsed: boolean;
  setCollapsed: (v: boolean) => void;
  mobileOpen: boolean;
  setMobileOpen: (v: boolean) => void;
}

const SidebarContext = createContext<SidebarContextType>({
  collapsed: false,
  setCollapsed: () => {},
  mobileOpen: false,
  setMobileOpen: () => {},
});

export const useSidebar = () => useContext(SidebarContext);

export interface NavItem {
  label: string;
  href: string;
  icon: React.ElementType;
  badge?: number;
}

export interface NavSection {
  title?: string;
  items: NavItem[];
}

const NAV_BY_ROLE: Record<UserRole, NavSection[]> = {
  admin: [
    {
      title: 'OVERVIEW',
      items: [
        { label: 'Dashboard', href: '/admin', icon: LayoutDashboard },
      ],
    },
    {
      title: 'PEOPLE & ROLES',
      items: [
        { label: 'All Users', href: '/admin/users', icon: Users },
        { label: 'Interns', href: '/admin/interns', icon: GraduationCap },
        { label: 'Mentors', href: '/admin/mentors', icon: Star },
        { label: 'Staff Team', href: '/admin/staff', icon: Briefcase },
      ],
    },
    {
      title: 'OPERATIONS',
      items: [
        { label: 'Assignments', href: '/admin/mentor-assignments', icon: Link2 },
        { label: 'Tasks & Tracks', href: '/admin/tasks', icon: BookOpen },
        { label: 'Certificates', href: '/admin/certificates', icon: Award },
      ],
    },
    {
      title: 'SYSTEM & COMMUNITY',
      items: [
        { label: 'Community Feed', href: '/community', icon: Globe },
        { label: 'Audit Logs', href: '/admin/audit-logs', icon: FileText },
        { label: 'Settings', href: '/admin/settings', icon: Settings },
      ],
    },
  ],
  mentor: [
    {
      title: 'OVERVIEW',
      items: [
        { label: 'Dashboard', href: '/mentor/dashboard', icon: LayoutDashboard },
      ],
    },
    {
      title: 'INTERNS & TASKS',
      items: [
        { label: 'My Interns', href: '/mentor/interns', icon: GraduationCap },
        { label: 'Manage Tasks', href: '/mentor/tasks', icon: BookOpen },
        { label: 'Certificates', href: '/admin/certificates', icon: Award },
        { label: 'Intern Directory', href: '/interns', icon: Users },
      ],
    },
    {
      title: 'COMMUNITY & TOOLS',
      items: [
        { label: 'Community', href: '/community', icon: Globe },
        { label: 'Tools', href: '/mentor/tools', icon: Award },
      ],
    },
    {
      title: 'ACCOUNT',
      items: [
        { label: 'Profile', href: '/profile', icon: UserCircle },
        { label: 'Notifications', href: '/notifications', icon: Bell },
      ],
    },
  ],
  intern: [
    {
      title: 'OVERVIEW',
      items: [
        { label: 'Dashboard', href: '/intern/dashboard', icon: LayoutDashboard },
      ],
    },
    {
      title: 'ACADEMICS',
      items: [
        { label: 'My Mentor', href: '/intern/mentor', icon: Star },
        { label: 'My Tasks', href: '/intern/tasks', icon: FileText },
        { label: 'My Documents', href: '/intern/documents', icon: Award },
        { label: 'Leaderboard', href: '/intern/leaderboard', icon: Trophy },
      ],
    },
    {
      title: 'COMMUNITY',
      items: [
        { label: 'Intern Directory', href: '/interns', icon: Users },
        { label: 'Community', href: '/community', icon: Globe },
      ],
    },
    {
      title: 'ACCOUNT',
      items: [
        { label: 'Profile', href: '/profile', icon: UserCircle },
        { label: 'Notifications', href: '/notifications', icon: Bell },
      ],
    },
  ],
  staff: [
    {
      title: 'OVERVIEW',
      items: [
        { label: 'Dashboard', href: '/staff/dashboard', icon: LayoutDashboard },
      ],
    },
    {
      title: 'MANAGEMENT',
      items: [
        { label: 'Users', href: '/admin/users', icon: Users },
        { label: 'Staff Tools', href: '/staff/tools', icon: Award },
      ],
    },
    {
      title: 'COMMUNITY & ACCOUNT',
      items: [
        { label: 'Community', href: '/community', icon: Globe },
        { label: 'Profile', href: '/profile', icon: UserCircle },
        { label: 'Notifications', href: '/notifications', icon: Bell },
      ],
    },
  ],
  member: [
    {
      title: 'OVERVIEW',
      items: [
        { label: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
      ],
    },
    {
      title: 'EXPLORE',
      items: [
        { label: 'Community', href: '/community', icon: Globe },
        { label: 'Directory', href: '/interns', icon: Users },
        { label: 'Profile', href: '/profile', icon: UserCircle },
        { label: 'Notifications', href: '/notifications', icon: Bell },
      ],
    },
  ],
  user: [
    {
      title: 'OVERVIEW',
      items: [
        { label: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
        { label: 'Community', href: '/community', icon: Globe },
        { label: 'Profile', href: '/profile', icon: UserCircle },
        { label: 'Notifications', href: '/notifications', icon: Bell },
      ],
    },
  ],
};

const ROLE_META: Record<UserRole, { label: string; badgeClass: string; barColor: string }> = {
  admin: {
    label: 'Super Admin',
    badgeClass: 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20',
    barColor: '#f59e0b',
  },
  mentor: {
    label: 'Mentor',
    badgeClass: 'bg-purple-500/10 text-purple-600 dark:text-purple-400 border border-purple-500/20',
    barColor: '#a855f7',
  },
  intern: {
    label: 'Intern',
    badgeClass: 'bg-cyan-500/10 text-cyan-600 dark:text-cyan-400 border border-cyan-500/20',
    barColor: '#06b6d4',
  },
  staff: {
    label: 'Staff Member',
    badgeClass: 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20',
    barColor: '#10b981',
  },
  member: {
    label: 'Member',
    badgeClass: 'bg-orange-500/10 text-orange-600 dark:text-orange-400 border border-orange-500/20',
    barColor: '#f97316',
  },
  user: {
    label: 'User',
    badgeClass: 'bg-slate-500/10 text-slate-600 dark:text-slate-400 border border-slate-500/20',
    barColor: '#64748b',
  },
};

export interface AppSidebarProps {
  role: UserRole;
  userName: string;
  userAvatar?: string | null;
  collapsed?: boolean;
  setCollapsed?: (v: boolean) => void;
  mobileOpen?: boolean;
  setMobileOpen?: (v: boolean) => void;
}

export function AppSidebar({
  role,
  userName,
  userAvatar,
  collapsed = false,
  setCollapsed,
  mobileOpen = false,
  setMobileOpen,
}: AppSidebarProps) {
  const { unreadCount } = useNotifications();
  const pathname = usePathname();
  const sections = NAV_BY_ROLE[role] ?? NAV_BY_ROLE.user;
  const meta = ROLE_META[role] || ROLE_META.user;

  const handleLogout = async () => {
    try {
      await fetch('/api/auth/logout', { method: 'POST' });
    } catch {
      // Proceed to login anyway
    }
    window.location.href = '/login';
  };

  const isActive = (href: string) => {
    if (href === '/admin' || href === '/dashboard' || href === '/mentor/dashboard' || href === '/intern/dashboard' || href === '/staff/dashboard') {
      return pathname === href;
    }
    return pathname.startsWith(href);
  };

  const SidebarContent = () => (
    <aside className="flex flex-col h-full bg-white dark:bg-zinc-900 border-r border-slate-200/90 dark:border-zinc-800 transition-all duration-300 select-none shadow-xs">
      {/* ── Brand Header ─────────────────────────────── */}
      <div className="h-16 shrink-0 flex items-center justify-between px-3.5 border-b border-slate-200/80 dark:border-zinc-800/80">
        <Link
          href={role === 'admin' ? '/admin' : '/dashboard'}
          className={`flex items-center gap-3 min-w-0 ${collapsed ? 'justify-center w-full' : ''}`}
        >
          <div className="w-9 h-9 rounded-xl shrink-0 flex items-center justify-center bg-gradient-to-br from-brand-500/20 to-brand-600/10 border border-brand-500/30 shadow-xs relative">
            <img
              src="/logo.png"
              alt="SAMStack"
              className="w-6 h-6 object-contain"
              onError={(e) => {
                (e.target as HTMLImageElement).style.display = 'none';
              }}
            />
          </div>

          {!collapsed && (
            <div className="flex flex-col min-w-0">
              <div className="flex items-center gap-1.5">
                <span className="text-sm font-black text-slate-900 dark:text-white tracking-tight">SAMStack</span>
                <span className="px-1.5 py-0.2 rounded text-[9px] font-extrabold uppercase tracking-widest bg-brand-500/10 text-brand-600 dark:text-brand-400 border border-brand-500/20">
                  Panel
                </span>
              </div>
              <span className="text-[11px] font-medium text-slate-500 dark:text-zinc-400 capitalize truncate">
                {meta.label}
              </span>
            </div>
          )}
        </Link>

        {/* Desktop Collapse Button */}
        {setCollapsed && !collapsed && (
          <button
            onClick={() => setCollapsed(!collapsed)}
            className="hidden lg:flex w-7 h-7 rounded-lg items-center justify-center text-slate-400 hover:text-slate-600 dark:hover:text-zinc-200 hover:bg-slate-100 dark:hover:bg-zinc-800 transition-colors"
            title="Collapse Sidebar"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
        )}
      </div>

      {/* ── Grouped Navigation ───────────────────────── */}
      <nav className="flex-1 overflow-y-auto px-2.5 py-4 space-y-4" style={{ scrollbarWidth: 'thin' }}>
        {sections.map((section, sIdx) => (
          <div key={section.title || sIdx} className="space-y-1">
            {!collapsed && section.title && (
              <p className="text-[10px] font-bold tracking-wider text-slate-400 dark:text-zinc-500 uppercase px-3 py-1">
                {section.title}
              </p>
            )}

            {section.items.map((item) => {
              const active = isActive(item.href);
              const Icon = item.icon;

              return (
                <Link
                  key={item.href + item.label}
                  href={item.href}
                  onClick={() => setMobileOpen?.(false)}
                  title={collapsed ? item.label : undefined}
                  className={`flex items-center gap-3 rounded-xl px-3 py-2 text-sm font-medium transition-all duration-150 group relative ${
                    active
                      ? 'bg-brand-500/10 text-brand-600 dark:text-brand-400 font-semibold shadow-xs'
                      : 'text-slate-600 dark:text-zinc-400 hover:text-slate-900 dark:hover:text-zinc-100 hover:bg-slate-100/70 dark:hover:bg-zinc-800/60'
                  } ${collapsed ? 'justify-center px-2 py-2.5' : ''}`}
                >
                  {/* Left Active Glow Indicator */}
                  {active && (
                    <span
                      className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-5 rounded-r-full bg-brand-500 dark:bg-brand-400"
                    />
                  )}

                  <Icon
                    className={`shrink-0 transition-colors ${
                      collapsed ? 'w-5 h-5' : 'w-[18px] h-[18px]'
                    } ${
                      active
                        ? 'text-brand-600 dark:text-brand-400'
                        : 'text-slate-400 dark:text-zinc-400 group-hover:text-slate-700 dark:group-hover:text-zinc-200'
                    }`}
                  />

                  {!collapsed && (
                    <span className="truncate">{item.label}</span>
                  )}

                  {/* Badge */}
                  {!collapsed && item.badge && item.badge > 0 && (
                    <span className="ml-auto text-[10px] font-bold px-2 py-0.5 rounded-full bg-brand-500/15 text-brand-600 dark:text-brand-400">
                      {item.badge}
                    </span>
                  )}

                  {!collapsed && item.label === 'Notifications' && unreadCount > 0 && (
                    <span className="ml-auto text-[10px] font-bold px-2 py-0.5 rounded-full bg-brand-500 text-white shadow-xs">
                      {unreadCount > 99 ? '99+' : unreadCount}
                    </span>
                  )}

                  {/* Floating tooltip on collapsed */}
                  {collapsed && (
                    <div className="absolute left-full ml-3 hidden group-hover:flex items-center z-50 pointer-events-none">
                      <div className="bg-slate-900 dark:bg-zinc-800 text-white text-xs font-semibold px-2.5 py-1.5 rounded-lg shadow-xl whitespace-nowrap border border-slate-700/50 dark:border-zinc-700">
                        {item.label}
                      </div>
                    </div>
                  )}
                </Link>
              );
            })}
          </div>
        ))}
      </nav>

      {/* ── Footer / User Area ───────────────────────── */}
      <div className="shrink-0 p-2.5 border-t border-slate-200/80 dark:border-zinc-800/80 space-y-1.5">
        {/* Quick link to live public site */}
        {!collapsed ? (
          <Link
            href="/"
            target="_blank"
            className="flex items-center justify-between px-3 py-2 rounded-xl text-xs font-medium text-slate-500 dark:text-zinc-400 hover:text-slate-800 dark:hover:text-zinc-200 hover:bg-slate-100/60 dark:hover:bg-zinc-800/40 transition-colors"
          >
            <span className="flex items-center gap-2">
              <Sparkles className="w-3.5 h-3.5 text-brand-500" />
              Public Website
            </span>
            <ExternalLink className="w-3.5 h-3.5 opacity-60" />
          </Link>
        ) : (
          <Link
            href="/"
            target="_blank"
            title="Public Website"
            className="flex items-center justify-center p-2 rounded-xl text-slate-500 dark:text-zinc-400 hover:text-brand-500 hover:bg-slate-100 dark:hover:bg-zinc-800 transition-colors group relative"
          >
            <ExternalLink className="w-4 h-4" />
            <div className="absolute left-full ml-3 hidden group-hover:flex items-center z-50 pointer-events-none">
              <div className="bg-slate-900 dark:bg-zinc-800 text-white text-xs font-semibold px-2.5 py-1.5 rounded-lg shadow-xl whitespace-nowrap border border-slate-700/50 dark:border-zinc-700">
                Public Website
              </div>
            </div>
          </Link>
        )}

        {/* User Card */}
        <div
          className={`flex items-center gap-2.5 p-2 rounded-xl bg-slate-100/60 dark:bg-zinc-800/50 border border-slate-200/60 dark:border-zinc-700/50 ${
            collapsed ? 'justify-center' : ''
          }`}
        >
          <div className="w-8 h-8 rounded-lg shrink-0 flex items-center justify-center text-xs font-bold text-white bg-gradient-to-br from-brand-600 to-brand-800 shadow-xs">
            {userAvatar ? (
              <img src={userAvatar} className="w-full h-full rounded-lg object-cover" alt="" />
            ) : (
              (userName || 'A').charAt(0).toUpperCase()
            )}
          </div>

          {!collapsed && (
            <div className="flex-1 min-w-0">
              <p className="text-xs font-semibold text-slate-900 dark:text-white truncate">
                {userName || 'Admin'}
              </p>
              <div className="flex items-center gap-1.5 mt-0.5">
                <span className={`px-1.5 py-0.2 rounded text-[9px] font-bold uppercase tracking-wider ${meta.badgeClass}`}>
                  {meta.label}
                </span>
              </div>
            </div>
          )}

          <button
            onClick={handleLogout}
            title="Sign out"
            className="text-slate-400 hover:text-rose-500 dark:hover:text-rose-400 transition-colors p-1.5 rounded-lg hover:bg-rose-500/10 shrink-0"
          >
            <LogOut className="w-4 h-4" />
          </button>
        </div>

        {/* Collapsed Expand Trigger */}
        {setCollapsed && collapsed && (
          <button
            onClick={() => setCollapsed(false)}
            className="w-full py-2 flex items-center justify-center text-slate-400 hover:text-slate-700 dark:hover:text-zinc-200 hover:bg-slate-100 dark:hover:bg-zinc-800 rounded-xl transition-colors"
            title="Expand Sidebar"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        )}
      </div>
    </aside>
  );

  return (
    <>
      {/* ── Mobile Drawer Sheet ───────────────────────── */}
      {mobileOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          {/* Backdrop */}
          <div
            className="fixed inset-0 bg-black/60 backdrop-blur-sm transition-opacity"
            onClick={() => setMobileOpen?.(false)}
          />

          {/* Slide-over */}
          <div className="fixed top-0 bottom-0 left-0 w-72 max-w-[85vw] shadow-2xl z-50 flex flex-col animate-in slide-in-from-left duration-200">
            <SidebarContent />
          </div>
        </div>
      )}

      {/* ── Desktop Permanent Sidebar ─────────────────── */}
      <div
        className="hidden lg:flex flex-col h-full shrink-0 transition-all duration-300"
        style={{ width: collapsed ? 72 : 256 }}
      >
        <SidebarContent />
      </div>
    </>
  );
}
