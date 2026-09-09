import React from 'react';
import { getSession } from '@/lib/adminAuth';
import { redirect } from 'next/navigation';
import { PlatformShell } from '@/components/ui/PlatformShell';

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
    redirect(
      `/${
        session.role === 'admin'
          ? 'admin'
          : session.role === 'staff'
          ? 'staff/dashboard'
          : (session.role === 'intern' || session.role === 'user')
          ? 'intern/dashboard'
          : session.role === 'mentor'
          ? 'mentor/dashboard'
          : 'dashboard'
      }`
    );
  }

  return (
    <PlatformShell
      role={session.role as any}
      userName={session.email || 'Administrator'}
    >
      {children}
    </PlatformShell>
  );
}
