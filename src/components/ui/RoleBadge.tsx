'use client';

import React from 'react';
import type { UserRole } from '@/lib/firestore-schema';

const ROLE_CLASSES: Record<UserRole, { label: string; classes: string }> = {
  admin: {
    label: 'Admin',
    classes: 'bg-amber-100 text-amber-900 border border-amber-300/80 dark:bg-amber-500/15 dark:text-amber-300 dark:border-amber-500/30',
  },
  mentor: {
    label: 'Mentor',
    classes: 'bg-purple-100 text-purple-900 border border-purple-300/80 dark:bg-purple-500/15 dark:text-purple-300 dark:border-purple-500/30',
  },
  intern: {
    label: 'Intern',
    classes: 'bg-sky-100 text-sky-900 border border-sky-300/80 dark:bg-sky-500/15 dark:text-sky-300 dark:border-sky-500/30',
  },
  staff: {
    label: 'Staff',
    classes: 'bg-emerald-100 text-emerald-900 border border-emerald-300/80 dark:bg-emerald-500/15 dark:text-emerald-300 dark:border-emerald-500/30',
  },
  member: {
    label: 'Member',
    classes: 'bg-orange-100 text-orange-900 border border-orange-300/80 dark:bg-orange-500/15 dark:text-orange-300 dark:border-orange-500/30',
  },
  user: {
    label: 'User',
    classes: 'bg-slate-100 text-slate-800 border border-slate-300/80 dark:bg-zinc-800 dark:text-zinc-300 dark:border-zinc-700',
  },
};

interface RoleBadgeProps {
  role: UserRole;
  className?: string;
}

export function RoleBadge({ role, className = '' }: RoleBadgeProps) {
  const cfg = ROLE_CLASSES[role] ?? ROLE_CLASSES.user;
  return (
    <span
      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold tracking-wide ${cfg.classes} ${className}`}
    >
      {cfg.label}
    </span>
  );
}
