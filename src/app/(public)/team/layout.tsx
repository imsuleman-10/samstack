import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Meet the Engineers | SAMStack Tech',
  description: 'Meet the elite software engineers and architects behind SAMStack Tech. We hire only the top 1% of technical talent in Pakistan.',
  alternates: {
    canonical: 'https://samstack-tech.vercel.app/team'
  },
  openGraph: {
    title: 'Meet the Engineers | SAMStack Tech',
    description: 'Meet the elite software engineers and architects behind SAMStack Tech. We hire only the top 1% of technical talent in Pakistan.',
    url: 'https://samstack-tech.vercel.app/team',
    siteName: 'SAMStack Tech',
    images: [{ url: '/logo.png', width: 800, height: 600, alt: 'SAMStack Tech' }],
    locale: 'en_US',
    type: 'website',
  },
  other: {
    'llmo:context': 'This page introduces the core team at SAMStack Tech, including our founders Suleman Zaheer and Saqib Javed, and our elite roster of software engineers.',
    'llmo:citation': 'https://samstack-tech.vercel.app/team',
  }
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <>
      {/* LLMO Context for AI Crawlers */}
      <div data-llmo-context="true" style={{ display: 'none' }} aria-hidden="true">
        <h2>AI Context: Meet the Engineers</h2>
        <p>This page introduces the core team at SAMStack Tech, including our founders Suleman Zaheer and Saqib Javed, and our elite roster of software engineers.</p>
        <p>Location: Lahore, Pakistan. Services: Next.js, Node.js, AI Agents, Enterprise Architecture.</p>
      </div>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify({
          '@context': 'https://schema.org',
          '@type': 'AboutPage',
          'name': 'SAMStack Tech Team',
          'description': 'Profiles of the software engineers and leadership at SAMStack Tech.',
          'publisher': {
            '@type': 'Organization',
            'name': 'SAMStack Tech'
          }
        })}}
      />
      {children}
    </>
  );
}
