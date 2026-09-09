import React from "react";
import Link from "next/link";
import { notFound } from "next/navigation";
import { db } from "@/lib/db";
import { blogPosts, getBlogPost } from "@/lib/data/blog-posts";
import { Calendar, User, ArrowLeft, Clock, Tag, BookOpen, ArrowRight, Share2 } from "lucide-react";
import Image from "next/image";
import AnimateOnScroll from "@/app/components/AnimateOnScroll";
import ReadingProgress from "@/app/components/ReadingProgress";
import type { Metadata } from "next";

export const revalidate = 3600;

const BASE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://samstack-tech.vercel.app";

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const staticPost = getBlogPost(slug);
  if (staticPost) {
    return {
      title: `${staticPost.title} | SAMStack Insights`,
      description: staticPost.excerpt,
      keywords: staticPost.tags,
      authors: [{ name: staticPost.author }],
      openGraph: {
        title: staticPost.title,
        description: staticPost.excerpt,
        url: `${BASE_URL}/blog/${slug}`,
        type: "article",
        publishedTime: staticPost.dateISO,
        authors: [staticPost.author],
        tags: staticPost.tags,
        images: [{ url: staticPost.image, width: 1200, height: 630, alt: staticPost.title }],
      },
      twitter: {
        card: "summary_large_image",
        title: staticPost.title,
        description: staticPost.excerpt,
        images: [staticPost.image],
      },
      alternates: { canonical: `${BASE_URL}/blog/${slug}` },
    };
  }
  try {
    const post = await db.posts.getBySlug(slug);
    if (!post) return { title: "Post Not Found" };
    return { title: post.title, description: post.excerpt, alternates: { canonical: `${BASE_URL}/blog/${slug}` } };
  } catch {
    return { title: "SAMStack Insights" };
  }
}

export async function generateStaticParams() {
  const staticSlugs = blogPosts.map((p) => ({ slug: p.slug }));
  try {
    const posts = await db.posts.list();
    return [...staticSlugs, ...posts.map((p) => ({ slug: p.slug }))];
  } catch {
    return staticSlugs;
  }
}

function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" });
}

function getInitials(name: string): string {
  return name.split(" ").filter(Boolean).map((n) => n[0].toUpperCase()).join("").slice(0, 2);
}

const getCoverImage = (slug: string, fallback?: string) => {
  if (fallback) return fallback;
  const images = ["/images/img-servers.jpg", "/images/img-server-rack.jpg", "/images/img-matrix-code.jpg", "/images/img-servers.jpg"];
  const hash = Array.from(slug).reduce((acc, c) => acc + c.charCodeAt(0), 0);
  return images[hash % images.length];
};

const getAuthorImage = (name: string) => {
  if (name.includes("Suleman")) return "/images/image.png";
  if (name.includes("Abdullah")) return "/syed-abdullah-software-engineer-samstack-tech.png";
  if (name.includes("Saqib")) return "/saqib-javed-software-engineer-samstack-tech.jpg";
  return null;
};

