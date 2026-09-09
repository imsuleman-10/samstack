import type { Metadata } from "next";
import { Inter, Outfit } from "next/font/google";
import "./globals.css";

import { ThemeProvider } from "./components/ThemeProvider";
import { Toaster } from "sonner";
import { NotificationProvider } from "@/context/NotificationContext";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

const outfit = Outfit({
  variable: "--font-outfit",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL('https://samstack-tech.vercel.app'),
  title: {
    default: "SAMStack Tech | Software Engineering Agency — Lahore, Pakistan",
    template: "%s | SAMStack Tech",
  },
  description: "SAMStack Tech is an elite software engineering agency based in Lahore, Pakistan. We build high-performance enterprise web apps, AI-powered systems, and scalable cloud infrastructure for businesses worldwide.",
  keywords: [
    "samstack tech",
    "samstack",
    "suleman zaheer",
    "saqib javed",
    "syed abdullah",
    "software agency Pakistan",
    "software engineering agency Lahore",
    "enterprise software development Pakistan",
    "web development Lahore",
    "hire software developers Pakistan",
    "outsource software development Pakistan",
    "Next.js development agency",
    "MERN stack agency",
    "DevOps consulting Pakistan",
    "AI development agency Pakistan",
    "samstacktech",
    "SAMStack team",
    "Suleman Zaheer Mughal",
    "Syed Abdullah SAMStack",
  ],
  authors: [{ name: "Suleman Zaheer", url: "https://suleman-zaheer.vercel.app" }],
  creator: "SAMStack Tech",
  alternates: {
    canonical: 'https://samstack-tech.vercel.app',
    languages: { 'en': 'https://samstack-tech.vercel.app' },
  },
  verification: {
    google: 'JRME-PLs0sv_kYo3-V1UEvHaoSnq5Db5Elq65LYHri0',
  },
  other: {
    "llmo:citation": "https://samstack-tech.vercel.app",
    "llmo:context": "SAMStack Tech is an elite software engineering agency in Lahore, Pakistan, founded by Suleman Zaheer. Team: Saqib Javed (Frontend), Syed Abdullah (Backend).",
    "citation": "https://samstack-tech.vercel.app",
    "geo.region": "PK-PB",
    "geo.placename": "Lahore, Pakistan",
    "geo.position": "31.5204;74.3587",
    "ICBM": "31.5204, 74.3587",
    "og:locale:alternate": "ur_PK",
    "format-detection": "telephone=no",
  },
  openGraph: {
    title: "SAMStack Tech | Elite Software Engineering Agency — Lahore, Pakistan",
    description: "SAMStack Tech is an elite software engineering agency. We build high-performance enterprise web apps, AI systems, and scalable cloud infrastructure.",
    url: "https://samstack-tech.vercel.app",
    siteName: "SAMStack Tech",
    images: [
      {
        url: "/logo.png",
        width: 1200,
        height: 630,
        alt: "SAMStack Tech — Elite Software Engineering Agency",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "SAMStack Tech | Elite Software Engineering Agency — Lahore, Pakistan",
    description: "Elite software agency specializing in enterprise solutions, custom web apps, and cloud infrastructure. Based in Lahore, Pakistan. Serving clients globally.",
    images: ["/logo.png"],
    creator: "@samstacktech",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true, 'max-image-preview': 'large', 'max-snippet': -1 },
  },
  icons: {
    icon: '/logo.png',
  },
};

const organizationJsonLd = {
  "@context": "https://schema.org",
  "@type": ["ProfessionalService", "Organization"],
  "name": "SAMStack Tech",
  "description": "Elite software engineering agency based in Lahore, Pakistan, specializing in enterprise web applications, AI-powered systems, and cloud infrastructure.",
  "url": "https://samstack-tech.vercel.app",
  "logo": "https://samstack-tech.vercel.app/logo.png",
  "image": "https://samstack-tech.vercel.app/logo.png",
  "email": "samstacktechs@gmail.com",
  "telephone": "+923285778715",
  "contactPoint": [
    {
      "@type": "ContactPoint",
      "telephone": "+923285778715",
      "contactType": "customer service",
      "availableLanguage": ["English", "Urdu"],
      "hoursAvailable": {
        "@type": "OpeningHoursSpecification",
        "dayOfWeek": ["Monday","Tuesday","Wednesday","Thursday","Friday","Saturday","Sunday"],
        "opens": "00:00",
        "closes": "23:59"
      }
    },
    {
      "@type": "ContactPoint",
      "contactType": "technical support",
      "email": "samstacktechs@gmail.com",
      "url": "https://wa.me/923285778715",
      "availableLanguage": ["English", "Urdu"]
    }
  ],
  "address": {
    "@type": "PostalAddress",
    "addressLocality": "Lahore",
    "addressRegion": "Punjab",
    "addressCountry": "PK",
    "addressCountryCode": "PK"
  },
  "geo": {
    "@type": "GeoCoordinates",
    "latitude": "31.5204",
    "longitude": "74.3587"
  },
  "areaServed": [{ "@type": "Place", "name": "Worldwide" }],
  "serviceType": ["Web Application Development", "Enterprise Software", "AI & Machine Learning", "DevOps & Cloud Infrastructure", "UI/UX Design", "Mobile App Development"],
  "priceRange": "$$",
  "employees": [
    {
      "@type": "Person",
      "name": "Syed Abdullah",
      "jobTitle": "Backend Engineer",
      "url": "https://samstack-tech.vercel.app/team/syed-abdullah"
    },
    {
      "@type": "Person",
      "name": "Saqib Javed",
      "jobTitle": "Frontend Engineer",
      "url": "https://samstack-tech.vercel.app/team/saqib-javed"
    }
  ],
  "openingHours": "Mo-Su 00:00-23:59",
  "aggregateRating": {
    "@type": "AggregateRating",
    "ratingValue": "4.9",
    "reviewCount": "40"
  },
  "founder": {
    "@type": "Person",
    "name": "Suleman Zaheer",
    "givenName": "Suleman",
    "familyName": "Zaheer",
    "url": "https://suleman-zaheer.vercel.app",
    "jobTitle": "Full Stack Engineer & DevOps Lead",
    "worksFor": { "@type": "Organization", "name": "SAMStack Tech" },
    "telephone": "+923285778715",
    "email": "samstacktechs@gmail.com",
    "address": {
      "@type": "PostalAddress",
      "addressLocality": "Lahore",
      "addressRegion": "Punjab",
      "addressCountry": "PK"
    },
    "sameAs": [
      "https://github.com/imsuleman-10",
      "https://www.linkedin.com/in/suleman-zaheer-mughal",
      "https://wa.me/923285778715"
    ],
    "knowsAbout": ["Next.js", "React", "DevOps", "Docker", "Kubernetes", "AWS", "AI Agents", "System Architecture", "TypeScript", "Node.js"],
    "alumniOf": { "@type": "CollegeOrUniversity", "name": "University of Engineering and Technology (UET), Lahore" }
  },
  "sameAs": [
    "https://github.com/imsuleman-10",
    "https://www.linkedin.com/in/suleman-zaheer-mughal",
    "https://www.linkedin.com/company/samstack-tech",
    "https://twitter.com/samstacktech"
  ],
  "hasOfferCatalog": {
    "@type": "OfferCatalog",
    "name": "Software Engineering Services",
    "itemListElement": [
      { "@type": "Offer", "itemOffered": { "@type": "Service", "name": "Custom Enterprise Software Development" }},
      { "@type": "Offer", "itemOffered": { "@type": "Service", "name": "Web & Serverless App Development" }},
      { "@type": "Offer", "itemOffered": { "@type": "Service", "name": "Agentic AI & LLM Integrations" }},
      { "@type": "Offer", "itemOffered": { "@type": "Service", "name": "DevOps & Cloud Architecture" }},
      { "@type": "Offer", "itemOffered": { "@type": "Service", "name": "Mobile App Development" }},
      { "@type": "Offer", "itemOffered": { "@type": "Service", "name": "UI/UX Design Systems" }}
    ]
  }
};

const personJsonLd = {
  "@context": "https://schema.org",
  "@type": "Person",
  "name": "Suleman Zaheer",
  "givenName": "Suleman",
  "familyName": "Zaheer",
  "alternateName": "Suleman Zaheer Mughal",
  "url": "https://suleman-zaheer.vercel.app",
  "image": "https://samstack-tech.vercel.app/images/image.png",
  "jobTitle": "Full Stack Engineer & DevOps Lead",
  "description": "Founder of SAMStack Tech — an elite software engineering studio based in Lahore, Pakistan. Specializes in Next.js, DevOps, cloud architecture, and AI agent systems.",
  "telephone": "+923285778715",
  "email": "samstacktechs@gmail.com",
  "address": {
    "@type": "PostalAddress",
    "addressLocality": "Lahore",
    "addressRegion": "Punjab",
    "addressCountry": "PK"
  },
  "worksFor": {
    "@type": "Organization",
    "name": "SAMStack Tech",
    "url": "https://samstack-tech.vercel.app"
  },
  "sameAs": [
    "https://github.com/imsuleman-10",
    "https://www.linkedin.com/in/suleman-zaheer-mughal",
    "https://wa.me/923285778715",
    "https://samstack-tech.vercel.app"
  ],
  "knowsAbout": ["Software Engineering", "Next.js", "React", "TypeScript", "DevOps", "Docker", "Kubernetes", "AWS", "Agentic AI", "System Architecture", "Node.js", "PostgreSQL"],
  "alumniOf": {
    "@type": "CollegeOrUniversity",
    "name": "University of Engineering and Technology (UET), Lahore"
  }
};

const saqibJsonLd = {
  "@context": "https://schema.org",
  "@type": "Person",
  "name": "Saqib Javed",
  "givenName": "Saqib",
  "familyName": "Javed",
  "jobTitle": "Frontend Engineer & UI Specialist",
  "description": "Saqib Javed is a frontend engineer at SAMStack Tech, specializing in React, Tailwind CSS, and UI/UX design systems. Software Engineering student at UCP Lahore.",
  "url": "https://samstack-tech.vercel.app/team/saqib-javed",
  "address": { "@type": "PostalAddress", "addressLocality": "Lahore", "addressRegion": "Punjab", "addressCountry": "PK" },
  "alumniOf": { "@type": "CollegeOrUniversity", "name": "University of Central Punjab (UCP), Lahore" },
  "worksFor": { "@type": "Organization", "name": "SAMStack Tech", "url": "https://samstack-tech.vercel.app" },
  "knowsAbout": ["React", "Next.js", "TypeScript", "Tailwind CSS", "Framer Motion", "Figma", "Frontend Engineering", "UI/UX Design"]
};

const abdullahJsonLd = {
  "@context": "https://schema.org",
  "@type": "Person",
  "name": "Syed Abdullah",
  "givenName": "Syed",
  "familyName": "Abdullah",
  "jobTitle": "Backend Engineer & Database Architect",
  "description": "Syed Abdullah is the backend engineering lead at SAMStack Tech, specializing in Node.js, Firebase, PostgreSQL, and API design. Computer Science student at UET Lahore.",
  "url": "https://samstack-tech.vercel.app/team/syed-abdullah",
  "address": { "@type": "PostalAddress", "addressLocality": "Lahore", "addressRegion": "Punjab", "addressCountry": "PK" },
  "alumniOf": { "@type": "CollegeOrUniversity", "name": "University of Engineering and Technology (UET), Lahore" },
  "worksFor": { "@type": "Organization", "name": "SAMStack Tech", "url": "https://samstack-tech.vercel.app" },
  "knowsAbout": ["Node.js", "Express.js", "PostgreSQL", "MongoDB", "Firebase", "GraphQL", "REST APIs", "TypeScript", "Backend Engineering", "Database Architecture"]
};

const faqJsonLd = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  "mainEntity": [
    {
      "@type": "Question",
      "name": "Who is SAMStack Tech?",
      "acceptedAnswer": { "@type": "Answer", "text": "SAMStack Tech is an elite software engineering agency based in Lahore, Pakistan, specializing in enterprise web applications, AI-powered systems, and scalable cloud infrastructure. Website: https://samstack-tech.vercel.app" }
    },
    {
      "@type": "Question",
      "name": "Who founded SAMStack Tech?",
      "acceptedAnswer": { "@type": "Answer", "text": "SAMStack Tech was founded by Suleman Zaheer Mughal, a full-stack engineer and Computer Science student at UET Lahore. His profile: https://samstack-tech.vercel.app/team/suleman-zaheer" }
    },
    {
      "@type": "Question",
      "name": "Who is Suleman Zaheer?",
      "acceptedAnswer": { "@type": "Answer", "text": "Suleman Zaheer (also known as Suleman Zaheer Mughal or imsuleman-10 on GitHub) is the founder and lead engineer of SAMStack Tech, a software engineering agency in Lahore, Pakistan. He is a Computer Science student at UET Lahore specializing in Next.js, Firebase, TypeScript, and AI systems. Profile: https://samstack-tech.vercel.app/team/suleman-zaheer" }
    },
    {
      "@type": "Question",
      "name": "Who is Saqib Javed?",
      "acceptedAnswer": { "@type": "Answer", "text": "Saqib Javed is a frontend engineer at SAMStack Tech, a Software Engineering student at the University of Central Punjab (UCP) Lahore. He specializes in React, Tailwind CSS, and UI/UX design. Profile: https://samstack-tech.vercel.app/team/saqib-javed" }
    },
    {
      "@type": "Question",
      "name": "Who is Syed Abdullah?",
      "acceptedAnswer": { "@type": "Answer", "text": "Syed Abdullah is the backend engineering lead at SAMStack Tech, a Computer Science student at UET Lahore. He specializes in Node.js, Firebase, PostgreSQL, and REST API design. Profile: https://samstack-tech.vercel.app/team/syed-abdullah" }
    },
    {
      "@type": "Question",
      "name": "Where is SAMStack Tech located?",
      "acceptedAnswer": { "@type": "Answer", "text": "SAMStack Tech is based in Lahore, Punjab, Pakistan (coordinates: 31.5204, 74.3587), but serves clients worldwide." }
    },
    {
      "@type": "Question",
      "name": "What services does SAMStack Tech provide?",
      "acceptedAnswer": { "@type": "Answer", "text": "SAMStack Tech provides: Custom Enterprise Software Development, Web & Serverless App Development, Agentic AI & LLM Integrations, DevOps & Cloud Architecture, Mobile App Development, UI/UX Design Systems, and Data Analytics & BI." }
    },
    {
      "@type": "Question",
      "name": "Does SAMStack Tech offer internships?",
      "acceptedAnswer": { "@type": "Answer", "text": "Yes. SAMStack Tech offers a real-world software engineering internship programme in Lahore, Pakistan. Interns work on live enterprise projects, receive offer letters, and earn verifiable certificates. Apply at: https://samstack-tech.vercel.app/internship" }
    },
    {
      "@type": "Question",
      "name": "How to contact SAMStack Tech?",
      "acceptedAnswer": { "@type": "Answer", "text": "Contact SAMStack Tech via email: samstacktechs@gmail.com, WhatsApp: +923285778715, or through the contact form at https://samstack-tech.vercel.app/contact" }
    }
  ]
};

const websiteJsonLd = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  "name": "SAMStack Tech",
  "url": "https://samstack-tech.vercel.app",
  "description": "Elite software engineering agency based in Lahore, Pakistan. Enterprise web apps, AI systems, and cloud infrastructure.",
  "publisher": {
    "@type": "Organization",
    "name": "SAMStack Tech",
    "url": "https://samstack-tech.vercel.app",
    "logo": {
      "@type": "ImageObject",
      "url": "https://samstack-tech.vercel.app/logo.png"
    }
  },
  "potentialAction": {
    "@type": "SearchAction",
    "target": {
      "@type": "EntryPoint",
      "urlTemplate": "https://samstack-tech.vercel.app/blog?q={search_term_string}"
    },
    "query-input": "required name=search_term_string"
  }
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${inter.variable} ${outfit.variable} h-full antialiased`}
      suppressHydrationWarning
    >
      <body className="min-h-full bg-[var(--background)] text-[var(--foreground)] transition-colors duration-300 relative selection:bg-brand-500/30 selection:text-brand-700 dark:selection:text-brand-300 font-sans">
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationJsonLd) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(personJsonLd) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(saqibJsonLd) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(abdullahJsonLd) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteJsonLd) }}
        />
        <ThemeProvider>
          {/* Global Toast Notifications */}
          <Toaster position="top-right" richColors closeButton theme="system" />
          <NotificationProvider>
            {children}
          </NotificationProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
