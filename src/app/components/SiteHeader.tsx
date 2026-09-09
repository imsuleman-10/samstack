"use client";
// force turbopack chunk invalidation to clear stale browser caches

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Menu, X, ChevronDown, Sun, Moon, Zap, Globe, Smartphone, Shield,
  Code, BarChart3, Bot, Layers, Briefcase, BookOpen, Users,
  GraduationCap, FileCheck, UserCheck, ArrowRight, Cpu
} from "lucide-react";
import { useTheme } from "./ThemeProvider";
import { AnimatePresence, motion } from "framer-motion";

// ── Nav Structure ──────────────────────────────────────────────
const NAV_ITEMS = [
  {
    label: "What We Do",
    mega: {
      columns: [
        {
          heading: "Our Services",
          links: [
            { label: "Custom Software", href: "/services/custom-enterprise-software#content", icon: Code, desc: "Enterprise platforms & systems" },
            { label: "Web & Serverless Apps", href: "/services/web-serverless-apps#content", icon: Globe, desc: "High-performance web solutions" },
            { label: "Mobile Apps", href: "/services/mobile-app-development#content", icon: Smartphone, desc: "iOS & Android cross-platform" },
            { label: "Agentic AI", href: "/services/agentic-ai-integrations#content", icon: Bot, desc: "AI agents & LLM integrations" },
          ],
        },
        {
          heading: "More Capabilities",
          links: [
            { label: "DevOps & Cloud", href: "/services/devops-cloud-architectures#content", icon: Cpu, desc: "CI/CD, infra & monitoring" },
            { label: "UI/UX Design", href: "/services/ui-ux-design-systems#content", icon: Layers, desc: "Design systems & prototypes" },
            { label: "Data Analytics", href: "/services/data-analytics-bi#content", icon: BarChart3, desc: "Dashboards & data pipelines" },
            { label: "All Services", href: "/services#services-grid", icon: Shield, desc: "Browse all our capabilities" },
          ],
        },
      ],
      cta: { label: "View All Services", href: "/services#services-grid" },
    },
  },
  {
    label: "Our Work",
    mega: {
      columns: [
        {
          heading: "Portfolio",
          links: [
            { label: "Case Studies", href: "/portfolio", icon: Briefcase, desc: "Real-world project outcomes" },
            { label: "MERN Stack Projects", href: "/portfolio", icon: Code, desc: "Full-stack web applications" },
            { label: "AI Solutions", href: "/portfolio", icon: Bot, desc: "Intelligent automation projects" },
          ],
        },
        {
          heading: "Insights",
          links: [
            { label: "Blog & Articles", href: "/blog#articles", icon: BookOpen, desc: "Technical deep-dives & guides" },
            { label: "Tech Stack", href: "/services#services-grid", icon: Layers, desc: "Technologies we master" },
          ],
        },
      ],
      cta: { label: "Explore Portfolio", href: "/portfolio" },
    },
  },
  {
    label: "Who We Are",
    mega: {
      columns: [
        {
          heading: "Company",
          links: [
            { label: "About SAMStack", href: "/about", icon: Users, desc: "Our story & mission" },
            { label: "Our Team", href: "/team", icon: Users, desc: "Meet the engineers" },
            { label: "Our Values", href: "/about#values", icon: Shield, desc: "Principles we build by" },
          ],
        },
        {
          heading: "Join Us",
          links: [
            { label: "Internship Program", href: "/internship#tracks", icon: GraduationCap, desc: "Learn by building real products" },
            { label: "Apply Now", href: "/internship", icon: UserCheck, desc: "Start your engineering journey" },
            { label: "Verify Certificate", href: "/verify", icon: FileCheck, desc: "Authenticate your credential" },
          ],
        },
      ],
      cta: { label: "Meet the Team", href: "/team" },
    },
  },
  {
    label: "Blog",
    mega: {
      columns: [
        {
          heading: "Insights & News",
          links: [
            { label: "Engineering Blog", href: "/blog#articles", icon: Code, desc: "Technical deep dives & tutorials" },
            { label: "Company Updates", href: "/blog#articles", icon: Globe, desc: "News from SAMStack" },
            { label: "AI Research", href: "/blog#articles", icon: Bot, desc: "Our latest AI findings" },
          ],
        },
        {
          heading: "Resources",
          links: [
            { label: "Case Studies", href: "/portfolio", icon: Briefcase, desc: "Real-world success stories" },
            { label: "Tech Stack", href: "/services#services-grid", icon: Layers, desc: "Tools and technologies we use" },
          ],
        },
      ],
      cta: { label: "Read All Articles", href: "/blog#articles" },
    },
  },
];

