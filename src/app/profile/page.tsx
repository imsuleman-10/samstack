'use client';

import React, { useEffect, useState } from 'react';
import { PageHeader } from '@/components/ui/PageHeader';
import { UserAvatar } from '@/components/ui/UserAvatar';
import { RoleBadge } from '@/components/ui/RoleBadge';
import { StatusBadge } from '@/components/ui/StatusBadge';
import { ProfileCompletion } from '@/components/ui/ProfileCompletion';
import { Loader2, Edit3, Globe, MapPin, Briefcase, GraduationCap } from 'lucide-react';
import Link from 'next/link';
import type { PlatformUser, InternProfile, MentorProfile } from '@/lib/firestore-schema';
import { getTrackTitle } from '@/lib/curriculum';

function calcCompletionFields(user: PlatformUser, intern?: InternProfile | null, mentor?: MentorProfile | null) {
  const fields = [
    { label: 'Full Name', done: !!user.full_name },
    { label: 'Age', done: !!(user.age || user.date_of_birth) },
    { label: 'Gender', done: !!user.gender },
    { label: 'Bio', done: !!user.bio },
    { label: 'City', done: !!user.city },
    { label: 'Skills', done: (user.skills?.length ?? 0) > 0 },
    { label: 'Social Links', done: !!user.social_links?.linkedin || !!user.social_links?.github },
    { label: 'Phone', done: !!user.phone },
    { label: 'Avatar', done: !!user.avatar_url },
  ];

  if ((user.role === 'intern' || user.role === 'user') && intern) {
    fields.push(
      { label: 'Track Selected', done: !!intern.track_selected },
      { label: 'University', done: !!intern.university },
      { label: 'Department', done: !!intern.department },
      { label: 'Semester', done: !!intern.semester },
    );
  }

  if (user.role === 'mentor' && mentor) {
    fields.push(
      { label: 'Department', done: !!mentor.department },
      { label: 'Designation', done: !!mentor.designation },
    );
  }

  return fields;
}

