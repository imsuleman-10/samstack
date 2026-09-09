"use client";

import React, { useEffect, useRef, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import {
  Shield,
  ArrowUpRight,
  Cpu,
  Layers,
  Clock,
  Star,
  ServerCog,
  Globe,
  Bot,
  ArrowRight,
  Code,
  CheckCircle2,
  Zap,
  TrendingUp,
  ChevronDown,
  Sparkles,
  Target,
  Award,
} from "lucide-react";
import { services } from "@/lib/data/services";
import AnimateOnScroll from "@/app/components/AnimateOnScroll";
import StickyVideoSection from "@/components/StickyVideoSection";
import { motion, useScroll, useTransform } from "framer-motion";

// ─── Data ─────────────────────────────────────────────────

const stats = [
  { icon: ServerCog, label: "Enterprise Deployments", value: "14+", note: "Global Scale", color: "text-brand-600 dark:text-brand-400", bg: "bg-brand-50/60 dark:bg-brand-950/30 border-brand-200 dark:border-brand-900", image: "/images/img-global-scale.jpg" },
  { icon: Shield, label: "Uptime Guarantee", value: "99.9%", note: "Zero-Downtime", color: "text-emerald-600 dark:text-emerald-400", bg: "bg-emerald-50/60 dark:bg-emerald-950/30 border-emerald-200 dark:border-emerald-900", image: "/images/img-server-rack.jpg" },
  { icon: Clock, label: "Response Time", value: "<12h", note: "Priority Support", color: "text-indigo-600 dark:text-indigo-400", bg: "bg-indigo-50/60 dark:bg-indigo-950/30 border-indigo-200 dark:border-indigo-900", image: "/images/img-matrix-code.jpg" },
  { icon: Star, label: "Client Satisfaction", value: "9.9/10", note: "Avg NPS Score", color: "text-amber-600 dark:text-amber-400", bg: "bg-amber-50/60 dark:bg-amber-950/30 border-amber-200 dark:border-amber-900", image: "/images/img-team-meeting.jpg" },
];

const defaultTeam = [
  {
    image: "/suleman-zaheer-software-engineer-samstack-tech.jpge",
    initials: "SZ",
    name: "Suleman Zaheer",
    role: "Founder & DevOps Lead",
    badge: "DevOps",
    description: "Architecting cloud-native systems, CI/CD pipelines, and zero-downtime infrastructure. Leads the overall vision and technical direction of SAMStack Tech.",
    skills: ["Docker & Kubernetes", "GitHub Actions", "Next.js", "Firebase"],
    badgeColor: "bg-brand-500",
    from: "from-brand-600",
    to: "to-indigo-600",
  },
  {
    image: "/saqib-javed-software-engineer-samstack-tech.jpg",
    initials: "SJ",
    name: "Saqib Javed",
    role: "Frontend Engineer",
    badge: "Frontend",
    description: "Crafting pixel-perfect, high-performance user interfaces with obsidian aesthetics and smooth micro-animations. Specialises in React & component systems.",
    skills: ["React / Next.js", "Tailwind CSS", "Figma", "Framer Motion"],
    badgeColor: "bg-emerald-500",
    from: "from-emerald-600",
    to: "to-teal-500",
  },
  {
    image: "/syed-abdullah-software-engineer-samstack-tech.png",
    initials: "SA",
    name: "Syed Abdullah",
    role: "Backend Engineer",
    badge: "Backend",
    description: "Building robust, scalable server-side systems, REST/GraphQL APIs, database architecture, and enterprise-grade business logic that powers our platforms.",
    skills: ["Node.js", "PostgreSQL", "REST / GraphQL", "Firebase Admin"],
    badgeColor: "bg-violet-500",
    from: "from-violet-600",
    to: "to-purple-500",
  },
];

const process = [
  { step: "01", title: "Discovery Call", desc: "30-minute focused session to discuss your requirements, goals, and technical constraints.", emoji: "🎯", image: "/images/img-discovery.jpg" },
  { step: "02", title: "Architecture Draft", desc: "Our engineers produce a detailed systems blueprint tailored to your stack and business objectives.", emoji: "📐", image: "/images/img-servers.jpg" },
  { step: "03", title: "Agile Build Sprints", desc: "Development in structured 2-week sprints with demos, feedback loops, and milestone gates.", emoji: "⚡", image: "/images/img-coding-laptop.jpg" },
  { step: "04", title: "Deploy & Support", desc: "Production deployment, live telemetry monitoring, and post-launch engineering support included.", emoji: "🚀", image: "/images/img-ai-tech.jpg" },
];

// ─── Main Component ────────────────────────────────────────
export default function HomeClient() {
  const [team, setTeam] = useState<any[]>(defaultTeam);

  useEffect(() => {
    fetch("/api/team")
      .then((res) => res.json())
      .then((data) => {
        if (data.team && data.team.length > 0) setTeam(data.team);
      })
      .catch((err) => console.error(err));
  }, []);

  const heroRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: heroRef, offset: ["start start", "end start"] });
  const heroTextY = useTransform(scrollYProgress, [0, 1], ["0%", "30%"]);
  const heroOpacity = useTransform(scrollYProgress, [0, 0.6], [1, 0]);

  return (
    <div className="flex-1 w-full">

      {/* ═══════════════════════════════════════════════════
          SECTION 1: HERO (100dvh, video bg, parallax text)
          ═══════════════════════════════════════════════════ */}
      <section
        ref={heroRef}
        className="z-0 overflow-hidden relative min-h-[100dvh] w-full flex flex-col justify-center items-center pt-20 group/section"
      >
        {/* No background image on section - clean solid background */}{/* Video */}
        <div className="absolute inset-0">
          <video preload="metadata" poster="/logo.png" autoPlay loop muted playsInline className="w-full h-full object-cover bg-zinc-950" src="/hero-video.mp4" />
          <div className="absolute inset-0 bg-white/50 dark:bg-black/60 backdrop-blur-[2px]" />
          <div className="absolute bottom-0 left-0 w-full h-48 bg-gradient-to-t from-slate-50 dark:from-black to-transparent" />
        </div>

        {/* Content with parallax */}
        <motion.div
          style={{ y: heroTextY, opacity: heroOpacity }}
          className="relative z-10 text-center max-w-4xl mx-auto px-4 sm:px-6 space-y-5 -mt-16"
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-black/5 dark:bg-white/10 backdrop-blur-md border border-black/10 dark:border-white/20 text-slate-900 dark:text-white text-xs font-bold uppercase tracking-[0.2em]">
            <Shield className="w-3.5 h-3.5 text-brand-600 dark:text-cyan-400" />
            Elite Software Engineering Studio
          </div>

          <h1 className="text-4xl sm:text-5xl lg:text-7xl font-extrabold tracking-tight text-slate-900 dark:text-white leading-[1.05] font-heading drop-shadow-sm dark:drop-shadow-2xl">
            Enterprise Software &amp;<br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-600 via-sky-600 to-indigo-600 dark:from-cyan-400 dark:via-sky-300 dark:to-indigo-400">
              Scalable Digital Systems
            </span>
          </h1>

          <p className="text-base sm:text-lg max-w-xl mx-auto leading-relaxed font-medium text-slate-700 dark:text-slate-300">
            We architect premium, high-performance digital systems — from enterprise backends and AI agents to modern luxury interfaces.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-1">
            <Link href="/contact" className="btn-premium inline-flex items-center gap-2 px-9 py-4 text-sm font-bold uppercase tracking-widest text-white dark:text-slate-900 bg-slate-900 dark:bg-white hover:bg-slate-800 dark:hover:bg-slate-100 rounded-xl transition-all duration-200 shadow-xl dark:shadow-2xl group">
              Start a Project
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform text-brand-400 dark:text-brand-600" />
            </Link>
            <Link href="/services" className="inline-flex items-center gap-2 px-9 py-4 text-sm font-bold uppercase tracking-widest text-white bg-brand-600 hover:bg-brand-500 rounded-xl transition-all duration-200 shadow-md hover:shadow-lg hover:shadow-brand-500/25">
              Our Services
              <Layers className="w-4 h-4 text-white" />
            </Link>
          </div>

          {/* Trust pills */}
          <div className="flex flex-wrap items-center justify-center gap-x-5 gap-y-2 pt-1">
            {["NDA-protected", "Free consultation", "14-day guarantee", "<12h response"].map((t) => (
              <span key={t} className="flex items-center gap-1.5 text-[11px] font-medium text-slate-600 dark:text-slate-400">
                <CheckCircle2 className="w-3 h-3 text-emerald-600 dark:text-emerald-400 shrink-0" />{t}
              </span>
            ))}
          </div>
        </motion.div>

        {/* Scroll indicator */}
        <motion.button
          onClick={() => window.scrollTo({ top: window.innerHeight, behavior: 'smooth' })}
          className="absolute bottom-16 left-1/2 -translate-x-1/2 z-20 flex flex-col items-center gap-1.5 text-slate-400 hover:text-slate-900 dark:text-white/50 dark:hover:text-white transition-colors cursor-pointer outline-none"
          animate={{ y: [0, 8, 0] }}
          transition={{ repeat: Infinity, duration: 1.8, ease: "easeInOut" }}
        >
          <span className="text-[9px] font-mono uppercase tracking-widest">Scroll</span>
          <ChevronDown className="w-4 h-4" />
        </motion.button>

        {/* Marquee Strip perfectly integrated at the absolute bottom of Hero screen */}
        <div className="absolute bottom-0 left-0 w-full overflow-hidden border-t border-slate-200/50 dark:border-white/10 bg-white/40 dark:bg-black/40 backdrop-blur-md py-3 z-20">
          <div className="absolute left-0 top-0 w-24 h-full bg-gradient-to-r from-slate-50/80 dark:from-black/80 to-transparent z-10 pointer-events-none" />
          <div className="absolute right-0 top-0 w-24 h-full bg-gradient-to-l from-slate-50/80 dark:from-black/80 to-transparent z-10 pointer-events-none" />
          <div className="marquee-track items-center gap-12 md:gap-20">
            {[...Array(2)].map((_, i) => (
              <div key={i} className="flex items-center gap-12 md:gap-20 px-6 shrink-0">
                {["Enterprise Scale", "High Availability", "Client Retention", "Edge Performance", "Global Reach", "AI Integration", "Custom SaaS", "Clean UI/UX"].map((t) => (
                  <span key={t} className="text-xs font-bold text-slate-400 dark:text-white/40 uppercase tracking-widest font-heading whitespace-nowrap">
                    {t}
                  </span>
                ))}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════
          SECTION 2: STATS (exact h-screen)
          ═══════════════════════════════════════════════════ */}
      <section className="z-0 overflow-hidden relative min-h-[100dvh] flex flex-col justify-center bg-slate-50 dark:bg-black pt-[80px] pb-8 px-4 sm:px-6 lg:px-8 group/section">
        {/* No background image on section - clean solid background */}<div className="z-10 relative max-w-7xl mx-auto w-full space-y-6">
          <AnimateOnScroll variant="fadeUp">
            <div className="text-center space-y-4">
              <div className="flex justify-center">
                <div className="section-label"><Sparkles className="w-3.5 h-3.5" />Trusted by Enterprises</div>
              </div>
              <h2 className="text-3xl sm:text-5xl font-extrabold text-slate-900 dark:text-white font-heading">
                Numbers That Speak
              </h2>
              <p className="text-slate-600 dark:text-slate-400 max-w-xl mx-auto text-base">
                Every metric is earned through real-world enterprise deployments and measurable client outcomes.
              </p>
            </div>
          </AnimateOnScroll>

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
            {stats.map((s, i) => (
              <AnimateOnScroll key={s.label} delay={0.1 * i} variant="fadeUp">
                <div className={`relative overflow-hidden group/card p-4 sm:p-5 rounded-2xl border ${s.bg} text-center space-y-2 hover:scale-105 transition-all duration-300`}>
                  {/* Background image */}
                  <div className="absolute inset-0 z-0 pointer-events-none rounded-[inherit] overflow-hidden">
                    <Image src={s.image} alt={s.label} fill sizes="(max-width: 768px) 100vw, 50vw" className="object-cover opacity-[0.06] group-hover/card:opacity-[0.12] transition-opacity duration-500 mix-blend-luminosity" />
                  </div>
                  <div className={`relative z-10 w-8 h-8 sm:w-10 sm:h-10 rounded-xl ${s.bg} border flex items-center justify-center mx-auto`}>
                    <s.icon className={`w-6 h-6 ${s.color}`} />
                  </div>
                  <p className={`relative z-10 text-2xl sm:text-3xl lg:text-4xl font-extrabold font-heading ${s.color}`}>{s.value}</p>
                  <div className="relative z-10">
                    <p className="text-xs font-bold text-slate-800 dark:text-slate-200 font-heading uppercase tracking-wide">{s.label}</p>
                    <p className="text-xs text-slate-500 dark:text-slate-500 mt-0.5">{s.note}</p>
                  </div>
                </div>
              </AnimateOnScroll>
            ))}
          </div>

          {/* Quick trust row */}
          <AnimateOnScroll variant="fadeUp" delay={0.3}>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-4">
              {[
                { icon: Shield, label: "Full NDA Protection", desc: "All submitted project ideas are protected under a strict mutual NDA before any discussion.", image: "/images/img-mobile-dev.jpg" },
                { icon: Zap, label: "< 12h Guaranteed Response", desc: "Every inquiry gets a personalised reply from a senior engineer — no bots, no delays.", image: "/images/img-design-tools.jpg" },
                { icon: Award, label: "Quality Guaranteed", desc: "We stand behind every line of code. Unlimited revisions until you are satisfied.", image: "/images/img-analytics.jpg" },
              ].map((item, idx) => (
                <div key={item.label} className="relative overflow-hidden group/card flex items-start gap-4 p-3 sm:p-4 rounded-2xl bg-white/70 dark:bg-neutral-950/70 border border-slate-200 dark:border-neutral-800 shadow-sm transition-all duration-300 hover:border-brand-300 dark:hover:border-brand-700">
                  {/* Background image */}
                  <div className="absolute inset-0 z-0 pointer-events-none rounded-[inherit] overflow-hidden">
                    <Image src={item.image} alt={item.label} fill sizes="(max-width: 768px) 100vw, 50vw" className="object-cover opacity-[0.06] group-hover/card:opacity-[0.12] transition-opacity duration-500 mix-blend-luminosity" />
                  </div>
                  <div className="relative z-10 w-7 h-7 sm:w-9 sm:h-9 rounded-xl bg-brand-50 dark:bg-brand-950/40 border border-brand-200 dark:border-brand-800/40 flex items-center justify-center shrink-0">
                    <item.icon className="w-4 h-4 text-brand-600 dark:text-brand-400" />
                  </div>
                  <div className="relative z-10">
                    <p className="text-xs font-bold text-slate-900 dark:text-white font-heading mb-0.5">{item.label}</p>
                    <p className="text-xs text-slate-500 dark:text-slate-500 leading-relaxed">{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </AnimateOnScroll>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════
          SECTION 3: SERVICES
          ═══════════════════════════════════════════════════ */}
      <section className="z-0 overflow-hidden relative min-h-[100dvh] flex flex-col justify-center py-24 px-4 sm:px-6 lg:px-8 bg-white dark:bg-neutral-950 group/section">
        {/* No background image on section - clean solid background */}<div className="z-10 relative max-w-7xl mx-auto w-full space-y-10">
          <AnimateOnScroll variant="fadeUp">
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-slate-900 dark:text-white font-heading">
              Transform Your Business
            </h2>
          </AnimateOnScroll>

          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-6">
            {services.map((svc, i) => (
              <AnimateOnScroll key={svc.id} delay={0.08 * i} variant="fadeUp" className="h-full">
                <div className="relative h-[200px] sm:h-[260px] lg:h-[300px] w-full rounded-2xl overflow-hidden group/card shadow-lg hover:shadow-2xl transition-all duration-300">
                  <Image
                    src={svc.image}
                    alt={svc.title}
                    fill
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
                    className="object-cover transition-transform duration-700 group-hover/card:scale-110"
                  />
                  <div className="absolute inset-0 bg-gradient-to-b from-black/80 via-black/20 to-black/60 transition-opacity duration-300 group-hover/card:opacity-80" />

                  <div className="absolute inset-0 p-6 flex flex-col justify-start">
                    <h3 className="text-xl sm:text-2xl font-bold text-white font-heading leading-snug drop-shadow-md">
                      {svc.title}
                    </h3>
                  </div>

                  {/* Optional: Show description on hover like a sleek reveal */}
                  <div className="absolute bottom-0 left-0 w-full p-6 translate-y-full group-hover/card:translate-y-0 transition-transform duration-300 bg-gradient-to-t from-black/90 to-transparent">
                    <p className="text-xs text-white/90 leading-relaxed mb-3 line-clamp-3">{svc.description}</p>
                    <Link href={`/contact?service=${svc.id}`} className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-widest text-cyan-400 hover:text-cyan-300 transition-colors">
                      Inquire <ArrowUpRight className="w-3.5 h-3.5" />
                    </Link>
                  </div>
                </div>
              </AnimateOnScroll>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════
          NEW SECTION: TECH STACK LANDING
          ═══════════════════════════════════════════════════ */}
      <section className="z-0 overflow-hidden min-h-[100dvh] flex flex-col justify-center py-24 px-4 sm:px-6 lg:px-8 bg-slate-50 dark:bg-black relative group/section">
        <div className="relative z-10 max-w-7xl mx-auto w-full space-y-6 sm:space-y-8">
          <AnimateOnScroll variant="fadeUp">
            <div className="text-center space-y-3">
              <div className="flex justify-center">
                <div className="section-label"><Code className="w-3.5 h-3.5" />Technologies</div>
              </div>
              <h2 className="text-3xl sm:text-5xl font-extrabold text-slate-900 dark:text-white font-heading">
                The Elite Stack
              </h2>
              <p className="text-slate-600 dark:text-slate-400 max-w-xl mx-auto text-sm sm:text-base">
                We strictly engineer systems using enterprise-grade, high-performance technologies.
              </p>
            </div>
          </AnimateOnScroll>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 lg:gap-6">
            {[
              { name: "React", icon: "react", desc: "Reactive UI", href: "/services/web-serverless-apps" },
              { name: "Next.js", icon: "nextdotjs", desc: "SSR & Edge", href: "/services/web-serverless-apps" },
              { name: "Node.js", icon: "nodedotjs", desc: "API Systems", href: "/services/custom-enterprise-software" },
              { name: "PostgreSQL", icon: "postgresql", desc: "Relational DB", href: "/services/custom-enterprise-software" },
              { name: "Docker", icon: "docker", desc: "Containerization", href: "/services/devops-cloud-architectures" },
              { name: "AWS", icon: "aws", src: "https://skillicons.dev/icons?i=aws", desc: "Cloud Infra", href: "/services/devops-cloud-architectures" },
              { name: "Python", icon: "python", desc: "Agentic AI", href: "/services/agentic-ai-integrations" },
              { name: "Tailwind CSS", icon: "tailwindcss", desc: "Styling Arch", href: "/services/web-serverless-apps" },
            ].map((tech, i) => {
              const iconSrc = (tech as any).src || `https://cdn.simpleicons.org/${tech.icon}`;
              return (
                <AnimateOnScroll key={tech.name} delay={0.05 * i} variant="fadeUp" className="h-full">
                  <Link href={tech.href} className="block relative p-5 sm:p-6 rounded-2xl sm:rounded-3xl border border-slate-200 dark:border-neutral-800 bg-white dark:bg-neutral-950 overflow-hidden group/card hover:border-brand-500 transition-all shadow-sm hover:shadow-xl z-10 h-full flex flex-col justify-center">
                    {/* Huge watermark logo */}
                    <div className={`absolute -bottom-6 -right-6 w-32 h-32 sm:w-40 sm:h-40 opacity-5 dark:opacity-10 transform rotate-[-15deg] group-hover/card:scale-110 group-hover/card:-rotate-6 group-hover/card:opacity-20 transition-all duration-500 z-0 ${tech.name === "Next.js" || tech.name === "AWS" ? "dark:invert" : ""}`}>
                      <Image src={iconSrc} alt={tech.name} fill sizes="(max-width: 768px) 100vw, 50vw" className="object-contain" unoptimized />
                    </div>

                    <div className="relative z-10">
                      <div className={`w-10 h-10 sm:w-12 sm:h-12 mb-4 relative ${tech.name === "Next.js" || tech.name === "AWS" ? "dark:invert" : ""}`}>
                        <Image src={iconSrc} alt={tech.name} fill sizes="(max-width: 768px) 100vw, 50vw" className="object-contain drop-shadow-md" unoptimized />
                      </div>
                      <h3 className="text-sm sm:text-base font-bold text-slate-900 dark:text-white font-heading tracking-tight">{tech.name}</h3>
                      <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 font-mono tracking-wide uppercase">{tech.desc}</p>
                    </div>
                  </Link>
                </AnimateOnScroll>
              );
            })}
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════
          SECTION 4: MID-PAGE CINEMATIC LANDING BREAK
          (Full-screen dark overlay section — the "landing in the middle")
          ═══════════════════════════════════════════════════ */}
      <section className="z-0 overflow-hidden relative min-h-[100dvh] pt-[80px] pb-8 flex flex-col items-center justify-center bg-white dark:bg-black group/section">
        {/* No background image on section - clean solid background */}{/* Grid overlay */}
        <div className="absolute inset-0 bg-[linear-gradient(rgba(0,0,0,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(0,0,0,0.03)_1px,transparent_1px)] dark:bg-[linear-gradient(rgba(255,255,255,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.03)_1px,transparent_1px)] bg-[size:60px_60px]" />

        <div className="relative z-10 text-center px-4 sm:px-6 max-w-4xl mx-auto space-y-8">
          <AnimateOnScroll variant="fadeUp">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-black/5 dark:bg-white/5 border border-black/10 dark:border-white/10 text-cyan-600 dark:text-cyan-400 text-xs font-bold uppercase tracking-wide">
              <Target className="w-3.5 h-3.5" />
              Our Mission
            </div>
          </AnimateOnScroll>

          <AnimateOnScroll variant="fadeUp" delay={0.15}>
            <h2 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold text-slate-900 dark:text-white font-heading leading-[1.05]">
              We Don&apos;t Just <span className="text-slate-700 dark:text-slate-300">Write Code.</span>
              <br />
              We Engineer <span className="text-brand-600 dark:text-brand-400">Advantages.</span>
            </h2>
          </AnimateOnScroll>

          <AnimateOnScroll variant="fadeUp" delay={0.25}>
            <p className="text-slate-600 dark:text-slate-400 text-sm sm:text-base max-w-2xl mx-auto leading-relaxed">
              SAMStack Tech operates at the intersection of precision engineering and elite design. Every system we build is architected to outlast market trends, scale with your growth, and perform flawlessly under production load.
            </p>
          </AnimateOnScroll>

          <AnimateOnScroll variant="fadeUp" delay={0.35}>
            <div className="grid grid-cols-3 gap-6 max-w-lg mx-auto pt-4">
              {[
                { val: "3", label: "Core Domains" },
                { val: "14+", label: "Deployments" },
                { val: "100%", label: "Client Retention" },
              ].map((m) => (
                <div key={m.label} className="text-center">
                  <p className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-slate-900 dark:text-white font-heading">{m.val}</p>
                  <p className="text-xs uppercase tracking-wide text-slate-500 mt-1">{m.label}</p>
                </div>
              ))}
            </div>
          </AnimateOnScroll>

          <AnimateOnScroll variant="fadeUp" delay={0.4}>
            <Link href="/about" className="inline-flex items-center gap-2 px-8 py-4 rounded-xl border border-black/10 dark:border-white/20 text-slate-900 dark:text-white hover:bg-black/5 dark:hover:bg-white/5 text-sm font-bold uppercase tracking-widest transition-all duration-200 group">
              Meet Our Team
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform text-brand-600 dark:text-brand-400" />
            </Link>
          </AnimateOnScroll>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════
          NEW SECTION: STICKY VIDEO
          ═══════════════════════════════════════════════════ */}
      <StickyVideoSection />

      {/* ═══════════════════════════════════════════════════
          SECTION 5: TEAM (exact h-screen)
          ═══════════════════════════════════════════════════ */}
      <section className="z-0 overflow-hidden relative min-h-[100dvh] flex flex-col justify-center py-24 px-4 sm:px-6 lg:px-8 bg-slate-50 dark:bg-neutral-950 group/section">
        {/* No background image on section - clean solid background */}<div className="z-10 relative max-w-7xl mx-auto w-full space-y-6">
          <AnimateOnScroll variant="fadeUp">
            <div className="text-center space-y-3">
              <div className="flex justify-center">
                <div className="section-label"><Sparkles className="w-3.5 h-3.5" />The Core Team</div>
              </div>
              <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-slate-900 dark:text-white font-heading">
                Built by Specialists
              </h2>
              <p className="text-slate-600 dark:text-slate-400 max-w-xl mx-auto text-base">
                A tight-knit team of senior engineers each owning their domain — no juniors, no filler.
              </p>
            </div>
          </AnimateOnScroll>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8">
            {team.map((member, i) => (
              <AnimateOnScroll key={member.name} delay={0.12 * i} variant="fadeUp" className="h-full">
                <div className="relative h-[440px] w-full flex flex-col justify-end rounded-[2rem] overflow-hidden group/card bg-neutral-900 border border-white/10 shadow-2xl transition-all duration-500 hover:-translate-y-2 hover:shadow-brand-500/20">
                  {/* Background Image / Placeholder */}
                  {member.image ? (
                    <Image src={member.image} alt={member.name} fill sizes="(max-width: 768px) 100vw, 50vw" className="object-cover transition-transform duration-700 group-hover/card:scale-110 opacity-60 group-hover/card:opacity-80" />
                  ) : (
                    <div className="absolute inset-0 bg-gradient-to-br from-neutral-800 to-black transition-transform duration-700 group-hover/card:scale-105" />
                  )}

                  {/* Elegant Gradient overlays */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black via-black/80 to-transparent opacity-100" />

                  {/* Subtle Top Glow */}
                  <div className="absolute top-0 inset-x-0 h-1/2 bg-gradient-to-b from-brand-500/10 to-transparent opacity-0 group-hover/card:opacity-100 transition-opacity duration-700" />

                  {/* Badge */}
                  <div className="absolute top-5 right-5 z-20">
                    <span className="text-[10px] font-black uppercase tracking-[0.2em] text-white/90 bg-white/10 backdrop-blur-md px-4 py-2 rounded-full border border-white/10 shadow-lg">
                      {member.badge}
                    </span>
                  </div>

                  {/* Content */}
                  <div className="relative z-10 p-8 flex flex-col gap-4 transform transition-transform duration-500">

                    {/* Avatar Circle (Fallback if no full image or just stylized) */}
                    <div className="w-16 h-16 rounded-full overflow-hidden border-2 border-white/20 bg-black/50 backdrop-blur-sm shadow-xl flex items-center justify-center shrink-0 group-hover/card:border-brand-400 transition-colors duration-500">
                      {member.image ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img src={member.image} alt={member.name} className="w-full h-full object-cover" />
                      ) : (
                        <span className="text-xl font-black text-white">{member.initials}</span>
                      )}
                    </div>

                    <div>
                      <h3 className="text-2xl font-extrabold text-white font-heading tracking-tight mb-1 group-hover/card:text-brand-400 transition-colors duration-300">
                        {member.name}
                      </h3>
                      <p className="text-[11px] font-bold text-brand-400 uppercase tracking-widest">{member.role}</p>
                    </div>

                    <p className="text-sm text-slate-300/80 leading-relaxed line-clamp-3 transition-opacity duration-500">
                      {member.description}
                    </p>

                    <div className="flex flex-wrap gap-2 pt-2 border-t border-white/10 mt-2">
                      {member.skills.slice(0, 4).map((skill: string) => (
                        <span key={skill} className="text-[10px] font-bold uppercase tracking-wider bg-white/5 text-slate-300 px-2.5 py-1.5 rounded border border-white/10">
                          {skill}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </AnimateOnScroll>
            ))}
          </div>

          <AnimateOnScroll variant="fadeUp" delay={0.3}>
            <div className="text-center pt-2">
              <Link href="/about" className="inline-flex items-center gap-2 px-6 py-3 rounded-xl border border-slate-300 dark:border-neutral-700 text-slate-700 dark:text-slate-300 hover:border-brand-400 dark:hover:border-brand-600 hover:text-brand-700 dark:hover:text-brand-400 text-sm font-bold uppercase tracking-widest transition-all duration-200 group">
                Full Team Profile
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>
          </AnimateOnScroll>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════
          SECTION 6: PROCESS (exact h-screen)
          ═══════════════════════════════════════════════════ */}
      <section className="z-0 overflow-hidden relative min-h-[100dvh] flex flex-col justify-center py-24 px-4 sm:px-6 lg:px-8 bg-white dark:bg-black group/section">
        {/* No background image on section - clean solid background */}<div className="z-10 relative max-w-7xl mx-auto w-full space-y-6">
          <AnimateOnScroll variant="fadeUp">
            <div className="text-center space-y-3">
              <div className="flex justify-center">
                <div className="section-label"><TrendingUp className="w-3.5 h-3.5" />How We Deliver</div>
              </div>
              <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-slate-900 dark:text-white font-heading">
                Our Engineering Process
              </h2>
              <p className="text-slate-600 dark:text-slate-400 max-w-xl mx-auto text-base">
                A structured, transparent process — from the first brief to production deployment.
              </p>
            </div>
          </AnimateOnScroll>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center h-full">

            {/* Left: Beautiful Realistic Process Photo */}
            <AnimateOnScroll variant="fadeUp" className="hidden lg:block lg:col-span-5 h-[50vh] relative rounded-3xl overflow-hidden shadow-2xl">
              <Image src="/process-photo.png" alt="Team collaborating" fill sizes="(max-width: 768px) 100vw, 50vw" className="object-cover transition-transform duration-700 hover:scale-105" />
              <div className="absolute inset-0 bg-gradient-to-tr from-brand-900/40 to-transparent" />
            </AnimateOnScroll>

            {/* Right: Process Steps */}
            <div className="lg:col-span-7 grid grid-cols-1 sm:grid-cols-2 gap-4">
              {process.map((p, i) => (
                <AnimateOnScroll key={p.step} delay={0.1 * i} variant="fadeUp" className="h-full">
                  <div className="relative overflow-hidden group/card p-5 rounded-2xl bg-slate-50/80 dark:bg-neutral-950/80 border border-slate-200 dark:border-neutral-800 space-y-2 hover:border-brand-300 dark:hover:border-brand-800 transition-all duration-300">
                    {/* Background image */}
                    <div className="absolute inset-0 z-0 pointer-events-none rounded-[inherit] overflow-hidden">
                      <Image src={p.image} alt={p.title} fill sizes="(max-width: 768px) 100vw, 50vw" className="object-cover opacity-[0.06] group-hover/card:opacity-[0.12] transition-opacity duration-500 mix-blend-luminosity" />
                    </div>
                    <div className="relative z-10 flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-brand-100 dark:bg-brand-900/30 text-brand-600 dark:text-brand-400 flex items-center justify-center font-bold font-mono text-xs">
                        {i + 1}
                      </div>
                      <span className="text-xs font-bold text-slate-400 dark:text-slate-600 font-mono tracking-wide">{p.step}</span>
                    </div>
                    <h3 className="relative z-10 text-sm font-bold text-slate-900 dark:text-white font-heading">{p.title}</h3>
                    <p className="relative z-10 text-xs text-slate-600 dark:text-slate-400 leading-relaxed">{p.desc}</p>
                  </div>
                </AnimateOnScroll>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════
          SECTION 7: QUOTE & CTA (exact h-screen)
          ═══════════════════════════════════════════════════ */}
      <section className="z-0 overflow-hidden min-h-[100dvh] flex flex-col justify-center items-center relative bg-slate-50 dark:bg-neutral-950 py-24 px-4 sm:px-6 group/section">
        {/* No background image on section - clean solid background */}<div className="z-10 relative absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:40px_40px] dark:opacity-100 opacity-0" />

        <div className="relative z-10 max-w-4xl mx-auto w-full space-y-10">

          {/* Quote Card */}
          <AnimateOnScroll variant="scaleUp">
            <div className="relative p-8 md:p-10 rounded-[2rem] border border-slate-200 dark:border-neutral-800 bg-white dark:bg-neutral-900/50 backdrop-blur-xl overflow-hidden flex flex-col md:flex-row items-center md:items-start gap-8 shadow-2xl">
              {/* Subtle gradient glow inside card */}

              <div className="relative w-20 h-20 md:w-24 md:h-24 rounded-full overflow-hidden flex-shrink-0 shadow-xl border-2 border-slate-100 dark:border-neutral-800">
                <Image src="/suleman-zaheer-software-engineer-samstack-tech.jpeg" alt="Suleman Zaheer" fill sizes="(max-width: 768px) 100vw, 50vw" className="object-cover" />
              </div>

              <div className="space-y-5 text-center md:text-left relative z-10 pt-1">
                <blockquote className="text-slate-900 dark:text-white text-lg md:text-xl font-heading leading-relaxed">
                  "We don't just write code — we engineer <span className="text-brand-600 dark:text-brand-400 italic">competitive advantages</span>. Our studio operates on absolute technical precision, delivering enterprise-grade systems that scale seamlessly."
                </blockquote>
                <cite className="flex flex-col gap-1.5 not-italic">
                  <span className="text-xs font-bold uppercase tracking-widest text-slate-900 dark:text-white">Suleman Zaheer</span>
                  <span className="text-xs text-slate-500 uppercase tracking-wide font-mono">Founder & Lead Architect</span>
                </cite>
              </div>
            </div>
          </AnimateOnScroll>

          {/* CTA Box */}
          <AnimateOnScroll variant="fadeUp" delay={0.2}>
            <div className="text-center space-y-8 pt-10">
              <h2 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-slate-900 dark:text-white font-heading leading-tight tracking-tight">
                Let&apos;s Engineer Something <br className="hidden sm:block" />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-600 to-cyan-500 dark:from-brand-400 dark:to-cyan-400">
                  Extraordinary.
                </span>
              </h2>
              <p className="text-slate-600 dark:text-slate-400 text-sm sm:text-base max-w-xl mx-auto leading-relaxed">
                Send us your project brief and one of our lead engineers will reach out with an architectural consultation within 12 hours.
              </p>
              <div className="flex justify-center pt-4">
                <Link href="/contact" className="relative inline-flex items-center gap-2 px-8 py-4 rounded-xl bg-slate-900 dark:bg-white text-white dark:text-slate-900 hover:bg-slate-800 dark:hover:bg-slate-200 transition-colors duration-300">
                  <span className="font-bold text-sm uppercase tracking-wide">Contact Our Team</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </div>
          </AnimateOnScroll>
        </div>
      </section>

    </div>
  );
}
