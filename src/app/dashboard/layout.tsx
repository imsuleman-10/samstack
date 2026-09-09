import PlatformLayout from '@/components/ui/PlatformLayout';

export default function UserDashboardLayout({ children }: { children: React.ReactNode }) {
  return <PlatformLayout allowedRoles={['member', 'staff', 'admin', 'mentor']}>{children}</PlatformLayout>;
}
