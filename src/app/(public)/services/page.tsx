"use client";

import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import {
  ArrowRight, ArrowUpRight, CheckCircle2, Zap, Shield, Clock, Star,
  Sparkles, ChevronRight, Users, BarChart3, Globe2,
} from "lucide-react";
import AnimateOnScroll from "@/app/components/AnimateOnScroll";
import { services } from "@/lib/data/services";

const stats = [
  { value: "98%", label: "On-Time Delivery", sublabel: "Across all projects" },
  { value: "40+", label: "Enterprise Clients", sublabel: "Globally served" },
  { value: "12h", label: "Response Time", sublabel: "Guaranteed SLA" },
  { value: "5★", label: "Avg Client Rating", sublabel: "On all platforms" },
];

const trustItems = [
  { icon: Clock,  label: "< 12h Response",      desc: "Every inquiry gets a personalised reply within 12 business hours from a senior engineer.", image: "/images/img-servers.jpg" },
  { icon: Shield, label: "Full NDA Protection", desc: "All submitted project ideas are protected under a strict mutual NDA before any discussion.", image: "/images/img-ai-tech.jpg" },
  { icon: Star,   label: "Quality Guaranteed",  desc: "We stand behind every line of code. Unlimited revisions until you are 100% satisfied.", image: "/images/img-server-rack.jpg" },
  { icon: Users,  label: "Dedicated Team",      desc: "A fixed pod of engineers owns your project end-to-end — no hand-offs, no account managers.", image: "/images/img-coding-laptop.jpg" },
  { icon: BarChart3, label: "Transparent Pricing", desc: "Fixed-scope contracts with milestone billing. No surprise invoices, ever.", image: "/images/img-design-tools.jpg" },
  { icon: Globe2, label: "Global Standards",    desc: "ISO-aligned development practices and GDPR-compliant data handling across all projects.", image: "/images/img-global-scale.jpg" },
];

const phases = [
  { step: "01", title: "Discovery & Scoping", desc: "Deep-dive into your requirements, goals, and technical landscape. We map every constraint before writing a line of code.", color: "from-brand-500 to-brand-600", image: "/images/img-team-meeting.jpg" },
  { step: "02", title: "Architecture Design",  desc: "System diagrams, tech stack decisions, API contracts, and a complete engineering roadmap with milestone dates.", color: "from-indigo-500 to-indigo-600", image: "/images/img-discovery.jpeg" },
  { step: "03", title: "Agile Engineering",    desc: "Two-week sprints with live demo sessions. CI/CD from day one, with full test coverage and code review gates.", color: "from-violet-500 to-violet-600", image: "/images/img-mobile-dev.jpg" },
  { step: "04", title: "Launch & Scale",        desc: "Zero-downtime deployment, production monitoring setup, performance profiling, and post-launch hypercare.", color: "from-emerald-500 to-teal-600", image: "/images/img-matrix-code.jpg" },
];

// Service accent colours — one per service in order
const accentColors = [
  "from-brand-500 to-cyan-500",
  "from-indigo-500 to-blue-500",
  "from-violet-500 to-purple-500",
  "from-emerald-500 to-teal-500",
  "from-orange-500 to-amber-500",
  "from-pink-500 to-rose-500",
  "from-sky-500 to-cyan-500",
];

