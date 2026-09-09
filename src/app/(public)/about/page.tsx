"use client";

import React from "react";
import Link from "next/link";
import {
  ArrowRight,
  Sparkles,
  Shield,
  Zap,
  Globe,
  Users,
  Target,
  Award,
  TrendingUp,
  Rocket,
  Layers,
  Star,
  Bot,
  ArrowUpRight,
} from "lucide-react";
import Image from "next/image";
import AnimateOnScroll from "@/app/components/AnimateOnScroll";

const values = [
  {
    icon: Zap,
    title: "Performance First",
    desc: "Optimization at every layer. We build systems designed to scale gracefully under extreme loads without compromising response times.",
    iconBg: "from-blue-500/20 to-blue-600/20",
    iconBorder: "border-blue-500/30",
    iconColor: "text-blue-400",
    image: "/images/img-global-scale.jpg",
  },
  {
    icon: Shield,
    title: "Security by Design",
    desc: "Zero-trust architecture implemented from day one. Enterprise-grade security is a foundational requirement, never an afterthought.",
    iconBg: "from-emerald-500/20 to-emerald-600/20",
    iconBorder: "border-emerald-500/30",
    iconColor: "text-emerald-400",
    image: "/images/img-discovery.jpeg",
  },
  {
    icon: Target,
    title: "Precision Execution",
    desc: "Surgical deployment methodologies. We utilize advanced CI/CD pipelines to ensure flawless, continuous delivery of complex features.",
    iconBg: "from-violet-500/20 to-violet-600/20",
    iconBorder: "border-violet-500/30",
    iconColor: "text-violet-400",
    image: "/images/img-coding-workspace.jpg",
  },
  {
    icon: Globe,
    title: "Global Standards",
    desc: "Adhering strictly to international best practices. Our codebases are designed to be universally understood by elite engineering teams worldwide.",
    iconBg: "from-amber-500/20 to-amber-600/20",
    iconBorder: "border-amber-500/30",
    iconColor: "text-amber-400",
    image: "/images/img-global-scale.jpg",
  },
];

const milestones = [
  {
    year: "2025",
    title: "Foundation Established",
    event: "SAMStack Tech incorporated in Lahore. Initial team assembled focusing on bespoke enterprise architecture.",
    icon: Rocket,
    color: "border-brand-500",
    labelColor: "text-brand-500",
    image: "/images/img-office.jpg",
  },
  {
    year: "EARLY 2026",
    title: "SaaS & Mentorship",
    event: "Delivered first enterprise SaaS platform and launched the structured elite internship protocol.",
    icon: TrendingUp,
    color: "border-indigo-500",
    labelColor: "text-indigo-400",
    image: "/images/img-server-rack.jpg",
  },
  {
    year: "LATE 2026",
    title: "Agentic AI & Next-Gen DevOps",
    event: "Integration of autonomous agentic AI workflows into core DevOps pipelines for unprecedented deployment velocity.",
    icon: Bot,
    color: "border-violet-500",
    labelColor: "text-violet-400",
    image: "/images/img-server-rack.jpg",
  },
];

const stats = [
  { value: "14+", label: "Enterprise Projects", icon: Layers, image: "/images/img-global-scale.jpg" },
  { value: "9.9", label: "Avg NPS Score", icon: Star, image: "/images/img-team-meeting.jpg" },
  { value: "50+", label: "Interns Mentored", icon: Users, image: "/images/img-server-rack.jpg" },
  { value: "100%", label: "On-Time Delivery", icon: Award, image: "/images/img-matrix-code.jpg" },
];