export default function ProfilePage() {
  const [data, setData] = useState<{ user: PlatformUser; internProfile?: InternProfile | null; mentorProfile?: MentorProfile | null } | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    async function fetchProfile() {
      try {
        const res = await fetch('/api/profile');
        if (!res.ok) {
          const errJson = await res.json().catch(() => null);
          throw new Error(errJson?.error || `Failed to load profile (${res.status})`);
        }
        const json = await res.json();
        setData({ user: json.user, internProfile: json.internProfile, mentorProfile: json.mentorProfile });
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }
    fetchProfile();
  }, []);

  if (loading) return <div className="p-12 text-center text-gray-500"><Loader2 className="w-8 h-8 animate-spin mx-auto" /></div>;
  if (error || !data) return <div className="p-12 text-center text-red-500">{error || 'Failed to load profile'}</div>;

  const { user, internProfile, mentorProfile } = data;
  const completionFields = calcCompletionFields(user, internProfile, mentorProfile);
  const roleProfile = internProfile || mentorProfile;

  return (
    <div>
      <PageHeader
        title="My Profile"
        description="Your professional profile as seen by the organization."
        action={
          <Link
            href="/profile/edit"
            className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold text-white bg-cyan-600 hover:bg-cyan-500 transition-colors"
          >
            <Edit3 className="w-4 h-4" />
            Edit Profile
          </Link>
        }
      />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left: Identity */}
        <div className="space-y-6">
          <div className="p-6 rounded-xl border flex flex-col items-center text-center" style={{ background: 'rgba(17,24,39,0.5)', borderColor: 'rgba(255,255,255,0.08)' }}>
            <UserAvatar src={user.avatar_url} name={user.full_name} size="xl" className="mb-4" />
            <h2 className="text-xl font-bold text-white">{user.full_name}</h2>
            <p className="text-gray-400 text-sm mb-3">{user.email}</p>
            <div className="flex gap-2 flex-wrap justify-center">
              <RoleBadge role={user.role} />
              <StatusBadge status={user.status} />
            </div>

            {/* Social links */}
            {user.social_links && (
              <div className="flex gap-3 mt-4">
                {user.social_links.linkedin && (
                  <a href={user.social_links.linkedin} target="_blank" rel="noreferrer" className="text-gray-500 hover:text-blue-400 transition-colors">
                    <Globe className="w-5 h-5" />
                  </a>
                )}
                {user.social_links.github && (
                  <a href={user.social_links.github} target="_blank" rel="noreferrer" className="text-gray-500 hover:text-white transition-colors">
                    <Globe className="w-5 h-5" />
                  </a>
                )}
                {user.social_links.twitter && (
                  <a href={user.social_links.twitter} target="_blank" rel="noreferrer" className="text-gray-500 hover:text-sky-400 transition-colors">
                    <Globe className="w-5 h-5" />
                  </a>
                )}
                {user.social_links.portfolio && (
                  <a href={user.social_links.portfolio} target="_blank" rel="noreferrer" className="text-gray-500 hover:text-cyan-400 transition-colors">
                    <Globe className="w-5 h-5" />
                  </a>
                )}
              </div>
            )}

            <div className="w-full mt-5 pt-5 border-t border-white/5 space-y-3 text-left">
              {user.gender && (
                <div className="flex items-center gap-2 text-sm text-gray-400">
                  <span className="text-gray-500 text-xs">Gender:</span>
                  <span className="text-gray-300 font-medium">{user.gender}</span>
                </div>
              )}
              {(user.age || user.date_of_birth) && (
                <div className="flex items-center gap-2 text-sm text-gray-400">
                  <span className="text-gray-500 text-xs">Age:</span>
                  <span className="text-gray-300 font-medium">{user.age || user.date_of_birth}</span>
                </div>
              )}
              {user.city && (
                <div className="flex items-center gap-2 text-sm text-gray-400">
                  <MapPin className="w-4 h-4 text-gray-600" />
                  {user.city}{user.country ? `, ${user.country}` : ''}
                </div>
              )}
              {user.phone && (
                <div className="flex items-center gap-2 text-sm text-gray-400">
                  <span className="text-gray-600 text-xs font-mono">📞</span>
                  {user.phone}
                </div>
              )}
            </div>
          </div>

          <ProfileCompletion fields={completionFields} />
        </div>

        {/* Right: Details */}
        <div className="lg:col-span-2 space-y-6">
          <div className="p-6 rounded-xl border" style={{ background: 'rgba(17,24,39,0.5)', borderColor: 'rgba(255,255,255,0.08)' }}>
            <h3 className="text-base font-semibold text-white mb-4 pb-3 border-b border-white/5">About</h3>
            <p className="text-sm text-gray-300 leading-relaxed whitespace-pre-wrap">
              {user.bio || 'No bio added yet. Click "Edit Profile" to add one.'}
            </p>
          </div>

          {user.skills && user.skills.length > 0 && (
            <div className="p-6 rounded-xl border" style={{ background: 'rgba(17,24,39,0.5)', borderColor: 'rgba(255,255,255,0.08)' }}>
              <h3 className="text-base font-semibold text-white mb-4 pb-3 border-b border-white/5">Skills</h3>
              <div className="flex flex-wrap gap-2">
                {user.skills.map((skill) => (
                  <span key={skill} className="px-3 py-1.5 rounded-lg bg-cyan-500/10 text-cyan-400 text-xs font-medium border border-cyan-500/20">
                    {skill}
                  </span>
                ))}
              </div>
            </div>
          )}

          {roleProfile && (
            <div className="p-6 rounded-xl border" style={{ background: 'rgba(17,24,39,0.5)', borderColor: 'rgba(255,255,255,0.08)' }}>
              <h3 className="text-base font-semibold text-white mb-4 pb-3 border-b border-white/5">
                {user.role === 'intern' || user.role === 'user' ? 'Internship Details' : 'Professional Details'}
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-4 gap-x-6">
                {(roleProfile as any).track_selected && (
                  <div className="sm:col-span-2 p-3 rounded-lg bg-cyan-500/5 border border-cyan-500/20">
                    <p className="text-xs text-cyan-400 font-semibold uppercase tracking-wider">Assigned Track</p>
                    <p className="text-base text-white font-bold mt-0.5">
                      {getTrackTitle((roleProfile as any).track_selected)}
                    </p>
                  </div>
                )}
                {(roleProfile as any).university && (
                  <div>
                    <p className="text-xs text-gray-500">University</p>
                    <p className="text-sm text-gray-300 mt-0.5 font-medium">{(roleProfile as any).university}</p>
                  </div>
                )}
                {(roleProfile as any).department && (
                  <div>
                    <p className="text-xs text-gray-500">Department</p>
                    <p className="text-sm text-gray-300 mt-0.5 font-medium">{(roleProfile as any).department}</p>
                  </div>
                )}
                {(roleProfile as any).semester && (
                  <div>
                    <p className="text-xs text-gray-500">Semester</p>
                    <p className="text-sm text-gray-300 mt-0.5 font-medium">{(roleProfile as any).semester}</p>
                  </div>
                )}
                {(roleProfile as any).degree && (
                  <div>
                    <p className="text-xs text-gray-500">Degree</p>
                    <p className="text-sm text-gray-300 mt-0.5 font-medium">{(roleProfile as any).degree}</p>
                  </div>
                )}
                {(roleProfile as any).cgpa && (
                  <div>
                    <p className="text-xs text-gray-500">CGPA</p>
                    <p className="text-sm text-gray-300 mt-0.5 font-medium">{(roleProfile as any).cgpa}</p>
                  </div>
                )}
                {(roleProfile as any).roll_number && (
                  <div>
                    <p className="text-xs text-gray-500">Roll Number</p>
                    <p className="text-sm text-cyan-400 font-mono mt-0.5">{(roleProfile as any).roll_number}</p>
                  </div>
                )}
                {(roleProfile as any).designation && (
                  <div>
                    <p className="text-xs text-gray-500">Designation</p>
                    <p className="text-sm text-gray-300 mt-0.5">{(roleProfile as any).designation}</p>
                  </div>
                )}
                {(roleProfile as any).experience && (
                  <div>
                    <p className="text-xs text-gray-500">Experience</p>
                    <p className="text-sm text-gray-300 mt-0.5">{(roleProfile as any).experience}</p>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
