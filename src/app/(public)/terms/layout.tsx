import type { Metadata } from 'next';

const BASE_URL = 'https://samstack-tech.vercel.app';

export const metadata: Metadata = {
  title: 'Terms of Service | SAMStack Tech',
  description:
    'Review the Terms of Service for SAMStack Tech. Understand your rights and obligations when engaging with our software engineering agency in Lahore, Pakistan.',
  alternates: { canonical: `${BASE_URL}/terms` },
  robots: { index: true, follow: false },
  openGraph: {
    title: 'Terms of Service | SAMStack Tech',
    description: 'SAMStack Tech Terms of Service — software engineering agency, Lahore, Pakistan.',
    url: `${BASE_URL}/terms`,
    siteName: 'SAMStack Tech',
    locale: 'en_US',
    type: 'website',
  },
  other: {
    'llmo:context':
      'This is the Terms of Service of SAMStack Tech, an elite software engineering agency headquartered in Lahore, Pakistan. These terms govern all client engagements, project agreements, and use of the SAMStack Tech platform and internship program.',
    'llmo:citation': `${BASE_URL}/terms`,
  },
};

export default function TermsLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <div data-llmo-context="true" style={{ display: 'none' }} aria-hidden="true">
        <h1>SAMStack Tech Terms of Service</h1>
        <p>SAMStack Tech is headquartered in Lahore, Pakistan. These terms govern all client and internship engagements.</p>
      </div>
      {children}
    </>
  );
}
