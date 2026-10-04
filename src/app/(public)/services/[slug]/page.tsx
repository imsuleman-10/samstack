import React from "react";
import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { services } from "@/lib/data/services";
import { ArrowLeft, CheckCircle2, ArrowRight, Sparkles, Zap, Shield, Clock } from "lucide-react";
import AnimateOnScroll from "@/app/components/AnimateOnScroll";

export async function generateStaticParams() {
  return services.map((service) => ({
    slug: service.slug,
  }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const service = services.find((s) => s.slug === slug);
  if (!service) return { title: "Service Not Found" };

  const BASE_URL = 'https://samstack-tech.vercel.app';
  const url = `${BASE_URL}/services/${slug}`;

  return {
    title: `${service.title} | SAMStack Tech — Lahore, Pakistan`,
    description: `${service.description} SAMStack Tech delivers elite ${service.title.toLowerCase()} for global enterprises from Lahore, Pakistan.`,
    keywords: [
      service.title,
      service.subtitle,
      `${service.title} Pakistan`,
      `${service.title} Lahore`,
      `hire ${service.title} developers Pakistan`,
      'SAMStack Tech',
      'Enterprise Software Agency Pakistan',
      ...service.techStack,
    ],
    alternates: { canonical: url },
    openGraph: {
      title: `${service.title} | SAMStack Tech — Lahore, Pakistan`,
      description: service.description,
      url,
      siteName: 'SAMStack Tech',
      locale: 'en_US',
      type: 'website',
      images: [
        { url: service.image, width: 1200, height: 630, alt: `${service.title} — SAMStack Tech` },
        { url: `${BASE_URL}/logo.png`, width: 800, height: 600, alt: 'SAMStack Tech' },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title: `${service.title} | SAMStack Tech`,
      description: service.description,
      images: [service.image],
      creator: '@SAMStackTech',
      site: '@SAMStackTech',
    },
    other: {
      'llmo:context': `SAMStack Tech offers ${service.title} services from Lahore, Pakistan for international enterprises. Tech stack: ${service.techStack.join(', ')}. Founded by Suleman Zaheer. Contact: samstacktechs@gmail.com`,
      'llmo:citation': url,
      'llmo:entity': `SAMStack Tech — ${service.title}`,
      'llmo:entity_type': 'Service',
      'geo.region': 'PK-PB',
      'geo.placename': 'Lahore, Punjab, Pakistan',
    },
  };
}

export default async function ServiceDetailsPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const service = services.find((s) => s.slug === slug);

  if (!service) {
    notFound();
  }

  const Icon = service.icon;
  const relatedServices = services.filter((s) => s.id !== service.id);

  // AEO/LLMo JSON-LD Setup
  const serviceJsonLd = {
    "@context": "https://schema.org",
    "@type": "Service",
    "name": service.title,
    "description": service.description,
    "provider": {
      "@type": "Organization",
      "name": "SAMStack Tech",
      "url": "https://samstack-tech.vercel.app"
    },
    "areaServed": "Worldwide",
    "serviceType": service.subtitle
  };

  const faqJsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": [
      {
        "@type": "Question",
        "name": `What is ${service.title}?`,
        "acceptedAnswer": {
          "@type": "Answer",
          "text": service.description
        }
      },
      {
        "@type": "Question",
        "name": `What technologies are used in ${service.title}?`,
        "acceptedAnswer": {
          "@type": "Answer",
          "text": `We utilize a modern tech stack for ${service.title} including: ${service.techStack.join(", ")}.`
        }
      },
      {
        "@type": "Question",
        "name": `How to start a ${service.title} project with SAMStack Tech?`,
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "You can start by booking a free discovery call. We offer a response within 12 hours, full NDA protection, and an elite delivery team."
        }
      }
    ]
  };

  return (
    <div className="flex-1 w-full bg-white dark:bg-black">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(serviceJsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }}
      />

      {/* ══════════════════════════════════════════
          HERO — Cinematic Full-screen
      ══════════════════════════════════════════ */}
      <section className="relative overflow-hidden min-h-[100dvh] flex items-center justify-center pt-20 pb-16 group/section">
        {/* Immersive Background */}
        <div className="absolute inset-0 z-0">
          <Image
            src={service.image}
            alt={service.title}
            fill
            priority
            sizes="100vw"
            className="object-cover scale-105 group-hover/section:scale-100 transition-transform duration-[2500ms] ease-out"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-black/80 via-black/65 to-slate-950/98" />
          <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.018)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.018)_1px,transparent_1px)] bg-[size:64px_64px]" />
          <div className="absolute top-1/4 left-1/3 w-[500px] h-[500px] bg-brand-500/15 rounded-full blur-[140px] mix-blend-screen pointer-events-none" />
          <div className="absolute bottom-1/4 right-1/4 w-[300px] h-[300px] bg-indigo-500/15 rounded-full blur-[120px] mix-blend-screen pointer-events-none" />
        </div>

        {/* Floating Glass Content Card */}
        <div className="relative z-20 w-full max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <AnimateOnScroll variant="fadeUp">
            <div className="rounded-3xl border border-white/10 bg-white/[0.04] backdrop-blur-2xl shadow-2xl shadow-black/60 overflow-hidden relative">
              <div className="absolute top-0 right-0 w-72 h-72 bg-brand-500/15 rounded-full blur-[100px] pointer-events-none" />
              <div className="absolute bottom-0 left-0 w-48 h-48 bg-indigo-500/10 rounded-full blur-[80px] pointer-events-none" />

              <div className="relative z-10">
                {/* Nav bar inside card */}
                <div className="flex items-center justify-between px-8 sm:px-12 lg:px-16 py-5 border-b border-white/10">
                  <Link
                    href="/services"
                    className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-white/60 hover:text-white bg-white/5 hover:bg-white/12 border border-white/10 hover:border-brand-500/40 px-4 py-2 rounded-xl transition-all duration-300 group"
                  >
                    <ArrowLeft className="w-3.5 h-3.5 group-hover:-translate-x-1 transition-transform text-brand-400" />
                    All Services
                  </Link>
                  <span className="text-[10px] font-mono text-white/30 uppercase tracking-widest hidden sm:block">SAMStack Tech</span>
                </div>

                {/* Main content */}
                <div className="px-8 sm:px-12 lg:px-16 py-10 sm:py-12 space-y-6">
                {/* Badge row */}
                <div className="flex flex-wrap items-center gap-3">
                  <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-brand-500 to-indigo-600 p-[1px] shadow-lg shadow-brand-500/30 shrink-0">
                    <div className="w-full h-full rounded-[15px] bg-black/60 backdrop-blur-md flex items-center justify-center">
                      <Icon className="w-7 h-7 text-white" />
                    </div>
                  </div>
                  <span className="text-[11px] font-mono bg-brand-500/15 border border-brand-500/30 px-4 py-1.5 rounded-full text-brand-300 uppercase tracking-widest font-bold">
                    {service.subtitle}
                  </span>
                </div>

                {/* Title */}
                <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black text-white font-heading leading-[1.05] tracking-tight max-w-4xl">
                  {service.title}
                </h1>

                {/* Description */}
                <p className="text-base sm:text-lg lg:text-xl text-slate-300 font-medium max-w-3xl leading-relaxed">
                  {service.description}
                </p>

                {/* CTA */}
                <div className="pt-2 flex flex-wrap gap-4">
                  <Link
                    href={`/contact?service=${service.id}`}
                    className="inline-flex items-center gap-2 px-8 py-4 bg-brand-600 hover:bg-brand-500 text-white text-sm font-bold uppercase tracking-widest rounded-xl transition-all shadow-lg hover:shadow-brand-500/30 group"
                  >
                    Start a Project <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </Link>
                  <Link
                    href="/services"
                    className="inline-flex items-center gap-2 px-8 py-4 bg-white/10 hover:bg-white/15 border border-white/15 hover:border-white/30 text-white text-sm font-bold uppercase tracking-widest rounded-xl transition-all"
                  >
                    All Services
                  </Link>
                </div>
              </div>
            </div>
            </div>
          </AnimateOnScroll>
        </div>
      </section>

      {/* ══════════════════════════════════════════
          CONTENT — Capabilities + Sidebar
      ══════════════════════════════════════════ */}
      <section id="content" className="relative py-20 sm:py-28 px-4 sm:px-6 bg-white dark:bg-black">
        <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-[1fr_300px] gap-12 lg:gap-16 items-start">

          {/* ── Main Content ── */}
          <div className="space-y-16">

            {/* Core Capabilities */}
            <AnimateOnScroll variant="fadeUp">
              <div>
                <div className="flex items-center gap-4 mb-10">
                  <div className="w-11 h-11 rounded-2xl bg-brand-500/10 border border-brand-500/20 flex items-center justify-center shrink-0">
                    <Zap className="w-5 h-5 text-brand-600 dark:text-brand-400" />
                  </div>
                  <div>
                    <p className="text-xs font-mono text-brand-500 dark:text-brand-400 uppercase tracking-widest font-bold mb-0.5">What we deliver</p>
                    <h2 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white font-heading tracking-tight">
                      Core Capabilities
                    </h2>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {service.features.map((feature, i) => (
                    <AnimateOnScroll key={feature} delay={0.05 * i} variant="fadeUp">
                      <div className="group/feat flex items-start gap-4 p-6 rounded-2xl border border-slate-100 dark:border-neutral-800/80 bg-slate-50/50 dark:bg-neutral-900/30 hover:bg-white dark:hover:bg-neutral-900 hover:border-brand-200 dark:hover:border-brand-800 hover:shadow-lg transition-all duration-300 h-full">
                        <div className="w-9 h-9 rounded-xl bg-brand-500/10 border border-brand-500/20 flex items-center justify-center shrink-0 mt-0.5 group-hover/feat:bg-brand-500/20 transition-colors">
                          <CheckCircle2 className="w-4 h-4 text-brand-600 dark:text-brand-400" />
                        </div>
                        <span className="text-sm text-slate-700 dark:text-slate-300 font-semibold leading-relaxed pt-1">{feature}</span>
                      </div>
                    </AnimateOnScroll>
                  ))}
                </div>
              </div>
            </AnimateOnScroll>

            {/* Why SAMStack Dark Banner */}
            <AnimateOnScroll variant="fadeUp">
              <div className="rounded-3xl bg-slate-900 dark:bg-neutral-950 border border-slate-800 dark:border-neutral-800 p-8 sm:p-12 relative overflow-hidden shadow-2xl">
                <div className="absolute top-0 right-0 w-72 h-72 bg-brand-500/15 rounded-full blur-[100px] pointer-events-none" />
                <div className="absolute bottom-0 left-0 w-56 h-56 bg-indigo-500/15 rounded-full blur-[80px] pointer-events-none" />
                <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:48px_48px]" />

                <div className="relative z-10">
                  <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-brand-500/10 border border-brand-500/20 text-brand-400 text-xs font-bold uppercase tracking-widest mb-6">
                    <Sparkles className="w-3.5 h-3.5" /> Our Commitment
                  </div>
                  <h3 className="text-2xl sm:text-3xl font-black text-white font-heading mb-5 tracking-tight leading-tight">
                    Why partner with SAMStack?
                  </h3>
                  <p className="text-slate-300 leading-relaxed mb-8 text-base sm:text-lg max-w-2xl font-medium">
                    Our approach to {service.title.toLowerCase()} goes beyond simply writing code. We architect systems
                    designed for the future — prioritizing scalability, zero-downtime, and elite performance from day one.
                    Every project is handled exclusively by senior specialists.
                  </p>
                  <div className="flex flex-wrap gap-4">
                    <Link
                      href={`/contact?service=${service.id}`}
                      className="inline-flex items-center gap-2 px-8 py-4 bg-brand-600 hover:bg-brand-500 text-white text-sm font-bold uppercase tracking-widest rounded-xl transition-all shadow-lg group"
                    >
                      Start a Project <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                    </Link>
                    <Link
                      href="/about"
                      className="inline-flex items-center gap-2 px-8 py-4 bg-white/10 hover:bg-white/15 border border-white/15 hover:border-white/30 text-white text-sm font-bold uppercase tracking-widest rounded-xl transition-all"
                    >
                      Meet the Team
                    </Link>
                  </div>
                </div>
              </div>
            </AnimateOnScroll>
          </div>

          {/* ── Sticky Sidebar ── */}
          <aside className="lg:sticky lg:top-28 space-y-5 lg:self-start">

            {/* Tech Stack Card */}
            <AnimateOnScroll variant="fadeRight">
              <div className="rounded-3xl bg-slate-50 dark:bg-neutral-900/50 border border-slate-200 dark:border-neutral-800 p-6 sm:p-7">
                <p className="text-[11px] font-mono font-bold text-slate-400 uppercase tracking-[0.2em] mb-5">Tech Stack</p>
                <div className="flex flex-wrap gap-2">
                  {service.techStack.map((tech) => (
                    <span
                      key={tech}
                      className="px-3 py-1.5 rounded-lg bg-white dark:bg-neutral-950 border border-slate-200 dark:border-neutral-800 text-xs font-mono font-bold text-slate-700 dark:text-slate-300 shadow-sm hover:border-brand-300 dark:hover:border-brand-700 transition-colors"
                    >
                      {tech}
                    </span>
                  ))}
                </div>
              </div>
            </AnimateOnScroll>

            {/* Consultation Card */}
            <AnimateOnScroll variant="fadeRight" delay={0.07}>
              <div className="rounded-3xl bg-slate-900 dark:bg-neutral-950 border border-slate-800 dark:border-neutral-800 p-6 sm:p-7 relative overflow-hidden group/cta">
                <div className="absolute inset-0 bg-gradient-to-br from-brand-500/10 to-transparent opacity-0 group-hover/cta:opacity-100 transition-opacity duration-500" />
                <div className="relative z-10">
                  <p className="text-[11px] font-mono font-bold text-brand-400 uppercase tracking-[0.2em] mb-2">Need Guidance?</p>
                  <p className="text-sm font-bold text-white leading-relaxed mb-6">
                    Book a free discovery call with our principal architects. No strings attached.
                  </p>
                  <Link
                    href="/contact"
                    className="w-full inline-flex items-center justify-center gap-2 px-5 py-3.5 bg-white hover:bg-slate-100 text-slate-900 text-xs font-bold uppercase tracking-widest rounded-xl transition-all shadow-md group"
                  >
                    Consult an Engineer
                    <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform text-brand-600" />
                  </Link>
                </div>
              </div>
            </AnimateOnScroll>

            {/* Trust Signals Card */}
            <AnimateOnScroll variant="fadeRight" delay={0.12}>
              <div className="rounded-3xl bg-slate-50 dark:bg-neutral-900/50 border border-slate-200 dark:border-neutral-800 p-6 sm:p-7 space-y-5">
                <p className="text-[11px] font-mono font-bold text-slate-400 uppercase tracking-[0.2em]">Why Trust Us</p>
                {[
                  { icon: Clock, label: "< 12h Response", desc: "Rapid architect review" },
                  { icon: Shield, label: "NDA Protected", desc: "Default confidentiality" },
                  { icon: Zap, label: "Elite Delivery", desc: "Senior teams only" },
                ].map((item) => (
                  <div key={item.label} className="flex items-start gap-4">
                    <div className="w-10 h-10 rounded-xl bg-brand-500/10 border border-brand-500/20 flex items-center justify-center shrink-0 mt-0.5">
                      <item.icon className="w-4 h-4 text-brand-600 dark:text-brand-400" />
                    </div>
                    <div>
                      <div className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider">{item.label}</div>
                      <div className="text-xs text-slate-500 dark:text-slate-400 font-medium mt-0.5">{item.desc}</div>
                    </div>
                  </div>
                ))}
              </div>
            </AnimateOnScroll>
          </aside>
        </div>
      </section>

      {/* ══════════════════════════════════════════
          RELATED SERVICES
      ══════════════════════════════════════════ */}
      <section className="relative py-20 sm:py-28 px-4 sm:px-6 bg-slate-50 dark:bg-neutral-950 border-t border-slate-100 dark:border-neutral-900 overflow-hidden">
        <div className="absolute top-0 left-1/4 w-[500px] h-[400px] bg-brand-500/5 dark:bg-brand-500/8 rounded-full blur-[140px] pointer-events-none" />
        <div className="absolute bottom-0 right-1/4 w-[400px] h-[300px] bg-indigo-500/5 dark:bg-indigo-500/8 rounded-full blur-[120px] pointer-events-none" />

        <div className="relative z-10 max-w-6xl mx-auto space-y-12">
          <AnimateOnScroll variant="fadeUp">
            <div className="text-center space-y-4">
              <div className="flex justify-center">
                <span className="inline-flex items-center gap-2 text-[11px] font-mono bg-brand-500/10 border border-brand-500/20 px-4 py-1.5 rounded-full text-brand-600 dark:text-brand-400 uppercase tracking-widest font-bold">
                  <Sparkles className="w-3.5 h-3.5" /> Explore More
                </span>
              </div>
              <h2 className="text-3xl sm:text-4xl font-black text-slate-900 dark:text-white font-heading tracking-tight">
                Other Services
              </h2>
              <p className="text-slate-500 dark:text-slate-400 text-base max-w-lg mx-auto font-medium">
                Discover our full range of engineering capabilities designed for scale.
              </p>
            </div>
          </AnimateOnScroll>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 lg:gap-6">
            {relatedServices.map((rsvc, i) => (
              <AnimateOnScroll key={rsvc.id} delay={0.06 * i} variant="fadeUp">
                <Link
                  href={`/services/${rsvc.slug}`}
                  className="group/card flex flex-col h-full rounded-3xl border border-slate-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 overflow-hidden hover:border-brand-300 dark:hover:border-brand-700 hover:shadow-xl transition-all duration-400"
                >
                  {/* Image */}
                  <div className="relative h-44 w-full overflow-hidden bg-slate-100 dark:bg-neutral-800 shrink-0">
                    <Image
                      src={rsvc.image}
                      alt={rsvc.title}
                      fill
                      sizes="(max-width: 768px) 100vw, 33vw"
                      className="object-cover transition-transform duration-700 group-hover/card:scale-105"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
                    <div className="absolute bottom-4 left-4">
                      <div className="w-10 h-10 rounded-xl bg-white/15 backdrop-blur-md flex items-center justify-center border border-white/25">
                        <rsvc.icon className="w-5 h-5 text-white" />
                      </div>
                    </div>
                    <div className="absolute top-3 right-3">
                      <span className="text-[9px] font-mono font-bold bg-black/40 backdrop-blur-md border border-white/15 px-2.5 py-1 rounded-full text-white/80 uppercase tracking-widest">
                        {rsvc.subtitle}
                      </span>
                    </div>
                  </div>

                  {/* Content */}
                  <div className="flex flex-col flex-1 p-5 sm:p-6 space-y-3">
                    <h3 className="text-base font-black text-slate-900 dark:text-white font-heading group-hover/card:text-brand-600 dark:group-hover/card:text-brand-400 transition-colors leading-snug">
                      {rsvc.title}
                    </h3>
                    <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed line-clamp-2 flex-1 font-medium">
                      {rsvc.description}
                    </p>
                    <div className="flex items-center gap-1.5 text-xs font-bold text-brand-600 dark:text-brand-400 pt-2 group-hover/card:gap-2.5 transition-all">
                      Learn More <ArrowRight className="w-3.5 h-3.5" />
                    </div>
                  </div>
                </Link>
              </AnimateOnScroll>
            ))}
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════
          FINAL CTA
      ══════════════════════════════════════════ */}
      <section className="relative py-28 sm:py-36 px-4 sm:px-6 overflow-hidden bg-slate-900 dark:bg-black border-t border-slate-800">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_60%_at_50%_-10%,rgba(14,165,233,0.20),transparent)]" />
        <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:64px_64px]" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[400px] bg-brand-500/10 rounded-full blur-[160px] pointer-events-none" />

        <div className="relative z-10 max-w-3xl mx-auto text-center space-y-8">
          <AnimateOnScroll variant="fadeUp">
            <div className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-white/8 border border-white/15 text-white/80 text-[11px] font-bold uppercase tracking-[0.2em]">
              <Sparkles className="w-3.5 h-3.5 text-brand-400" />
              Ready to Build?
            </div>
          </AnimateOnScroll>

          <AnimateOnScroll variant="fadeUp" delay={0.08}>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-white font-heading leading-tight tracking-tight">
              Let&apos;s Engineer{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-400 to-indigo-300">
                Your Next System
              </span>
            </h2>
          </AnimateOnScroll>

          <AnimateOnScroll variant="fadeUp" delay={0.12}>
            <p className="text-slate-400 text-base sm:text-lg max-w-xl mx-auto leading-relaxed font-medium">
              Send us your project brief and one of our lead engineers will reach out
              with an architectural consultation within 12 hours.
            </p>
          </AnimateOnScroll>

          <AnimateOnScroll variant="fadeUp" delay={0.16}>
            <div className="flex flex-wrap gap-4 justify-center">
              <Link
                href="/contact"
                className="inline-flex items-center gap-2 px-8 py-4 rounded-xl bg-brand-600 hover:bg-brand-500 text-white font-bold text-sm uppercase tracking-widest shadow-2xl shadow-brand-500/20 transition-all group"
              >
                Contact Our Team
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </Link>
              <Link
                href="/services"
                className="inline-flex items-center gap-2 px-8 py-4 rounded-xl bg-white/8 hover:bg-white/15 border border-white/15 hover:border-white/30 text-white font-bold text-sm uppercase tracking-widest transition-all"
              >
                All Services
              </Link>
            </div>
          </AnimateOnScroll>

          <AnimateOnScroll variant="fadeUp" delay={0.2}>
            <div className="flex flex-wrap items-center justify-center gap-6 pt-6 border-t border-white/10">
              {["14+ Deployments", "9.9 NPS Score", "NDA Protected", "Free Consultation"].map((badge) => (
                <span key={badge} className="flex items-center gap-2 text-xs text-slate-400 font-medium">
                  <CheckCircle2 className="w-4 h-4 text-brand-500 shrink-0" />
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
