"use client";

import React from "react";
import Link from "next/link";
import {
  ArrowRight,
  Sparkles,
  ShieldCheck,
  Layers,
  Users,
  Trophy,
  Code,
  GitBranch,
  Zap,
  Globe,
  Cpu,
  BrainCircuit,
  Calendar,
  CheckCircle2,
  Star,
  ArrowUpRight,
} from "lucide-react";
import AnimateOnScroll from "@/app/components/AnimateOnScroll";
import Image from "next/image";
import { tracks } from "@/lib/curriculum";

const TRACKS_PREVIEW = [
  { id: "PYTHON",  icon: BrainCircuit, label: "Python",     color: "from-yellow-500 to-amber-500", image: "https://images.unsplash.com/photo-1515879218367-8466d910aaa4?auto=format&fit=crop&q=80&w=800" },
  { id: "UI_UX",   icon: Sparkles,    label: "UI/UX Design",color: "from-pink-500 to-rose-500", image: "https://images.unsplash.com/photo-1561070791-2526d30994b5?auto=format&fit=crop&q=80&w=800" },
  { id: "CPP",     icon: Cpu,         label: "C++ Systems", color: "from-slate-500 to-slate-700", image: "https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&q=80&w=800" },
  { id: "WEB_DEV", icon: Globe,       label: "Web Dev",     color: "from-cyan-500 to-sky-500", image: "https://images.unsplash.com/photo-1547658719-da2b51169166?auto=format&fit=crop&q=80&w=800" },
  { id: "REACT",   icon: Code,        label: "React",       color: "from-blue-500 to-cyan-500", image: "https://images.unsplash.com/photo-1633356122544-f134324a6cee?auto=format&fit=crop&q=80&w=800" },
  { id: "NEXT_JS", icon: GitBranch,   label: "Next.js",     color: "from-neutral-600 to-neutral-900", image: "https://images.unsplash.com/photo-1555099962-4199c345e5dd?auto=format&fit=crop&q=80&w=800" },
  { id: "MERN",    icon: Zap,         label: "MERN Stack",  color: "from-emerald-500 to-teal-500", image: "https://images.unsplash.com/photo-1555066931-4365d14bab8c?auto=format&fit=crop&q=80&w=800" },
];

const BENEFITS = [
  { icon: Layers,     title: "Enterprise Scale",    desc: "Build architectures meant to handle 10k+ concurrent users, not just toy apps.", image: "/images/img-global-scale.jpg" },
  { icon: Users,      title: "Senior Mentorship",   desc: "Get your PRs reviewed directly by senior engineers with 8+ years in the industry.", image: "/images/img-server-rack.jpg" },
  { icon: Trophy,     title: "Zero Cost",           desc: "We invest in talent. Our residency is 100% free for every accepted candidate.", image: "/images/img-team-meeting.jpg" },
  { icon: ShieldCheck,title: "Verified Credential", desc: "Graduate with a cryptographically verifiable certificate that proves your skills.", image: "/images/img-discovery.jpeg" },
];

const STATS = [
  { val: "7",    label: "Specialization Tracks", icon: Layers,  image: "/images/img-servers.jpg" },
  { val: "5",    label: "Projects Per Track",    icon: Code,   image: "/images/img-code-editor.jpg" },
  { val: "100+", label: "Interns Enrolled",      icon: Users,   image: "/images/img-server-rack.jpg" },
  { val: "Free", label: "Zero Cost to Apply",    icon: Trophy,  image: "/images/img-team-meeting.jpg" },
];

const PROCESS = [
  { step: "01", title: "Apply Online",        desc: "Fill the multi-step intake form. Select your specialization track and accept the engineering covenant.", image: "/images/img-servers.jpg" },
  { step: "02", title: "Receive Roll Number", desc: "Our automated pipeline instantly issues your unique, immutable Roll Number and sends your offer letter.", image: "/images/img-mobile-dev.jpg" },
  { step: "03", title: "Ship 5 Projects",     desc: "Work on 5 real production-grade projects mapped to your track. Build, deploy, and submit your repos.", image: "/images/img-code-editor.jpg" },
  { step: "04", title: "Get Certified",       desc: "Complete your track and receive a cryptographically signed certificate you can verify on our platform.", image: "/images/img-analytics.jpg" },
];

