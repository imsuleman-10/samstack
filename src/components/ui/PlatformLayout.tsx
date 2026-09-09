import React, { Suspense } from 'react';
import { AppSidebar } from '@/components/ui/Sidebar';
import { getSession } from '@/lib/adminAuth';
import { redirect } from 'next/navigation';
import { ThemeToggle } from '@/components/ui/ThemeToggle';

export default async function PlatformLayout({
  children,
  allowedRoles,
}: {
  children: React.ReactNode;
  allowedRoles?: string[];
}) {
  const session = await getSession();

  if (!session) {
    redirect('/login');
  }

  if (allowedRoles && !allowedRoles.includes(session.role)) {
    redirect(`/${session.role === 'admin' ? 'admin' : session.role === 'staff' ? 'staff/dashboard' : (session.role === 'intern' || session.role === 'user') ? 'intern/dashboard' : session.role === 'mentor' ? 'mentor/dashboard' : 'dashboard'}`);
  }

  return (
    <div
      className="flex h-screen overflow-hidden bg-[var(--background)] text-[var(--foreground)] transition-colors duration-300"
      style={{ position: 'fixed', inset: 0, width: '100%' }}
    >
      {/* Sidebar */}
      <Suspense fallback={
        <div style={{ width: 240 }} className="hidden lg:flex flex-col h-full shrink-0 bg-[var(--card)] border-r border-[var(--border)]" />
      }>
        <AppSidebar
          role={session.role as any}
          userName={session.email || 'User'}
        />
      </Suspense>

      {/* Main Content */}
      <div className="flex-1 flex flex-col h-full overflow-hidden">
        {/* Top bar */}
        <header
          className="hidden lg:flex items-center justify-between px-6 h-14 shrink-0 bg-[var(--background)]/90 border-b border-[var(--border)] backdrop-blur-md transition-colors duration-300"
        >
          <div className="flex items-center gap-3">
            <div className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
            <span className="text-xs text-gray-500 font-medium">System Online</span>
          </div>
          <div className="flex items-center gap-4">
            <span suppressHydrationWarning className="text-xs text-[var(--foreground)] opacity-70">
              {new Date().toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })}
            </span>
            <div
              className="px-3 py-1 rounded-full text-xs font-semibold capitalize"
              style={{ background: 'rgba(34,211,238,0.1)', color: '#22d3ee', border: '1px solid rgba(34,211,238,0.2)' }}
            >
              {session.role}
            </div>
            <ThemeToggle />
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 overflow-y-auto pt-14 lg:pt-0">
          <div className="mx-auto p-4 md:p-6 lg:p-8 max-w-screen-xl w-full">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}