const team = [
  {
    name: "Suleman Zaheer",
    role: "System Architecture & AI",
    image: "/suleman-zaheer-software-engineer-samstack-tech.jpeg",
    badge: "Founder & Lead",
    badgeBg: "bg-blue-500/20 border-blue-500/30",
    badgeText: "text-blue-400",
    skills: ["Next.js", "DevOps", "AI Agents", "System Design"],
    phone: "+923285778715",
    whatsapp: "https://wa.me/923285778715",
    email: "samstacktechs@gmail.com",
    linkedin: "https://www.linkedin.com/in/suleman-zaheer-mughal",
    github: "https://github.com/imsuleman-10",
    bio: "Founder of SAMStack Tech. Full Stack Engineer & DevOps Lead specializing in cloud-native systems, CI/CD pipelines, and AI-powered applications. Based in Lahore, Pakistan.",
    portfolioId: "suleman-zaheer",
  },
  {
    name: "Saqib Javed",
    role: "UI/UX & Client Logic",
    image: "/saqib-javed-software-engineer-samstack-tech.jpg",
    badge: "Frontend Engineering",
    badgeBg: "bg-emerald-500/20 border-emerald-500/30",
    badgeText: "text-emerald-400",
    skills: ["React", "TypeScript", "Framer Motion", "Figma"],
    phone: null,
    whatsapp: null,
    email: null,
    linkedin: null,
    github: null,
    bio: null,
    portfolioId: "saqib-javed",
  },
  {
    name: "Syed Abdullah",
    role: "Database & APIs",
    image: "/syed-abdullah-software-engineer-samstack-tech.png",
    badge: "Backend Engineering",
    badgeBg: "bg-violet-500/20 border-violet-500/30",
    badgeText: "text-violet-400",
    skills: ["Node.js", "PostgreSQL", "GraphQL", "Firebase"],
    phone: null,
    whatsapp: null,
    email: null,
    linkedin: null,
    github: null,
    bio: null,
    portfolioId: "syed-abdullah",
  },
];


