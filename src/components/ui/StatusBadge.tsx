'use client';

import React from 'react';
import type { AccountStatus } from '@/lib/firestore-schema';

const STATUS_CLASSES: Record<AccountStatus, { label: string; dot: string; classes: string }> = {
  active: {
    label: 'Active',
    dot: 'bg-emerald-600 dark:bg-emerald-400',
    classes: 'bg-emerald-100 text-emerald-900 border border-emerald-300/80 dark:bg-emerald-500/15 dark:text-emerald-300 dark:border-emerald-500/30',
  },
  inactive: {
    label: 'Inactive',
    dot: 'bg-slate-500 dark:bg-zinc-400',
    classes: 'bg-slate-100 text-slate-800 border border-slate-300/80 dark:bg-zinc-800 dark:text-zinc-300 dark:border-zinc-700',
  },
  suspended: {
    label: 'Suspended',
    dot: 'bg-rose-600 dark:bg-rose-400',
    classes: 'bg-rose-100 text-rose-900 border border-rose-300/80 dark:bg-rose-500/15 dark:text-rose-300 dark:border-rose-500/30',
  },
  pending: {
    label: 'Pending',
    dot: 'bg-amber-600 dark:bg-amber-400',
    classes: 'bg-amber-100 text-amber-900 border border-amber-300/80 dark:bg-amber-500/15 dark:text-amber-300 dark:border-amber-500/30',
  },
};

interface StatusBadgeProps {
  status: AccountStatus;
  showDot?: boolean;
  className?: string;
}

export function StatusBadge({ status, showDot = true, className = '' }: StatusBadgeProps) {
  const cfg = STATUS_CLASSES[status] ?? STATUS_CLASSES.pending;
  return (
    <span
      className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-bold tracking-wide ${cfg.classes} ${className}`}
    >
      {showDot && (
        <span className={`w-1.5 h-1.5 rounded-full ${cfg.dot}`} />
      )}
      {cfg.label}
    </span>
  );
}