export default function ServicesPage() {
  const [activeService, setActiveService] = useState(0);

  return (
    <div className="flex-1 w-full bg-white dark:bg-black text-slate-900 dark:text-white" style={{ overflowX: "clip" }}>

      {/* ══════════════════════════════════════════
          HERO — Full-height statement
      ══════════════════════════════════════════ */}
      <section className="z-0 relative min-h-[100dvh] w-full snap-start flex flex-col justify-center pt-28 pb-10 px-4 sm:px-6 lg:px-8 overflow-hidden">
        {/* Background layers - no images on section */}
        <div className="absolute inset-0 bg-gradient-to-br from-slate-50 via-white to-blue-50/30 dark:from-black dark:via-neutral-950 dark:to-black" />

        {/* Grid */}
        <div className="absolute inset-0 bg-[linear-gradient(rgba(0,0,0,0.025)_1px,transparent_1px),linear-gradient(90deg,rgba(0,0,0,0.025)_1px,transparent_1px)] dark:bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:64px_64px]" />

        <div className="relative z-10 max-w-7xl mx-auto w-full">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center">

            {/* Left copy */}
            <div className="space-y-7">
              <AnimateOnScroll variant="fadeUp">
                <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-brand-50 dark:bg-brand-950/50 border border-brand-200 dark:border-brand-800/40 text-brand-700 dark:text-brand-400 text-[11px] font-bold uppercase tracking-[0.2em]">
                  <Sparkles className="w-3 h-3" />
                  SAMStack Tech — Engineering Services
                </div>
              </AnimateOnScroll>

              <AnimateOnScroll variant="fadeUp" delay={0.08}>
                <h1 className="text-5xl sm:text-6xl lg:text-7xl font-black text-slate-900 dark:text-white font-heading leading-[1.02] tracking-tight">
                  Software That<br />
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-600 via-brand-500 to-cyan-500 dark:from-brand-400 dark:via-brand-300 dark:to-cyan-400">
                    Moves Markets.
                  </span>
                </h1>
              </AnimateOnScroll>

              <AnimateOnScroll variant="fadeUp" delay={0.14}>
                <p className="text-slate-500 dark:text-slate-400 text-lg leading-relaxed max-w-lg">
                  We don&apos;t build features — we engineer competitive advantages. 
                  From zero to production-scale in weeks, not quarters.
                </p>
              </AnimateOnScroll>

              <AnimateOnScroll variant="fadeUp" delay={0.2}>
                <div className="flex flex-wrap gap-3 pt-2">
                  <Link href="/contact" className="inline-flex items-center gap-2 px-7 py-3.5 rounded-xl bg-slate-900 dark:bg-white text-white dark:text-slate-900 font-bold text-sm hover:bg-slate-700 dark:hover:bg-slate-200 transition-colors shadow-lg group">
                    Start a Project
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </Link>
                  <a href="#services-grid" className="inline-flex items-center gap-2 px-7 py-3.5 rounded-xl border border-slate-200 dark:border-neutral-700 text-slate-700 dark:text-slate-300 font-bold text-sm hover:border-brand-400 dark:hover:border-brand-600 transition-colors group">
                    Explore Services
                    <ChevronRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
                  </a>
                </div>
              </AnimateOnScroll>
            </div>

            {/* Right — Hero Visual */}
            <AnimateOnScroll variant="fadeUp" delay={0.12}>
              <div className="relative w-full h-[460px] lg:h-[540px] rounded-3xl overflow-hidden border border-slate-100 dark:border-neutral-800 shadow-2xl group">
                <Image
                  src="/images/img-coding-workspace.jpg"
                  alt="Enterprise software engineering at SAMStack Tech"
                  fill sizes="(max-width: 768px) 100vw, 50vw"
                  className="object-cover transition-transform duration-700 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />
                {/* Floating badges */}
                <div className="absolute top-5 left-5 flex items-center gap-2 px-3 py-1.5 rounded-full bg-black/40 backdrop-blur-md border border-white/20 text-white text-[11px] font-bold">
                  <Sparkles className="w-3 h-3 text-brand-400" />
                  SAMStack Tech Services
                </div>
                {/* Stat cards */}
                <div className="absolute bottom-6 left-6 right-6 grid grid-cols-2 gap-3">
                  {stats.map((s) => (
                    <div key={s.label} className="bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-4">
                      <div className="text-2xl font-black text-white font-mono">{s.value}</div>
                      <div className="text-[10px] text-white/60 uppercase tracking-widest font-bold mt-0.5">{s.label}</div>
                    </div>
                  ))}
                </div>
              </div>
            </AnimateOnScroll>
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════
          INTERACTIVE SERVICES SHOWCASE
      ══════════════════════════════════════════ */}
      <section id="services-grid" className="z-0 relative min-h-[100dvh] w-full snap-start flex flex-col justify-center pt-28 pb-10 px-4 sm:px-6 lg:px-8 bg-slate-50 dark:bg-neutral-950 overflow-hidden">
        {/* No background image on section - clean solid background */}
        <div className="relative z-10 max-w-7xl mx-auto space-y-16 lg:space-y-24">

          <AnimateOnScroll variant="fadeUp">
            <div className="text-center space-y-3">
              <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white dark:bg-neutral-900 border border-slate-200 dark:border-neutral-800 text-slate-500 dark:text-slate-400 text-[11px] font-bold uppercase tracking-[0.2em]">
                <Zap className="w-3 h-3 text-brand-500" />
                What We Engineer
              </div>
              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-slate-900 dark:text-white font-heading tracking-tight">
                Our Core Capabilities
              </h2>
              <p className="text-slate-500 dark:text-slate-400 max-w-xl mx-auto text-base">
                End-to-end engineering across every layer of the modern tech stack.
              </p>
            </div>
          </AnimateOnScroll>

          {/* Desktop: sidebar + detail panel */}
          <div className="hidden lg:grid grid-cols-5 gap-6 min-h-[520px]">
            {/* Sidebar nav */}
            <div className="col-span-2 flex flex-col gap-2">
              {services.map((svc, i) => (
                <button
                  key={svc.id}
                  onClick={() => setActiveService(i)}
                  className={`group text-left px-5 py-4 rounded-2xl border transition-all duration-300 flex items-center gap-4 ${
                    activeService === i
                      ? "bg-white dark:bg-neutral-900 border-brand-300 dark:border-brand-700 shadow-md"
                      : "bg-transparent border-transparent hover:bg-white/60 dark:hover:bg-neutral-900/60 hover:border-slate-200 dark:hover:border-neutral-800"
                  }`}
                >
                  <div className={`w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0 transition-all duration-300 ${
                    activeService === i
                      ? `bg-gradient-to-br ${accentColors[i]} shadow-lg`
                      : "bg-slate-100 dark:bg-neutral-800"
                  }`}>
                    <svc.icon className={`w-4 h-4 ${activeService === i ? "text-white" : "text-slate-500 dark:text-slate-400"}`} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className={`text-sm font-bold truncate transition-colors ${activeService === i ? "text-slate-900 dark:text-white" : "text-slate-600 dark:text-slate-400"}`}>
                      {svc.title}
                    </div>
                    <div className="text-xs text-slate-400 dark:text-slate-500 truncate">{svc.subtitle}</div>
                  </div>
                  <ChevronRight className={`w-4 h-4 flex-shrink-0 transition-all duration-300 ${activeService === i ? "text-brand-500 translate-x-0.5" : "text-slate-300 dark:text-neutral-700"}`} />
                </button>
              ))}
            </div>

            {/* Detail panel */}
            <div className="col-span-3 relative rounded-3xl overflow-hidden bg-white dark:bg-neutral-900 border border-slate-100 dark:border-neutral-800 shadow-xl">
              {services[activeService] && (
                <>
                  {/* Image */}
                  <div className="relative h-56 w-full overflow-hidden">
                    <Image
                      key={activeService}
                      src={services[activeService].image}
                      alt={services[activeService].title}
                      fill sizes="(max-width: 768px) 100vw, 50vw"
                      className="object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-white dark:from-neutral-900 via-transparent to-transparent" />
                    {/* Floating badge */}
                    <div className={`absolute top-4 left-4 px-3 py-1.5 rounded-full text-[10px] font-bold uppercase tracking-widest text-white bg-gradient-to-r ${accentColors[activeService]} shadow-lg`}>
                      {services[activeService].subtitle}
                    </div>
                  </div>

                  <div className="p-7 space-y-5">
                    <div>
                      <h3 className="text-2xl font-extrabold text-slate-900 dark:text-white font-heading">{services[activeService].title}</h3>
                      <p className="text-slate-500 dark:text-slate-400 text-sm mt-2 leading-relaxed">{services[activeService].description}</p>
                    </div>

                    <div className="grid grid-cols-2 gap-2">
                      {services[activeService].features.map((f) => (
                        <div key={f} className="flex items-center gap-2 text-xs text-slate-700 dark:text-slate-300">
                          <CheckCircle2 className="w-3.5 h-3.5 text-brand-500 flex-shrink-0" />
                          <span>{f}</span>
                        </div>
                      ))}
                    </div>

                    <div className="flex items-center justify-between pt-4 border-t border-slate-100 dark:border-neutral-800">
                      <div className="flex flex-wrap gap-1.5">
                        {services[activeService].techStack.slice(0, 4).map((t) => (
                          <span key={t} className="px-2.5 py-1 rounded-md bg-slate-50 dark:bg-neutral-800 border border-slate-200 dark:border-neutral-700 text-[10px] font-mono text-slate-500 dark:text-slate-400">{t}</span>
                        ))}
                      </div>
                      <Link href={`/services/${services[activeService].slug}`} className="inline-flex items-center gap-1.5 text-xs font-bold text-brand-600 dark:text-brand-400 hover:text-brand-700 dark:hover:text-brand-300 transition-colors group">
                        Full Details
                        <ArrowUpRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                      </Link>
                    </div>
                  </div>
                </>
              )}
            </div>
          </div>

          {/* Mobile: cards grid */}
          <div className="lg:hidden grid grid-cols-1 sm:grid-cols-2 gap-6 sm:gap-8">
            {services.map((svc, i) => (
              <AnimateOnScroll key={svc.id} delay={0.06 * i} variant="fadeUp">
                <Link href={`/services/${svc.slug}`} className="group flex flex-col rounded-2xl border border-slate-100 dark:border-neutral-800 bg-white dark:bg-neutral-900/60 overflow-hidden shadow-sm hover:shadow-xl hover:border-brand-300 dark:hover:border-brand-700 transition-all duration-300">
                  <div className="relative h-44 overflow-hidden">
                    <Image src={svc.image} alt={svc.title} fill sizes="(max-width: 768px) 100vw, 50vw" className="object-cover transition-transform duration-700 group-hover:scale-105" />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                    <div className={`absolute top-3 left-3 px-2.5 py-1 rounded-full text-[9px] font-bold uppercase tracking-widest text-white bg-gradient-to-r ${accentColors[i]}`}>
                      {svc.subtitle}
                    </div>
                    <div className={`absolute bottom-3 left-3 w-8 h-8 rounded-xl bg-gradient-to-br ${accentColors[i]} flex items-center justify-center shadow-lg`}>
                      <svc.icon className="w-4 h-4 text-white" />
                    </div>
                  </div>
                  <div className="p-4 space-y-2 flex-1 flex flex-col">
                    <h3 className="text-sm font-bold text-slate-900 dark:text-white font-heading">{svc.title}</h3>
                    <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed line-clamp-2 flex-1">{svc.description}</p>
                    <div className="flex items-center gap-1 text-xs font-bold text-brand-600 dark:text-brand-400 pt-2 border-t border-slate-100 dark:border-neutral-800">
                      Explore <ArrowRight className="w-3 h-3 group-hover:translate-x-1 transition-transform" />
                    </div>
                  </div>
                </Link>
              </AnimateOnScroll>
            ))}
          </div>

        </div>
      </section>

      {/* ══════════════════════════════════════════
          PROCESS — Numbered horizontal stepper
      ══════════════════════════════════════════ */}
      <section className="z-0 relative min-h-[100dvh] w-full snap-start flex flex-col justify-center pt-28 pb-10 px-4 sm:px-6 lg:px-8 bg-white dark:bg-black overflow-hidden">
        {/* No background image on section - clean solid background */}

        <div className="relative z-10 max-w-7xl mx-auto space-y-16 lg:space-y-24">
          <AnimateOnScroll variant="fadeUp">
            <div className="text-center space-y-3">
              <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-slate-50 dark:bg-neutral-900 border border-slate-200 dark:border-neutral-800 text-slate-500 dark:text-slate-400 text-[11px] font-bold uppercase tracking-[0.2em]">
                <Zap className="w-3 h-3 text-brand-500" />
                How We Work
              </div>
              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-slate-900 dark:text-white font-heading tracking-tight">
                Our Delivery Process
              </h2>
              <p className="text-slate-500 dark:text-slate-400 max-w-xl mx-auto text-base">
                A proven, structured workflow that eliminates surprises and ships on time.
              </p>
            </div>
          </AnimateOnScroll>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8 relative">
            {/* Connecting line on desktop */}
            <div className="hidden lg:block absolute top-8 left-[12.5%] right-[12.5%] h-px bg-gradient-to-r from-brand-500/0 via-brand-500/30 to-brand-500/0" />

            {phases.map((phase, i) => (
              <AnimateOnScroll key={phase.step} delay={0.1 * i} variant="fadeUp" className="h-full">
                <div className="relative overflow-hidden flex flex-col rounded-2xl border border-slate-100 dark:border-neutral-800 hover:border-brand-200 dark:hover:border-brand-800 transition-all duration-500 group/card hover:shadow-xl h-full">
                  {/* Background Image fills the entire card */}
                  <div className="absolute inset-0 pointer-events-none rounded-[inherit] overflow-hidden">
                    <Image src={phase.image} alt={phase.title} fill sizes="(max-width: 768px) 100vw, 50vw" className="object-cover opacity-[0.70] group-hover/card:opacity-[0.90] transition-opacity duration-500 mix-blend-luminosity" />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/50 to-black/20" />
                  </div>
                  {/* Content on top of image */}
                  <div className="relative z-10 flex flex-col gap-4 p-6 h-full">
                    {/* Step number circle */}
                    <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${phase.color} flex items-center justify-center shadow-lg flex-shrink-0`}>
                      <span className="text-xl font-black text-white font-mono">{phase.step}</span>
                    </div>
                    <div className="space-y-2 mt-auto">
                      <h3 className="text-base font-bold text-white font-heading">{phase.title}</h3>
                      <p className="text-sm text-white/70 leading-relaxed">{phase.desc}</p>
                    </div>
                  </div>
                </div>
              </AnimateOnScroll>
            ))}
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════
          WHY US — 6-tile trust grid
      ══════════════════════════════════════════ */}
      <section className="z-0 relative min-h-[100dvh] w-full snap-start flex flex-col justify-center pt-28 pb-10 px-4 sm:px-6 lg:px-8 bg-slate-50 dark:bg-neutral-950 overflow-hidden">
        {/* No background image on section - clean solid background */}
        <div className="relative z-10 max-w-7xl mx-auto space-y-16 lg:space-y-24">
          <AnimateOnScroll variant="fadeUp">
            <div className="text-center space-y-3">
              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-slate-900 dark:text-white font-heading tracking-tight">
                Why SAMStack?
              </h2>
              <p className="text-slate-500 dark:text-slate-400 max-w-xl mx-auto text-base">
                Built for businesses that demand elite engineering and zero compromise.
              </p>
            </div>
          </AnimateOnScroll>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8 lg:gap-10">
            {trustItems.map((item, i) => (
              <AnimateOnScroll key={item.label} delay={0.07 * i} variant="fadeUp" className="h-full">
                <div className="relative rounded-2xl border border-slate-100 dark:border-neutral-800 hover:border-brand-200 dark:hover:border-brand-800 hover:shadow-xl transition-all duration-300 overflow-hidden h-full group/card min-h-[260px]">
                  {/* Background Image fills the entire card */}
                  <div className="absolute inset-0 z-0 pointer-events-none rounded-[inherit] overflow-hidden">
                    <Image src={item.image} alt={item.label} fill sizes="(max-width: 768px) 100vw, 50vw" className="object-cover transition-transform duration-700 group-hover/card:scale-110" />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/60 to-black/30" />
                  </div>
                  {/* Content on top of image */}
                  <div className="relative z-10 p-7 flex flex-col h-full space-y-4">
                    <div className="w-12 h-12 rounded-2xl bg-white/20 backdrop-blur-sm border border-white/30 flex items-center justify-center">
                      <item.icon className="w-5 h-5 text-white" />
                    </div>
                    <div className="space-y-1.5 mt-auto">
                      <h3 className="text-base font-bold text-white font-heading">{item.label}</h3>
                      <p className="text-sm text-white/70 leading-relaxed">{item.desc}</p>
                    </div>
                  </div>
                </div>
              </AnimateOnScroll>
            ))}
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════
          FINAL CTA — Dark editorial band
      ══════════════════════════════════════════ */}
      <section className="z-0 relative min-h-[100dvh] w-full snap-start flex flex-col justify-center pt-28 pb-10 px-4 sm:px-6 lg:px-8 overflow-hidden bg-slate-900 dark:bg-neutral-950">
        {/* No background image on section - dark solid background */}
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_60%_at_50%_-10%,rgba(14,165,233,0.18),transparent)]" />
        <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:64px_64px]" />

        <div className="relative z-10 max-w-4xl mx-auto text-center space-y-8">
          <AnimateOnScroll variant="fadeUp">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/10 border border-white/15 text-white/70 text-[11px] font-bold uppercase tracking-[0.2em]">
              <Sparkles className="w-3 h-3 text-cyan-400" />
              Ready to Build?
            </div>
          </AnimateOnScroll>

          <AnimateOnScroll variant="fadeUp" delay={0.08}>
            <h2 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-white font-heading leading-tight tracking-tight">
              Let&apos;s Engineer Something{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-brand-400">
                Extraordinary.
              </span>
            </h2>
          </AnimateOnScroll>

          <AnimateOnScroll variant="fadeUp" delay={0.12}>
            <p className="text-white/60 text-base sm:text-lg max-w-xl mx-auto leading-relaxed">
              Send us your project brief and a lead engineer will respond within 12 hours with a tailored architectural consultation.
            </p>
          </AnimateOnScroll>

          <AnimateOnScroll variant="fadeUp" delay={0.16}>
            <div className="flex flex-wrap gap-4 sm:gap-6 justify-center">
              <Link href="/contact" className="inline-flex items-center gap-2 px-8 py-4 rounded-xl bg-white hover:bg-slate-100 text-slate-900 font-bold text-sm transition-all shadow-2xl group">
                Contact Our Team
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </Link>
              <Link href="/portfolio" className="inline-flex items-center gap-2 px-8 py-4 rounded-xl bg-white/10 hover:bg-white/15 border border-white/20 hover:border-white/30 text-white font-bold text-sm transition-all group">
                View Our Work
                <ArrowUpRight className="w-4 h-4 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
              </Link>
            </div>
          </AnimateOnScroll>

          <AnimateOnScroll variant="fadeUp" delay={0.2}>
            <div className="flex flex-wrap items-center justify-center gap-5 sm:gap-8 pt-6 border-t border-white/10">
              {["14+ Deployments", "4.9/5 Rating", "NDA Protected", "Free Consultation"].map((badge) => (
                <span key={badge} className="flex items-center gap-2 text-xs text-white/50 font-medium">
                  <CheckCircle2 className="w-3.5 h-3.5 text-cyan-400 flex-shrink-0" />
                  {badge}
                </span>
              ))}
            </div>
          </AnimateOnScroll>
        </div>
      </section>

    </div>
  );
}
