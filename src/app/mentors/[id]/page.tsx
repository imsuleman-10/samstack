'use client';

import React, { useEffect, useState } from 'react';
import { PageHeader } from '@/components/ui/PageHeader';
import { UserAvatar } from '@/components/ui/UserAvatar';
import { Loader2, Mail, MapPin, Briefcase, Star, Globe } from 'lucide-react';
import Link from 'next/link';
import { RoleBadge } from '@/components/ui/RoleBadge';

export default function MentorProfilePage({ params }: { params: Promise<{ id: string }> }) {
  const [id, setId] = useState<string | null>(null);
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    params.then(p => setId(p.id));
  }, [params]);

  useEffect(() => {
    async function fetchProfile() {
      if (!id) return;
      try {
        const res = await fetch(`/api/mentors/${id}`);
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
    }
    fetchProfile();
  }, [id]);

  if (loading) return <div className="p-12 text-center text-gray-500"><Loader2 className="w-8 h-8 animate-spin mx-auto" /></div>;
  if (error || !data) return <div className="p-12 text-center text-red-500">{error || 'Profile not found'}</div>;

  const { user, profile } = data;

  return (
    <div className="max-w-4xl mx-auto pb-12">
      <div className="mb-6 flex items-center gap-2 text-sm">
        <Link href="/mentors" className="text-gray-500 hover:text-white transition-colors">Mentor Directory</Link>
        <span className="text-gray-600">/</span>
        <span className="text-gray-300">{user.full_name}</span>
      </div>

      <div className="rounded-2xl border overflow-hidden" style={{ background: 'rgba(17,24,39,0.5)', borderColor: 'rgba(255,255,255,0.08)' }}>
        {/* Cover / Header Area */}
        <div className="h-32 md:h-48 w-full" style={{ background: 'linear-gradient(135deg, rgba(167,139,250,0.2), rgba(139,92,246,0.2))' }} />
        
        <div className="px-6 md:px-10 pb-8 relative">
          <div className="flex flex-col md:flex-row md:items-end gap-6 -mt-16 md:-mt-20 mb-6">
            <UserAvatar 
              src={user.avatar_url} 
              name={user.full_name} 
              size="xl" 
              className="w-32 h-32 md:w-40 md:h-40 border-4 border-[var(--bg-surface,#0f1423)] bg-[var(--bg-surface,#0f1423)] shadow-xl" 
            />
            <div className="flex-1 min-w-0 pb-2">
              <div className="flex flex-wrap items-center gap-3 mb-2">
                <h1 className="text-2xl md:text-3xl font-bold text-white truncate">{user.full_name}</h1>
                <RoleBadge role={user.role} />
              </div>
              <p className="text-gray-400 text-base">{profile?.designation || 'Mentor'}</p>
            </div>
            
            <div className="flex gap-3 pb-2 w-full md:w-auto shrink-0">
              {user.email && (
                <a 
                  href={`mailto:${user.email}`}
                  className="flex-1 md:flex-none px-6 py-2.5 rounded-lg text-sm font-semibold bg-white/10 hover:bg-white/20 text-white transition-colors flex items-center justify-center gap-2"
                >
                  <Mail className="w-4 h-4" />
                  Contact
                </a>
              )}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-10">
            {/* Left Column */}
            <div className="space-y-6">
              <div>
                <h3 className="text-sm font-medium text-gray-500 mb-4 uppercase tracking-wider">Details</h3>
                <div className="space-y-4">
                  {user.city && (
                    <div className="flex items-start gap-3 text-gray-300">
                      <MapPin className="w-5 h-5 text-gray-500 shrink-0" />
                      <span className="text-sm">{user.city}{user.country ? `, ${user.country}` : ''}</span>
                    </div>
                  )}
                  {profile?.department && (
                    <div className="flex items-start gap-3 text-gray-300">
                      <Briefcase className="w-5 h-5 text-gray-500 shrink-0" />
                      <span className="text-sm">{profile.department}</span>
                    </div>
                  )}
                  {profile?.experience && (
                    <div className="flex items-start gap-3 text-gray-300">
                      <Star className="w-5 h-5 text-gray-500 shrink-0" />
                      <span className="text-sm">{profile.experience} Experience</span>
                    </div>
                  )}
                </div>
              </div>

              {user.social_links && Object.keys(user.social_links).length > 0 && (
                <div className="pt-6 border-t border-white/5">
                  <h3 className="text-sm font-medium text-gray-500 mb-4 uppercase tracking-wider">Links</h3>
                  <div className="flex flex-col gap-3">
                    {user.social_links.linkedin && (
                      <a href={user.social_links.linkedin} target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 text-sm text-gray-300 hover:text-purple-400 transition-colors">
                        <Globe className="w-4 h-4 text-gray-500" /> LinkedIn
                      </a>
                    )}
                    {user.social_links.github && (
                      <a href={user.social_links.github} target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 text-sm text-gray-300 hover:text-purple-400 transition-colors">
                        <Globe className="w-4 h-4 text-gray-500" /> GitHub
                      </a>
                    )}
                    {user.social_links.portfolio && (
                      <a href={user.social_links.portfolio} target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 text-sm text-gray-300 hover:text-purple-400 transition-colors">
                        <Globe className="w-4 h-4 text-gray-500" /> Portfolio
                      </a>
                    )}
                    {user.social_links.twitter && (
                      <a href={user.social_links.twitter} target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 text-sm text-gray-300 hover:text-purple-400 transition-colors">
                        <Globe className="w-4 h-4 text-gray-500" /> Twitter
                      </a>
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* Right Column */}
            <div className="md:col-span-2 space-y-8">
              <div>
                <h3 className="text-sm font-medium text-gray-500 mb-4 uppercase tracking-wider">About</h3>
                <p className="text-sm text-gray-300 leading-relaxed whitespace-pre-wrap">
                  {user.bio || profile?.bio || 'This mentor hasn\'t added a bio yet.'}
                </p>
              </div>

              {user.skills && user.skills.length > 0 && (
                <div>
                  <h3 className="text-sm font-medium text-gray-500 mb-4 uppercase tracking-wider">Expertise</h3>
                  <div className="flex flex-wrap gap-2">
                    {user.skills.map((skill: string) => (
                      <span key={skill} className="px-3 py-1.5 rounded-lg bg-purple-500/10 text-purple-400 text-xs font-medium border border-purple-500/20">
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