// ── Component ──────────────────────────────────────────────────
export default function SiteHeader() {
  const [openMenu, setOpenMenu] = useState<string | null>(null);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [mobileSection, setMobileSection] = useState<string | null>(null);
  const [mounted, setMounted] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const pathname = usePathname();
  const { theme, toggleTheme } = useTheme();

  useEffect(() => {
    setMounted(true);
    const onScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Close on route change
  useEffect(() => {
    setMobileOpen(false);
    setOpenMenu(null);
  }, [pathname]);

  const closeTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const handleMouseEnter = (label: string) => {
    if (closeTimeoutRef.current) {
      clearTimeout(closeTimeoutRef.current);
      closeTimeoutRef.current = null;
    }
    setOpenMenu(label);
  };

  const handleMouseLeave = () => {
    if (closeTimeoutRef.current) {
      clearTimeout(closeTimeoutRef.current);
    }
    closeTimeoutRef.current = setTimeout(() => {
      setOpenMenu(null);
    }, 200);
  };

  const cancelClose = () => {
    if (closeTimeoutRef.current) {
      clearTimeout(closeTimeoutRef.current);
      closeTimeoutRef.current = null;
    }
  };

  const toggleDesktopMenu = (label: string) => {
    if (closeTimeoutRef.current) {
      clearTimeout(closeTimeoutRef.current);
      closeTimeoutRef.current = null;
    }
    setOpenMenu((prev) => (prev === label ? null : label));
  };

  return (
    <>
      <header
        className="fixed top-0 z-50 w-full transition-all duration-300 bg-white/95 dark:bg-neutral-950/95 backdrop-blur-xl border-b border-slate-200/70 dark:border-neutral-800/70 shadow-sm"
      >
        <div className="max-w-screen-xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center gap-6">

          {/* ── Logo ── */}
          <Link href="/" className="flex items-center gap-3 group shrink-0 mr-2" onClick={() => setMobileOpen(false)}>
            <div className="relative w-10 h-10 rounded-xl overflow-hidden bg-white dark:bg-black flex items-center justify-center shadow-lg group-hover:shadow-xl group-hover:shadow-brand-500/30 transition-all duration-300 border border-slate-200 dark:border-neutral-800">
              <img
                src="/logo.png"
                alt="SAMStack Tech"
                className="w-8 h-8 object-contain group-hover:scale-105 transition-transform duration-300"
              />
            </div>
            <div>
              <span className="text-lg font-extrabold text-slate-900 dark:text-white font-heading tracking-tight group-hover:text-brand-600 dark:group-hover:text-brand-400 transition-colors duration-200">
                SAMStack <span className="text-brand-600 dark:text-brand-400">Tech</span>
              </span>
              <span className="block text-[10px] uppercase tracking-[0.25em] text-slate-500 dark:text-slate-400 font-medium leading-none">
                Software Systems
              </span>
            </div>
          </Link>

          {/* ── Desktop Nav ── */}
          <nav className="hidden lg:flex items-center gap-0.5 flex-1">
            {NAV_ITEMS.map((item) => {
              const isOpen = openMenu === item.label;
              return (
                <div
                  key={item.label}
                  onMouseEnter={() => handleMouseEnter(item.label)}
                  onMouseLeave={handleMouseLeave}
                  className="relative"
                >
                  <button
                    onClick={() => toggleDesktopMenu(item.label)}
                    className={`flex items-center gap-1 px-3.5 py-2 text-[13px] font-semibold rounded-md transition-colors duration-150 cursor-pointer ${
                      isOpen
                        ? "text-brand-600 dark:text-brand-400 bg-brand-50/70 dark:bg-brand-500/10"
                        : "text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100/70 dark:hover:bg-white/5"
                    }`}
                  >
                    {item.label}
                    <ChevronDown
                      className={`w-3.5 h-3.5 transition-transform duration-200 ${isOpen ? "rotate-180 text-brand-500" : ""}`}
                    />
                  </button>
                </div>
              );
            })}
          </nav>

          {/* ── Right Section ── */}
          <div className="flex items-center gap-2 ml-auto shrink-0">
            {/* Theme toggle */}
            {mounted ? (
              <button
                onClick={toggleTheme}
                aria-label="Toggle theme"
                className="w-8 h-8 flex items-center justify-center rounded-lg text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-white/10 transition-colors"
              >
                {theme === "dark" ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4" />}
              </button>
            ) : (
              <div className="w-8 h-8 rounded-lg bg-slate-100 dark:bg-white/5 animate-pulse" />
            )}

            {/* Login CTA (outlined) */}
            <Link
              href="/login"
              className="hidden sm:inline-flex items-center gap-1.5 px-4 py-2 text-[12px] font-bold rounded-lg border border-slate-300 dark:border-neutral-700 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-neutral-800 transition-all duration-200"
            >
              <UserCheck className="w-3.5 h-3.5" />
              Login
            </Link>

            {/* Internship CTA (outlined) */}
            <Link
              href="/internship"
              className="hidden sm:inline-flex items-center gap-1.5 px-4 py-2 text-[12px] font-bold rounded-lg border border-brand-500 text-brand-600 dark:text-brand-400 dark:border-brand-500/60 hover:bg-brand-50 dark:hover:bg-brand-500/10 transition-all duration-200"
            >
              <GraduationCap className="w-3.5 h-3.5" />
              Internship
            </Link>

            {/* Contact CTA (filled) */}
            <Link
              href="/contact"
              className="hidden sm:inline-flex items-center gap-1.5 px-4 py-2 text-[12px] font-bold rounded-lg bg-brand-600 hover:bg-brand-500 text-white transition-all duration-200 shadow-md hover:shadow-brand-500/30 hover:shadow-lg"
            >
              <Zap className="w-3.5 h-3.5" />
              Let&apos;s Talk
            </Link>

            {/* Mobile hamburger */}
            <button
              onClick={() => setMobileOpen((o) => !o)}
              className="lg:hidden w-9 h-9 flex items-center justify-center rounded-lg text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-white/10 transition-colors"
              aria-label="Toggle menu"
            >
              {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* ── Desktop Full-Width Mega Dropdown ── */}
        <AnimatePresence>
          {openMenu && (
            <motion.div
              onMouseEnter={cancelClose}
              onMouseLeave={handleMouseLeave}
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2, ease: "easeOut" }}
              className="hidden lg:block absolute top-[64px] left-0 w-full h-[calc(100vh-64px)] bg-white dark:bg-neutral-950 border-b border-slate-200/70 dark:border-neutral-800/70 shadow-xl z-40 overflow-hidden"
            >
              <div className="flex flex-col h-full justify-between">
                <div>
              {NAV_ITEMS.map((item) => {
                if (item.label !== openMenu) return null;
                return (
                  <div key={item.label} className="max-w-screen-xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                    <div className="flex flex-row justify-between items-start gap-12">
                      <div className="flex-1 grid grid-cols-2 lg:grid-cols-3 gap-8">
                        {item.mega.columns.map((col) => (
                          <div key={col.heading}>
                            <p className="mb-4 text-[11px] font-black uppercase tracking-[0.15em] text-slate-400 dark:text-slate-500">
                              {col.heading}
                            </p>
                            <div className="space-y-1">
                              {col.links.map((link) => {
                                const Icon = link.icon;
                                const isActive = pathname === link.href.split("#")[0];
                                return (
                                  <Link
                                    key={link.href + link.label}
                                    href={link.href}
                                    onClick={() => setOpenMenu(null)}
                                    className={`flex items-start gap-3 p-3 -mx-3 rounded-xl transition-all group/link ${
                                      isActive
                                        ? "bg-brand-50 dark:bg-brand-500/10 text-brand-600 dark:text-brand-400"
                                        : "hover:bg-slate-50 dark:hover:bg-white/5 text-slate-700 dark:text-slate-300"
                                    }`}
                                  >
                                    <div className={`shrink-0 w-10 h-10 rounded-xl flex items-center justify-center transition-colors ${
                                      isActive
                                        ? "bg-brand-100 dark:bg-brand-500/20"
                                        : "bg-slate-100 dark:bg-white/5 group-hover/link:bg-white dark:group-hover/link:bg-neutral-800 shadow-sm"
                                    }`}>
                                      <Icon className={`w-5 h-5 ${isActive ? "text-brand-500" : "text-slate-500 dark:text-slate-400 group-hover/link:text-brand-500"}`} />
                                    </div>
                                    <div className="min-w-0 pt-0.5">
                                      <p className="text-[14px] font-bold leading-tight truncate">{link.label}</p>
                                      {"desc" in link && (
                                        <p className="text-[12px] text-slate-500 dark:text-slate-400 leading-tight mt-1 truncate">{link.desc}</p>
                                      )}
                                    </div>
                                  </Link>
                                );
                              })}
                            </div>
                          </div>
                        ))}
                      </div>

                      {/* Right Side CTA Area */}
                      <div className="w-[300px] shrink-0 p-6 rounded-2xl bg-slate-50 dark:bg-neutral-900 border border-slate-100 dark:border-neutral-800 flex flex-col justify-center items-start">
                        <div className="w-12 h-12 rounded-xl bg-brand-500/10 flex items-center justify-center mb-4">
                          <Zap className="w-6 h-6 text-brand-500" />
                        </div>
                        <h4 className="text-lg font-black text-slate-900 dark:text-white font-heading mb-2">Ready to scale?</h4>
                        <p className="text-sm text-slate-500 dark:text-slate-400 mb-6 leading-relaxed">
                          Partner with SAMStack to build enterprise-grade solutions.
                        </p>
                        <Link
                          href={item.mega.cta.href}
                          onClick={() => setOpenMenu(null)}
                          className="w-full inline-flex items-center justify-center gap-2 px-5 py-3 text-[13px] font-bold text-white bg-slate-900 dark:bg-white dark:text-slate-900 hover:bg-brand-600 dark:hover:bg-brand-500 dark:hover:text-white rounded-xl transition-all duration-200"
                        >
                          {item.mega.cta.label}
                          <ArrowRight className="w-4 h-4" />
                        </Link>
                      </div>
                    </div>
                  </div>
                );
              })}
              </div>

              {/* Professional Bottom Bar */}
              <div className="bg-slate-50 dark:bg-neutral-900 border-t border-slate-200/70 dark:border-neutral-800/70 mt-auto">
                <div className="max-w-screen-xl mx-auto px-4 sm:px-6 lg:px-8 py-6 flex flex-row items-center justify-between">
                  <div className="flex items-center gap-8">
                    <div className="flex items-center gap-2.5 text-slate-600 dark:text-slate-300 text-[13px] font-semibold">
                      <div className="w-8 h-8 rounded-full bg-brand-500/10 flex items-center justify-center">
                        <Globe className="w-4 h-4 text-brand-600 dark:text-brand-400" />
                      </div>
                      Lahore, Pakistan
                    </div>
                    <div className="flex items-center gap-2.5 text-slate-600 dark:text-slate-300 text-[13px] font-semibold">
                      <div className="w-8 h-8 rounded-full bg-brand-500/10 flex items-center justify-center">
                        <UserCheck className="w-4 h-4 text-brand-600 dark:text-brand-400" />
                      </div>
                      samstacktechs@gmail.com
                    </div>
                    <div className="flex items-center gap-2.5 text-slate-600 dark:text-slate-300 text-[13px] font-semibold">
                      <div className="w-8 h-8 rounded-full bg-brand-500/10 flex items-center justify-center">
                        <Shield className="w-4 h-4 text-brand-600 dark:text-brand-400" />
                      </div>
                      Strict NDA Protected
                    </div>
                  </div>
                  <div className="flex flex-col items-end">
                    <span className="text-[11px] font-black uppercase tracking-[0.2em] text-slate-400 dark:text-slate-500">
                      Enterprise Software Systems
                    </span>
                  </div>
                </div>
              </div>
            </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* ── Mobile Drawer ── */}
        <AnimatePresence>
          {mobileOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.22 }}
              className="lg:hidden border-t border-slate-200 dark:border-neutral-800 bg-white dark:bg-neutral-950 overflow-hidden"
            >
              <div className="px-4 py-5 space-y-1 max-h-[80vh] overflow-y-auto">
                {NAV_ITEMS.map((item) => {
                  const isExpanded = mobileSection === item.label;
                  return (
                    <div key={item.label} className="rounded-xl overflow-hidden">
                      <button
                        onClick={() => setMobileSection(isExpanded ? null : item.label)}
                        className="w-full flex items-center justify-between px-4 py-3 text-sm font-semibold text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-white/5 rounded-xl transition-colors"
                      >
                        {item.label}
                        <ChevronDown className={`w-4 h-4 text-slate-400 transition-transform ${isExpanded ? "rotate-180" : ""}`} />
                      </button>

                      <AnimatePresence>
                        {isExpanded && (
                          <motion.div
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: "auto" }}
                            exit={{ opacity: 0, height: 0 }}
                            transition={{ duration: 0.18 }}
                            className="overflow-hidden"
                          >
                            <div className="pl-4 pb-2 space-y-0.5">
                              {item.mega.columns.flatMap((col) =>
                                col.links.map((link) => {
                                  const Icon = link.icon;
                                  return (
                                    <Link
                                      key={link.href + link.label}
                                      href={link.href}
                                      onClick={() => setMobileOpen(false)}
                                      className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-colors ${
                                        pathname === link.href.split("#")[0]
                                          ? "text-brand-600 dark:text-brand-400 bg-brand-50 dark:bg-brand-500/10"
                                          : "text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-white/5"
                                      }`}
                                    >
                                      <Icon className="w-4 h-4 text-brand-500 shrink-0" />
                                      {link.label}
                                    </Link>
                                  );
                                })
                              )}
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  );
                })}

                {/* Mobile CTAs */}
                <div className="pt-3 mt-3 border-t border-slate-100 dark:border-neutral-800 grid grid-cols-2 gap-2">
                  <Link
                    href="/login"
                    onClick={() => setMobileOpen(false)}
                    className="flex items-center justify-center gap-2 px-4 py-3 text-xs font-bold rounded-xl border border-slate-300 dark:border-neutral-700 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-neutral-800 transition-colors"
                  >
                    <UserCheck className="w-3.5 h-3.5" />
                    Login
                  </Link>
                  <Link
                    href="/internship"
                    onClick={() => setMobileOpen(false)}
                    className="flex items-center justify-center gap-2 px-4 py-3 text-xs font-bold rounded-xl border border-brand-500 text-brand-600 dark:text-brand-400 hover:bg-brand-50 dark:hover:bg-brand-500/10 transition-colors"
                  >
                    <GraduationCap className="w-3.5 h-3.5" />
                    Internship
                  </Link>
                  <Link
                    href="/contact"
                    onClick={() => setMobileOpen(false)}
                    className="flex items-center justify-center gap-2 px-4 py-3 text-xs font-bold rounded-xl bg-brand-600 text-white hover:bg-brand-500 transition-colors shadow-md"
                  >
                    <Zap className="w-3.5 h-3.5" />
                    Let&apos;s Talk
                  </Link>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </header>

      {/* Overlay to close dropdown when clicking outside */}
      {openMenu && (
        <div
          className="fixed inset-0 z-30"
          onClick={() => setOpenMenu(null)}
        />
      )}
    </>
  );
}
