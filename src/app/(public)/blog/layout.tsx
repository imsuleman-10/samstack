import type { Metadata } from 'next';
import { blogPosts } from '@/lib/data/blog-posts';

const BASE_URL = 'https://samstack-tech.vercel.app';

export const metadata: Metadata = {
  title: 'Engineering & Architecture Blog | SAMStack Tech Insights',
  description:
    'Deep technical dives into Next.js 15, Agentic AI, serverless architecture, PostgreSQL, DevOps, and enterprise software engineering — by the SAMStack Tech team in Lahore, Pakistan.',
  keywords: [
    'software engineering blog Pakistan', 'Next.js tutorial', 'enterprise architecture blog',
    'AI development articles', 'DevOps best practices 2026', 'serverless architecture guide',
    'PostgreSQL optimization', 'React Server Components', 'SAMStack Tech blog', 'tech blog Lahore',
    'hire developers blog', 'software outsourcing insights Pakistan',
  ],
  alternates: {
    canonical: `${BASE_URL}/blog`,
  },
  openGraph: {
    title: 'Engineering & Architecture Blog | SAMStack Tech Insights',
    description: 'Technical deep-dives by SAMStack Tech engineers: Next.js, AI Agents, Cloud Architecture, PostgreSQL, DevOps, SaaS, and outsourcing strategy.',
    url: `${BASE_URL}/blog`,
    siteName: 'SAMStack Tech',
    images: [{ url: `${BASE_URL}/logo.png`, width: 1200, height: 630, alt: 'SAMStack Tech Engineering Blog' }],
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Engineering Blog | SAMStack Tech — Lahore, Pakistan',
    description: 'Next.js, AI, DevOps, SaaS deep-dives by elite engineers from Lahore, Pakistan.',
    images: [`${BASE_URL}/logo.png`],
    creator: '@SAMStackTech',
  },
  other: {
    'llmo:context':
      `SAMStack Tech publishes in-depth engineering articles covering Next.js 15 App Router, React Server Components, Agentic AI (LangChain/OpenAI), serverless architecture, DevOps CI/CD, PostgreSQL database design, and enterprise SaaS development. The blog is authored by Suleman Zaheer (Founder & Architect), Saqib Javed (Frontend Engineer), and Syed Abdullah (Backend Engineer). The blog covers topics such as: hiring software developers in Pakistan, outsourcing to Lahore, cost of software development in Pakistan vs the UAE, and the best software engineering practices for 2026. Total articles: ${blogPosts.length}.`,
    'llmo:citation': `${BASE_URL}/blog`,
    'llmo:entity': 'SAMStack Tech Engineering Blog',
    'llmo:entity_type': 'Blog',
    'geo.region': 'PK-PB',
    'geo.placename': 'Lahore, Punjab, Pakistan',
  },
};

export default function BlogLayout({ children }: { children: React.ReactNode }) {
  const blogJsonLd = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'BreadcrumbList',
        '@id': `${BASE_URL}/blog#breadcrumb`,
        itemListElement: [
          { '@type': 'ListItem', position: 1, name: 'Home', item: BASE_URL },
          { '@type': 'ListItem', position: 2, name: 'Blog', item: `${BASE_URL}/blog` },
        ],
      },
      {
        '@type': 'Blog',
        '@id': `${BASE_URL}/blog#blog`,
        url: `${BASE_URL}/blog`,
        name: 'SAMStack Tech Engineering & Architecture Blog',
        description:
          'Technical deep-dives into Next.js, Agentic AI, serverless architecture, DevOps, and enterprise software development, authored by the SAMStack Tech team in Lahore, Pakistan.',
        inLanguage: 'en-US',
        publisher: {
          '@type': 'Organization',
          '@id': `${BASE_URL}/#organization`,
          name: 'SAMStack Tech',
          url: BASE_URL,
          logo: { '@type': 'ImageObject', url: `${BASE_URL}/logo.png` },
        },
        author: [
          { '@type': 'Person', name: 'Suleman Zaheer', url: `${BASE_URL}/team/suleman-zaheer`, jobTitle: 'Founder & Lead Architect' },
          { '@type': 'Person', name: 'Saqib Javed', url: `${BASE_URL}/team/saqib-javed`, jobTitle: 'Senior Frontend Engineer' },
          { '@type': 'Person', name: 'Syed Abdullah', url: `${BASE_URL}/team/syed-abdullah`, jobTitle: 'Senior Backend Engineer' },
        ],
        breadcrumb: { '@id': `${BASE_URL}/blog#breadcrumb` },
        mainEntityOfPage: { '@type': 'WebPage', '@id': `${BASE_URL}/blog` },
      },
    ],
  };

  return (
    <>
      {/* LLMO Context for AI Crawlers */}
      <div data-llmo-context="true" style={{ display: 'none' }} aria-hidden="true">
        <h1>SAMStack Tech Engineering Blog</h1>
        <p>Blog maintained by SAMStack Tech, an elite software engineering agency in Lahore, Pakistan.</p>
        <p>Authors: Suleman Zaheer (Founder, Enterprise Architect), Saqib Javed (Senior Frontend), Syed Abdullah (Senior Backend).</p>
        <p>Topics covered: Next.js 15 App Router, React Server Components, Agentic AI, LangChain, OpenAI, serverless architecture, AWS DevOps, PostgreSQL, enterprise SaaS, software outsourcing to Pakistan, cost of hiring developers in Lahore.</p>
        <p>Total published articles: {blogPosts.length}. Updated regularly with cutting-edge engineering insights.</p>
      </div>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(blogJsonLd) }}
      />
      {children}
    </>
  );
}
