'use client';

import React from 'react';
import Link from 'next/link';
import { ChevronRight } from 'lucide-react';

interface Breadcrumb {
  label: string;
  href?: string;
}

interface PageHeaderProps {
  title: string;
  description?: string;
  breadcrumbs?: Breadcrumb[];
  action?: React.ReactNode;
}

export function PageHeader({ title, description, breadcrumbs, action }: PageHeaderProps) {
  return (
    <div className="mb-8">
      {breadcrumbs && breadcrumbs.length > 0 && (
        <nav className="flex items-center gap-1.5 text-xs sm:text-sm font-medium text-slate-500 dark:text-zinc-400 mb-2.5">
          {breadcrumbs.map((bc, idx) => (
            <React.Fragment key={idx}>
              {idx > 0 && <ChevronRight className="w-3.5 h-3.5 text-slate-400 dark:text-zinc-600" />}
              {bc.href ? (
                <Link
                  href={bc.href}
                  className="hover:text-slate-900 dark:hover:text-zinc-100 transition-colors"
                >
                  {bc.label}
                </Link>
              ) : (
                <span className="text-slate-800 dark:text-zinc-200 font-semibold">{bc.label}</span>
              )}
            </React.Fragment>
          ))}
        </nav>
      )}

      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            {title}
          </h1>
          {description && (
            <p className="text-sm text-slate-500 dark:text-zinc-400 mt-1 max-w-2xl leading-relaxed">
              {description}
            </p>
          )}
        </div>
        {action && <div className="shrink-0 flex items-center gap-3">{action}</div>}
      </div>
    </div>
  );
}
