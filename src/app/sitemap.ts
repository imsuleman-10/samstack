import { MetadataRoute } from 'next';
import { services } from '@/lib/data/services';
import { blogPosts } from '@/lib/data/blog-posts';
import { teamData } from '@/lib/data/team';

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = 'https://samstack-tech.vercel.app';
  const now = new Date();

  // ── Tier 1: Homepage (1.0) ──────────────────────────────────────────────
  const homePage: MetadataRoute.Sitemap = [
    {
      url: baseUrl,
      lastModified: now,
      changeFrequency: 'weekly',
      priority: 1.0,
      images: [
        `${baseUrl}/logo.png`,
        `${baseUrl}/images/img-server-rack.jpg`,
        `${baseUrl}/images/img-team-meeting.jpg`,
      ],
    },
  ];

  // ── Tier 2: Core conversion pages (0.95) ───────────────────────────────
  const conversionPages: MetadataRoute.Sitemap = [
    { url: `${baseUrl}/services`,  lastModified: now, changeFrequency: 'monthly', priority: 0.95 },
    { url: `${baseUrl}/contact`,   lastModified: now, changeFrequency: 'monthly', priority: 0.92 },
  ];

  // ── Tier 3: Brand / trust pages (0.88) ─────────────────────────────────
  const brandPages: MetadataRoute.Sitemap = [
    { url: `${baseUrl}/about`,     lastModified: now, changeFrequency: 'monthly', priority: 0.88 },
    { url: `${baseUrl}/portfolio`, lastModified: now, changeFrequency: 'monthly', priority: 0.85 },
    { url: `${baseUrl}/team`,      lastModified: now, changeFrequency: 'monthly', priority: 0.85 },
  ];

  // ── Tier 4: Blog index page (0.82) ─────────────────────────────────────
  const blogIndex: MetadataRoute.Sitemap = [
    { url: `${baseUrl}/blog`, lastModified: now, changeFrequency: 'weekly', priority: 0.82 },
  ];

  // ── Tier 5: Programme pages (0.75) ─────────────────────────────────────
  const programmePages: MetadataRoute.Sitemap = [
    { url: `${baseUrl}/internship`,       lastModified: now, changeFrequency: 'monthly', priority: 0.75 },
    { url: `${baseUrl}/internship/apply`, lastModified: now, changeFrequency: 'monthly', priority: 0.65 },
    { url: `${baseUrl}/verify`,           lastModified: now, changeFrequency: 'yearly',  priority: 0.5  },
  ];

  // ── Tier 6: Legal / utility pages (0.3) ────────────────────────────────
  const legalPages: MetadataRoute.Sitemap = [
    { url: `${baseUrl}/privacy`, lastModified: now, changeFrequency: 'yearly', priority: 0.3 },
    { url: `${baseUrl}/terms`,   lastModified: now, changeFrequency: 'yearly', priority: 0.3 },
  ];

  // ── Dynamic: Service detail pages (0.9) ────────────────────────────────
  const serviceSitemaps: MetadataRoute.Sitemap = services.map((service) => ({
    url: `${baseUrl}/services/${service.slug}`,
    lastModified: now,
    changeFrequency: 'monthly',
    priority: 0.9,
  }));

  // ── Dynamic: Blog post pages (0.75) — SEO blog posts get high priority
  const blogSitemaps: MetadataRoute.Sitemap = blogPosts.map((post) => ({
    url: `${baseUrl}/blog/${post.slug}`,
    lastModified: new Date(post.dateISO),
    changeFrequency: 'monthly',
    priority: 0.75,
    images: post.image ? [`${baseUrl}${post.image}`] : [],
  }));

  // ── Dynamic: Team profile pages (0.8 for Suleman / 0.72 for others) ────
  const teamSitemaps: MetadataRoute.Sitemap = teamData.map((member) => {
    const imageUrl = member.avatarUrl.startsWith('http')
      ? member.avatarUrl
      : `${baseUrl}${member.avatarUrl}`;
    return {
      url: `${baseUrl}/team/${member.id}`,
      lastModified: now,
      changeFrequency: 'monthly',
      // Suleman Zaheer is the founder; give his profile the highest priority
      priority: member.id === 'suleman-zaheer' ? 0.82 : 0.72,
      images: [imageUrl],
    };
  });

  return [
    ...homePage,
    ...conversionPages,
    ...brandPages,
    ...blogIndex,
    ...programmePages,
    ...legalPages,
    ...serviceSitemaps,
    ...blogSitemaps,
    ...teamSitemaps,
  ];
}