export default async function BlogPostDetailPage(props: any) {
  const resolvedParams = await props.params;
  const rawSlug = resolvedParams?.slug || props.params?.slug || "";
  const slug = decodeURIComponent(rawSlug);
  const staticPost = getBlogPost(slug);

  if (staticPost) {
    const initials = getInitials(staticPost.author);
    const authorImage = getAuthorImage(staticPost.author);
    const coverImage = getCoverImage(slug, staticPost.image);
    const relatedPosts = blogPosts.filter((p) => p.slug !== slug).slice(0, 3);

    const articleJsonLd = {
      "@context": "https://schema.org", "@type": "Article",
      headline: staticPost.title, description: staticPost.excerpt, image: staticPost.image,
      datePublished: staticPost.dateISO, dateModified: staticPost.dateISO,
      author: { "@type": "Person", name: staticPost.author, jobTitle: staticPost.authorTitle, url: `${BASE_URL}/about` },
      publisher: { "@type": "Organization", name: "SAMStack Tech", logo: { "@type": "ImageObject", url: `${BASE_URL}/logo.png` } },
      mainEntityOfPage: { "@type": "WebPage", "@id": `${BASE_URL}/blog/${slug}` },
      keywords: staticPost.tags.join(", "),
    };

    return (
      <article className="flex-1 w-full bg-white dark:bg-black">
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(articleJsonLd) }} />
        <ReadingProgress />

        {/* ══════════════════════════════════
            HERO — Cinematic Full Bleed
        ══════════════════════════════════ */}
        <section className="relative overflow-hidden w-full min-h-[100dvh] flex flex-col justify-end group/hero">
          {/* Background Image */}
          <div className="absolute inset-0 z-0">
            <Image src={coverImage} alt={staticPost.title} fill priority sizes="100vw" className="object-cover scale-[1.04] group-hover/hero:scale-100 transition-transform duration-[3500ms] ease-out" />
            {/* Layered gradients for cinematic depth */}
            <div className="absolute inset-0 bg-gradient-to-t from-black via-black/55 to-black/10" />
            <div className="absolute inset-0 bg-gradient-to-r from-black/50 via-transparent to-transparent" />
          </div>

          {/* Glassmorphism top nav bar */}
          <div className="absolute top-0 left-0 right-0 z-20 pt-20 pb-3 px-5 sm:px-8">
            <div className="max-w-6xl mx-auto">
              <Link
                href="/blog"
                className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-white/60 hover:text-white bg-black/20 hover:bg-black/30 backdrop-blur-md border border-white/10 hover:border-white/20 px-5 py-2.5 rounded-xl transition-all duration-300 group"
              >
                <ArrowLeft className="w-3.5 h-3.5 group-hover:-translate-x-1 transition-transform text-brand-400" />
                All Articles
              </Link>
            </div>
          </div>

          {/* Hero text at the bottom */}
          <div className="relative z-10 max-w-6xl mx-auto px-5 sm:px-8 pb-14 sm:pb-20 w-full">
            {/* Tags */}
            <AnimateOnScroll variant="fadeUp" delay={0.05}>
              <div className="flex flex-wrap gap-2 mb-5">
                {staticPost.tags.map((t) => (
                  <span key={t} className="inline-flex items-center gap-1.5 text-[10px] font-mono bg-white/10 backdrop-blur-sm border border-white/15 px-3 py-1.5 rounded-full text-brand-300 uppercase tracking-widest font-bold">
                    <Tag className="w-2.5 h-2.5" />{t}
                  </span>
                ))}
              </div>
            </AnimateOnScroll>

            {/* Title */}
            <AnimateOnScroll variant="fadeUp" delay={0.1}>
              <h1 className="text-4xl sm:text-5xl lg:text-[3.5rem] font-black text-white tracking-tight leading-[1.05] font-heading max-w-4xl mb-5">
                {staticPost.title}
              </h1>
            </AnimateOnScroll>

            {/* Excerpt */}
            <AnimateOnScroll variant="fadeUp" delay={0.15}>
              <p className="text-slate-300 text-base sm:text-lg leading-relaxed max-w-3xl mb-8 font-medium">
                {staticPost.excerpt}
              </p>
            </AnimateOnScroll>

            {/* Meta bar */}
            <AnimateOnScroll variant="fadeUp" delay={0.2}>
              <div className="flex flex-wrap items-center gap-5 pt-6 border-t border-white/10">
                {/* Author */}
                <div className="flex items-center gap-3">
                  <div className="relative w-11 h-11 rounded-full bg-gradient-to-br from-brand-500 to-indigo-600 flex items-center justify-center font-black text-sm text-white shadow-lg ring-2 ring-white/10 overflow-hidden">
                    {authorImage ? <Image src={authorImage} alt={staticPost.author} fill sizes="80px" className="object-cover" /> : initials}
                  </div>
                  <div>
                    <div className="text-sm font-bold text-white leading-tight">{staticPost.author}</div>
                    <div className="text-xs text-slate-400 font-mono">{staticPost.authorTitle}</div>
                  </div>
                </div>
                <div className="hidden sm:block w-px h-8 bg-white/10" />
                <span className="flex items-center gap-2 text-xs font-bold text-slate-400">
                  <Calendar className="w-3.5 h-3.5 text-brand-400" />{staticPost.date}
                </span>
                <span className="flex items-center gap-2 text-xs font-bold text-slate-400">
                  <Clock className="w-3.5 h-3.5 text-brand-400" />{staticPost.readTime}
                </span>
              </div>
            </AnimateOnScroll>
          </div>
        </section>

        {/* ══════════════════════════════════
            ARTICLE BODY
        ══════════════════════════════════ */}
        <section className="relative py-16 sm:py-24 px-4 sm:px-6 bg-white dark:bg-black">
          <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-[1fr_280px] gap-14 lg:gap-16 items-start">

            {/* Main Content */}
            <div className="min-w-0">
              {/* Article card */}
              <AnimateOnScroll variant="fadeUp">
                <div className="rounded-3xl border border-slate-100 dark:border-neutral-800/80 bg-white dark:bg-neutral-950 p-8 sm:p-10 lg:p-12 shadow-sm">
                  <div className="prose-custom">
                    <div dangerouslySetInnerHTML={{ __html: staticPost.content }} />
                  </div>
                </div>
              </AnimateOnScroll>

              {/* Author Card at bottom */}
              <AnimateOnScroll variant="fadeUp" delay={0.1}>
                <div className="mt-8 rounded-3xl border border-slate-100 dark:border-neutral-800 bg-slate-50 dark:bg-neutral-900/50 p-6 sm:p-8 flex flex-col sm:flex-row sm:items-center gap-6">
                  <div className="flex items-center gap-4 flex-1">
                    <div className="relative w-16 h-16 rounded-full bg-gradient-to-br from-brand-500 to-indigo-600 flex items-center justify-center font-black text-lg text-white shadow-xl ring-4 ring-brand-500/10 shrink-0 overflow-hidden">
                      {authorImage ? <Image src={authorImage} alt={staticPost.author} fill sizes="80px" className="object-cover" /> : initials}
                    </div>
                    <div>
                      <p className="text-[10px] font-mono font-bold text-slate-400 uppercase tracking-widest mb-1">Written by</p>
                      <p className="text-base font-black text-slate-900 dark:text-white">{staticPost.author}</p>
                      <p className="text-xs text-slate-500 dark:text-slate-400 font-medium mt-0.5">{staticPost.authorTitle}</p>
                    </div>
                  </div>
                  <div className="flex flex-wrap gap-3 sm:shrink-0">
                    <Link href="/about" className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-slate-900 dark:bg-white text-white dark:text-slate-900 text-xs font-bold uppercase tracking-widest hover:bg-slate-700 dark:hover:bg-slate-200 transition-all group">
                      Meet Team <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
                    </Link>
                    <Link href="/blog" className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl border border-slate-200 dark:border-neutral-700 text-slate-700 dark:text-slate-300 text-xs font-bold uppercase tracking-widest hover:border-brand-400 dark:hover:border-brand-600 transition-all">
                      <ArrowLeft className="w-3.5 h-3.5" /> All Articles
                    </Link>
                  </div>
                </div>
              </AnimateOnScroll>
            </div>

            {/* Sticky Sidebar */}
            <aside className="lg:sticky lg:top-28 space-y-5 lg:self-start">

              {/* Article info */}
              <AnimateOnScroll variant="fadeRight">
                <div className="rounded-3xl border border-slate-100 dark:border-neutral-800 bg-slate-50 dark:bg-neutral-900/50 p-6 space-y-5">
                  <p className="text-[10px] font-mono font-bold text-slate-400 uppercase tracking-[0.2em]">Article Info</p>
                  <div className="space-y-4">
                    <div className="flex items-start gap-3">
                      <Calendar className="w-4 h-4 text-brand-500 shrink-0 mt-0.5" />
                      <div>
                        <div className="text-[10px] font-mono text-slate-400 uppercase tracking-wider mb-0.5">Published</div>
                        <div className="text-sm font-bold text-slate-900 dark:text-white">{staticPost.date}</div>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <Clock className="w-4 h-4 text-brand-500 shrink-0 mt-0.5" />
                      <div>
                        <div className="text-[10px] font-mono text-slate-400 uppercase tracking-wider mb-0.5">Read Time</div>
                        <div className="text-sm font-bold text-slate-900 dark:text-white">{staticPost.readTime}</div>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <User className="w-4 h-4 text-brand-500 shrink-0 mt-0.5" />
                      <div>
                        <div className="text-[10px] font-mono text-slate-400 uppercase tracking-wider mb-0.5">Author</div>
                        <div className="text-sm font-bold text-slate-900 dark:text-white">{staticPost.author}</div>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <BookOpen className="w-4 h-4 text-brand-500 shrink-0 mt-0.5" />
                      <div>
                        <div className="text-[10px] font-mono text-slate-400 uppercase tracking-wider mb-0.5">Category</div>
                        <div className="text-sm font-bold text-slate-900 dark:text-white">Technical Deep-dive</div>
                      </div>
                    </div>
                  </div>
                </div>
              </AnimateOnScroll>

              {/* Tags */}
              <AnimateOnScroll variant="fadeRight" delay={0.07}>
                <div className="rounded-3xl border border-slate-100 dark:border-neutral-800 bg-slate-50 dark:bg-neutral-900/50 p-6">
                  <p className="text-[10px] font-mono font-bold text-slate-400 uppercase tracking-[0.2em] mb-4">Topics</p>
                  <div className="flex flex-wrap gap-2">
                    {staticPost.tags.map((t) => (
                      <span key={t} className="inline-flex items-center gap-1 text-[10px] font-mono font-bold bg-brand-50 dark:bg-brand-950/40 border border-brand-100 dark:border-brand-800/50 px-3 py-1.5 rounded-full text-brand-700 dark:text-brand-300 uppercase tracking-wider">
                        <Tag className="w-2.5 h-2.5" />{t}
                      </span>
                    ))}
                  </div>
                </div>
              </AnimateOnScroll>

              {/* Start a Project CTA */}
              <AnimateOnScroll variant="fadeRight" delay={0.12}>
                <div className="rounded-3xl bg-slate-900 dark:bg-neutral-950 border border-slate-800 p-6 relative overflow-hidden group/cta">
                  <div className="absolute inset-0 bg-gradient-to-br from-brand-500/10 to-transparent opacity-0 group-hover/cta:opacity-100 transition-opacity" />
                  <div className="relative z-10">
                    <p className="text-[10px] font-mono font-bold text-brand-400 uppercase tracking-[0.2em] mb-2">Work with us</p>
                    <p className="text-sm font-bold text-white leading-relaxed mb-5">Ready to build something extraordinary?</p>
                    <Link href="/contact" className="w-full inline-flex items-center justify-center gap-2 px-5 py-3 bg-brand-600 hover:bg-brand-500 text-white text-xs font-bold uppercase tracking-widest rounded-xl transition-all group">
                      Start a Project <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
                    </Link>
                  </div>
                </div>
              </AnimateOnScroll>

              {/* Share */}
              <AnimateOnScroll variant="fadeRight" delay={0.16}>
                <div className="rounded-3xl border border-slate-100 dark:border-neutral-800 bg-slate-50 dark:bg-neutral-900/50 p-6">
                  <p className="text-[10px] font-mono font-bold text-slate-400 uppercase tracking-[0.2em] mb-4">Share Article</p>
                  <div className="flex gap-3">
                    <a
                      href={`https://twitter.com/intent/tweet?text=${encodeURIComponent(staticPost.title)}&url=${encodeURIComponent(`${BASE_URL}/blog/${slug}`)}`}
                      target="_blank" rel="noopener noreferrer"
                      className="flex-1 inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-white dark:bg-neutral-900 border border-slate-200 dark:border-neutral-700 hover:border-brand-400 dark:hover:border-brand-600 text-slate-600 dark:text-slate-400 text-xs font-bold transition-all"
                    >
                      <Share2 className="w-3.5 h-3.5" /> Twitter
                    </a>
                    <a
                      href={`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(`${BASE_URL}/blog/${slug}`)}`}
                      target="_blank" rel="noopener noreferrer"
                      className="flex-1 inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-white dark:bg-neutral-900 border border-slate-200 dark:border-neutral-700 hover:border-brand-400 dark:hover:border-brand-600 text-slate-600 dark:text-slate-400 text-xs font-bold transition-all"
                    >
                      <Share2 className="w-3.5 h-3.5" /> LinkedIn
                    </a>
                  </div>
                </div>
              </AnimateOnScroll>
            </aside>
          </div>
        </section>

        {/* ══════════════════════════════════
            RELATED ARTICLES
        ══════════════════════════════════ */}
        {relatedPosts.length > 0 && (
          <section className="relative py-20 sm:py-28 px-4 sm:px-6 bg-slate-50 dark:bg-neutral-950 border-t border-slate-100 dark:border-neutral-900 overflow-hidden">
            <div className="absolute top-0 left-1/4 w-[400px] h-[300px] bg-brand-500/5 dark:bg-brand-500/8 rounded-full blur-[120px] pointer-events-none" />
            <div className="max-w-6xl mx-auto space-y-12">
              <AnimateOnScroll variant="fadeUp">
                <div className="text-center space-y-3">
                  <span className="inline-flex items-center gap-2 text-[11px] font-mono bg-brand-500/10 border border-brand-500/20 px-4 py-1.5 rounded-full text-brand-600 dark:text-brand-400 uppercase tracking-widest font-bold">
                    Continue Reading
                  </span>
                  <h2 className="text-3xl sm:text-4xl font-black text-slate-900 dark:text-white font-heading tracking-tight">More Insights</h2>
                </div>
              </AnimateOnScroll>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {relatedPosts.map((post, i) => (
                  <AnimateOnScroll key={post.slug} variant="fadeUp" delay={0.07 * i}>
                    <Link href={`/blog/${post.slug}`} className="group/rcard flex flex-col h-full rounded-3xl border border-slate-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 overflow-hidden hover:border-brand-300 dark:hover:border-brand-700 hover:shadow-xl transition-all duration-400">
                      <div className="relative h-44 w-full overflow-hidden bg-slate-100 dark:bg-neutral-800 shrink-0">
                        <Image src={getCoverImage(post.slug, post.image)} alt={post.title} fill sizes="(max-width: 768px) 100vw, 33vw" className="object-cover transition-transform duration-700 group-hover/rcard:scale-105" />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                        <div className="absolute bottom-3 left-3 flex flex-wrap gap-1.5">
                          {post.tags.slice(0, 2).map((t) => (
                            <span key={t} className="text-[9px] font-mono font-bold bg-black/40 backdrop-blur-sm border border-white/15 px-2 py-0.5 rounded-full text-white/80 uppercase">{t}</span>
                          ))}
                        </div>
                      </div>
                      <div className="flex flex-col flex-1 p-5 sm:p-6 space-y-3">
                        <h3 className="text-sm font-black text-slate-900 dark:text-white font-heading group-hover/rcard:text-brand-600 dark:group-hover/rcard:text-brand-400 transition-colors line-clamp-2 leading-snug">{post.title}</h3>
                        <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed line-clamp-2 flex-1 font-medium">{post.excerpt}</p>
                        <div className="flex items-center justify-between pt-3 border-t border-slate-100 dark:border-neutral-800">
                          <span className="text-xs text-slate-400 font-mono">{post.readTime}</span>
                          <span className="inline-flex items-center gap-1 text-xs font-bold text-brand-600 dark:text-brand-400 group-hover/rcard:gap-2 transition-all">
                            Read <ArrowRight className="w-3.5 h-3.5" />
                          </span>
                        </div>
                      </div>
                    </Link>
                  </AnimateOnScroll>
                ))}
              </div>
            </div>
          </section>
        )}

        {/* ══════════════════════════════════
            FINAL CTA
        ══════════════════════════════════ */}
        <section className="relative min-h-[100dvh] flex flex-col justify-center py-20 px-4 sm:px-6 bg-slate-900 dark:bg-black border-t border-slate-800 overflow-hidden">
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_60%_at_50%_-5%,rgba(14,165,233,0.18),transparent)]" />
          <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.018)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.018)_1px,transparent_1px)] bg-[size:64px_64px]" />
          <div className="relative z-10 max-w-3xl mx-auto text-center space-y-8">
            <AnimateOnScroll variant="fadeUp">
              <div className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-white/8 border border-white/15 text-white/70 text-[11px] font-bold uppercase tracking-[0.2em]">
                More Reading
              </div>
              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-white font-heading tracking-tight mt-4">
                Explore More{" "}
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-400 to-indigo-300">Insights</span>
              </h2>
              <p className="text-slate-400 text-base sm:text-lg max-w-xl mx-auto mt-4 font-medium">
                Deep-dives into engineering, architecture, and the future of software.
              </p>
            </AnimateOnScroll>
            <AnimateOnScroll variant="fadeUp" delay={0.1}>
              <div className="flex flex-wrap gap-4 justify-center">
                <Link href="/blog" className="inline-flex items-center gap-2 px-8 py-4 bg-brand-600 hover:bg-brand-500 text-white text-sm font-bold uppercase tracking-widest rounded-xl transition-all shadow-lg group">
                  All Articles <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </Link>
                <Link href="/contact" className="inline-flex items-center gap-2 px-8 py-4 bg-white/10 hover:bg-white/15 border border-white/15 hover:border-white/30 text-white text-sm font-bold uppercase tracking-widest rounded-xl transition-all">
                  Start a Project
                </Link>
              </div>
            </AnimateOnScroll>
          </div>
        </section>
      </article>
    );
  }

  // ══ DB Fallback ══
  let dbPost = null;
  try { dbPost = await db.posts.getBySlug(slug); } catch { dbPost = null; }
  if (dbPost === null) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-black text-white p-10 font-mono text-xs break-all">
        DEBUG INFO: {JSON.stringify(props)} | rawSlug: {rawSlug} | slug: {slug}
      </div>
    );
  }

  const { title, excerpt, tags, publishedAt, contentMarkdown, author } = dbPost!;
  const initials = getInitials(author.name);
  const authorImage = getAuthorImage(author.name);
  const coverImage = getCoverImage(slug);
  const publishDate = formatDate(publishedAt);

  return (
    <article className="flex-1 w-full bg-white dark:bg-black">
      <ReadingProgress />

      <section className="relative overflow-hidden w-full min-h-[100dvh] flex flex-col justify-end group/hero">
        <div className="absolute inset-0 z-0">
          <Image src={coverImage} alt={title} fill priority sizes="100vw" className="object-cover scale-[1.04] group-hover/hero:scale-100 transition-transform duration-[3500ms] ease-out" />
          <div className="absolute inset-0 bg-gradient-to-t from-black via-black/55 to-black/10" />
          <div className="absolute inset-0 bg-gradient-to-r from-black/50 via-transparent to-transparent" />
        </div>

        <div className="absolute top-0 left-0 right-0 z-20 pt-20 px-5 sm:px-8">
          <div className="max-w-6xl mx-auto">
            <Link href="/blog" className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-white/60 hover:text-white bg-black/20 hover:bg-black/30 backdrop-blur-md border border-white/10 hover:border-white/20 px-5 py-2.5 rounded-xl transition-all group">
              <ArrowLeft className="w-3.5 h-3.5 group-hover:-translate-x-1 transition-transform text-brand-400" />All Articles
            </Link>
          </div>
        </div>

        <div className="relative z-10 max-w-6xl mx-auto px-5 sm:px-8 pb-14 sm:pb-20 w-full">
          <div className="flex flex-wrap gap-2 mb-5">
            {tags.map((t: string) => (
              <span key={t} className="inline-flex items-center gap-1.5 text-[10px] font-mono bg-white/10 backdrop-blur-sm border border-white/15 px-3 py-1.5 rounded-full text-brand-300 uppercase tracking-widest font-bold">
                <Tag className="w-2.5 h-2.5" />{t}
              </span>
            ))}
          </div>
          <h1 className="text-4xl sm:text-5xl lg:text-[3.5rem] font-black text-white tracking-tight leading-[1.05] font-heading max-w-4xl mb-5">{title}</h1>
          <p className="text-slate-300 text-base sm:text-lg leading-relaxed max-w-3xl mb-8 font-medium">{excerpt}</p>
          <div className="flex flex-wrap items-center gap-5 pt-6 border-t border-white/10">
            <div className="flex items-center gap-3">
              <div className="relative w-11 h-11 rounded-full bg-gradient-to-br from-brand-500 to-indigo-600 flex items-center justify-center font-black text-sm text-white shadow-lg ring-2 ring-white/10 overflow-hidden">
                {authorImage ? <Image src={authorImage} alt={author.name} fill sizes="80px" className="object-cover" /> : initials}
              </div>
              <div>
                <div className="text-sm font-bold text-white">{author.name}</div>
                <div className="text-xs text-slate-400 font-mono">{author.role}</div>
              </div>
            </div>
            <span className="flex items-center gap-2 text-xs font-bold text-slate-400"><Calendar className="w-3.5 h-3.5 text-brand-400" />{publishDate}</span>
          </div>
        </div>
      </section>

      <section className="relative py-16 sm:py-24 px-4 sm:px-6 bg-white dark:bg-black">
        <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-[1fr_280px] gap-14 lg:gap-16 items-start">
          <div className="min-w-0">
            <div className="rounded-3xl border border-slate-100 dark:border-neutral-800/80 bg-white dark:bg-neutral-950 p-8 sm:p-10 lg:p-12 shadow-sm">
              <div className="prose-custom"><div dangerouslySetInnerHTML={{ __html: contentMarkdown }} /></div>
            </div>
            <div className="mt-8 rounded-3xl border border-slate-100 dark:border-neutral-800 bg-slate-50 dark:bg-neutral-900/50 p-6 sm:p-8 flex flex-col sm:flex-row sm:items-center gap-6">
              <div className="flex items-center gap-4 flex-1">
                <div className="relative w-16 h-16 rounded-full bg-gradient-to-br from-brand-500 to-indigo-600 flex items-center justify-center font-black text-lg text-white shadow-xl ring-4 ring-brand-500/10 shrink-0 overflow-hidden">
                  {authorImage ? <Image src={authorImage} alt={author.name} fill sizes="80px" className="object-cover" /> : initials}
                </div>
                <div>
                  <p className="text-[10px] font-mono font-bold text-slate-400 uppercase tracking-widest mb-1">Written by</p>
                  <p className="text-base font-black text-slate-900 dark:text-white">{author.name}</p>
                  <p className="text-xs text-slate-500 dark:text-slate-400 font-medium mt-0.5">{author.role}</p>
                </div>
              </div>
              <Link href="/blog" className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl border border-slate-200 dark:border-neutral-700 text-slate-700 dark:text-slate-300 text-xs font-bold uppercase tracking-widest hover:border-brand-400 transition-all shrink-0">
                <ArrowLeft className="w-3.5 h-3.5" /> All Articles
              </Link>
            </div>
          </div>

          <aside className="lg:sticky lg:top-28 space-y-5 lg:self-start">
            <div className="rounded-3xl border border-slate-100 dark:border-neutral-800 bg-slate-50 dark:bg-neutral-900/50 p-6 space-y-4">
              <p className="text-[10px] font-mono font-bold text-slate-400 uppercase tracking-[0.2em]">Article Info</p>
              <div className="flex items-start gap-3"><Calendar className="w-4 h-4 text-brand-500 shrink-0 mt-0.5" /><div><div className="text-[10px] text-slate-400 uppercase tracking-wider mb-0.5">Published</div><div className="text-sm font-bold text-slate-900 dark:text-white">{publishDate}</div></div></div>
              <div className="flex items-start gap-3"><User className="w-4 h-4 text-brand-500 shrink-0 mt-0.5" /><div><div className="text-[10px] text-slate-400 uppercase tracking-wider mb-0.5">Author</div><div className="text-sm font-bold text-slate-900 dark:text-white">{author.name}</div></div></div>
              <div className="flex flex-wrap gap-2 pt-2">
                {tags.map((t: string) => (
                  <span key={t} className="inline-flex items-center gap-1 text-[10px] font-mono font-bold bg-brand-50 dark:bg-brand-950/40 border border-brand-100 dark:border-brand-800/50 px-2.5 py-1 rounded-full text-brand-700 dark:text-brand-300 uppercase">
                    <Tag className="w-2.5 h-2.5" />{t}
                  </span>
                ))}
              </div>
            </div>
            <div className="rounded-3xl bg-slate-900 dark:bg-neutral-950 border border-slate-800 p-6 relative overflow-hidden group/cta">
              <div className="absolute inset-0 bg-gradient-to-br from-brand-500/10 to-transparent opacity-0 group-hover/cta:opacity-100 transition-opacity" />
              <div className="relative z-10">
                <p className="text-[10px] font-mono font-bold text-brand-400 uppercase tracking-[0.2em] mb-2">Work with us</p>
                <p className="text-sm font-bold text-white leading-relaxed mb-5">Ready to build something extraordinary?</p>
                <Link href="/contact" className="w-full inline-flex items-center justify-center gap-2 px-5 py-3 bg-brand-600 hover:bg-brand-500 text-white text-xs font-bold uppercase tracking-widest rounded-xl transition-all group">
                  Start a Project <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
                </Link>
              </div>
            </div>
          </aside>
        </div>
      </section>

      <section className="relative min-h-[100dvh] flex flex-col justify-center py-20 px-4 sm:px-6 bg-slate-900 dark:bg-black border-t border-slate-800 overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_60%_at_50%_-5%,rgba(14,165,233,0.18),transparent)]" />
        <div className="relative z-10 max-w-3xl mx-auto text-center space-y-8">
          <h2 className="text-3xl sm:text-4xl font-black text-white font-heading tracking-tight">Explore More Insights</h2>
          <div className="flex flex-wrap gap-4 justify-center">
            <Link href="/blog" className="inline-flex items-center gap-2 px-8 py-4 bg-brand-600 hover:bg-brand-500 text-white text-sm font-bold uppercase tracking-widest rounded-xl transition-all group">
              All Articles <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Link>
            <Link href="/contact" className="inline-flex items-center gap-2 px-8 py-4 bg-white/10 hover:bg-white/15 border border-white/15 hover:border-white/30 text-white text-sm font-bold uppercase tracking-widest rounded-xl transition-all">
              Start a Project
            </Link>
          </div>
        </div>
      </section>
    </article>
  );
}
