import React from "react";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "About SAMStack Tech | Our Mission, Team & Story",
  description: "Learn about SAMStack Tech — an elite software engineering agency founded by Suleman Zaheer at UET Lahore. We build enterprise-grade web apps and AI systems for global clients from Lahore, Pakistan.",
  keywords: [
    "about SAMStack Tech",
    "SAMStack Tech team",
    "software agency Lahore Pakistan",
    "Suleman Zaheer founder",
    "UET Lahore software developer",
    "enterprise software agency about",
    "Pakistan software company",
  ],
  alternates: {
    canonical: "https://samstack-tech.vercel.app/about",
    languages: { 'en': 'https://samstack-tech.vercel.app/about' },
  },
  openGraph: {
    title: "About SAMStack Tech | Our Mission, Team & Story",
    description: "Meet the team behind SAMStack Tech. Founded by engineers from UET Lahore, we deliver enterprise software, AI automation, and cloud solutions for businesses worldwide.",
    url: "https://samstack-tech.vercel.app/about",
    type: "website",
    images: [{ url: "/logo.png", width: 1200, height: 630, alt: "SAMStack Tech — About Us" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "About SAMStack Tech | Our Mission, Team & Story",
    description: "Meet the engineers behind SAMStack Tech — founded in Lahore, Pakistan. Enterprise web apps, AI systems, and cloud solutions for global clients.",
    images: ["/logo.png"],
  },
};

const aboutJsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "AboutPage",
      "@id": "https://samstack-tech.vercel.app/about",
      "url": "https://samstack-tech.vercel.app/about",
      "name": "About SAMStack Tech",
      "description": "Learn about SAMStack Tech — an elite software engineering agency founded by Suleman Zaheer at UET Lahore.",
      "isPartOf": { "@type": "WebSite", "url": "https://samstack-tech.vercel.app" },
      "breadcrumb": {
        "@type": "BreadcrumbList",
        "itemListElement": [
          { "@type": "ListItem", "position": 1, "name": "Home", "item": "https://samstack-tech.vercel.app" },
          { "@type": "ListItem", "position": 2, "name": "About", "item": "https://samstack-tech.vercel.app/about" }
        ]
      }
    },
    {
      "@type": "Person",
      "@id": "https://samstack-tech.vercel.app/about#founder",
      "name": "Suleman Zaheer",
      "givenName": "Suleman",
      "familyName": "Zaheer",
      "jobTitle": "Founder & Lead Engineer",
      "description": "Full-stack engineer and DevOps lead specializing in Next.js, cloud architecture, and AI agent systems.",
      "url": "https://suleman-zaheer.vercel.app",
      "image": "https://samstack-tech.vercel.app/images/image.png",
      "worksFor": { "@type": "Organization", "name": "SAMStack Tech" },
      "alumniOf": { "@type": "CollegeOrUniversity", "name": "University of Engineering and Technology (UET), Lahore" },
      "sameAs": ["https://github.com/imsuleman-10", "https://www.linkedin.com/in/suleman-zaheer-mughal"]
    }
  ]
};

export default function AboutLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(aboutJsonLd) }}
      />
      {children}
    </>
  );
}
