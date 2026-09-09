'use client';

import React, { useEffect, useState } from 'react';
import { UserAvatar } from '@/components/ui/UserAvatar';
import {
  Loader2, Mail, MapPin, GraduationCap, Calendar,
  FileText, ArrowLeft, Code2, ExternalLink,
  GitBranch, Globe2, Rss, Briefcase, Sparkles, User,
} from 'lucide-react';
import Link from 'next/link';
import { RoleBadge } from '@/components/ui/RoleBadge';

/* ─── Social config ───────────────────────────────────────────────────────── */
const SOCIAL_CONFIG = {
  linkedin:  { label: 'LinkedIn',  color: '#0A66C2', glowR: 10,  glowG: 102, glowB: 194, icon: <Globe2    className="w-4 h-4" /> },
  github:    { label: 'GitHub',    color: '#e2e8f0', glowR: 226, glowG: 232, glowB: 240, icon: <GitBranch className="w-4 h-4" /> },
  twitter:   { label: 'Twitter',   color: '#1DA1F2', glowR: 29,  glowG: 161, glowB: 242, icon: <Rss       className="w-4 h-4" /> },
  portfolio: { label: 'Portfolio', color: '#22d3ee', glowR: 34,  glowG: 211, glowB: 238, icon: <Globe2    className="w-4 h-4" /> },
} as const;

type SocialPlatform = keyof typeof SOCIAL_CONFIG;

/* ─── Skill colour palettes ─────────────────────────────────────────────── */
const SKILL_PALETTES = [
  { bg: 'rgba(34,211,238,0.08)',   border: 'rgba(34,211,238,0.25)',   text: '#67e8f9' },
  { bg: 'rgba(139,92,246,0.08)',   border: 'rgba(139,92,246,0.25)',   text: '#c4b5fd' },
  { bg: 'rgba(251,146,60,0.08)',   border: 'rgba(251,146,60,0.25)',   text: '#fdba74' },
  { bg: 'rgba(52,211,153,0.08)',   border: 'rgba(52,211,153,0.25)',   text: '#6ee7b7' },
  { bg: 'rgba(248,113,113,0.08)',  border: 'rgba(248,113,113,0.25)',  text: '#fca5a5' },
  { bg: 'rgba(251,191,36,0.08)',   border: 'rgba(251,191,36,0.25)',   text: '#fde68a' },
];

/* ─── Sub-components ─────────────────────────────────────────────────────── */
function StatPill({ icon, label }: { icon: React.ReactNode; label: string }) {
  return (
    <span
      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium"
      style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)', color: '#94a3b8' }}
    >
      {icon}
      {label}
    </span>
  );
}

function InfoRow({ icon, label, value }: { icon: React.ReactNode; label: string; value: string }) {
  return (
    <div
      className="group flex items-start gap-3 py-3.5"
      style={{ borderBottom: '1px solid rgba(255,255,255,0.04)' }}
    >
      <div
        className="mt-0.5 shrink-0 w-8 h-8 rounded-lg flex items-center justify-center transition-transform duration-200 group-hover:scale-110"
        style={{ background: 'rgba(34,211,238,0.08)', color: '#22d3ee' }}
      >
        {icon}
      </div>
      <div>
        <p className="text-[10px] font-bold uppercase tracking-widest mb-0.5" style={{ color: '#475569' }}>{label}</p>
        <p className="text-sm font-medium" style={{ color: '#e2e8f0' }}>{value}</p>
      </div>
    </div>
  );
}

function GlassCard({ children, className = '' }: { children: React.ReactNode; className?: string }) {
  return (
    <div
      className={`rounded-2xl p-6 ${className}`}
      style={{
        background: 'rgba(10,14,28,0.6)',
        border: '1px solid rgba(255,255,255,0.07)',
        backdropFilter: 'blur(16px)',
        WebkitBackdropFilter: 'blur(16px)',
      }}
    >
      {children}
    </div>
  );
}

