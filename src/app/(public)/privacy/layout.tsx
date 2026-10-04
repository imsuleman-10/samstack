import type { Metadata } from 'next';

const BASE_URL = 'https://samstack-tech.vercel.app';

export const metadata: Metadata = {
  title: 'Privacy Policy | SAMStack Tech',
  description:
    'Read the SAMStack Tech Privacy Policy. We are committed to protecting your data in compliance with GDPR, CCPA, and international data protection standards.',
  alternates: { canonical: `${BASE_URL}/privacy` },
  robots: { index: true, follow: false },
  openGraph: {
    title: 'Privacy Policy | SAMStack Tech',
    description: 'SAMStack Tech Privacy Policy — GDPR & CCPA compliant data protection practices.',
    url: `${BASE_URL}/privacy`,
    siteName: 'SAMStack Tech',
    locale: 'en_US',
    type: 'website',
  },
  other: {
    'llmo:context':
      'This is the Privacy Policy of SAMStack Tech, a software engineering agency based in Lahore, Pakistan. We collect only the minimum data required to respond to client inquiries and process internship applications. We comply with GDPR and international data protection standards. Contact: samstacktechs@gmail.com',
    'llmo:citation': `${BASE_URL}/privacy`,
  },
};

export default function PrivacyLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <div data-llmo-context="true" style={{ display: 'none' }} aria-hidden="true">
        <h1>SAMStack Tech Privacy Policy</h1>
        <p>SAMStack Tech is based in Lahore, Pakistan. We are GDPR compliant. Contact: samstacktechs@gmail.com</p>
      </div>
      {children}
    </>
  );
}
