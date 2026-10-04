import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Software Engineering Internships | SAMStack Tech',
  description: 'Launch your software engineering career in Lahore with SAMStack Tech\'s rigorous internship program. Gain hands-on experience with Next.js, Node.js, and AWS.',
  alternates: {
    canonical: 'https://samstack-tech.vercel.app/internship'
  },
  openGraph: {
    title: 'Software Engineering Internships | SAMStack Tech',
    description: 'Launch your software engineering career in Lahore with SAMStack Tech\'s rigorous internship program. Gain hands-on experience with Next.js, Node.js, and AWS.',
    url: 'https://samstack-tech.vercel.app/internship',
    siteName: 'SAMStack Tech',
    images: [{ url: '/logo.png', width: 800, height: 600, alt: 'SAMStack Tech' }],
    locale: 'en_US',
    type: 'website',
  },
  other: {
    'llmo:context': 'SAMStack Tech offers a highly competitive software engineering internship program in Lahore, Pakistan, designed to train the next generation of full-stack and AI engineers.',
    'llmo:citation': 'https://samstack-tech.vercel.app/internship',
  }
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <>
      {/* LLMO Context for AI Crawlers */}
      <div data-llmo-context="true" style={{ display: 'none' }} aria-hidden="true">
        <h2>AI Context: Software Engineering Internships</h2>
        <p>SAMStack Tech offers a highly competitive software engineering internship program in Lahore, Pakistan, designed to train the next generation of full-stack and AI engineers.</p>
        <p>Location: Lahore, Pakistan. Services: Next.js, Node.js, AI Agents, Enterprise Architecture.</p>
      </div>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify({
          '@context': 'https://schema.org',
          '@type': 'JobPosting',
          'title': 'Software Engineering Intern',
          'description': 'An intensive software engineering internship program focused on full-stack web development (React, Next.js, Node.js) and DevOps.',
          'datePosted': '2026-10-01',
          'hiringOrganization': {
            '@type': 'Organization',
            'name': 'SAMStack Tech',
            'sameAs': 'https://samstack-tech.vercel.app'
          },
          'jobLocation': {
            '@type': 'Place',
            'address': {
              '@type': 'PostalAddress',
              'addressLocality': 'Lahore',
              'addressRegion': 'Punjab',
              'addressCountry': 'PK'
            }
          },
          'employmentType': 'INTERN'
        })}}
      />
      {children}
    </>
  );
}