function SectionHeader({ icon, title }: { icon: React.ReactNode; title: string }) {
  return (
    <div className="flex items-center gap-2.5 mb-5">
      <span
        className="w-7 h-7 rounded-lg flex items-center justify-center shrink-0"
        style={{ background: 'rgba(34,211,238,0.1)', color: '#22d3ee' }}
      >
        {icon}
      </span>
      <h3 className="text-[10px] font-bold uppercase tracking-[0.15em]" style={{ color: '#64748b' }}>{title}</h3>
      <div className="flex-1 h-px" style={{ background: 'rgba(255,255,255,0.04)' }} />
    </div>
  );
}

/* ─── Page ───────────────────────────────────────────────────────────────── */
export default function InternProfilePage({ params }: { params: Promise<{ id: string }> }) {
  const [id, setId] = useState<string | null>(null);
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => { params.then(p => setId(p.id)); }, [params]);

  useEffect(() => {
    if (!id) return;
    (async () => {
      try {
        const res = await fetch(`/api/interns/${id}`);
        if (!res.ok) {
          const errData = await res.json().catch(() => ({}));
          throw new Error(errData.error || 'Failed to load profile');
        }
        const json = await res.json();
        setData(json);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    })();
  }, [id]);

  /* ── Loading ── */
  if (loading) return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] gap-5">
      <div className="relative">
        <div
          className="w-16 h-16 rounded-2xl flex items-center justify-center"
          style={{ background: 'rgba(34,211,238,0.06)', border: '1px solid rgba(34,211,238,0.15)' }}
        >
          <Loader2 className="w-7 h-7 animate-spin" style={{ color: '#22d3ee' }} />
        </div>
        <div
          className="absolute inset-0 rounded-2xl animate-ping opacity-20"
          style={{ background: 'rgba(34,211,238,0.3)' }}
        />
      </div>
      <div className="text-center">
        <p className="text-sm font-semibold" style={{ color: '#94a3b8' }}>Loading profile</p>
        <p className="text-xs mt-0.5" style={{ color: '#475569' }}>Please wait a moment…</p>
      </div>
    </div>
  );

  /* ── Error ── */
  if (error || !data) return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] gap-5">
      <div
        className="w-16 h-16 rounded-2xl flex items-center justify-center text-2xl"
        style={{ background: 'rgba(248,113,113,0.08)', border: '1px solid rgba(248,113,113,0.2)' }}
      >
        😕
      </div>
      <div className="text-center">
        <p className="font-semibold" style={{ color: '#f87171' }}>{error || 'Profile not found'}</p>
        <p className="text-xs mt-1" style={{ color: '#64748b' }}>This intern profile could not be loaded.</p>
      </div>
      <Link
        href="/interns"
        className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-all duration-200 hover:scale-[1.02]"
        style={{ background: 'rgba(34,211,238,0.08)', color: '#22d3ee', border: '1px solid rgba(34,211,238,0.2)' }}
      >
        <ArrowLeft className="w-4 h-4" /> Back to Directory
      </Link>
    </div>
  );

  const { user, profile } = data;
  const socialLinks: Record<string, string> = user.social_links || {};
  const hasSocials = (['linkedin', 'github', 'twitter', 'portfolio'] as const).some(k => socialLinks[k]);

  return (
    <div className="max-w-5xl mx-auto pb-20">

      {/* ── Breadcrumb ── */}
      <nav className="mb-7 flex items-center gap-2 text-sm">
        <Link
          href="/interns"
          className="flex items-center gap-1.5 font-medium transition-colors duration-200 hover:text-cyan-400"
          style={{ color: '#64748b' }}
        >
          <ArrowLeft className="w-4 h-4" />
          Intern Directory
        </Link>
        <span style={{ color: '#1e293b' }}>/</span>
        <span className="font-semibold truncate max-w-[200px]" style={{ color: '#e2e8f0' }}>
          {user.full_name}
        </span>
      </nav>

      {/* ── HERO CARD ── */}
      <div
        className="relative rounded-3xl overflow-hidden mb-6"
        style={{ border: '1px solid rgba(255,255,255,0.07)' }}
      >
        {/* Animated cover */}
        <div className="relative h-48 md:h-60 overflow-hidden">
          {/* Base */}
          <div
            className="absolute inset-0"
            style={{ background: 'linear-gradient(135deg, #060d1f 0%, #0c1a3a 50%, #08111e 100%)' }}
          />
          {/* Orbs */}
          <div className="absolute -top-20 -left-20 w-80 h-80 rounded-full"
            style={{ background: 'radial-gradient(circle, rgba(34,211,238,0.18) 0%, transparent 65%)', filter: 'blur(1px)' }} />
          <div className="absolute -bottom-24 right-0 w-96 h-96 rounded-full"
            style={{ background: 'radial-gradient(circle, rgba(99,102,241,0.14) 0%, transparent 65%)' }} />
          <div className="absolute top-8 right-1/4 w-48 h-48 rounded-full"
            style={{ background: 'radial-gradient(circle, rgba(59,130,246,0.12) 0%, transparent 65%)' }} />
          <div className="absolute bottom-0 left-1/3 w-40 h-40 rounded-full"
            style={{ background: 'radial-gradient(circle, rgba(139,92,246,0.1) 0%, transparent 65%)' }} />
          {/* Dot grid */}
          <div
            className="absolute inset-0"
            style={{
              backgroundImage: 'radial-gradient(rgba(255,255,255,0.07) 1px, transparent 1px)',
              backgroundSize: '28px 28px',
            }}
          />
          {/* Shimmer line */}
          <div
            className="absolute top-0 left-0 right-0 h-px"
            style={{ background: 'linear-gradient(90deg, transparent, rgba(34,211,238,0.4), transparent)' }}
          />
        </div>

        {/* Profile body */}
        <div
          className="px-6 md:px-10 pb-8"
          style={{ background: 'rgba(8,11,20,0.92)', backdropFilter: 'blur(24px)' }}
        >
          <div className="flex flex-col md:flex-row md:items-end gap-5 -mt-14 md:-mt-16 mb-6">

            {/* Avatar */}
            <div className="relative shrink-0 self-start">
              <div
                className="p-[3px] rounded-full"
                style={{ background: 'linear-gradient(135deg, rgba(34,211,238,0.8), rgba(99,102,241,0.8), rgba(139,92,246,0.8))' }}
              >
                <div className="rounded-full overflow-hidden" style={{ padding: 3, background: '#080b14' }}>
                  <UserAvatar
                    src={user.avatar_url}
                    name={user.full_name}
                    size="xl"
                    className="w-28 h-28 md:w-32 md:h-32 !rounded-full"
                  />
                </div>
              </div>
              <span
                className="absolute bottom-2.5 right-2.5 w-4 h-4 rounded-full border-2"
                style={{ background: '#34d399', borderColor: '#080b14', boxShadow: '0 0 10px rgba(52,211,153,0.6)' }}
              />
            </div>

            {/* Identity */}
            <div className="flex-1 min-w-0 pt-1 md:pt-0">
              <div className="flex flex-wrap items-center gap-3 mb-1.5">
                <h1
                  className="text-2xl md:text-3xl font-extrabold tracking-tight"
                  style={{ color: '#f8fafc', letterSpacing: '-0.02em' }}
                >
                  {user.full_name}
                </h1>
                <RoleBadge role={user.role} />
              </div>

              <p className="text-sm font-semibold mb-3" style={{ color: '#22d3ee', opacity: 0.9 }}>
                {profile?.department || profile?.track || 'Software Engineering Intern'}
              </p>

              <div className="flex flex-wrap gap-2">
                {profile?.university && (
                  <StatPill
                    icon={<GraduationCap className="w-3.5 h-3.5" style={{ color: '#22d3ee' }} />}
                    label={profile.university}
                  />
                )}
                {(user.city || user.country) && (
                  <StatPill
                    icon={<MapPin className="w-3.5 h-3.5" style={{ color: '#f87171' }} />}
                    label={[user.city, user.country].filter(Boolean).join(', ')}
                  />
                )}
                {profile?.semester && (
                  <StatPill
                    icon={<Calendar className="w-3.5 h-3.5" style={{ color: '#fbbf24' }} />}
                    label={profile.semester}
                  />
                )}
              </div>
            </div>

            {/* CTAs */}
            <div className="flex flex-wrap gap-2.5 pb-1 shrink-0">
              {profile?.resume_url && (
                <a
                  href={profile.resume_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold transition-all duration-200 hover:scale-[1.03] active:scale-[0.97]"
                  style={{
                    background: 'linear-gradient(135deg, rgba(52,211,153,0.15), rgba(34,211,238,0.08))',
                    color: '#34d399',
                    border: '1px solid rgba(52,211,153,0.3)',
                    boxShadow: '0 0 20px rgba(52,211,153,0.06)',
                  }}
                >
                  <FileText className="w-4 h-4" />
                  Resume
                  <ExternalLink className="w-3 h-3 opacity-60" />
                </a>
              )}
              {user.email && (
                <a
                  href={`mailto:${user.email}`}
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold transition-all duration-200 hover:scale-[1.03] active:scale-[0.97]"
                  style={{
                    background: 'linear-gradient(135deg, rgba(34,211,238,0.12), rgba(99,102,241,0.06))',
                    color: '#67e8f9',
                    border: '1px solid rgba(34,211,238,0.25)',
                    boxShadow: '0 0 20px rgba(34,211,238,0.05)',
                  }}
                >
                  <Mail className="w-4 h-4" />
                  Contact
                </a>
              )}
            </div>
          </div>

          {/* Divider */}
          <div
            className="h-px"
            style={{ background: 'linear-gradient(90deg, rgba(34,211,238,0.15), rgba(99,102,241,0.1), transparent)' }}
          />
        </div>
      </div>

      {/* ── CONTENT GRID ── */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">

        {/* Left sidebar */}
        <div className="space-y-5">

          <GlassCard>
            <SectionHeader icon={<Briefcase className="w-3.5 h-3.5" />} title="Details" />
            <div>
              {user.email && <InfoRow icon={<Mail className="w-3.5 h-3.5" />} label="Email" value={user.email} />}
              {profile?.university && <InfoRow icon={<GraduationCap className="w-3.5 h-3.5" />} label="University" value={profile.university} />}
              {profile?.semester && <InfoRow icon={<Calendar className="w-3.5 h-3.5" />} label="Semester" value={profile.semester} />}
              {(user.city || user.country) && (
                <InfoRow
                  icon={<MapPin className="w-3.5 h-3.5" />}
                  label="Location"
                  value={[user.city, user.country].filter(Boolean).join(', ')}
                />
              )}
              {(profile?.department || profile?.track) && (
                <InfoRow icon={<Code2 className="w-3.5 h-3.5" />} label="Track" value={profile.department || profile.track} />
              )}
            </div>
          </GlassCard>

          {hasSocials && (
            <GlassCard>
              <SectionHeader icon={<Globe2 className="w-3.5 h-3.5" />} title="Connect" />
              <div className="space-y-2">
                {(['linkedin', 'github', 'portfolio', 'twitter'] as SocialPlatform[]).map(platform => {
                  const url = socialLinks[platform];
                  if (!url) return null;
                  const cfg = SOCIAL_CONFIG[platform];
                  return (
                    <a
                      key={platform}
                      href={url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="group flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 hover:scale-[1.02] hover:-translate-y-px active:scale-[0.98]"
                      style={{
                        background: 'rgba(255,255,255,0.03)',
                        border: '1px solid rgba(255,255,255,0.07)',
                        color: '#94a3b8',
                      }}
                      onMouseEnter={e => {
                        e.currentTarget.style.background = `rgba(${cfg.glowR},${cfg.glowG},${cfg.glowB},0.1)`;
                        e.currentTarget.style.borderColor = `rgba(${cfg.glowR},${cfg.glowG},${cfg.glowB},0.35)`;
                        e.currentTarget.style.color = cfg.color;
                        e.currentTarget.style.boxShadow = `0 4px 18px rgba(${cfg.glowR},${cfg.glowG},${cfg.glowB},0.18)`;
                      }}
                      onMouseLeave={e => {
                        e.currentTarget.style.background = 'rgba(255,255,255,0.03)';
                        e.currentTarget.style.borderColor = 'rgba(255,255,255,0.07)';
                        e.currentTarget.style.color = '#94a3b8';
                        e.currentTarget.style.boxShadow = 'none';
                      }}
                    >
                      <span className="shrink-0">{cfg.icon}</span>
                      <span className="flex-1">{cfg.label}</span>
                      <ExternalLink className="w-3 h-3 opacity-30 group-hover:opacity-70 transition-opacity" />
                    </a>
                  );
                })}
              </div>
            </GlassCard>
          )}
        </div>

        {/* Right 2-col */}
        <div className="md:col-span-2 space-y-5">

          <GlassCard>
            <SectionHeader icon={<User className="w-3.5 h-3.5" />} title="About" />
            {user.bio ? (
              <p className="text-sm leading-[1.85] whitespace-pre-wrap" style={{ color: '#cbd5e1' }}>
                {user.bio}
              </p>
            ) : (
              <div
                className="rounded-xl p-6 text-center"
                style={{ background: 'rgba(255,255,255,0.02)', border: '1px dashed rgba(255,255,255,0.07)' }}
              >
                <Sparkles className="w-6 h-6 mx-auto mb-2 opacity-30" style={{ color: '#22d3ee' }} />
                <p className="text-sm italic" style={{ color: '#475569' }}>
                  This intern hasn&apos;t added a bio yet.
                </p>
              </div>
            )}
          </GlassCard>

          {user.skills && user.skills.length > 0 && (
            <GlassCard>
              <SectionHeader icon={<Code2 className="w-3.5 h-3.5" />} title="Skills & Technologies" />
              <div className="flex flex-wrap gap-2">
                {user.skills.map((skill: string, i: number) => {
                  const p = SKILL_PALETTES[i % SKILL_PALETTES.length];
                  return (
                    <span
                      key={skill}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold cursor-default select-none transition-all duration-200 hover:scale-105 hover:-translate-y-px"
                      style={{ background: p.bg, border: `1px solid ${p.border}`, color: p.text }}
                    >
                      <span className="w-1.5 h-1.5 rounded-full shrink-0" style={{ background: p.text, opacity: 0.8 }} />
                      {skill}
                    </span>
                  );
                })}
              </div>
            </GlassCard>
          )}

          {(profile?.start_date || profile?.end_date) && (
            <GlassCard>
              <SectionHeader icon={<Briefcase className="w-3.5 h-3.5" />} title="Internship Details" />
              <div className="grid grid-cols-2 gap-4">
                {profile?.start_date && (
                  <div className="rounded-xl p-4"
                    style={{ background: 'rgba(34,211,238,0.04)', border: '1px solid rgba(34,211,238,0.1)' }}>
                    <p className="text-[10px] font-bold uppercase tracking-widest mb-1" style={{ color: '#475569' }}>Start Date</p>
                    <p className="text-sm font-semibold" style={{ color: '#e2e8f0' }}>{profile.start_date}</p>
                  </div>
                )}
                {profile?.end_date && (
                  <div className="rounded-xl p-4"
                    style={{ background: 'rgba(139,92,246,0.04)', border: '1px solid rgba(139,92,246,0.1)' }}>
                    <p className="text-[10px] font-bold uppercase tracking-widest mb-1" style={{ color: '#475569' }}>End Date</p>
                    <p className="text-sm font-semibold" style={{ color: '#e2e8f0' }}>{profile.end_date}</p>
                  </div>
                )}
              </div>
            </GlassCard>
          )}
        </div>
      </div>
    </div>
  );
}