export default function AboutPage() {
  return (
    <div className="flex-1 w-full bg-white/80 dark:bg-black text-slate-900 dark:text-white" style={{ overflowX: "clip" }}>

      {/* ══════════════════════════════════════════
          SLIDE 1: HERO
      ══════════════════════════════════════════ */}
      <section className="z-0 relative min-h-[100dvh] w-full flex flex-col justify-center pt-28 pb-10 px-4 sm:px-6 lg:px-8 overflow-hidden bg-white/80 dark:bg-black">
        {/* Background Gradients */}
        <div className="absolute inset-0 bg-gradient-to-br from-slate-50 via-white to-blue-50/30 dark:from-black dark:via-neutral-950 dark:to-black" />

        <div className="absolute inset-0 bg-[linear-gradient(rgba(0,0,0,0.025)_1px,transparent_1px),linear-gradient(90deg,rgba(0,0,0,0.025)_1px,transparent_1px)] dark:bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:64px_64px]" />

        <div className="relative z-10 max-w-7xl mx-auto w-full grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center">
          {/* Left: Copy */}
          <div className="flex flex-col items-start space-y-7">
            <AnimateOnScroll variant="fadeUp">
              <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-brand-50 dark:bg-brand-950/50 border border-brand-200 dark:border-brand-800/40 text-brand-700 dark:text-brand-400 text-[11px] font-bold uppercase tracking-[0.2em]">
                <Sparkles className="w-3 h-3" />
                Established 2025 &bull; Lahore, PK
              </div>
            </AnimateOnScroll>

            <AnimateOnScroll variant="fadeUp" delay={0.08}>
              <h1 className="text-5xl sm:text-6xl lg:text-7xl font-black text-slate-900 dark:text-white font-heading leading-[1.02] tracking-tight">
                Engineering the{" "}
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-600 via-brand-500 to-cyan-500 dark:from-brand-400 dark:via-brand-300 dark:to-cyan-400">
                  Extraordinary.
                </span>
              </h1>
            </AnimateOnScroll>

            <AnimateOnScroll variant="fadeUp" delay={0.14}>
              <p className="text-slate-500 dark:text-slate-400 text-lg sm:text-xl max-w-2xl leading-relaxed">
                A premium software engineering studio crafting enterprise-grade digital products,
                intelligent systems, and future-ready infrastructure.
              </p>
            </AnimateOnScroll>

            <AnimateOnScroll variant="fadeUp" delay={0.2}>
              <div className="flex flex-col sm:flex-row items-start gap-4">
                <Link href="/contact" className="inline-flex items-center gap-2 px-8 py-4 rounded-xl bg-slate-900 dark:bg-white/80 text-white dark:text-slate-900 font-bold text-sm hover:bg-slate-700 dark:hover:bg-slate-200 transition-colors shadow-lg group">
                  Start a Project <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </Link>
                <Link href="#values" className="inline-flex items-center gap-2 px-8 py-4 rounded-xl border border-slate-200 dark:border-neutral-700 text-slate-700 dark:text-slate-300 font-bold text-sm hover:border-brand-400 dark:hover:border-brand-600 transition-colors group">
                  Our Values
                </Link>
              </div>
            </AnimateOnScroll>
          </div>

          {/* Right: Visual */}
          <AnimateOnScroll variant="fadeUp" delay={0.12}>
            <div className="relative w-full h-[420px] lg:h-[520px] rounded-3xl overflow-hidden border border-slate-100 dark:border-neutral-800 shadow-2xl group">
              <Image
                src="/images/img-server-rack.jpg"
                alt="SAMStack Tech engineering team at work"
                fill sizes="(max-width: 768px) 100vw, 50vw"
                className="object-cover transition-transform duration-700 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
              {/* Floating stat cards */}
              <div className="absolute bottom-6 left-6 right-6 flex gap-3">
                <div className="flex-1 bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-4">
                  <div className="text-2xl font-black text-white font-mono">14+</div>
                  <div className="text-[10px] text-white/70 uppercase tracking-widest font-bold">Projects</div>
                </div>
                <div className="flex-1 bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-4">
                  <div className="text-2xl font-black text-white font-mono">100+</div>
                  <div className="text-[10px] text-white/70 uppercase tracking-widest font-bold">Interns</div>
                </div>
                <div className="flex-1 bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-4">
                  <div className="text-2xl font-black text-white font-mono">9.9★</div>
                  <div className="text-[10px] text-white/70 uppercase tracking-widest font-bold">Rating</div>
                </div>
              </div>
            </div>
          </AnimateOnScroll>
        </div>
      </section>

      {/* ══════════════════════════════════════════
          SLIDE 2: MISSION & STATS
      ══════════════════════════════════════════ */}
      <section className="z-0 relative min-h-[100dvh] w-full flex flex-col justify-center pt-28 pb-10 px-4 sm:px-6 lg:px-8 bg-slate-50/80 dark:bg-neutral-950 border-t border-slate-100 dark:border-neutral-900 overflow-hidden">
        <div className="relative z-10 max-w-7xl mx-auto w-full grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-24 items-center">

          <AnimateOnScroll variant="fadeUp">
            <div className="space-y-8">
              <div className="relative">
                <div className="text-8xl font-black text-slate-200 dark:text-neutral-800 absolute -top-10 -left-4 opacity-50 select-none leading-none">&ldquo;</div>
                <blockquote className="relative z-10 font-heading font-black text-4xl lg:text-5xl text-slate-900 dark:text-white tracking-tight leading-tight mb-8">
                  Democratizing elite engineering for ambitious builders worldwide.
                </blockquote>
                <div className="flex items-center gap-4">
                  <div className="w-12 h-1 bg-gradient-to-r from-brand-500 to-cyan-500 rounded-full" />
                  <span className="font-mono text-xs uppercase tracking-widest font-bold text-slate-600 dark:text-slate-400">
                    Suleman Zaheer, Founder
                  </span>
                </div>
              </div>
              {/* Founder card */}
              <Link href="/team/suleman-zaheer" className="flex items-center gap-4 p-5 rounded-2xl bg-white/80 dark:bg-neutral-900 border border-slate-100 dark:border-neutral-800 shadow-sm hover:border-brand-300 dark:hover:border-brand-700 hover:shadow-lg transition-all group">
                <div className="relative w-16 h-16 rounded-2xl overflow-hidden border-2 border-brand-200 dark:border-brand-800 shrink-0">
                  <Image src="/suleman-zaheer-software-engineer-samstack-tech.jpeg" alt="Suleman Zaheer - Founder" fill sizes="(max-width: 768px) 100vw, 50vw" className="object-cover object-top" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="font-bold text-slate-900 dark:text-white text-sm group-hover:text-brand-600 dark:group-hover:text-brand-400 transition-colors">Suleman Zaheer</div>
                  <div className="text-xs text-slate-500 dark:text-slate-400">Founder & Lead Architect</div>
                  <div className="flex gap-1 mt-1.5">
                    {["Next.js", "DevOps", "AI Agents"].map(s => (
                      <span key={s} className="text-[9px] px-2 py-0.5 rounded-md bg-brand-50 dark:bg-brand-950/40 text-brand-600 dark:text-brand-400 font-mono font-bold border border-brand-100 dark:border-brand-900/50">{s}</span>
                    ))}
                  </div>
                </div>
                <svg className="w-4 h-4 text-slate-400 group-hover:text-brand-500 transition-colors shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" /></svg>
              </Link>
            </div>
          </AnimateOnScroll>

          <div className="grid grid-cols-2 gap-4 sm:gap-6">
            {stats.map((stat, i) => (
              <AnimateOnScroll key={stat.label} variant="fadeUp" delay={0.08 * i} className="h-full">
                <div className="relative p-6 sm:p-8 rounded-2xl bg-white/80 dark:bg-neutral-900/50 border border-slate-100 dark:border-neutral-800 hover:border-brand-300 dark:hover:border-brand-700 transition-all duration-300 group/card shadow-sm hover:shadow-lg overflow-hidden h-full">
                  <div className="absolute inset-0 z-0 pointer-events-none rounded-[inherit] overflow-hidden">
                    <Image src={stat.image} alt={stat.label} fill sizes="(max-width: 768px) 100vw, 50vw" className="object-cover opacity-20 group-hover/card:opacity-30 transition-opacity duration-500" />
                  </div>
                  <div className="relative z-10 w-10 h-10 rounded-xl bg-brand-50 dark:bg-brand-950/40 border border-brand-100 dark:border-brand-900/50 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                    <stat.icon className="w-5 h-5 text-brand-600 dark:text-brand-400" />
                  </div>
                  <div className="relative z-10 font-heading font-black text-4xl sm:text-5xl text-slate-900 dark:text-white mb-1 tracking-tight">
                    {stat.value}
                  </div>
                  <div className="relative z-10 font-mono text-[10px] sm:text-xs uppercase tracking-widest font-bold text-slate-500 dark:text-slate-400">
                    {stat.label}
                  </div>
                </div>
              </AnimateOnScroll>
            ))}
          </div>

        </div>
      </section>

      {/* ══════════════════════════════════════════
          SLIDE 3: CORE VALUES
      ══════════════════════════════════════════ */}
      <section id="values" className="z-0 relative min-h-[100dvh] w-full flex flex-col justify-center pt-28 pb-10 px-4 sm:px-6 lg:px-8 bg-white/80 dark:bg-black overflow-hidden border-t border-slate-100 dark:border-neutral-900">
        <div className="relative z-10 max-w-7xl mx-auto w-full space-y-12 lg:space-y-16">
          <AnimateOnScroll variant="fadeUp">
            <div className="text-center space-y-3">
              <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-slate-50/80 dark:bg-neutral-900 border border-slate-200 dark:border-neutral-800 text-slate-500 dark:text-slate-400 text-[11px] font-bold uppercase tracking-[0.2em]">
                <Shield className="w-3 h-3 text-brand-500" />
                What We Believe
              </div>
              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-slate-900 dark:text-white font-heading tracking-tight">
                Core Architecture
              </h2>
              <p className="text-slate-500 dark:text-slate-400 max-w-xl mx-auto text-base">
                The fundamental principles that govern our engineering processes and dictate our standard of delivery.
              </p>
            </div>
          </AnimateOnScroll>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8">
            {values.map((value, i) => (
              <AnimateOnScroll key={value.title} variant="fadeUp" delay={0.08 * i} className="h-full">
                <div className="relative p-8 sm:p-10 rounded-3xl bg-slate-50/80 dark:bg-neutral-900/40 border border-slate-100 dark:border-neutral-800 flex flex-col sm:flex-row items-start gap-6 hover:bg-white/80 dark:hover:bg-neutral-900 hover:border-slate-300 dark:hover:border-neutral-700 transition-all duration-300 shadow-sm hover:shadow-xl overflow-hidden group h-full">
                  <div className="absolute inset-0 z-0 pointer-events-none rounded-[inherit] overflow-hidden">
                    <Image src={value.image} alt={value.title} fill sizes="(max-width: 768px) 100vw, 50vw" className="object-cover opacity-[0.08] dark:opacity-[0.18] group-hover:opacity-[0.15] dark:group-hover:opacity-[0.28] transition-opacity duration-500" />
                  </div>
                  <div className={`relative z-10 w-14 h-14 rounded-2xl bg-gradient-to-br ${value.iconBg} flex items-center justify-center border ${value.iconBorder} shrink-0 group-hover:scale-110 transition-transform`}>
                    <value.icon className={`w-6 h-6 ${value.iconColor}`} />
                  </div>
                  <div className="relative z-10 space-y-2">
                    <h3 className="font-heading font-bold text-xl text-slate-900 dark:text-white">{value.title}</h3>
                    <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">{value.desc}</p>
                  </div>
                </div>
              </AnimateOnScroll>
            ))}
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════
          SLIDE 4: THE TEAM
      ══════════════════════════════════════════ */}
      <section id="team" className="z-0 relative min-h-[100dvh] w-full flex flex-col justify-center pt-28 pb-10 px-4 sm:px-6 lg:px-8 bg-slate-50/80 dark:bg-neutral-950 overflow-hidden border-t border-slate-100 dark:border-neutral-900 group/section">

        <div className="relative z-10 max-w-7xl mx-auto w-full space-y-12 lg:space-y-16">
          <AnimateOnScroll variant="fadeUp">
            <div className="text-center space-y-3">
              <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/80 dark:bg-neutral-900 border border-slate-200 dark:border-neutral-800 text-slate-500 dark:text-slate-400 text-[11px] font-bold uppercase tracking-[0.2em]">
                <Users className="w-3 h-3 text-brand-500" />
                The Team
              </div>
              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-slate-900 dark:text-white font-heading tracking-tight">
                The Engineering Core
              </h2>
              <p className="text-slate-500 dark:text-slate-400 max-w-xl mx-auto text-base">
                Senior engineers only. No juniors. No compromise.
              </p>
            </div>
          </AnimateOnScroll>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8">
            {team.map((member, i) => (
              <AnimateOnScroll key={member.name} variant="fadeUp" delay={0.1 * i} className="h-full">
                <Link
                  href={`/team/${member.portfolioId}`}
                  className="group/card relative rounded-3xl overflow-hidden border border-slate-200 dark:border-neutral-800 bg-white/80 dark:bg-neutral-900 aspect-[3/4] hover:border-brand-300 dark:hover:border-brand-700 hover:shadow-2xl transition-all duration-500 h-full flex flex-col block"
                >
                  <Image
                    src={member.image}
                    alt={member.name}
                    fill sizes="(max-width: 768px) 100vw, 50vw"
                    className="object-cover object-top opacity-80 mix-blend-luminosity group-hover/card:scale-105 group-hover/card:opacity-100 group-hover/card:mix-blend-normal transition-all duration-700"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black via-black/60 to-transparent opacity-90 group-hover/card:opacity-100 transition-opacity" />

                  {/* Portfolio hover pill */}
                  <div className="absolute top-4 right-4 opacity-0 group-hover/card:opacity-100 transition-all duration-300 translate-y-1 group-hover/card:translate-y-0">
                    <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/20 backdrop-blur-md border border-white/30 text-white text-[10px] font-bold uppercase tracking-wider">
                      <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}><path strokeLinecap="round" strokeLinejoin="round" d="M13.5 6H5.25A2.25 2.25 0 003 8.25v10.5A2.25 2.25 0 005.25 21h10.5A2.25 2.25 0 0018 18.75V10.5m-10.5 6L21 3m0 0h-5.25M21 3v5.25" /></svg>
                      View Portfolio
                    </span>
                  </div>

                  <div className="absolute inset-0 p-6 flex flex-col justify-end">
                    <div className={`${member.badgeBg} ${member.badgeText} font-mono text-[9px] font-bold uppercase tracking-widest px-3 py-1.5 rounded-full w-fit mb-3 border`}>
                      {member.badge}
                    </div>
                    <h3 className="font-heading font-black text-2xl mb-1 text-white">{member.name}</h3>
                    <p className="text-slate-300 mb-4 font-bold text-xs uppercase tracking-wider">{member.role}</p>

                    <div className="flex gap-1.5 flex-wrap">
                      {member.skills.map((skill) => (
                        <span key={skill} className="text-[10px] font-mono font-bold uppercase text-slate-300 bg-white/10 backdrop-blur-sm px-2.5 py-1 rounded-md border border-white/20">
                          {skill}
                        </span>
                      ))}
                    </div>

                    {/* Socials - Reveal on Hover for Desktop, always visible on Mobile */}
                    {(member.linkedin || member.github) && (
                      <div className="pt-4 mt-4 border-t border-white/20 flex gap-2 lg:opacity-0 lg:-translate-y-2 group-hover/card:opacity-100 group-hover/card:translate-y-0 transition-all duration-300">
                        {member.linkedin && (
                          <button type="button" onClick={e => { e.preventDefault(); e.stopPropagation(); window.open(member.linkedin, '_blank', 'noopener,noreferrer'); }} className="p-2 rounded-lg bg-white/10 hover:bg-brand-500 border border-white/20 hover:border-brand-500 text-white transition-colors">
                            <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" /></svg>
                          </button>
                        )}
                        {member.github && (
                          <button type="button" onClick={e => { e.preventDefault(); e.stopPropagation(); window.open(member.github, '_blank', 'noopener,noreferrer'); }} className="p-2 rounded-lg bg-white/10 hover:bg-slate-700 border border-white/20 hover:border-slate-700 text-white transition-colors">
                            <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor"><path d="M12 0C5.374 0 0 5.373 0 12c0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23A11.509 11.509 0 0112 5.803c1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576C20.566 21.797 24 17.3 24 12c0-6.627-5.373-12-12-12z" /></svg>
                          </button>
                        )}
                      </div>
                    )}
                  </div>
                </Link>
              </AnimateOnScroll>
            ))}
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════
          SLIDE 5: TIMELINE
      ══════════════════════════════════════════ */}
      <section className="z-0 relative min-h-[100dvh] w-full flex flex-col justify-start sm:justify-center pt-28 pb-10 px-4 sm:px-6 lg:px-8 bg-white/80 dark:bg-black overflow-hidden border-t border-slate-100 dark:border-neutral-900 group/section">

        <div className="relative z-10 max-w-4xl mx-auto w-full">
          <AnimateOnScroll variant="fadeUp">
            <div className="text-center space-y-3 mb-16 lg:mb-24">
              <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-slate-50/80 dark:bg-neutral-900 border border-slate-200 dark:border-neutral-800 text-slate-500 dark:text-slate-400 text-[11px] font-bold uppercase tracking-[0.2em]">
                <TrendingUp className="w-3 h-3 text-brand-500" />
                Our Journey
              </div>
              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-slate-900 dark:text-white font-heading tracking-tight">
                Evolution Protocol
              </h2>
            </div>
          </AnimateOnScroll>

          <div className="relative">
            {/* Center line */}
            <div className="absolute left-[32px] md:left-1/2 top-0 bottom-0 w-1 bg-gradient-to-b from-brand-500 via-indigo-500 to-transparent -translate-x-1/2 rounded-full opacity-50" />

            {milestones.map((m, i) => {
              const isLeft = i % 2 === 0;
              return (
                <AnimateOnScroll key={m.year} variant="fadeUp" delay={0.1 * i}>
                  <div className={`relative mb-12 md:mb-16 flex items-center w-full md:w-1/2 ${isLeft ? "md:justify-end" : "md:justify-start md:ml-auto"}`}>

                    <div className={`absolute left-[32px] -translate-x-1/2 md:left-auto ${isLeft ? "md:right-0 md:translate-x-1/2" : "md:left-0 md:-translate-x-1/2"} w-10 h-10 rounded-full bg-white/80 dark:bg-neutral-900 ${m.color} border-4 z-10 flex items-center justify-center shadow-lg`}>
                      <m.icon className="w-4 h-4 text-slate-700 dark:text-slate-300" />
                    </div>

                    <div className={`relative w-[calc(100%-72px)] ml-[72px] ${isLeft ? "md:w-[calc(100%-56px)] md:ml-0 md:mr-[56px]" : "md:w-[calc(100%-56px)] md:ml-[56px]"} bg-slate-50/80 dark:bg-neutral-900/50 p-6 sm:p-8 rounded-3xl border border-slate-100 dark:border-neutral-800 hover:border-slate-300 dark:hover:border-neutral-700 transition-colors shadow-sm hover:shadow-lg ${isLeft ? "md:text-right" : "md:text-left"} overflow-hidden group`}>
                      <div className="absolute inset-0 z-0 pointer-events-none rounded-[inherit] overflow-hidden">
                        <Image src={m.image} alt={m.title} fill sizes="(max-width: 768px) 100vw, 50vw" className="object-cover opacity-[0.08] dark:opacity-[0.18] group-hover:opacity-[0.15] dark:group-hover:opacity-[0.28] transition-opacity duration-500" />
                      </div>
                      <div className={`relative z-10 font-mono font-bold tracking-widest mb-2 text-[10px] sm:text-xs ${m.labelColor}`}>{m.year}</div>
                      <h3 className="relative z-10 font-heading font-bold text-xl sm:text-2xl mb-2 text-slate-900 dark:text-white">{m.title}</h3>
                      <p className="relative z-10 text-slate-500 dark:text-slate-400 text-sm leading-relaxed">{m.event}</p>
                    </div>
                  </div>
                </AnimateOnScroll>
              );
            })}
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════
          SLIDE 6: CTA BANNER
      ══════════════════════════════════════════ */}
      <section className="z-0 relative min-h-[100dvh] w-full flex flex-col justify-center pt-28 pb-10 px-4 sm:px-6 lg:px-8 overflow-hidden bg-slate-900 dark:bg-neutral-950 group/section">

        <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_60%_at_50%_-10%,rgba(14,165,233,0.18),transparent)]" />
        <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:64px_64px]" />

        <div className="relative z-10 max-w-4xl mx-auto text-center space-y-8 w-full">
          <AnimateOnScroll variant="fadeUp">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/10 border border-white/15 text-white/70 text-[11px] font-bold uppercase tracking-[0.2em]">
              <Sparkles className="w-3 h-3 text-cyan-400" />
              Ready to Build?
            </div>
          </AnimateOnScroll>

          <AnimateOnScroll variant="fadeUp" delay={0.08}>
            <h2 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-white font-heading leading-tight tracking-tight">
              Ready to build something{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-brand-400">
                legendary?
              </span>
            </h2>
          </AnimateOnScroll>

          <AnimateOnScroll variant="fadeUp" delay={0.12}>
            <p className="text-white/60 text-base sm:text-lg max-w-xl mx-auto leading-relaxed">
              Let&apos;s turn your vision into a scalable, production-grade reality.
              We are ready when you are.
            </p>
          </AnimateOnScroll>

          <AnimateOnScroll variant="fadeUp" delay={0.16}>
            <div className="flex flex-wrap gap-4 sm:gap-6 justify-center">
              <Link href="/contact" className="inline-flex items-center gap-2 px-8 py-4 rounded-xl bg-white/80 hover:bg-slate-100 text-slate-900 font-bold text-sm transition-all shadow-2xl group">
                Initiate Project <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </Link>
              <Link href="/portfolio" className="inline-flex items-center gap-2 px-8 py-4 rounded-xl bg-white/10 hover:bg-white/15 border border-white/20 hover:border-white/30 text-white font-bold text-sm transition-all group">
                View Portfolio <ArrowUpRight className="w-4 h-4 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
              </Link>
            </div>
          </AnimateOnScroll>
        </div>
      </section>

    </div>
  );
}
