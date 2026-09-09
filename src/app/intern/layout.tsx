import PlatformLayout from '@/components/ui/PlatformLayout';

export default function InternLayout({ children }: { children: React.ReactNode }) {
  return <PlatformLayout allowedRoles={['intern', 'user', 'admin', 'staff', 'mentor']}>{children}</PlatformLayout>;
}
