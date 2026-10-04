"use client";
import React, { useState, Suspense, useRef, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import {
  ArrowRight,
  Mail,
  Building,
  DollarSign,
  Cpu,
  MessageSquare,
  Zap,
  Shield,
  CheckCircle2,
  Users,
  Award,
  Clock,
  Send,
  Sparkles,
  Phone,
  MapPin,
  ArrowUpRight,
  User,
  ChevronDown,
  Check,
  Search,
} from "lucide-react";
import AnimateOnScroll from "@/app/components/AnimateOnScroll";
import Image from "next/image";
import { toast } from "sonner";

const SERVICE_LABELS: Record<string, string> = {
  CUSTOM_SOFTWARE: "Custom Enterprise Software",
  SERVERLESS_WEB: "Web & Serverless Apps",
  AGENTIC_AI: "Agentic AI & Integrations",
  DEVOPS_CLOUD: "DevOps & Cloud Architectures",
  MOBILE_APPS: "Mobile App Development",
  UI_UX_DESIGN: "UI/UX Design Systems",
  DATA_ANALYTICS: "Data Analytics & BI",
};

const TRUST_ITEMS = [
  {
    icon: Shield,
    title: "NDA by Default",
    desc: "Your IP and ideas are protected from the first message. No questions asked.",
    image: "/images/img-discovery.jpg",
  },
  {
    icon: Users,
    title: "Senior Team Only",
    desc: "No juniors. Only senior architects with proven enterprise track records.",
    image: "/images/img-server-rack.jpg",
  },
  {
    icon: Award,
    title: "Transparent Pricing",
    desc: "Fixed or milestone-based pricing. Clear deliverables, no hidden fees.",
    image: "/images/img-team-meeting.jpg",
  },
  {
    icon: Clock,
    title: "<12h Response",
    desc: "Every inquiry is reviewed personally by our founder and lead architect.",
    image: "/images/img-matrix-code.jpg",
  },
];

const CONTACT_CHANNELS = [
  {
    icon: Mail,
    label: "Email",
    value: "samstacktechs@gmail.com",
    href: "mailto:samstacktechs@gmail.com",
    color: "from-brand-600 to-cyan-600",
    lightColor: "bg-brand-50 dark:bg-brand-950/40 border-brand-100 dark:border-brand-900/50",
    iconColor: "text-brand-600 dark:text-brand-400",
    image: "/images/img-office.jpg",
  },
  {
    icon: Phone,
    label: "WhatsApp",
    value: "+92 328 577 8715",
    href: "https://wa.me/923285778715",
    color: "from-emerald-600 to-teal-600",
    lightColor: "bg-emerald-50 dark:bg-emerald-950/40 border-emerald-100 dark:border-emerald-900/50",
    iconColor: "text-emerald-600 dark:text-emerald-400",
    image: "/images/img-team-collab.jpg",
  },
  {
    icon: MapPin,
    label: "Location",
    value: "Lahore, Pakistan (PKT UTC+5)",
    href: "#",
    color: "from-violet-600 to-indigo-600",
    lightColor: "bg-violet-50 dark:bg-violet-950/40 border-violet-100 dark:border-violet-900/50",
    iconColor: "text-violet-600 dark:text-violet-400",
    image: "/images/img-global-scale.jpg",
  },
];

function ContactForm() {
  const searchParams = useSearchParams();
  const preSelectedService = searchParams.get("service") || "CUSTOM_SOFTWARE";

  const [clientName, setClientName] = useState("");
  const [clientEmail, setClientEmail] = useState("");
  const [organization, setOrganization] = useState("");
  const [serviceType, setServiceType] = useState(preSelectedService);
  const [budget, setBudget] = useState("$500 - $1,500");
  const [region, setRegion] = useState("");
  const [message, setMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [regionOpen, setRegionOpen] = useState(false);
  const [serviceOpen, setServiceOpen] = useState(false);
  const [regionSearch, setRegionSearch] = useState("");
  const regionRef = useRef<HTMLDivElement>(null);
  const serviceRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      if (regionRef.current && !regionRef.current.contains(e.target as Node)) setRegionOpen(false);
      if (serviceRef.current && !serviceRef.current.contains(e.target as Node)) setServiceOpen(false);
    };
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  const formSectionRef = useRef<HTMLElement>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isSubmitting) return;
    if (message.trim().length < 30) {
      toast.error("Message Too Short", {
        description: "Please describe your project in at least 30 characters.",
        duration: 4000,
      });
      return;
    }

    setIsSubmitting(true);
    try {
      const response = await fetch("/api/services/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ clientName, clientEmail, organization, serviceType, budget, region, message }),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || "Failed to submit request.");

      toast.success("Inquiry Transmitted!", {
        description: "Your project inquiry has been transmitted. We will contact you within 12 hours.",
        duration: 6000,
      });

      setClientName("");
      setClientEmail("");
      setOrganization("");
      setRegion("");
      setMessage("");
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "An unexpected error occurred.";
      toast.error("Transmission Failed", { description: msg, duration: 5000 });
    } finally {
      setIsSubmitting(false);
    }
  };

  const inputClass =
    "w-full px-4 py-3.5 text-sm rounded-xl bg-slate-50 dark:bg-neutral-900 border border-slate-200 dark:border-neutral-700 text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-neutral-500 focus:outline-none focus:border-brand-500 focus:ring-2 focus:ring-brand-500/20 transition-all duration-300 hover:border-slate-300 dark:hover:border-neutral-600 font-medium";

  const REGIONS = [
    { group: "🌍 Middle East & Gulf", items: ["United Arab Emirates (UAE)", "Saudi Arabia (KSA)", "Qatar", "Kuwait", "Bahrain", "Oman"] },
    { group: "🌍 South Asia", items: ["Pakistan", "India", "Bangladesh", "Sri Lanka"] },
    { group: "🌎 North America", items: ["United States (USA)", "Canada", "Mexico"] },
    { group: "🌍 Europe", items: ["United Kingdom (UK)", "Germany", "France", "Netherlands", "Sweden", "Switzerland", "Other EU Country"] },
    { group: "🌏 SE Asia & Pacific", items: ["Australia", "Singapore", "Malaysia", "Indonesia"] },
    { group: "🌍 Africa", items: ["Nigeria", "South Africa", "Kenya", "Egypt"] },
    { group: "🌎 Other", items: ["Other / Not Listed"] },
  ];

  const filteredRegions = REGIONS.map(g => ({
    ...g,
    items: g.items.filter(i => i.toLowerCase().includes(regionSearch.toLowerCase())),
  })).filter(g => g.items.length > 0);

  const SERVICE_OPTIONS = Object.entries(SERVICE_LABELS);

  // ── Service Pricing Map ──────────────────────────────────
  const SERVICE_PRICING: Record<string, {
    suggested: string;       // matches fullVal used in budget buttons
    label: string;           // human-readable range
    tier: "starter" | "pro" | "enterprise";
    desc: string;
    color: string;
    startingFrom: string;
  }> = {
    UI_UX_DESIGN:     { suggested: "$500 - $1,500",    label: "$500 – $1,500",    tier: "starter",    startingFrom: "$500",   color: "text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/30 border-emerald-200 dark:border-emerald-800/40", desc: "Design system, wireframes, prototypes" },
    SERVERLESS_WEB:   { suggested: "$1,500 - $5,000",  label: "$1,500 – $5,000",  tier: "pro",        startingFrom: "$1,500", color: "text-brand-600 dark:text-brand-400 bg-brand-50 dark:bg-brand-950/30 border-brand-200 dark:border-brand-800/40",   desc: "SEO-optimized web app, serverless backend" },
    DATA_ANALYTICS:   { suggested: "$1,500 - $5,000",  label: "$1,500 – $5,000",  tier: "pro",        startingFrom: "$1,500", color: "text-brand-600 dark:text-brand-400 bg-brand-50 dark:bg-brand-950/30 border-brand-200 dark:border-brand-800/40",   desc: "Dashboards, reports, data pipelines" },
    MOBILE_APPS:      { suggested: "$1,500 - $5,000",  label: "$1,500 – $5,000",  tier: "pro",        startingFrom: "$1,500", color: "text-brand-600 dark:text-brand-400 bg-brand-50 dark:bg-brand-950/30 border-brand-200 dark:border-brand-800/40",   desc: "iOS & Android cross-platform app" },
    DEVOPS_CLOUD:     { suggested: "$1,500 - $5,000",  label: "$1,500 – $5,000",  tier: "pro",        startingFrom: "$1,500", color: "text-brand-600 dark:text-brand-400 bg-brand-50 dark:bg-brand-950/30 border-brand-200 dark:border-brand-800/40",   desc: "CI/CD pipelines, cloud infra, monitoring" },
    CUSTOM_SOFTWARE:  { suggested: "$5,000+",          label: "$5,000+",          tier: "enterprise", startingFrom: "$5,000", color: "text-violet-600 dark:text-violet-400 bg-violet-50 dark:bg-violet-950/30 border-violet-200 dark:border-violet-800/40", desc: "Full-stack enterprise platform, custom architecture" },
    AGENTIC_AI:       { suggested: "$5,000+",          label: "$5,000+",          tier: "enterprise", startingFrom: "$5,000", color: "text-violet-600 dark:text-violet-400 bg-violet-50 dark:bg-violet-950/30 border-violet-200 dark:border-violet-800/40", desc: "AI agents, LLM integrations, automation workflows" },
  };

  const currentPricing = SERVICE_PRICING[serviceType];

  return (
    <div className="flex-1 w-full bg-white dark:bg-black text-slate-900 dark:text-white" style={{ overflowX: "clip" }}>

      {/* ══════════════════════════════════════════
          SLIDE 1: HERO
      ══════════════════════════════════════════ */}
      <section className="z-0 relative min-h-[100dvh] w-full flex flex-col justify-center pt-28 pb-10 px-4 sm:px-6 lg:px-8 overflow-hidden bg-white dark:bg-black group/section">

        <div className="absolute inset-0 bg-gradient-to-br from-slate-50 via-white to-violet-50/20 dark:from-black dark:via-neutral-950 dark:to-black" />

        <div className="absolute inset-0 bg-[linear-gradient(rgba(0,0,0,0.025)_1px,transparent_1px),linear-gradient(90deg,rgba(0,0,0,0.025)_1px,transparent_1px)] dark:bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:64px_64px]" />

        <div className="relative z-10 text-center max-w-5xl mx-auto w-full space-y-7">
          <AnimateOnScroll variant="fadeUp">
            <div className="inline-flex items-center gap-2.5 px-4 py-1.5 rounded-full bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800/40 text-emerald-700 dark:text-emerald-400 text-[11px] font-bold uppercase tracking-[0.2em]">
              <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              Accepting New Projects
            </div>
          </AnimateOnScroll>

          <AnimateOnScroll variant="fadeUp" delay={0.08}>
            <h1 className="text-5xl sm:text-6xl lg:text-7xl font-black text-slate-900 dark:text-white font-heading leading-[1.02] tracking-tight">
              We Engineer{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-600 via-cyan-500 to-violet-600 dark:from-brand-400 dark:via-cyan-400 dark:to-violet-400">
                What Matters.
              </span>
            </h1>
          </AnimateOnScroll>

          <AnimateOnScroll variant="fadeUp" delay={0.14}>
            <p className="text-slate-500 dark:text-slate-400 text-lg sm:text-xl max-w-3xl mx-auto leading-relaxed">
              Bespoke software solutions for ambitious enterprises. From vision to scalable reality —
              delivered with precision and speed.
            </p>
          </AnimateOnScroll>

          <AnimateOnScroll variant="fadeUp" delay={0.2}>
            <div className="flex flex-wrap justify-center gap-4 pt-4">
              <button
                onClick={() => formSectionRef.current?.scrollIntoView({ behavior: "smooth" })}
                className="inline-flex items-center gap-2 px-8 py-4 rounded-xl bg-slate-900 dark:bg-white text-white dark:text-slate-900 font-bold text-sm hover:bg-slate-700 dark:hover:bg-slate-200 transition-colors shadow-lg group cursor-pointer"
              >
                Start a Conversation <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </button>
              <Link
                href="/portfolio"
                className="inline-flex items-center gap-2 px-8 py-4 rounded-xl border border-slate-200 dark:border-neutral-700 text-slate-700 dark:text-slate-300 font-bold text-sm hover:border-brand-400 dark:hover:border-brand-600 transition-colors group"
              >
                View Our Work <ArrowUpRight className="w-4 h-4 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
              </Link>
            </div>
          </AnimateOnScroll>

          {/* Trust pills */}
          <AnimateOnScroll variant="fadeUp" delay={0.26}>
            <div className="flex flex-wrap items-center justify-center gap-x-6 gap-y-2 pt-2">
              {["NDA-protected", "Free consultation", "<12h response", "Senior team only"].map((t) => (
                <span key={t} className="flex items-center gap-1.5 text-xs font-medium text-slate-500 dark:text-slate-400">
                  <CheckCircle2 className="w-3 h-3 text-emerald-500 shrink-0" /> {t}
                </span>
              ))}
            </div>
          </AnimateOnScroll>
        </div>
      </section>

      {/* ══════════════════════════════════════════
          SLIDE 2: CONTACT CHANNELS + TRUST
      ══════════════════════════════════════════ */}
      <section className="z-0 relative min-h-[100dvh] w-full flex flex-col justify-center pt-28 pb-10 px-4 sm:px-6 lg:px-8 bg-slate-50 dark:bg-neutral-950 border-t border-slate-100 dark:border-neutral-900 overflow-hidden group/section">
        
        <div className="relative z-10 max-w-7xl mx-auto w-full grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-24 items-center">

          {/* Left: Contact Channels */}
          <AnimateOnScroll variant="fadeUp">
            <div className="space-y-8">
              <div className="space-y-3">
                <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white dark:bg-neutral-900 border border-slate-200 dark:border-neutral-800 text-slate-500 dark:text-slate-400 text-[11px] font-bold uppercase tracking-[0.2em]">
                  <MessageSquare className="w-3 h-3 text-brand-500" />
                  Get In Touch
                </div>
                <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold font-heading text-slate-900 dark:text-white tracking-tight leading-tight">
                  Multiple ways to reach us — all lead to the same result.
                </h2>
              </div>

              <div className="space-y-4">
                {CONTACT_CHANNELS.map((ch, i) => (
                  <a
                    key={ch.label}
                    href={ch.href}
                    target={ch.href.startsWith("http") ? "_blank" : undefined}
                    rel="noopener noreferrer"
                    className="relative flex items-center gap-5 p-5 rounded-2xl bg-white dark:bg-neutral-900 border border-slate-100 dark:border-neutral-800 hover:border-brand-300 dark:hover:border-brand-700 hover:shadow-xl hover:-translate-y-0.5 transition-all duration-300 group overflow-hidden"
                  >
                    <div className="absolute inset-0 z-0 pointer-events-none rounded-[inherit] overflow-hidden">
                      <Image src={ch.image} alt={ch.label} fill sizes="(max-width: 768px) 100vw, 50vw" className="object-cover opacity-[0.08] dark:opacity-[0.16] group-hover:opacity-[0.15] dark:group-hover:opacity-[0.25] transition-opacity duration-500" />
                    </div>
                    <div className={`relative z-10 w-12 h-12 rounded-2xl flex items-center justify-center border shrink-0 ${ch.lightColor} group-hover:scale-110 transition-transform`}>
                      <ch.icon className={`w-5 h-5 ${ch.iconColor}`} />
                    </div>
                    <div className="relative z-10 flex-1 min-w-0">
                      <div className="text-[10px] font-bold uppercase tracking-widest text-slate-400 dark:text-slate-500 mb-0.5">{ch.label}</div>
                      <div className="text-sm font-bold text-slate-900 dark:text-white truncate">{ch.value}</div>
                    </div>
                    <ArrowUpRight className="relative z-10 w-4 h-4 text-slate-300 dark:text-neutral-600 group-hover:text-brand-500 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all shrink-0" />
                  </a>
                ))}
              </div>
            </div>
          </AnimateOnScroll>

          {/* Right: Office Visual */}
          <AnimateOnScroll variant="fadeUp" delay={0.1}>
            <div className="relative w-full h-[460px] lg:h-[540px] rounded-3xl overflow-hidden border border-slate-100 dark:border-neutral-800 shadow-2xl group">
              <Image
                src="/contact-office.webp"
                alt="SAMStack Tech office, Lahore"
                fill sizes="(max-width: 768px) 100vw, 50vw"
                className="object-cover transition-transform duration-700 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />
              {/* Location badge */}
              <div className="absolute top-5 left-5 flex items-center gap-2 px-3 py-1.5 rounded-full bg-black/40 backdrop-blur-md border border-white/20 text-white text-[11px] font-bold">
                <MapPin className="w-3 h-3 text-brand-400" />
                Lahore, Pakistan — PKT UTC+5
              </div>
              {/* Status badge */}
              <div className="absolute top-5 right-5 flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-500/20 backdrop-blur-md border border-emerald-500/40 text-emerald-300 text-[11px] font-bold">
                <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                Accepting Projects
              </div>
              {/* Bottom stats */}
              <div className="absolute bottom-6 left-6 right-6 grid grid-cols-2 gap-3">
                <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-4">
                  <div className="text-xl font-black text-white font-mono">&lt;12h</div>
                  <div className="text-[10px] text-white/60 uppercase tracking-widest font-bold mt-0.5">Response Time</div>
                </div>
                <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-4">
                  <div className="text-xl font-black text-white font-mono">Free</div>
                  <div className="text-[10px] text-white/60 uppercase tracking-widest font-bold mt-0.5">Consultation</div>
                </div>
              </div>
            </div>
          </AnimateOnScroll>

        </div>
      </section>

      {/* ══════════════════════════════════════════
          SLIDE 3: CONTACT FORM (grows if needed)
      ══════════════════════════════════════════ */}
      <section
        ref={formSectionRef}
        className="z-0 relative min-h-[100dvh] w-full flex flex-col justify-center pt-28 pb-10 px-4 sm:px-6 lg:px-8 bg-white dark:bg-black border-t border-slate-100 dark:border-neutral-900 overflow-hidden group/section"
      >
        
        <div className="relative z-10 max-w-7xl mx-auto w-full grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-20 items-start">

          {/* Left: Sticky Info */}
          <div className="lg:col-span-4 lg:sticky lg:top-28 space-y-10">
            <AnimateOnScroll variant="fadeUp">
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <div className="w-6 h-1 bg-gradient-to-r from-brand-500 to-violet-500 rounded-full" />
                  <span className="text-[11px] font-bold uppercase tracking-[0.2em] text-slate-400 dark:text-slate-500">Project Brief</span>
                </div>
                <h2 className="text-3xl sm:text-4xl font-extrabold font-heading text-slate-900 dark:text-white tracking-tight leading-tight">
                  Start Your Project Today
                </h2>
                <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed">
                  Every inquiry is reviewed personally by our founder and lead architect.
                  Expect a thoughtful, technical response — not a sales pitch.
                </p>
              </div>
            </AnimateOnScroll>

            {/* Services Quick List */}
            <AnimateOnScroll variant="fadeUp" delay={0.1}>
              <div className="space-y-3">
                <div className="text-[10px] font-bold uppercase tracking-widest text-slate-400 dark:text-slate-500 mb-3">What We Build</div>
                {Object.entries(SERVICE_LABELS).map(([key, label]) => (
                  <div key={key} className="flex items-center gap-3 text-sm text-slate-700 dark:text-slate-300">
                    <Cpu className="w-3.5 h-3.5 text-brand-500 shrink-0" />
                    <span className="font-medium">{label}</span>
                  </div>
                ))}
              </div>
            </AnimateOnScroll>
          </div>

          {/* Right: Form */}
          <div className="lg:col-span-8">
            <AnimateOnScroll variant="fadeUp" delay={0.08}>
              <div className="relative bg-slate-50 dark:bg-neutral-900/50 border border-slate-100 dark:border-neutral-800 rounded-3xl p-7 sm:p-10 lg:p-12 shadow-xl shadow-slate-200/50 dark:shadow-black/30">
                {/* Top accent */}
                <div className="absolute top-0 left-8 right-8 h-1 bg-gradient-to-r from-brand-500 via-cyan-500 to-violet-500 rounded-b-full" />

                <form onSubmit={handleSubmit} className="space-y-6 mt-4">
                  {/* Row 1 */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                    <div className="space-y-2">
                      <label className="text-[11px] font-bold tracking-widest text-slate-500 dark:text-slate-400 uppercase flex items-center gap-1.5">
                        <User className="w-3 h-3" /> Full Name
                      </label>
                      <input
                        type="text"
                        required
                        value={clientName}
                        onChange={(e) => setClientName(e.target.value)}
                        placeholder="Alex Rivera"
                        className={inputClass}
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-[11px] font-bold tracking-widest text-slate-500 dark:text-slate-400 uppercase flex items-center gap-1.5">
                        <Mail className="w-3 h-3" /> Work Email
                      </label>
                      <input
                        type="email"
                        required
                        value={clientEmail}
                        onChange={(e) => setClientEmail(e.target.value)}
                        placeholder="you@company.com"
                        className={inputClass}
                      />
                    </div>
                  </div>

                  {/* Row 2: Organization + Region */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                    <div className="space-y-2">
                      <label className="text-[11px] font-bold tracking-widest text-slate-500 dark:text-slate-400 uppercase flex items-center gap-1.5">
                        <Building className="w-3 h-3" /> Organization
                      </label>
                      <input
                        type="text"
                        value={organization}
                        onChange={(e) => setOrganization(e.target.value)}
                        placeholder="Acme Corp"
                        className={inputClass}
                      />
                    </div>
                    <div className="space-y-2" ref={regionRef}>
                      <label className="text-[11px] font-bold tracking-widest text-slate-500 dark:text-slate-400 uppercase flex items-center gap-1.5">
                        <MapPin className="w-3 h-3" /> Region / Country
                      </label>
                      <div className="relative">
                        <button
                          type="button"
                          onClick={() => { setRegionOpen(o => !o); setServiceOpen(false); }}
                          className={`${inputClass} flex items-center justify-between text-left ${!region ? "text-slate-400 dark:text-neutral-500" : ""}`}
                        >
                          <span className="truncate">{region || "Select your region"}</span>
                          <ChevronDown className={`w-4 h-4 shrink-0 ml-2 transition-transform duration-200 ${regionOpen ? "rotate-180" : ""}`} />
                        </button>

                        {regionOpen && (
                          <div className="absolute z-50 top-[calc(100%+6px)] left-0 right-0 bg-white dark:bg-neutral-900 border border-slate-200 dark:border-neutral-700 rounded-2xl shadow-2xl shadow-slate-300/40 dark:shadow-black/60 overflow-hidden animate-in fade-in slide-in-from-top-2 duration-200">
                            {/* Search bar */}
                            <div className="p-3 border-b border-slate-100 dark:border-neutral-800">
                              <div className="relative">
                                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-400" />
                                <input
                                  autoFocus
                                  type="text"
                                  placeholder="Search country..."
                                  value={regionSearch}
                                  onChange={e => setRegionSearch(e.target.value)}
                                  className="w-full pl-9 pr-3 py-2 text-sm bg-slate-50 dark:bg-neutral-800 border border-slate-200 dark:border-neutral-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-500/30 focus:border-brand-500 transition-all placeholder:text-slate-400 text-slate-900 dark:text-white"
                                />
                              </div>
                            </div>

                            {/* Options */}
                            <div className="max-h-64 overflow-y-auto py-2 custom-scrollbar">
                              {filteredRegions.length === 0 ? (
                                <div className="px-4 py-6 text-center text-sm text-slate-400">No results found</div>
                              ) : filteredRegions.map(group => (
                                <div key={group.group}>
                                  <div className="px-4 py-1.5 text-[10px] font-bold uppercase tracking-widest text-slate-400 dark:text-slate-500 bg-slate-50 dark:bg-neutral-800/50">{group.group}</div>
                                  {group.items.map(item => (
                                    <button
                                      key={item}
                                      type="button"
                                      onClick={() => { setRegion(item); setRegionOpen(false); setRegionSearch(""); }}
                                      className={`w-full flex items-center justify-between px-4 py-2.5 text-sm text-left transition-colors hover:bg-brand-50 dark:hover:bg-brand-950/30 ${
                                        region === item ? "text-brand-600 dark:text-brand-400 bg-brand-50 dark:bg-brand-950/30" : "text-slate-700 dark:text-slate-300"
                                      }`}
                                    >
                                      <span className="font-medium">{item}</span>
                                      {region === item && <Check className="w-3.5 h-3.5 shrink-0" />}
                                    </button>
                                  ))}
                                </div>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Row 3: Budget */}
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <label className="text-[11px] font-bold tracking-widest text-slate-500 dark:text-slate-400 uppercase flex items-center gap-1.5">
                        <DollarSign className="w-3 h-3" /> Budget Range
                      </label>
                      {currentPricing && (
                        <span className="text-[10px] font-mono text-slate-400 dark:text-slate-500">
                          Suggested for this service:
                          <span className="ml-1 font-bold text-slate-600 dark:text-slate-300">{currentPricing.label}</span>
                        </span>
                      )}
                    </div>
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                      {["<$500", "$500–$1.5K", "$1.5K–$5K", "$5K+"].map((b) => {
                        const fullVal = b === "<$500" ? "<$500" : b === "$500–$1.5K" ? "$500 - $1,500" : b === "$1.5K–$5K" ? "$1,500 - $5,000" : "$5,000+";
                        const isSelected = budget === fullVal;
                        const isSuggested = currentPricing?.suggested === fullVal;
                        return (
                          <div key={b} className="relative">
                            <button
                              type="button"
                              onClick={() => setBudget(fullVal)}
                              className={`w-full px-3 py-2.5 rounded-xl text-xs font-bold border transition-all duration-200 ${
                                isSelected
                                  ? "bg-slate-900 dark:bg-white text-white dark:text-slate-900 border-slate-900 dark:border-white shadow-md"
                                  : isSuggested
                                  ? "bg-brand-50 dark:bg-brand-950/30 text-brand-700 dark:text-brand-300 border-brand-300 dark:border-brand-700 shadow-sm"
                                  : "bg-slate-50 dark:bg-neutral-900 text-slate-500 dark:text-slate-400 border-slate-200 dark:border-neutral-700 hover:border-brand-400 dark:hover:border-brand-600"
                              }`}
                            >
                              {b}
                            </button>
                            {isSuggested && !isSelected && (
                              <span className="absolute -top-2 left-1/2 -translate-x-1/2 text-[8px] font-black uppercase tracking-widest px-1.5 py-0.5 bg-brand-500 text-white rounded-full whitespace-nowrap">
                                ★ Best
                              </span>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  {/* Service */}
                  <div className="space-y-2" ref={serviceRef}>
                    <label className="text-[11px] font-bold tracking-widest text-slate-500 dark:text-slate-400 uppercase flex items-center gap-1.5">
                      <Cpu className="w-3 h-3" /> Service Type
                    </label>
                    <div className="relative">
                      <button
                        type="button"
                        onClick={() => { setServiceOpen(o => !o); setRegionOpen(false); }}
                        className={`${inputClass} flex items-center justify-between text-left`}
                      >
                        <span className="truncate">{SERVICE_LABELS[serviceType] || "Select service"}</span>
                        <ChevronDown className={`w-4 h-4 shrink-0 ml-2 transition-transform duration-200 ${serviceOpen ? "rotate-180" : ""}`} />
                      </button>

                      {serviceOpen && (
                        <div className="absolute z-50 top-[calc(100%+6px)] left-0 right-0 bg-white dark:bg-neutral-900 border border-slate-200 dark:border-neutral-700 rounded-2xl shadow-2xl shadow-slate-300/40 dark:shadow-black/60 overflow-hidden animate-in fade-in slide-in-from-top-2 duration-200">
                          <div className="py-2">
                            {SERVICE_OPTIONS.map(([val, label]) => {
                              const pricing = SERVICE_PRICING[val];
                              return (
                                <button
                                  key={val}
                                  type="button"
                                  onClick={() => {
                                    setServiceType(val);
                                    setServiceOpen(false);
                                    if (pricing) setBudget(pricing.suggested);
                                  }}
                                  className={`w-full flex items-center justify-between px-4 py-3 text-sm text-left transition-colors hover:bg-brand-50 dark:hover:bg-brand-950/30 ${
                                    serviceType === val ? "text-brand-600 dark:text-brand-400 bg-brand-50 dark:bg-brand-950/30 font-bold" : "text-slate-700 dark:text-slate-300"
                                  }`}
                                >
                                  <div className="flex flex-col gap-0.5">
                                    <span className="font-semibold">{label}</span>
                                    {pricing && <span className="text-[10px] font-mono text-slate-400 dark:text-slate-500">{pricing.label}</span>}
                                  </div>
                                  <div className="flex items-center gap-2 shrink-0">
                                    {pricing && (
                                      <span className={`text-[9px] font-black uppercase tracking-widest px-2 py-0.5 rounded-full border ${
                                        pricing.tier === "starter" ? "text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/30 border-emerald-200 dark:border-emerald-800" :
                                        pricing.tier === "enterprise" ? "text-violet-600 dark:text-violet-400 bg-violet-50 dark:bg-violet-950/30 border-violet-200 dark:border-violet-800" :
                                        "text-brand-600 dark:text-brand-400 bg-brand-50 dark:bg-brand-950/30 border-brand-200 dark:border-brand-800"
                                      }`}>{pricing.tier}</span>
                                    )}
                                    {serviceType === val && <Check className="w-3.5 h-3.5" />}
                                  </div>
                                </button>
                              );
                            })}
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Pricing Info Card */}
                    {currentPricing && (
                      <div className={`flex items-center justify-between gap-3 px-4 py-3 rounded-xl border text-xs font-medium transition-all duration-300 ${currentPricing.color}`}>
                        <div className="flex items-center gap-2">
                          <DollarSign className="w-3.5 h-3.5 shrink-0" />
                          <span>
                            <span className="font-black">Starting from {currentPricing.startingFrom}</span>
                            <span className="opacity-70"> — {currentPricing.desc}</span>
                          </span>
                        </div>
                        <span className={`shrink-0 text-[9px] font-black uppercase tracking-widest px-2 py-1 rounded-full border ${
                          currentPricing.tier === "starter" ? "text-emerald-700 dark:text-emerald-300 bg-emerald-100 dark:bg-emerald-950/60 border-emerald-300 dark:border-emerald-700" :
                          currentPricing.tier === "enterprise" ? "text-violet-700 dark:text-violet-300 bg-violet-100 dark:bg-violet-950/60 border-violet-300 dark:border-violet-700" :
                          "text-brand-700 dark:text-brand-300 bg-brand-100 dark:bg-brand-950/60 border-brand-300 dark:border-brand-700"
                        }`}>{currentPricing.tier}</span>
                      </div>
                    )}
                  </div>

                  {/* Message */}
                  <div className="space-y-2">
                    <label className="text-[11px] font-bold tracking-widest text-slate-500 dark:text-slate-400 uppercase flex items-center gap-1.5">
                      <MessageSquare className="w-3 h-3" /> Project Brief
                    </label>
                    <textarea
                      required
                      minLength={30}
                      rows={6}
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      placeholder="Tell us about your goals, timeline, current challenges, and what success looks like..."
                      className={`${inputClass} resize-y min-h-[130px]`}
                    />
                    <div className="flex justify-between text-[11px] text-slate-400 font-mono">
                      <span className={message.length > 0 && message.length < 30 ? "text-rose-500" : ""}>
                        {message.length > 0 && message.length < 30 ? `${30 - message.length} chars needed` : ""}
                      </span>
                      <span>{message.length}/800</span>
                    </div>
                  </div>

                  {/* Submit */}
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full bg-brand-600 hover:bg-brand-500 disabled:opacity-70 text-white font-bold py-4 rounded-xl flex items-center justify-center gap-2.5 text-sm tracking-wide transition-all duration-300 active:scale-[0.985] shadow-md hover:shadow-lg hover:shadow-brand-500/25"
                  >
                    {isSubmitting ? (
                      <>Transmitting Secure Brief...</>
                    ) : (
                      <>
                        Send Project Brief
                        <Send className="w-4 h-4" />
                      </>
                    )}
                  </button>

                  <p className="text-center text-[11px] text-slate-400 dark:text-neutral-500 flex items-center justify-center gap-2">
                    <Shield className="w-3.5 h-3.5" /> End-to-end encrypted &bull; NDA by default
                  </p>
                </form>
              </div>
            </AnimateOnScroll>
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════
          SLIDE 4: DARK CTA
      ══════════════════════════════════════════ */}
      <section className="z-0 relative min-h-[100dvh] w-full flex flex-col justify-center pt-28 pb-10 px-4 sm:px-6 lg:px-8 overflow-hidden bg-slate-900 dark:bg-neutral-950 border-t-8 border-brand-500 group/section">
        <div className="z-10 relative absolute inset-0 bg-[radial-gradient(ellipse_80%_60%_at_50%_-10%,rgba(14,165,233,0.15),transparent)]" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_60%_50%_at_80%_100%,rgba(139,92,246,0.12),transparent)]" />
        <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:64px_64px]" />

        <div className="relative z-10 max-w-4xl mx-auto text-center space-y-8 w-full">
          <AnimateOnScroll variant="fadeUp">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/10 border border-white/15 text-white/70 text-[11px] font-bold uppercase tracking-[0.2em]">
              <Sparkles className="w-3 h-3 text-cyan-400" />
              Ready to Begin?
            </div>
          </AnimateOnScroll>

          <AnimateOnScroll variant="fadeUp" delay={0.08}>
            <h2 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-white font-heading leading-tight tracking-tight">
              Let&apos;s architect something{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-violet-400">
                legendary.
              </span>
            </h2>
          </AnimateOnScroll>

          <AnimateOnScroll variant="fadeUp" delay={0.12}>
            <p className="text-white/60 text-base sm:text-lg max-w-xl mx-auto leading-relaxed">
              Every great product starts with a single conversation. Tell us what you&apos;re building
              and we&apos;ll show you exactly how we&apos;d engineer it.
            </p>
          </AnimateOnScroll>

          <AnimateOnScroll variant="fadeUp" delay={0.16}>
            <div className="flex flex-wrap gap-4 sm:gap-6 justify-center">
              <button
                onClick={() => formSectionRef.current?.scrollIntoView({ behavior: "smooth" })}
                className="inline-flex items-center gap-2 px-8 py-4 rounded-xl bg-white hover:bg-slate-100 text-slate-900 font-bold text-sm transition-all shadow-2xl group cursor-pointer"
              >
                Start Conversation <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </button>
              <Link
                href="/portfolio"
                className="inline-flex items-center gap-2 px-8 py-4 rounded-xl bg-white/10 hover:bg-white/15 border border-white/20 hover:border-white/30 text-white font-bold text-sm transition-all group"
              >
                Explore Our Work <ArrowUpRight className="w-4 h-4 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
              </Link>
            </div>
          </AnimateOnScroll>
        </div>
      </section>

    </div>
  );
}

export default function ContactPage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center text-slate-400 bg-white dark:bg-black">Loading...</div>}>
      <ContactForm />
    </Suspense>
  );
}
