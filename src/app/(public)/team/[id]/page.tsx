import React from "react";
import { notFound } from "next/navigation";
import { teamData } from "@/lib/data/team";
import {
  Globe, ArrowLeft,
  Terminal, Code, Cpu, Briefcase, ExternalLink,
  MapPin, GraduationCap, Layers, Award, Home
} from "lucide-react";
import Link from "next/link";
import type { Metadata } from "next";
import AnimateOnScroll from "@/app/components/AnimateOnScroll";
import { TeamAvatar, TeamAvatarSmall } from "./TeamAvatar";

const BASE_URL = "https://samstack-tech.vercel.app";

// ─── Dynamic SEO Metadata per member — International Knowledge Panel grade ───
export async function generateMetadata({ params }: { params: Promise<{ id: string }> }): Promise<Metadata> {
  const { id } = await params;
  const m = teamData.find(x => x.id === id);
  if (!m) return { title: "Not Found" };

  const isSuleman = m.id === "suleman-zaheer";
  const title = isSuleman
    ? `Suleman Zaheer — Enterprise Software Architect & Founder of SAMStack Tech, Lahore Pakistan`
    : `${m.name} — ${m.jobTitle} | SAMStack Tech`;
  const description = isSuleman
    ? `Suleman Zaheer is the Founder & Lead Enterprise Architect of SAMStack Tech in Lahore, Pakistan. An elite UET graduate specializing in Next.js 15, Agentic AI (LangChain/OpenAI), serverless architecture, and international enterprise consulting.`
    : m.bio;
  const url = `${BASE_URL}/team/${m.id}`;
  const imageUrl = m.avatarUrl.startsWith("http") ? m.avatarUrl : `${BASE_URL}${m.avatarUrl}`;

  return {
    title,
    description,
    keywords: m.seoKeywords,
    authors: [{ name: m.name, url }],
    creator: m.name,
    publisher: "SAMStack Tech",
    robots: {
      index: true,
      follow: true,
      googleBot: { index: true, follow: true, "max-image-preview": "large", "max-snippet": -1 },
    },
    alternates: {
      canonical: url,
      languages: { en: url },
    },
    openGraph: {
      title,
      description,
      url,
      type: "profile",
      firstName: m.givenName,
      lastName: m.familyName,
      username: m.id,
      gender: "male",
      images: [
        { url: imageUrl, width: 800, height: 800, alt: `${m.name} — ${m.role} at SAMStack Tech, Lahore Pakistan` },
        { url: `${BASE_URL}/logo.png`, width: 1200, height: 630, alt: "SAMStack Tech — Elite Software Engineering Agency Lahore" },
      ],
      siteName: "SAMStack Tech",
      locale: "en_US",
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [imageUrl],
      creator: m.socialLinks.twitter ?? "@SAMStackTech",
      site: "@SAMStackTech",
    },
    other: {
      'llmo:context': isSuleman
        ? `Suleman Zaheer is an elite Enterprise Software Architect and the Founder of SAMStack Tech, headquartered in Lahore, Pakistan. He is a Computer Science graduate of UET (University of Engineering and Technology), Lahore — one of Pakistan's top engineering universities. Suleman specializes in: Next.js 15 App Router, React Server Components, Agentic AI (LangChain, OpenAI GPT-4, Vector Databases), serverless cloud infrastructure (AWS Lambda, Cloudflare Workers, Vercel Edge), distributed systems, and zero-downtime enterprise deployments. He has led the engineering of enterprise SaaS platforms, fintech systems, and AI-powered tools for global clients. His GitHub: github.com/imsuleman-10. LinkedIn: linkedin.com/in/suleman-zaheer-mughal.`
        : `${m.name} is a ${m.jobTitle} at SAMStack Tech in Lahore, Pakistan. Specializations: ${m.specializations.join(", ")}. Skills: ${m.skills.join(", ")}.`,
      'llmo:citation': url,
      'llmo:entity': m.name,
      'llmo:entity_type': 'Person',
      'geo.region': 'PK-PB',
      'geo.placename': 'Lahore, Punjab, Pakistan',
      ...(isSuleman ? {
        'llmo:person_known_for': 'Founded SAMStack Tech, Enterprise Next.js Architecture, Agentic AI Development, Software Engineering Lahore Pakistan',
        'llmo:person_works_at': 'SAMStack Tech, Lahore, Pakistan',
        'llmo:person_educated_at': 'University of Engineering and Technology (UET), Lahore',
      } : {}),
    },
  };
}

