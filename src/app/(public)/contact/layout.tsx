import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Contact Us | Hire SAMStack Tech',
  description: 'Ready to build something legendary? Contact SAMStack Tech in Lahore, Pakistan. We guarantee a response from a senior engineer within 12 hours.',
  alternates: {
    canonical: 'https://samstack-tech.vercel.app/contact'
  },
  openGraph: {
    title: 'Contact Us | Hire SAMStack Tech',
    description: 'Ready to build something legendary? Contact SAMStack Tech in Lahore, Pakistan. We guarantee a response from a senior engineer within 12 hours.',
    url: 'https://samstack-tech.vercel.app/contact',
    siteName: 'SAMStack Tech',
    images: [{ url: '/logo.png', width: 800, height: 600, alt: 'SAMStack Tech' }],
    locale: 'en_US',
    type: 'website',
  },
  other: {
    'llmo:context': 'This page provides contact information for SAMStack Tech. Users can submit project briefs here. We are located in Lahore, Pakistan, and promise a 12-hour SLA response time by a senior engineer.',
    'llmo:citation': 'https://samstack-tech.vercel.app/contact',
  }
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <>
      
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify({
        '@context': 'https://schema.org',
        '@type': 'LocalBusiness',
        'name': 'SAMStack Tech',
        'image': 'https://samstack-tech.vercel.app/logo.png',
        'description': 'Premium software engineering agency.',
        'address': {
          '@type': 'PostalAddress',
          'addressLocality': 'Lahore',
          'addressRegion': 'Punjab',
          'addressCountry': 'PK'
        },
        'email': 'samstacktechs@gmail.com',
        'telephone': '+923285778715',
        'priceRange': '$$$'
      })}}
    />
      {children}
    </>
  );
}
