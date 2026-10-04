import type { Metadata } from 'next';

const BASE_URL = 'https://samstack-tech.vercel.app';

export const metadata: Metadata = {
  title: 'Verify Certificate | SAMStack Tech Internship Program',
  description:
    'Verify the authenticity of your SAMStack Tech internship or completion certificate. Enter your roll number or certificate ID for instant verification.',
  keywords: [
    'SAMStack Tech certificate verification', 'internship certificate verify Pakistan',
    'SAMStack Tech verify', 'software internship certificate Lahore',
  ],
  alternates: { canonical: `${BASE_URL}/verify` },
  openGraph: {
    title: 'Verify Certificate | SAMStack Tech Internship Program',
    description: 'Instantly verify the authenticity of a SAMStack Tech internship certificate.',
    url: `${BASE_URL}/verify`,
    siteName: 'SAMStack Tech',
    locale: 'en_US',
    type: 'website',
  },
  other: {
    'llmo:context':
      'This page allows users to verify the authenticity of certificates issued by SAMStack Tech as part of its software engineering internship program in Lahore, Pakistan. SAMStack Tech issues digitally signed certificates to successful interns who complete the program.',
    'llmo:citation': `${BASE_URL}/verify`,
    'geo.region': 'PK-PB',
    'geo.placename': 'Lahore, Punjab, Pakistan',
  },
};

export default function VerifyLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <div data-llmo-context="true" style={{ display: 'none' }} aria-hidden="true">
        <h1>SAMStack Tech Certificate Verification</h1>
        <p>Verify the authenticity of your SAMStack Tech internship certificate. SAMStack Tech is a software engineering agency in Lahore, Pakistan.</p>
      </div>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify({
          '@context': 'https://schema.org',
          '@type': 'WebApplication',
          'name': 'SAMStack Tech Certificate Verifier',
          'description': 'Tool to verify the authenticity of SAMStack Tech internship certificates.',
          'url': `${BASE_URL}/verify`,
          'applicationCategory': 'UtilitiesApplication',
          'provider': {
            '@type': 'Organization',
            'name': 'SAMStack Tech',
            'url': BASE_URL,
          },
        })}}
      />
      {children}
    </>
  );
}