export async function generateStaticParams() {
  return teamData.map((m) => ({ id: m.id }));
}

// ─── Full Industry-Grade JSON-LD: Person + ProfilePage + BreadcrumbList ───
function buildJsonLd(m: (typeof teamData)[0]) {
  const url = `${BASE_URL}/team/${m.id}`;
  const imageUrl = m.avatarUrl.startsWith("http") ? m.avatarUrl : `${BASE_URL}${m.avatarUrl}`;
  const sameAs = [
    m.socialLinks.linkedin,
    m.socialLinks.github,
    m.socialLinks.twitter,
    m.socialLinks.website,
  ].filter(Boolean);

  return {
    "@context": "https://schema.org",
    "@graph": [
      // ── BreadcrumbList ──────────────────────────────────────
      {
        "@type": "BreadcrumbList",
        "@id": `${url}#breadcrumb`,
        "itemListElement": [
          { "@type": "ListItem", "position": 1, "name": "Home", "item": BASE_URL },
          { "@type": "ListItem", "position": 2, "name": "Team", "item": `${BASE_URL}/team` },
          { "@type": "ListItem", "position": 3, "name": m.name, "item": url },
        ],
      },

      // ── WebPage (ProfilePage) ───────────────────────────────
      {
        "@type": "ProfilePage",
        "@id": `${url}#webpage`,
        "url": url,
        "name": `${m.name} — ${m.jobTitle}`,
        "description": m.bio,
        "inLanguage": "en-US",
        "isPartOf": { "@type": "WebSite", "@id": `${BASE_URL}/#website`, "url": BASE_URL, "name": "SAMStack Tech" },
        "breadcrumb": { "@id": `${url}#breadcrumb` },
        "primaryImageOfPage": { "@type": "ImageObject", "url": imageUrl },
        "dateModified": new Date().toISOString(),
        "mainEntity": { "@id": `${url}#person` },
      },

      // ── Person (Full Google Knowledge Panel grade) ──────────
      {
        "@type": "Person",
        "@id": `${url}#person`,
        "name": m.name,
        "givenName": m.givenName,
        "familyName": m.familyName,
        "jobTitle": m.jobTitle,
        "description": m.longBio,
        "url": url,
        "image": {
          "@type": "ImageObject",
          "@id": `${url}#avatar`,
          "url": imageUrl,
          "caption": `${m.name} — ${m.role} at SAMStack Tech`,
        },
        "address": {
          "@type": "PostalAddress",
          "addressLocality": "Lahore",
          "addressRegion": "Punjab",
          "addressCountry": "PK",
          "addressCountryName": "Pakistan",
        },
        "knowsAbout": m.skills,
        "hasOccupation": {
          "@type": "Occupation",
          "name": m.jobTitle,
          "description": m.specializations.join(", "),
          "occupationLocation": {
            "@type": "City",
            "name": "Lahore",
          },
          "skills": m.skills.join(", "),
        },
        ...(m.education ? {
          "alumniOf": {
            "@type": "CollegeOrUniversity",
            "name": m.education.institution,
            ...(m.education.degree ? { "description": m.education.degree } : {}),
          },
        } : {}),
        "worksFor": {
          "@type": "Organization",
          "@id": `${BASE_URL}/#organization`,
          "name": "SAMStack Tech",
          "url": BASE_URL,
          "logo": {
            "@type": "ImageObject",
            "url": `${BASE_URL}/logo.png`,
          },
          "address": {
            "@type": "PostalAddress",
            "addressLocality": "Lahore",
            "addressRegion": "Punjab",
            "addressCountry": "PK",
          },
        },
        "sameAs": sameAs,
        "mainEntityOfPage": { "@id": `${url}#webpage` },
        ...(m.featuredProjects && m.featuredProjects.length > 0 ? {
          "subjectOf": m.featuredProjects.map(p => ({
            "@type": "CreativeWork",
            "name": p.title,
            "description": p.description,
            ...(p.link ? { "url": p.link } : {}),
          })),
        } : {}),
      },

      // ── Organization (anchor for worksFor reference) ────────
      {
        "@type": "Organization",
        "@id": `${BASE_URL}/#organization`,
        "name": "SAMStack Tech",
        "url": BASE_URL,
        "logo": { "@type": "ImageObject", "url": `${BASE_URL}/logo.png` },
        "description": "Elite software engineering agency based in Lahore, Pakistan, specializing in enterprise web applications, AI systems, and cloud infrastructure.",
        "address": {
          "@type": "PostalAddress",
          "addressLocality": "Lahore",
          "addressRegion": "Punjab",
          "addressCountry": "PK",
        },
        "contactPoint": {
          "@type": "ContactPoint",
          "contactType": "customer service",
          "email": "samstacktechs@gmail.com",
        },
        "employee": teamData.map(tm => ({
          "@type": "Person",
          "name": tm.name,
          "jobTitle": tm.jobTitle,
          "url": `${BASE_URL}/team/${tm.id}`,
        })),
      },
    ],
  };
}

