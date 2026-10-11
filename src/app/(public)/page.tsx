import React from "react";
import HomeClient from "./home-client";
import type { Metadata } from "next";

const BASE_URL = (process.env.NEXT_PUBLIC_SITE_URL && !process.env.NEXT_PUBLIC_SITE_URL.includes("localhost"))
  ? process.env.NEXT_PUBLIC_SITE_URL
  : "https://samstack-tech.vercel.app";

export const metadata: Metadata = {
  title: "SAMStack Tech | Software Engineering Agency in Lahore, Pakistan",
  description: "SAMStack Tech is a modern software engineering agency based in Lahore, Pakistan. We engineer high-performance web applications, full-stack systems, and scalable cloud solutions for companies worldwide.",
  keywords: [
    "Next.js development agency Pakistan",
    "software engineering agency Lahore Pakistan",
    "hire Next.js developers Pakistan",
    "full-stack development agency Lahore",
    "custom web application development Pakistan",
    "React and Node.js agency Pakistan",
    "cloud architecture and DevOps consulting Pakistan",
    "enterprise software development Pakistan",
  ],
  alternates: {
    canonical: BASE_URL,
  },
  openGraph: {
    title: "SAMStack Tech | Software Engineering Agency in Lahore, Pakistan",
    description: "Modern software engineering agency building high-performance web apps, APIs, and cloud infrastructure. Based in Lahore — serving clients globally.",
    url: BASE_URL,
    type: "website",
    images: [{ url: "/logo.png", width: 1200, height: 630, alt: "SAMStack Tech — Software Engineering Agency Lahore Pakistan" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "SAMStack Tech | Software Engineering Agency in Lahore, Pakistan",
    description: "Modern web applications, APIs, and cloud infrastructure from Lahore, Pakistan. Book a free discovery call.",
    images: ["/logo.png"],
    creator: "@samstacktech",
  },
};

const faqJsonLd = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  "mainEntity": [
    {
      "@type": "Question",
      "name": "What services does SAMStack Tech offer?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "SAMStack Tech offers custom enterprise software development, web & serverless application development with Next.js, agentic AI & LLM integrations, DevOps & cloud architecture, mobile app development, UI/UX design systems, and data analytics & business intelligence services."
      }
    },
    {
      "@type": "Question",
      "name": "Where is SAMStack Tech based?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "SAMStack Tech is based in Lahore, Pakistan and serves clients globally across North America, Europe, the Middle East, and Asia-Pacific."
      }
    },
    {
      "@type": "Question",
      "name": "How much does custom software development cost at SAMStack Tech?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Project costs vary based on scope and complexity. Small projects typically start from $2,000, mid-scale enterprise applications range from $8,000–$25,000, and large-scale systems are quoted after discovery. Contact us for a free consultation and detailed quote."
      }
    },
    {
      "@type": "Question",
      "name": "How quickly can SAMStack Tech start my project?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "We respond to all project inquiries within 12 hours. After an initial discovery call, we can typically begin development within 1–2 weeks of finalizing project requirements and signing the agreement."
      }
    },
    {
      "@type": "Question",
      "name": "Does SAMStack Tech work with international clients?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Yes. While based in Lahore, Pakistan, SAMStack Tech works with clients from North America, Europe, the Middle East, and Asia. We are available 24/7, communicate in English, and are experienced with NDA agreements and international payment methods."
      }
    },
    {
      "@type": "Question",
      "name": "What technology stack does SAMStack Tech use?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Our primary stack includes Next.js, React, TypeScript, Node.js, PostgreSQL, Redis, Docker, Kubernetes, and AWS/Vercel for cloud infrastructure. For AI projects we use Python, LangChain, OpenAI, and Pinecone. We select technology based on your project requirements, not personal preference."
      }
    },
    {
      "@type": "Question",
      "name": "Is my project information kept confidential?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Absolutely. All projects are covered by a Non-Disclosure Agreement (NDA) by default. We do not disclose client identities, business logic, or project details without explicit written permission."
      }
    },
    {
      "@type": "Question",
      "name": "Do you provide post-launch support and maintenance?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Yes. All enterprise projects include post-launch engineering support. We offer ongoing maintenance, performance monitoring, bug fixes, and feature additions through retainer agreements. Our 99.9% uptime guarantee applies to all production deployments."
      }
    }
  ]
};

const aggregateRatingJsonLd = {
  "@context": "https://schema.org",
  "@type": "ProfessionalService",
  "name": "SAMStack Tech",
  "url": BASE_URL,
  "aggregateRating": {
    "@type": "AggregateRating",
    "ratingValue": "4.9",
    "reviewCount": "14",
    "bestRating": "5",
    "worstRating": "1"
  },
  "review": [
    {
      "@type": "Review",
      "author": { "@type": "Person", "name": "Ahmed Malik" },
      "reviewRating": { "@type": "Rating", "ratingValue": "5", "bestRating": "5" },
      "reviewBody": "SAMStack Tech delivered our enterprise SaaS platform ahead of schedule with exceptional code quality. The architecture they designed handles our 50k daily users flawlessly. Highly recommend for serious enterprise projects."
    },
    {
      "@type": "Review",
      "author": { "@type": "Person", "name": "Sarah O'Brien" },
      "reviewRating": { "@type": "Rating", "ratingValue": "5", "bestRating": "5" },
      "reviewBody": "Outstanding team. They took our vague idea and turned it into a production-grade AI automation system in 8 weeks. Communication was excellent throughout and the final product exceeded our expectations."
    },
    {
      "@type": "Review",
      "author": { "@type": "Person", "name": "Khalid Al-Rashid" },
      "reviewRating": { "@type": "Rating", "ratingValue": "5", "bestRating": "5" },
      "reviewBody": "We outsourced our fintech backend to SAMStack Tech and it was the best decision we made. Zero downtime since launch, clean code, and they respond within hours whenever we need support."
    }
  ]
};

export default function HomePage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(aggregateRatingJsonLd) }}
      />
      <HomeClient />
    </>
  );
}
