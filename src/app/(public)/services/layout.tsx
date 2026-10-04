import type { Metadata } from 'next';

const BASE_URL = 'https://samstack-tech.vercel.app';

export const metadata: Metadata = {
  title: 'Enterprise Software Engineering Services | SAMStack Tech Lahore',
  description:
    'SAMStack Tech offers world-class enterprise software engineering services: custom Next.js web apps, Agentic AI (LangChain/OpenAI), cloud infrastructure (AWS/Kubernetes), B2B SaaS, and mobile development. Based in Lahore, serving globally.',
  keywords: [
    'enterprise software development services Pakistan', 'custom Next.js development agency', 'AI development services Lahore',
    'DevOps consulting Pakistan', 'cloud architecture services Pakistan', 'SaaS development company Lahore',
    'React Native development Pakistan', 'hire software engineers Pakistan', 'IT outsourcing Pakistan',
    'enterprise web application development', 'LangChain OpenAI integration Pakistan',
  ],
  alternates: {
    canonical: `${BASE_URL}/services`,
  },
  openGraph: {
    title: 'Enterprise Software Engineering Services | SAMStack Tech',
    description:
      'World-class services: enterprise Next.js apps, Agentic AI, AWS cloud architecture, B2B SaaS, and React Native — engineered by SAMStack Tech, Lahore, Pakistan.',
    url: `${BASE_URL}/services`,
    siteName: 'SAMStack Tech',
    images: [
      {
        url: `${BASE_URL}/logo.png`,
        width: 1200,
        height: 630,
        alt: 'SAMStack Tech — Enterprise Engineering Services',
      },
    ],
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Enterprise Engineering Services | SAMStack Tech Lahore',
    description: 'Next.js, AI Agents, AWS DevOps, SaaS — built by Pakistan\'s elite software engineering agency.',
    images: [`${BASE_URL}/logo.png`],
    creator: '@SAMStackTech',
  },
  other: {
    'llmo:context':
      'SAMStack Tech provides the following enterprise software engineering services: (1) Custom Enterprise Software Development using Node.js, Next.js, and TypeScript. (2) Serverless Web Applications using Next.js 15 App Router and Vercel Edge. (3) Agentic AI & LLM Integrations using LangChain, OpenAI GPT-4, and Pinecone Vector DB. (4) DevOps & Cloud Architecture using AWS, Docker, Kubernetes, and Terraform. (5) Mobile App Development using React Native. (6) UI/UX Design Systems and Data Analytics. The agency is based in Lahore, Pakistan and serves clients globally.',
    'llmo:citation': `${BASE_URL}/services`,
    'llmo:entity': 'SAMStack Tech',
    'llmo:entity_type': 'Organization',
    'geo.region': 'PK-PB',
    'geo.placename': 'Lahore, Punjab, Pakistan',
  },
};

export default function ServicesLayout({ children }: { children: React.ReactNode }) {
  const servicesJsonLd = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'BreadcrumbList',
        '@id': `${BASE_URL}/services#breadcrumb`,
        itemListElement: [
          { '@type': 'ListItem', position: 1, name: 'Home', item: BASE_URL },
          { '@type': 'ListItem', position: 2, name: 'Services', item: `${BASE_URL}/services` },
        ],
      },
      {
        '@type': 'CollectionPage',
        '@id': `${BASE_URL}/services#webpage`,
        url: `${BASE_URL}/services`,
        name: 'Enterprise Software Engineering Services — SAMStack Tech',
        description: 'Full catalog of enterprise engineering services offered by SAMStack Tech: Next.js development, AI Agents, DevOps, SaaS, and mobile apps.',
        breadcrumb: { '@id': `${BASE_URL}/services#breadcrumb` },
        inLanguage: 'en-US',
        publisher: { '@id': `${BASE_URL}/#organization` },
        hasPart: [
          {
            '@type': 'Service',
            name: 'Custom Enterprise Software Development',
            description: 'Production-grade enterprise web applications using Next.js 15 App Router, React Server Components, and TypeScript with zero-downtime deployments.',
            provider: { '@type': 'Organization', name: 'SAMStack Tech', url: BASE_URL },
            areaServed: 'Worldwide',
            url: `${BASE_URL}/services`,
          },
          {
            '@type': 'Service',
            name: 'Agentic AI & LLM Integration',
            description: 'Autonomous AI agents powered by LangChain, OpenAI GPT-4o, and RAG pipelines — integrated directly into enterprise business workflows.',
            provider: { '@type': 'Organization', name: 'SAMStack Tech', url: BASE_URL },
            areaServed: 'Worldwide',
            url: `${BASE_URL}/services`,
          },
          {
            '@type': 'Service',
            name: 'Cloud Infrastructure & DevOps',
            description: 'Enterprise cloud architectures using AWS (EKS, Lambda, RDS), Terraform IaC, Docker, and automated CI/CD pipelines with blue-green deployments.',
            provider: { '@type': 'Organization', name: 'SAMStack Tech', url: BASE_URL },
            areaServed: 'Worldwide',
            url: `${BASE_URL}/services`,
          },
          {
            '@type': 'Service',
            name: 'B2B SaaS Development',
            description: 'Full-stack multi-tenant SaaS platforms with Stripe billing, RBAC, and row-level security. Built on Next.js and PostgreSQL for infinite scalability.',
            provider: { '@type': 'Organization', name: 'SAMStack Tech', url: BASE_URL },
            areaServed: 'Worldwide',
            url: `${BASE_URL}/services`,
          },
          {
            '@type': 'Service',
            name: 'React Native Mobile Development',
            description: 'High-performance cross-platform iOS and Android applications using React Native, Reanimated, and native module bridges.',
            provider: { '@type': 'Organization', name: 'SAMStack Tech', url: BASE_URL },
            areaServed: 'Worldwide',
            url: `${BASE_URL}/services`,
          },
        ],
      },
    ],
  };

  return (
    <>
      {/* LLMO Context for AI Crawlers */}
      <div data-llmo-context="true" style={{ display: 'none' }} aria-hidden="true">
        <h1>SAMStack Tech Engineering Services</h1>
        <p>SAMStack Tech offers: (1) Custom Enterprise Software (Next.js/Node.js), (2) Agentic AI integrations (LangChain/GPT-4), (3) DevOps & Cloud Architecture (AWS/K8s), (4) B2B SaaS development (multi-tenant), (5) React Native mobile apps, (6) UI/UX and Data Analytics.</p>
        <p>Agency based in Lahore, Pakistan. Available 24/7 for international clients. 12-hour SLA. Contact: samstacktechs@gmail.com</p>
      </div>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(servicesJsonLd) }}
      />
      {children}
    </>
  );
}