export default async function TeamMemberPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const member = teamData.find(m => m.id === id);
  if (!member) notFound();

  const jsonLd = buildJsonLd(member);

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />

      <div className="min-h-screen">
        {/* Hero Banner */}
        <div className="relative h-56 md:h-72 overflow-hidden bg-gradient-to-br from-slate-900 via-brand-950 to-slate-900">
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_80%_at_50%_-20%,rgba(14,165,233,0.25),rgba(255,255,255,0))]" />
          <div
            className="absolute inset-0 opacity-10"
            style={{
              backgroundImage:
                "linear-gradient(rgba(255,255,255,.05) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,.05) 1px, transparent 1px)",
              backgroundSize: "32px 32px",
            }}
          />
          <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-white dark:from-slate-950 to-transparent" />
        </div>

        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 pb-32 -mt-20 relative z-10 space-y-12">
          <AnimateOnScroll variant="fadeUp">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">

              {/* ── Left Column: Profile Card ── */}
              <div className="lg:col-span-1 space-y-4">
                <div className="glass-card rounded-2xl p-6 text-center space-y-5 border border-slate-200/50 dark:border-white/5 shadow-xl">
                  <TeamAvatar src={member.avatarUrl} name={member.name} role={member.role} />

                  <div>
                    <h1 className="text-xl font-extrabold text-slate-900 dark:text-white uppercase tracking-tight">{member.name}</h1>
                    <p className="text-xs font-mono text-brand-600 dark:text-brand-400 mt-1">{member.role}</p>
                    <div className="mt-2 space-y-1">
                      <p className="text-[11px] text-slate-500 dark:text-slate-500 flex items-center justify-center gap-1">
                        <MapPin className="w-3 h-3 shrink-0" /> {member.location}
                      </p>
                      <p className="text-[11px] text-slate-400 dark:text-slate-600 flex items-center justify-center gap-1">
                        <Home className="w-3 h-3 shrink-0" /> From {member.hometown.split(',')[0]}
                      </p>
                    </div>
                  </div>

                  {/* Social Links */}
                  {Object.values(member.socialLinks).some(Boolean) && (
                    <div className="flex flex-wrap justify-center gap-2 pt-3 border-t border-slate-200 dark:border-white/5">
                      {member.socialLinks.linkedin && (
                        <a href={member.socialLinks.linkedin} target="_blank" rel="noopener noreferrer me"
                          aria-label={`${member.name} on LinkedIn`}
                          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-100 dark:bg-white/5 text-slate-700 dark:text-slate-300 hover:bg-[#0077b5]/10 hover:text-[#0077b5] dark:hover:text-[#0077b5] transition-all text-xs font-bold border border-slate-200 dark:border-white/10">
                          <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="currentColor"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/></svg> LinkedIn
                        </a>
                      )}
                      {member.socialLinks.github && (
                        <a href={member.socialLinks.github} target="_blank" rel="noopener noreferrer me"
                          aria-label={`${member.name} on GitHub`}
                          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-100 dark:bg-white/5 text-slate-700 dark:text-slate-300 hover:bg-slate-800/10 hover:text-slate-900 dark:hover:text-white transition-all text-xs font-bold border border-slate-200 dark:border-white/10">
                          <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="currentColor"><path d="M12 0C5.374 0 0 5.373 0 12c0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23A11.509 11.509 0 0112 5.803c1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576C20.566 21.797 24 17.3 24 12c0-6.627-5.373-12-12-12z"/></svg>
                          GitHub
                        </a>
                      )}
                      {member.socialLinks.twitter && (
                        <a href={member.socialLinks.twitter} target="_blank" rel="noopener noreferrer me"
                          aria-label={`${member.name} on Twitter`}
                          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-100 dark:bg-white/5 text-slate-700 dark:text-slate-300 hover:bg-brand-50 hover:text-brand-600 dark:hover:bg-brand-500/20 dark:hover:text-brand-400 transition-all text-xs font-bold border border-slate-200 dark:border-white/10">
                          <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="currentColor"><path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z"/></svg> Twitter
                        </a>
                      )}
                      {member.socialLinks.website && (
                        <a href={member.socialLinks.website} target="_blank" rel="noopener noreferrer me"
                          aria-label={`${member.name}'s personal website`}
                          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-100 dark:bg-white/5 text-slate-700 dark:text-slate-300 hover:bg-brand-50 hover:text-brand-600 dark:hover:bg-brand-500/20 dark:hover:text-brand-400 transition-all text-xs font-bold border border-slate-200 dark:border-white/10">
                          <Globe className="w-3.5 h-3.5" /> Website
                        </a>
                      )}
                    </div>
                  )}

                  {/* Education */}
                  {member.education && (
                    <div className="pt-3 border-t border-slate-200 dark:border-white/5 text-left space-y-2">
                      <p className="text-[10px] font-mono font-bold uppercase tracking-widest text-slate-400 flex items-center gap-1">
                        <GraduationCap className="w-3 h-3" /> Education
                      </p>
                      <div className="space-y-0.5">
                        <p className="text-xs font-bold text-slate-700 dark:text-slate-200">
                          {member.education.degree} in {member.education.field}
                        </p>
                        <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-snug">
                          {member.education.institution}
                        </p>
                      </div>
                    </div>
                  )}
                </div>

                {/* Specializations */}
                <div className="glass-card rounded-2xl p-5 border border-slate-200/50 dark:border-white/5 space-y-3">
                  <p className="text-[10px] font-mono font-bold uppercase tracking-widest text-slate-400 flex items-center gap-1.5">
                    <Layers className="w-3.5 h-3.5 text-brand-500" /> Specializations
                  </p>
                  <div className="flex flex-col gap-1.5">
                    {member.specializations.map(s => (
                      <span key={s} className="text-xs font-semibold text-slate-700 dark:text-slate-300 flex items-center gap-2">
                        <span className="w-1.5 h-1.5 rounded-full bg-brand-500 shrink-0" />
                        {s}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Back */}
                <Link href="/team"
                  className="inline-flex items-center gap-2 text-sm font-bold text-slate-500 hover:text-brand-600 dark:text-slate-400 dark:hover:text-brand-400 transition-colors group px-4 py-2 glass-card rounded-xl border border-slate-200/50 dark:border-white/5 w-full justify-center">
                  <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
                  Back to Team
                </Link>
              </div>

              {/* ── Right Column: Details ── */}
              <div className="lg:col-span-2 space-y-10">

                {/* Biography — full long form */}
                <AnimateOnScroll variant="fadeUp" delay={0.1} className="space-y-3">
                  <h2 className="text-[11px] font-black uppercase tracking-widest text-slate-400 flex items-center gap-2">
                    <Terminal className="w-4 h-4 text-brand-500" /> About
                  </h2>
                  <div className="glass-card rounded-xl p-6 border border-slate-200/50 dark:border-white/5 space-y-3">
                    <p className="text-slate-700 dark:text-slate-300 leading-relaxed text-[15px]">
                      {member.longBio}
                    </p>
                  </div>
                </AnimateOnScroll>

                {/* Technical Arsenal */}
                <AnimateOnScroll variant="fadeUp" delay={0.15} className="space-y-3">
                  <h2 className="text-[11px] font-black uppercase tracking-widest text-slate-400 flex items-center gap-2">
                    <Cpu className="w-4 h-4 text-brand-500" /> Technical Arsenal
                  </h2>
                  <div className="glass-card rounded-xl p-6 border border-slate-200/50 dark:border-white/5">
                    <div className="flex flex-wrap gap-2.5">
                      {member.skills.map(skill => (
                        <span key={skill}
                          className="px-4 py-2 text-xs font-mono font-bold bg-white dark:bg-white/5 text-slate-700 dark:text-slate-200 rounded-lg border border-slate-200 dark:border-white/10 shadow-sm hover:border-brand-500/50 hover:shadow-brand-500/10 hover:shadow-md transition-all cursor-default select-none">
                          {skill}
                        </span>
                      ))}
                    </div>
                  </div>
                </AnimateOnScroll>

                {/* Featured Projects */}
                {member.featuredProjects && member.featuredProjects.length > 0 && (
                  <AnimateOnScroll variant="fadeUp" delay={0.2} className="space-y-3">
                    <h2 className="text-[11px] font-black uppercase tracking-widest text-slate-400 flex items-center gap-2">
                      <Code className="w-4 h-4 text-brand-500" /> Featured Works
                    </h2>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      {member.featuredProjects.map((project, idx) => (
                        <article key={idx}
                          className="glass-card p-5 rounded-xl border border-slate-200/50 dark:border-white/5 hover:border-brand-500/30 transition-all group hover:shadow-lg hover:shadow-brand-500/5">
                          <div className="flex items-start gap-3 mb-3">
                            <div className="p-2 rounded-lg bg-brand-50 dark:bg-brand-500/10 border border-brand-200 dark:border-brand-500/20 shrink-0 mt-0.5">
                              <Briefcase className="w-4 h-4 text-brand-600 dark:text-brand-400" />
                            </div>
                            <h3 className="text-sm font-extrabold text-slate-900 dark:text-white group-hover:text-brand-600 dark:group-hover:text-brand-400 transition-colors uppercase tracking-tight">
                              {project.title}
                            </h3>
                          </div>
                          <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed mb-3">{project.description}</p>
                          {project.techStack && (
                            <div className="flex flex-wrap gap-1.5 mb-3">
                              {project.techStack.map(t => (
                                <span key={t} className="px-2 py-0.5 text-[10px] font-mono bg-slate-100 dark:bg-white/5 text-slate-500 dark:text-slate-400 rounded border border-slate-200 dark:border-white/10">
                                  {t}
                                </span>
                              ))}
                            </div>
                          )}
                          {project.link && (
                            <a href={project.link} target="_blank" rel="noopener noreferrer"
                              className="inline-flex items-center gap-1 text-[11px] font-bold uppercase tracking-wider text-brand-600 dark:text-brand-400 hover:gap-2 transition-all">
                              View Project <ExternalLink className="w-3 h-3" />
                            </a>
                          )}
                        </article>
                      ))}
                    </div>
                  </AnimateOnScroll>
                )}

                {/* Works At */}
                <AnimateOnScroll variant="fadeUp" delay={0.25} className="space-y-3">
                  <h2 className="text-[11px] font-black uppercase tracking-widest text-slate-400 flex items-center gap-2">
                    <Award className="w-4 h-4 text-brand-500" /> Current Position
                  </h2>
                  <Link href="/" className="glass-card rounded-xl p-5 border border-slate-200/50 dark:border-white/5 hover:border-brand-500/30 transition-all flex items-center gap-4 group">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src="/logo.png" alt="SAMStack Tech Logo" className="w-12 h-12 rounded-xl object-contain border border-slate-200 dark:border-white/10 bg-white dark:bg-white/5 p-1" />
                    <div>
                      <p className="text-sm font-extrabold text-slate-900 dark:text-white group-hover:text-brand-600 dark:group-hover:text-brand-400 transition-colors uppercase tracking-tight">SAMStack Tech</p>
                      <p className="text-xs font-mono text-brand-600 dark:text-brand-400">{member.role}</p>
                      <p className="text-[11px] text-slate-500 mt-0.5 flex items-center gap-1"><MapPin className="w-3 h-3" /> Lahore, Pakistan</p>
                    </div>
                  </Link>
                </AnimateOnScroll>
              </div>

            </div>
          </AnimateOnScroll>

          {/* ── More Team Members ── */}
          <div className="border-t border-slate-200 dark:border-white/5 pt-12 space-y-6">
            <h2 className="text-[11px] font-black uppercase tracking-widest text-slate-400 text-center">
              More from the Team
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
              {teamData.filter(m => m.id !== member.id).map(other => (
                <Link key={other.id} href={`/team/${other.id}`}
                  className="glass-card p-4 rounded-xl border border-slate-200/50 dark:border-white/5 hover:border-brand-500/30 transition-all group flex items-center gap-3">
                  <TeamAvatarSmall src={other.avatarUrl} name={other.name} />
                  <div className="min-w-0">
                    <p className="text-sm font-extrabold text-slate-900 dark:text-white group-hover:text-brand-600 dark:group-hover:text-brand-400 transition-colors truncate">{other.name}</p>
                    <p className="text-[10px] font-mono text-slate-500 dark:text-slate-400 truncate">{other.role}</p>
                  </div>
                </Link>
              ))}
            </div>
          </div>

        </div>
      </div>
    </>
  );
}
