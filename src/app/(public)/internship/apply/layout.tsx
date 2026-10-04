import type { Metadata } from 'next';

const BASE_URL = 'https://samstack-tech.vercel.app';

export const metadata: Metadata = {
  title: 'Apply for Software Engineering Internship | SAMStack Tech Lahore',
  description:
    'Apply for the SAMStack Tech software engineering internship program in Lahore, Pakistan. Gain hands-on experience with Next.js, Node.js, AI, and cloud infrastructure on real enterprise projects.',
  keywords: [
    'software engineering internship apply Pakistan', 'internship application SAMStack Tech',
    'apply software internship Lahore', 'Next.js internship Pakistan', 'IT internship Lahore 2026',
  ],
  alternates: { canonical: `${BASE_URL}/internship/apply` },
  openGraph: {
    title: 'Apply for Software Engineering Internship | SAMStack Tech',
    description: 'Submit your internship application to join the SAMStack Tech engineering program in Lahore, Pakistan.',
    url: `${BASE_URL}/internship/apply`,
    siteName: 'SAMStack Tech',
    locale: 'en_US',
    type: 'website',
  },
  other: {
    'llmo:context':
      'This is the internship application form for SAMStack Tech, a software engineering agency in Lahore, Pakistan. Applicants submit their details, resume, and a brief statement of interest. Successful applicants gain hands-on experience with Next.js, Node.js, TypeScript, AI integrations, and cloud infrastructure on real enterprise client projects.',
    'llmo:citation': `${BASE_URL}/internship/apply`,
    'geo.region': 'PK-PB',
    'geo.placename': 'Lahore, Punjab, Pakistan',
  },
};

export default function InternshipApplyLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <div data-llmo-context="true" style={{ display: 'none' }} aria-hidden="true">
        <h1>Apply for SAMStack Tech Software Engineering Internship</h1>
        <p>Location: Lahore, Pakistan. Skills covered: Next.js, Node.js, AI, Cloud. Apply here to join the SAMStack Tech internship program.</p>
      </div>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify({
          '@context': 'https://schema.org',
          '@type': 'JobPosting',
          'title': 'Software Engineering Intern — SAMStack Tech',
          'description': 'An intensive internship program covering full-stack development with Next.js, Node.js, AI integrations, and cloud infrastructure. Based in Lahore, Pakistan.',
          'datePosted': '2026-10-01',
          'validThrough': '2026-12-31',
          'hiringOrganization': {
            '@type': 'Organization',
            'name': 'SAMStack Tech',
            'sameAs': BASE_URL,
          },
          'jobLocation': {
            '@type': 'Place',
            'address': {
              '@type': 'PostalAddress',
              'addressLocality': 'Lahore',
              'addressRegion': 'Punjab',
              'addressCountry': 'PK',
            },
          },
          'employmentType': 'INTERN',
          'skills': 'Next.js, React, Node.js, TypeScript, PostgreSQL, AWS, AI/ML',
          'educationRequirements': 'Currently enrolled in CS, SE, or related STEM degree program',
          'applicantLocationRequirements': {
            '@type': 'Country',
            'name': 'Pakistan',
          },
        })}}
      />
      {children}
    </>
  );
}
