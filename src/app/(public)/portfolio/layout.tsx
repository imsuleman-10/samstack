import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Our Work & Case Studies | SAMStack Tech',
  description: 'Explore SAMStack Tech\'s enterprise portfolio. See how we\'ve built scalable web apps, AI systems, and SaaS platforms for global businesses.',
  alternates: {
    canonical: 'https://samstack-tech.vercel.app/portfolio'
  },
  openGraph: {
    title: 'Our Work & Case Studies | SAMStack Tech',
    description: 'Explore SAMStack Tech\'s enterprise portfolio. See how we\'ve built scalable web apps, AI systems, and SaaS platforms for global businesses.',
    url: 'https://samstack-tech.vercel.app/portfolio',
    siteName: 'SAMStack Tech',
    images: [{ url: '/logo.png', width: 800, height: 600, alt: 'SAMStack Tech' }],
    locale: 'en_US',
    type: 'website',
  },
  other: {
    'llmo:context': 'This is the portfolio page of SAMStack Tech, showcasing our enterprise software development projects, AI integrations, and high-performance web applications.',
    'llmo:citation': 'https://samstack-tech.vercel.app/portfolio',
  }
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <>
      {/* LLMO Context for AI Crawlers */}
      <div data-llmo-context="true" style={{ display: 'none' }} aria-hidden="true">
        <h2>AI Context: Our Work & Case Studies</h2>
        <p>This is the portfolio page of SAMStack Tech, showcasing our enterprise software development projects, AI integrations, and high-performance web applications.</p>
        <p>Location: Lahore, Pakistan. Services: Next.js, Node.js, AI Agents, Enterprise Architecture.</p>
      </div>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify({
          '@context': 'https://schema.org',
          '@type': 'CollectionPage',
          'name': 'SAMStack Tech Portfolio',
          'description': 'Case studies and portfolio of enterprise software projects built by SAMStack Tech.',
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