export default function InternshipPage() {
  const courseJsonLd = {
    "@context": "https://schema.org",
    "@type": "Course",
    "name": "Software Engineering Internship Program",
    "description": "An elite software engineering residency where candidates ship 5 production-grade projects and receive a verified credential.",
    "provider": {
      "@type": "Organization",
      "name": "SAMStack Tech",
      "url": "https://samstack-tech.vercel.app"
    },
    "coursePrerequisites": "Basic understanding of programming concepts.",
    "hasCourseInstance": {
      "@type": "CourseInstance",
      "courseMode": "Online",
      "instructor": {
        "@type": "Person",
        "name": "Suleman Zaheer"
      }
    }
  };

  return (
    <div className="flex-1 w-full bg-white/80 dark:bg-black text-slate-900 dark:text-white" style={{ overflowX: "clip" }}>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(courseJsonLd) }} />

      {/* ══════════════════════════════════════════
          SLIDE 1: HERO
      ══════════════════════════════════════════ */}
      <section className="z-0 relative min-h-[100dvh] w-full flex flex-col justify-center pt-28 pb-10 px-4 sm:px-6 lg:px-8 overflow-hidden bg-white/80 dark:bg-black group/section">
        
        <div className="absolute inset-0 bg-gradient-to-br from-slate-50 via-white to-brand-50/20 dark:from-black dark:via-neutral-950 dark:to-black" />

        <div className="absolute inset-0 bg-[linear-gradient(rgba(0,0,0,0.025)_1px,transparent_1px),linear-gradient(90deg,rgba(0,0,0,0.025)_1px,transparent_1px)] dark:bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:64px_64px]" />

        <div className="relative z-10 max-w-7xl mx-auto w-full grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center">
          {/* Left: Copy */}
          <div className="flex flex-col items-start space-y-7">
            <AnimateOnScroll variant="fadeUp">
              <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-brand-50 dark:bg-brand-950/50 border border-brand-200 dark:border-brand-800/40 text-brand-700 dark:text-brand-400 text-[11px] font-bold uppercase tracking-[0.2em]">
                <Sparkles className="w-3 h-3" />
                Elite Engineering Residency — Applications Open
              </div>
            </AnimateOnScroll>

            <AnimateOnScroll variant="fadeUp" delay={0.08}>
              <h1 className="text-5xl sm:text-6xl lg:text-7xl font-black text-slate-900 dark:text-white font-heading leading-[1.02] tracking-tight">
                Build the{" "}
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-600 via-cyan-500 to-indigo-600 dark:from-brand-400 dark:via-cyan-400 dark:to-indigo-400">
                  Future.
                </span>{" "}
                With Us.
              </h1>
            </AnimateOnScroll>

            <AnimateOnScroll variant="fadeUp" delay={0.14}>
              <p className="text-slate-500 dark:text-slate-400 text-lg sm:text-xl max-w-xl leading-relaxed">
                Join SAMStack Tech&apos;s rigorous, highly-automated residency. Ship 5 production-grade projects,
                get mentored by senior engineers, and earn a cryptographically verified credential.
              </p>
            </AnimateOnScroll>

            <AnimateOnScroll variant="fadeUp" delay={0.2}>
              <div className="flex flex-wrap gap-4">
                <Link
                  href="/internship/apply"
                  className="inline-flex items-center gap-2 px-8 py-4 rounded-xl bg-slate-900 dark:bg-white/80 text-white dark:text-slate-900 font-bold text-sm hover:bg-slate-700 dark:hover:bg-slate-200 transition-colors shadow-lg group"
                >
                  Apply for Residency <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </Link>
                <Link
                  href="/verify"
                  className="inline-flex items-center gap-2 px-8 py-4 rounded-xl border border-slate-200 dark:border-neutral-700 text-slate-700 dark:text-slate-300 font-bold text-sm hover:border-brand-400 dark:hover:border-brand-600 transition-colors group"
                >
                  Verify Certificate <ShieldCheck className="w-4 h-4" />
                </Link>
              </div>
            </AnimateOnScroll>

            <AnimateOnScroll variant="fadeUp" delay={0.26}>
              <div className="flex flex-wrap items-center gap-x-6 gap-y-2">
                {["Zero cost", "Remote & async", "Cryptographic credential", "Real projects"].map((t) => (
                  <span key={t} className="flex items-center gap-1.5 text-xs font-medium text-slate-500 dark:text-slate-400">
                    <CheckCircle2 className="w-3 h-3 text-emerald-500 shrink-0" /> {t}
                  </span>
                ))}
              </div>
            </AnimateOnScroll>
          </div>

          {/* Right: Hero Image */}
          <AnimateOnScroll variant="fadeUp" delay={0.12}>
            <div className="relative w-full h-[420px] lg:h-[540px] rounded-3xl overflow-hidden border border-slate-100 dark:border-neutral-800 shadow-2xl group">
              <Image
                src="/internship-hero.webp"
                alt="SAMStack Tech Internship Program"
                fill sizes="(max-width: 768px) 100vw, 50vw"
                className="object-cover transition-transform duration-700 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
              {/* Floating track badges */}
              <div className="absolute top-5 left-5 right-5 flex flex-wrap gap-2">
                {TRACKS_PREVIEW.slice(0, 4).map(tr => (
                  <span key={tr.id} className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-gradient-to-r ${tr.color} text-white text-[10px] font-bold uppercase tracking-wide shadow-lg`}>
                    <tr.icon className="w-3 h-3" />{tr.label}
                  </span>
                ))}
              </div>
              {/* Bottom stats */}
              <div className="absolute bottom-6 left-6 right-6 grid grid-cols-3 gap-3">
                {STATS.slice(0,3).map(s => (
                  <div key={s.label} className="bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-3 text-center">
                    <div className="text-xl font-black text-white font-mono">{s.val}</div>
                    <div className="text-[9px] text-white/60 uppercase tracking-widest font-bold mt-0.5 leading-tight">{s.label}</div>
                  </div>
                ))}
              </div>
            </div>
          </AnimateOnScroll>
        </div>
      </section>

      {/* ══════════════════════════════════════════
          SLIDE 2: STATS + BENEFITS
      ══════════════════════════════════════════ */}
      <section id="benefits" className="z-0 relative min-h-[100dvh] w-full flex flex-col justify-center pt-28 pb-10 px-4 sm:px-6 lg:px-8 bg-slate-50/80 dark:bg-neutral-950 border-t border-slate-100 dark:border-neutral-900 overflow-hidden group/section">
        
        <div className="relative z-10 max-w-7xl mx-auto w-full space-y-14 lg:space-y-20">

          {/* Stats Row */}
          <AnimateOnScroll variant="fadeUp">
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
              {STATS.map((s, i) => (
                <div key={s.label} className="relative p-6 sm:p-8 rounded-3xl bg-white/80 dark:bg-neutral-900 border border-slate-100 dark:border-neutral-800 hover:border-brand-200 dark:hover:border-brand-800 hover:shadow-xl transition-all duration-300 text-center space-y-3 overflow-hidden group">
                  <div className="absolute inset-0 z-0 pointer-events-none rounded-[inherit] overflow-hidden">
                    <Image src={s.image} alt={s.label} fill sizes="(max-width: 768px) 100vw, 50vw" className="object-cover opacity-20 group-hover/card:opacity-30 transition-opacity duration-500" />
                  </div>
                  <div className="relative z-10 w-10 h-10 rounded-2xl bg-brand-50 dark:bg-brand-950/40 border border-brand-100 dark:border-brand-900/50 flex items-center justify-center mx-auto group-hover:scale-110 transition-transform">
                    <s.icon className="w-5 h-5 text-brand-600 dark:text-brand-400" />
                  </div>
                  <div className="relative z-10 text-3xl sm:text-4xl font-black font-heading text-slate-900 dark:text-white tracking-tight">{s.val}</div>
                  <div className="relative z-10 text-[10px] font-bold uppercase tracking-widest text-slate-500 dark:text-slate-400">{s.label}</div>
                </div>
              ))}
            </div>
          </AnimateOnScroll>

          {/* Benefits */}
          <div className="space-y-8">
            <AnimateOnScroll variant="fadeUp">
              <div className="text-center space-y-2">
                <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/80 dark:bg-neutral-900 border border-slate-200 dark:border-neutral-800 text-slate-500 dark:text-slate-400 text-[11px] font-bold uppercase tracking-[0.2em]">
                  <Star className="w-3 h-3 text-brand-500" /> Why Join Our Pipeline?
                </div>
                <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold font-heading text-slate-900 dark:text-white tracking-tight">
                  What You Get
                </h2>
              </div>
            </AnimateOnScroll>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {BENEFITS.map((b, i) => (
                <AnimateOnScroll key={b.title} variant="fadeUp" delay={0.08 * i} className="h-full">
                  <div className="relative p-7 rounded-3xl bg-white/80 dark:bg-neutral-900 border border-slate-100 dark:border-neutral-800 hover:border-brand-300 dark:hover:border-brand-700 hover:shadow-xl transition-all duration-300 space-y-4 h-full group overflow-hidden">
                    <div className="absolute inset-0 z-0 pointer-events-none rounded-[inherit] overflow-hidden">
                      <Image src={b.image} alt={b.title} fill sizes="(max-width: 768px) 100vw, 50vw" className="object-cover opacity-20 group-hover/card:opacity-30 transition-opacity duration-500" />
                    </div>
                    <div className="relative z-10 w-12 h-12 rounded-2xl bg-brand-50 dark:bg-brand-950/40 border border-brand-100 dark:border-brand-900/50 flex items-center justify-center group-hover:scale-110 transition-transform">
                      <b.icon className="w-6 h-6 text-brand-600 dark:text-brand-400" />
                    </div>
                    <h3 className="relative z-10 font-heading font-bold text-lg text-slate-900 dark:text-white">{b.title}</h3>
                    <p className="relative z-10 text-sm text-slate-600 dark:text-slate-400 leading-relaxed">{b.desc}</p>
                  </div>
                </AnimateOnScroll>
              ))}
            </div>
          </div>

        </div>
      </section>

      {/* ══════════════════════════════════════════
          SLIDE 3: SPECIALIZATION TRACKS
      ══════════════════════════════════════════ */}
      <section id="tracks" className="z-0 relative min-h-[100dvh] w-full flex flex-col justify-center pt-28 pb-10 px-4 sm:px-6 lg:px-8 bg-white/80 dark:bg-black border-t border-slate-100 dark:border-neutral-900 overflow-hidden group/section">
        
        <div className="relative z-10 max-w-7xl mx-auto w-full space-y-12 lg:space-y-16">
          <AnimateOnScroll variant="fadeUp">
            <div className="text-center space-y-3">
              <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-slate-50/80 dark:bg-neutral-900 border border-slate-200 dark:border-neutral-800 text-slate-500 dark:text-slate-400 text-[11px] font-bold uppercase tracking-[0.2em]">
                <GitBranch className="w-3 h-3 text-brand-500" /> Specialization Tracks
              </div>
              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold font-heading text-slate-900 dark:text-white tracking-tight">
                Choose Your Engineering Path
              </h2>
              <p className="text-slate-500 dark:text-slate-400 max-w-xl mx-auto text-base">
                7 production-grade specialization tracks. Each one comes with 5 real projects, expert guidance, and a verifiable credential.
              </p>
            </div>
          </AnimateOnScroll>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
            {Object.values(tracks).map((track, i) => {
              const preview = TRACKS_PREVIEW[i % TRACKS_PREVIEW.length];
              const IconComp = preview.icon;
              return (
                <AnimateOnScroll key={track.id} variant="fadeUp" delay={0.06 * i} className="h-full">
                  <Link
                    href={`/internship/apply?track=${track.id}`}
                    className="relative group/card flex flex-col h-full p-5 sm:p-6 rounded-3xl bg-slate-50/80 dark:bg-neutral-900 border border-slate-100 dark:border-neutral-800 hover:border-brand-300 dark:hover:border-brand-700 hover:shadow-xl transition-all duration-300 overflow-hidden"
                  >
                    <div className="absolute inset-0 z-0 pointer-events-none rounded-[inherit] overflow-hidden">
                      <Image src={preview.image} alt={track.title} fill sizes="(max-width: 768px) 100vw, 50vw" className="object-cover opacity-20 group-hover/card:opacity-30 transition-opacity duration-500" />
                    </div>
                    <div className={`relative z-10 w-11 h-11 sm:w-12 sm:h-12 rounded-2xl bg-gradient-to-br ${preview.color} flex items-center justify-center text-white shadow-lg group-hover:scale-110 transition-transform mb-4`}>
                      <IconComp className="w-5 h-5" />
                    </div>
                    <h3 className="relative z-10 font-heading font-bold text-sm sm:text-base text-slate-900 dark:text-white group-hover:text-brand-600 dark:group-hover:text-brand-400 transition-colors mb-1.5">{track.title}</h3>
                    <p className="relative z-10 text-[11px] sm:text-xs text-slate-500 dark:text-slate-400 leading-relaxed flex-1 line-clamp-3">{track.desc}</p>
                    <div className="relative z-10 flex items-center gap-1.5 mt-4 text-[10px] font-mono font-bold text-brand-600 dark:text-brand-400 uppercase tracking-widest">
                      <Calendar className="w-3 h-3" /> {track.tasks.length} projects
                    </div>
                  </Link>
                </AnimateOnScroll>
              );
            })}
          </div>

          <AnimateOnScroll variant="fadeUp">
            <div className="text-center">
              <Link
                href="/internship/apply"
                className="inline-flex items-center gap-2 px-8 py-4 rounded-xl bg-slate-900 dark:bg-white/80 text-white dark:text-slate-900 font-bold text-sm hover:bg-slate-700 dark:hover:bg-slate-200 transition-colors shadow-lg group"
              >
                Apply for Residency <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>
          </AnimateOnScroll>
        </div>
      </section>

      {/* ══════════════════════════════════════════
          SLIDE 4: HOW IT WORKS
      ══════════════════════════════════════════ */}
      <section className="z-0 relative min-h-[100dvh] w-full flex flex-col justify-center pt-28 pb-10 px-4 sm:px-6 lg:px-8 bg-slate-50/80 dark:bg-neutral-950 border-t border-slate-100 dark:border-neutral-900 overflow-hidden group/section">
        
        <div className="relative z-10 max-w-7xl mx-auto w-full space-y-12 lg:space-y-16">
          <AnimateOnScroll variant="fadeUp">
            <div className="text-center space-y-3">
              <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/80 dark:bg-neutral-900 border border-slate-200 dark:border-neutral-800 text-slate-500 dark:text-slate-400 text-[11px] font-bold uppercase tracking-[0.2em]">
                <Zap className="w-3 h-3 text-brand-500" /> How It Works
              </div>
              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold font-heading text-slate-900 dark:text-white tracking-tight">
                Don&apos;t Just Learn.{" "}
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-600 to-cyan-500 dark:from-brand-400 dark:to-cyan-400">
                  Build & Ship.
                </span>
              </h2>
              <p className="text-slate-500 dark:text-slate-400 max-w-2xl mx-auto">
                Every project is built on real-world enterprise patterns — not homework. You get production specs, architecture briefs, and deployment targets.
              </p>
            </div>
          </AnimateOnScroll>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {PROCESS.map((p, i) => (
              <AnimateOnScroll key={p.step} variant="fadeUp" delay={0.08 * i} className="h-full">
                <div className="relative p-7 rounded-3xl bg-white/80 dark:bg-neutral-900 border border-slate-100 dark:border-neutral-800 hover:border-brand-200 dark:hover:border-brand-800 hover:shadow-xl transition-all duration-300 h-full space-y-4 overflow-hidden group">
                  <div className="absolute inset-0 z-0 pointer-events-none rounded-[inherit] overflow-hidden">
                    <Image src={p.image} alt={p.title} fill sizes="(max-width: 768px) 100vw, 50vw" className="object-cover opacity-40 group-hover/card:opacity-60 transition-opacity duration-500" />
                  </div>
                  <div className="relative z-10 text-5xl font-black font-mono text-slate-100 dark:text-neutral-800 select-none leading-none transition-colors duration-500 group-hover:text-brand-100 dark:group-hover:text-brand-900/30">
                    {p.step}
                  </div>
                  <h3 className="relative z-10 font-heading font-bold text-xl text-slate-900 dark:text-white">{p.title}</h3>
                  <p className="relative z-10 text-sm text-slate-600 dark:text-slate-400 leading-relaxed">{p.desc}</p>
                </div>
              </AnimateOnScroll>
            ))}
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════
          SLIDE 5: DARK CTA
      ══════════════════════════════════════════ */}
      <section className="z-0 relative min-h-[100dvh] w-full flex flex-col justify-center pt-28 pb-10 px-4 sm:px-6 lg:px-8 overflow-hidden bg-slate-900 dark:bg-neutral-950 border-t-8 border-brand-500 group/section">
        
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_60%_at_50%_-10%,rgba(14,165,233,0.18),transparent)]" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_60%_50%_at_80%_100%,rgba(99,102,241,0.12),transparent)]" />
        <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:64px_64px]" />

        <div className="relative z-10 max-w-4xl mx-auto text-center space-y-8 w-full">
          <AnimateOnScroll variant="fadeUp">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/10 border border-white/15 text-white/70 text-[11px] font-bold uppercase tracking-[0.2em]">
              <Sparkles className="w-3 h-3 text-cyan-400" />
              Applications Are Open
            </div>
          </AnimateOnScroll>

          <AnimateOnScroll variant="fadeUp" delay={0.08}>
            <h2 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-white font-heading leading-tight tracking-tight">
              Ready to join the{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-brand-400">
                engineering residency?
              </span>
            </h2>
          </AnimateOnScroll>

          <AnimateOnScroll variant="fadeUp" delay={0.12}>
            <p className="text-white/60 text-base sm:text-lg max-w-xl mx-auto leading-relaxed">
              Zero cost. Real projects. Cryptographic certification. Apply in under 5 minutes
              and receive your roll number instantly.
            </p>
          </AnimateOnScroll>

          <AnimateOnScroll variant="fadeUp" delay={0.16}>
            <div className="flex flex-wrap gap-4 sm:gap-6 justify-center">
              <Link
                href="/internship/apply"
                className="inline-flex items-center gap-2 px-8 py-4 rounded-xl bg-white/80 hover:bg-slate-100 text-slate-900 font-bold text-sm transition-all shadow-2xl group"
              >
                Apply Now — It&apos;s Free <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </Link>
              <Link
                href="/verify"
                className="inline-flex items-center gap-2 px-8 py-4 rounded-xl bg-white/10 hover:bg-white/15 border border-white/20 hover:border-white/30 text-white font-bold text-sm transition-all group"
              >
                Verify a Certificate <ArrowUpRight className="w-4 h-4 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
              </Link>
            </div>
          </AnimateOnScroll>
        </div>
      </section>

    </div>
  );
}
