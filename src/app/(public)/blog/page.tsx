"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  ArrowRight,
  Clock,
  Calendar,
  Sparkles,
  ArrowUpRight,
  Rss,
  Tag,
  Search,
  BookOpen
} from "lucide-react";
import Image from "next/image";
import AnimateOnScroll from "@/app/components/AnimateOnScroll";
import { blogPosts, getFeaturedPost } from "@/lib/data/blog-posts";

const tags = ["All Logs", "Next.js", "DevOps", "Serverless", "AI & Agents", "Architecture", "TypeScript"];

const getAuthorImage = (name: string) => {
  if (name.includes("Suleman")) return "/images/image.png";
  if (name.includes("Abdullah")) return "/syed-abdullah-software-engineer-samstack-tech.png";
  if (name.includes("Saqib")) return "/saqib-javed-software-engineer-samstack-tech.jpg";
  return null;
};

export default function BlogPage() {
  const [activeTag, setActiveTag] = useState("All Logs");
  const [searchQuery, setSearchQuery] = useState("");

  const featuredArticle = getFeaturedPost();

  let filteredArticles = blogPosts;

  // Filter by tag (exclude featured if we are on "All Logs", or include it if it matches the tag)
  if (activeTag === "All Logs") {
    filteredArticles = filteredArticles.filter((p) => p.slug !== featuredArticle.slug);
  } else {
    filteredArticles = filteredArticles.filter((p) => p.tags.includes(activeTag) && p.slug !== featuredArticle.slug);
  }

  // Filter by search query
  if (searchQuery.trim() !== "") {
    const q = searchQuery.toLowerCase();
    filteredArticles = filteredArticles.filter((p) => 
      p.title.toLowerCase().includes(q) || 
      p.excerpt.toLowerCase().includes(q) ||
      p.tags.some(t => t.toLowerCase().includes(q))
    );
  }

  return (
    <div className="flex-1 w-full bg-slate-50 dark:bg-[#050505] text-slate-900 dark:text-white selection:bg-brand-500/30">

      {/* ══════════════════════════════════════════
          HERO SECTION — Premium Industrial
      ══════════════════════════════════════════ */}
      <section className="relative overflow-hidden w-full pt-32 pb-16 lg:pt-40 lg:pb-24 px-4 sm:px-6 lg:px-8 border-b border-slate-200 dark:border-neutral-900">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-brand-500/10 dark:bg-brand-500/10 rounded-full blur-[120px] pointer-events-none mix-blend-screen" />
        <div className="absolute inset-0 bg-[url('/noise.png')] opacity-[0.03] dark:opacity-[0.05] pointer-events-none mix-blend-overlay" />
        
        <div className="relative z-10 max-w-6xl mx-auto w-full">
          <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-10">
            <div className="space-y-6 max-w-3xl">
              <AnimateOnScroll variant="fadeUp">
                <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-brand-50 dark:bg-brand-950/40 border border-brand-100 dark:border-brand-800/50 text-brand-700 dark:text-brand-400 text-[10px] font-bold uppercase tracking-[0.2em] shadow-sm">
                  <Rss className="w-3 h-3" /> Technical Insights
                </div>
              </AnimateOnScroll>

              <AnimateOnScroll variant="fadeUp" delay={0.1}>
                <h1 className="text-4xl sm:text-5xl lg:text-7xl font-black text-slate-900 dark:text-white font-heading leading-[1.05] tracking-tight">
                  Engineering <br/>
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-600 via-indigo-500 to-cyan-500 dark:from-brand-400 dark:via-indigo-400 dark:to-cyan-400">
                    &amp; Architecture Logs.
                  </span>
                </h1>
              </AnimateOnScroll>

              <AnimateOnScroll variant="fadeUp" delay={0.2}>
                <p className="text-slate-600 dark:text-slate-400 text-base sm:text-lg lg:text-xl font-medium leading-relaxed max-w-2xl">
                  Deep technical dives into full-stack architecture, high-throughput systems, scalable cloud infrastructure, and modern frontend paradigms.
                </p>
              </AnimateOnScroll>
            </div>

            <AnimateOnScroll variant="fadeLeft" delay={0.3} className="w-full lg:w-72 shrink-0">
              <div className="relative group">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 group-focus-within:text-brand-500 transition-colors" />
                <input
                  type="text"
                  placeholder="Search articles..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full bg-white dark:bg-neutral-900 border border-slate-200 dark:border-neutral-800 rounded-2xl py-3.5 pl-11 pr-4 text-sm font-medium text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-brand-500/50 focus:border-brand-500 transition-all shadow-sm"
                />
              </div>
            </AnimateOnScroll>
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════
          FEATURED ARTICLE — Cinematic Card
      ══════════════════════════════════════════ */}
      {activeTag === "All Logs" && featuredArticle && searchQuery === "" && (
        <section className="relative px-4 sm:px-6 lg:px-8 py-10 sm:py-16 -mt-8 z-20">
          <div className="max-w-6xl mx-auto">
            <AnimateOnScroll variant="fadeUp">
              <Link
                href={`/blog/${featuredArticle.slug}`}
                className="group relative flex flex-col lg:flex-row rounded-[2rem] bg-white dark:bg-neutral-900/80 backdrop-blur-xl border border-slate-200 dark:border-neutral-800 shadow-2xl shadow-slate-200/50 dark:shadow-black/80 overflow-hidden transition-all duration-500 hover:-translate-y-1 hover:shadow-brand-500/10 hover:border-brand-500/30"
              >
                {/* Image Section */}
                <div className="relative w-full lg:w-1/2 h-[300px] lg:h-[450px] overflow-hidden bg-slate-100 dark:bg-neutral-950">
                  <Image
                    src={featuredArticle.image}
                    alt={featuredArticle.title}
                    fill sizes="(max-width: 768px) 100vw, 50vw"
                    className="object-cover transition-transform duration-[2000ms] group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent lg:bg-gradient-to-r lg:from-transparent lg:via-black/20 lg:to-black/80" />
                  
                  {/* Badge */}
                  <div className="absolute top-6 left-6">
                    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-black/60 backdrop-blur-md border border-white/20 text-white text-[10px] font-bold uppercase tracking-widest shadow-lg">
                      <Sparkles className="w-3 h-3 text-brand-400" /> Featured Post
                    </span>
                  </div>
                </div>

                {/* Content Section */}
                <div className="relative w-full lg:w-1/2 p-8 sm:p-10 lg:p-12 xl:p-14 flex flex-col justify-center">
                  <div className="flex flex-wrap items-center gap-4 text-xs font-mono font-bold text-slate-500 dark:text-slate-400 mb-6">
                    <span className="text-brand-600 dark:text-brand-400 bg-brand-50 dark:bg-brand-500/10 px-2 py-0.5 rounded-md">{featuredArticle.category}</span>
                    <span className="flex items-center gap-1.5"><Calendar className="w-3.5 h-3.5" /> {featuredArticle.date}</span>
                    <span className="flex items-center gap-1.5"><Clock className="w-3.5 h-3.5" /> {featuredArticle.readTime}</span>
                  </div>

                  <h2 className="text-3xl sm:text-4xl font-black font-heading text-slate-900 dark:text-white leading-[1.15] mb-5 group-hover:text-brand-600 dark:group-hover:text-brand-400 transition-colors line-clamp-3">
                    {featuredArticle.title}
                  </h2>

                  <p className="text-slate-600 dark:text-slate-400 font-medium leading-relaxed text-base mb-8 line-clamp-3">
                    {featuredArticle.excerpt}
                  </p>

                  <div className="flex items-center justify-between pt-6 mt-auto border-t border-slate-100 dark:border-neutral-800">
                    <div className="flex items-center gap-3">
                      <div className="relative w-8 h-8 rounded-full bg-gradient-to-br from-brand-500 to-indigo-600 flex items-center justify-center text-[10px] font-black text-white shadow-md overflow-hidden">
                        {getAuthorImage(featuredArticle.author) ? (
                          <Image src={getAuthorImage(featuredArticle.author)!} alt={featuredArticle.author} fill sizes="(max-width: 768px) 100vw, 50vw" className="object-cover" />
                        ) : (
                          featuredArticle.author.split(' ').map(n=>n[0]).join('')
                        )}
                      </div>
                      <span className="text-xs font-bold text-slate-900 dark:text-white">{featuredArticle.author}</span>
                    </div>
                    <span className="inline-flex items-center gap-2 text-[11px] font-bold uppercase tracking-widest text-brand-600 dark:text-brand-400 bg-brand-50 dark:bg-brand-500/10 px-4 py-2 rounded-xl group-hover:bg-brand-600 group-hover:text-white transition-all">
                      Read Article <ArrowUpRight className="w-3.5 h-3.5" />
                    </span>
                  </div>
                </div>
              </Link>
            </AnimateOnScroll>
          </div>
        </section>
      )}

      {/* ══════════════════════════════════════════
          MAIN CONTENT — Filters & Grid
      ══════════════════════════════════════════ */}
      <section id="articles" className="relative px-4 sm:px-6 lg:px-8 pb-24 sm:pb-32">
        <div className="max-w-6xl mx-auto">
          
          {/* Filters Bar */}
          <AnimateOnScroll variant="fadeUp" delay={0.1}>
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-12 pb-6 border-b border-slate-200 dark:border-neutral-800">
              <div className="flex items-center gap-3 overflow-x-auto pb-2 md:pb-0 hide-scrollbar mask-edges">
                <Tag className="w-4 h-4 text-slate-400 shrink-0" />
                <div className="flex gap-2">
                  {tags.map((tag) => (
                    <button
                      key={tag}
                      onClick={() => setActiveTag(tag)}
                      className={`whitespace-nowrap px-4 py-2 rounded-xl text-[11px] font-bold uppercase tracking-wider transition-all duration-300 border ${
                        activeTag === tag
                          ? "text-white bg-slate-900 dark:bg-white dark:text-slate-900 border-slate-900 dark:border-white shadow-md"
                          : "text-slate-500 dark:text-slate-400 bg-transparent border-slate-200 dark:border-neutral-800 hover:border-brand-400 dark:hover:border-neutral-600 hover:bg-slate-50 dark:hover:bg-neutral-900"
                      }`}
                    >
                      {tag}
                    </button>
                  ))}
                </div>
              </div>
              <div className="text-[11px] font-mono font-bold text-slate-400 uppercase tracking-widest shrink-0">
                Showing {filteredArticles.length} Logs
              </div>
            </div>
          </AnimateOnScroll>

          {/* Grid */}
          {filteredArticles.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
              {filteredArticles.map((article, i) => (
                <AnimateOnScroll key={article.slug} delay={0.05 * (i % 6)} variant="fadeUp" className="h-full">
                  <Link
                    href={`/blog/${article.slug}`}
                    className="group flex flex-col h-full rounded-[24px] bg-white dark:bg-neutral-900/50 border border-slate-200 dark:border-neutral-800 overflow-hidden hover:border-brand-300 dark:hover:border-brand-700 hover:shadow-2xl hover:shadow-brand-500/10 transition-all duration-500 hover:-translate-y-1"
                  >
                    {/* Card Image */}
                    <div className="relative w-full h-52 sm:h-60 overflow-hidden bg-slate-100 dark:bg-neutral-950 shrink-0">
                      <Image
                        src={article.image}
                        alt={article.title}
                        fill sizes="(max-width: 768px) 100vw, 50vw"
                        className="object-cover transition-transform duration-700 group-hover:scale-105"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-80" />
                      <div className="absolute bottom-4 left-4 flex flex-wrap gap-2">
                        {article.tags.slice(0,2).map((t) => (
                          <span key={t} className="px-2.5 py-1 bg-black/40 backdrop-blur-md border border-white/20 rounded-md text-[9px] font-mono font-bold text-white uppercase tracking-widest shadow-sm">
                            {t}
                          </span>
                        ))}
                      </div>
                    </div>

                    {/* Card Content */}
                    <div className="flex flex-col flex-1 p-6 sm:p-8">
                      <div className="flex items-center gap-3 text-[10px] font-mono font-bold text-slate-400 mb-4">
                        <span className="text-brand-600 dark:text-brand-400 uppercase tracking-wider">{article.category}</span>
                        <span>&bull;</span>
                        <span className="flex items-center gap-1"><Clock className="w-3 h-3" /> {article.readTime}</span>
                      </div>
                      
                      <h3 className="text-xl font-black font-heading text-slate-900 dark:text-white leading-snug mb-3 group-hover:text-brand-600 dark:group-hover:text-brand-400 transition-colors line-clamp-2">
                        {article.title}
                      </h3>
                      
                      <p className="text-sm text-slate-600 dark:text-slate-400 font-medium leading-relaxed line-clamp-3 mb-6 flex-1">
                        {article.excerpt}
                      </p>

                      <div className="flex items-center justify-between pt-5 mt-auto border-t border-slate-100 dark:border-neutral-800/80">
                        <span className="text-[11px] font-bold text-slate-500 dark:text-slate-400">
                          {article.date}
                        </span>
                        <span className="inline-flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-widest text-slate-900 dark:text-white group-hover:text-brand-600 dark:group-hover:text-brand-400 transition-colors bg-slate-100 dark:bg-neutral-800 group-hover:bg-brand-50 dark:group-hover:bg-brand-500/10 px-3 py-1.5 rounded-lg">
                          Read <ArrowRight className="w-3 h-3" />
                        </span>
                      </div>
                    </div>
                  </Link>
                </AnimateOnScroll>
              ))}
            </div>
          ) : (
            <div className="text-center py-32 rounded-[2rem] border border-dashed border-slate-300 dark:border-neutral-800 bg-slate-50 dark:bg-neutral-900/30">
              <BookOpen className="w-12 h-12 text-slate-300 dark:text-neutral-700 mx-auto mb-4" />
              <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2">No articles found</h3>
              <p className="text-slate-500 dark:text-slate-400 text-sm">
                Try adjusting your search query or tag filters.
              </p>
              <button
                onClick={() => { setSearchQuery(""); setActiveTag("All Logs"); }}
                className="mt-6 px-6 py-2.5 rounded-xl bg-slate-900 dark:bg-white text-white dark:text-slate-900 text-xs font-bold uppercase tracking-widest hover:bg-slate-700 dark:hover:bg-slate-200 transition-colors"
              >
                Clear Filters
              </button>
            </div>
          )}
        </div>
      </section>

      {/* ══════════════════════════════════════════
          NEWSLETTER CTA
      ══════════════════════════════════════════ */}
      <section className="relative overflow-hidden py-24 sm:py-32 px-4 sm:px-6 bg-slate-900 dark:bg-black border-t border-slate-800">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_70%_50%_at_50%_0%,rgba(14,165,233,0.15),transparent)] pointer-events-none" />
        <div className="relative z-10 max-w-3xl mx-auto text-center space-y-8">
          <AnimateOnScroll variant="fadeUp">
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-white font-heading tracking-tight mb-4">
              Never Miss an <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-400 to-cyan-300">Update.</span>
            </h2>
            <p className="text-slate-400 text-base sm:text-lg max-w-xl mx-auto font-medium">
              Join 10,000+ engineers receiving our best technical deep-dives and architecture patterns directly in their inbox.
            </p>
          </AnimateOnScroll>

          <AnimateOnScroll variant="fadeUp" delay={0.1}>
            <form className="flex flex-col sm:flex-row max-w-lg mx-auto gap-3 mt-8" onSubmit={(e) => e.preventDefault()}>
              <input 
                type="email" 
                placeholder="developer@company.com" 
                className="flex-1 px-5 py-4 rounded-xl bg-white/5 border border-white/10 text-white placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-brand-500/50 focus:border-brand-500 transition-all text-sm font-medium"
                required
              />
              <button 
                type="submit"
                className="px-8 py-4 rounded-xl bg-brand-600 hover:bg-brand-500 text-white text-xs font-bold uppercase tracking-widest transition-all shadow-lg hover:shadow-brand-500/25 shrink-0"
              >
                Subscribe
              </button>
            </form>
            <p className="text-[10px] text-slate-500 mt-4 uppercase tracking-widest font-mono">
              No spam. Unsubscribe anytime.
            </p>
          </AnimateOnScroll>
        </div>
      </section>

    </div>
  );
}
