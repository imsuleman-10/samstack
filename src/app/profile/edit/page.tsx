'use client';

import React, { useEffect, useRef, useState } from 'react';
import { PageHeader } from '@/components/ui/PageHeader';
import { UserAvatar } from '@/components/ui/UserAvatar';
import { Loader2, Camera, X, Plus, FileText, Upload, KeyRound, Eye, EyeOff } from 'lucide-react';
import { toast } from 'sonner';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import type { PlatformUser, InternProfile, MentorProfile } from '@/lib/firestore-schema';
import { compressImage, blobToFile } from '@/lib/compressImage';
import { tracks } from '@/lib/curriculum';

const Field = ({ label, children }: { label: string; children: React.ReactNode }) => (
  <div>
    <label className="block text-sm font-medium text-gray-400 mb-1.5">{label}</label>
    {children}
  </div>
);

export default function ProfileEditPage() {
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const resumeInputRef = useRef<HTMLInputElement>(null);

  const [data, setData] = useState<{ user: PlatformUser; internProfile?: InternProfile | null; mentorProfile?: MentorProfile | null } | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploadingAvatar, setUploadingAvatar] = useState(false);
  const [uploadingResume, setUploadingResume] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const [form, setForm] = useState<any>({});
  const [internForm, setInternForm] = useState<any>({});
  const [mentorForm, setMentorForm] = useState<any>({});
  const [skillInput, setSkillInput] = useState('');

  // Password change state
  const [pwForm, setPwForm] = useState({ newPassword: '', confirmPassword: '' });
  const [showPw, setShowPw] = useState(false);
  const [changingPw, setChangingPw] = useState(false);

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
        setForm({
          full_name: json.user.full_name || '',
          bio: json.user.bio || '',
          phone: json.user.phone || '',
          city: json.user.city || '',
          country: json.user.country || '',
          region: json.user.region || '',
          language: json.user.language || '',
          gender: json.user.gender || '',
          age: json.user.age ?? '',
          skills: json.user.skills || [],
          visibility: json.user.visibility || 'organization',
          social_links: json.user.social_links || {},
        });
        if (json.internProfile) {
          setInternForm({
            university: json.internProfile.university || '',
            high_education: json.internProfile.high_education || '',
            current_education: json.internProfile.current_education || '',
            degree: json.internProfile.degree || '',
            semester: json.internProfile.semester || '',
            cgpa: json.internProfile.cgpa || '',
            department: json.internProfile.department || '',
            position: json.internProfile.position || '',
            roll_number: json.internProfile.roll_number || '',
            track_selected: json.internProfile.track_selected || '',
            resume_url: json.internProfile.resume_url || '',
          });
        }
        if (json.mentorProfile) {
          setMentorForm({
            department: json.mentorProfile.department || '',
            designation: json.mentorProfile.designation || '',
            experience: json.mentorProfile.experience || '',
          });
        }
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }
    fetchProfile();
  }, []);

  const handleAvatarUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    let file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 5 * 1024 * 1024) {
      toast.error('Image size must be less than 5MB.');
      return;
    }

    setUploadingAvatar(true);
    try {
      if (file.size > 150 * 1024) {
        toast.info('Compressing image...');
        const compressedBlob = await compressImage(file, { targetKB: 100 });
        file = blobToFile(compressedBlob, file.name);
      }

      const fd = new FormData();
      fd.append('avatar', file);
      const res = await fetch('/api/upload/avatar', { method: 'POST', body: fd });
      const json = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(json.error || 'Upload failed');
      setData(prev => prev ? { ...prev, user: { ...prev.user, avatar_url: json.avatar_url } } : null);
      toast.success('Profile photo updated successfully.');
    } catch (err: any) {
      setError(err.message);
      toast.error(err.message);
    } finally {
      setUploadingAvatar(false);
    }
  };

  const handleResumeUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadingResume(true);
    try {
      const fd = new FormData();
      fd.append('resume', file);
      const res = await fetch('/api/upload/resume', { method: 'POST', body: fd });
      const json = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(json.error || 'Upload failed');
      
      setInternForm((prev: any) => ({ ...prev, resume_url: json.resume_url }));
      setData(prev => prev ? { ...prev, internProfile: { ...prev.internProfile!, resume_url: json.resume_url } } : null);
      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setUploadingResume(false);
    }
  };

  const addSkill = () => {
    const trimmed = skillInput.trim();
    if (!trimmed || form.skills.includes(trimmed)) { setSkillInput(''); return; }
    setForm((f: any) => ({ ...f, skills: [...f.skills, trimmed] }));
    setSkillInput('');
  };

  const removeSkill = (skill: string) => {
    setForm((f: any) => ({ ...f, skills: f.skills.filter((s: string) => s !== skill) }));
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError('');

    try {
      const payload: any = { ...form };
      if (data?.user.role === 'intern' || data?.user.role === 'user') payload.internProfile = internForm;
      if (data?.user.role === 'mentor') payload.mentorProfile = mentorForm;

      const res = await fetch('/api/profile', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      const json = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(json.error || 'Failed to save');

      setSuccess(true);
      setTimeout(() => router.push('/profile'), 1200);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  };

  const inputClass = "w-full h-10 px-3 rounded-lg text-sm text-white bg-white/5 border border-white/10 outline-none focus:border-cyan-500/50 transition-colors";

  if (loading) return <div className="p-12 text-center text-gray-500"><Loader2 className="w-8 h-8 animate-spin mx-auto" /></div>;
  if (!data) return <div className="p-12 text-center text-red-500">{error || 'Failed to load profile'}</div>;

  return (
    <div className="max-w-3xl">
      <PageHeader
        title="Edit Profile"
        breadcrumbs={[{ label: 'Profile', href: '/profile' }, { label: 'Edit' }]}
      />

      {success && (
        <div className="mb-6 p-4 rounded-lg bg-green-500/10 border border-green-500/20 text-green-400 text-sm font-medium">
          ✓ Profile saved! Redirecting…
        </div>
      )}
      {error && (
        <div className="mb-6 p-4 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 text-sm">
          {error}
        </div>
      )}

      <form onSubmit={handleSave} className="space-y-8">
        {/* Avatar */}
        <div className="p-6 rounded-xl border" style={{ background: 'rgba(17,24,39,0.5)', borderColor: 'rgba(255,255,255,0.08)' }}>
          <h2 className="text-base font-semibold text-white mb-4">Profile Photo</h2>
          <div className="flex items-center gap-6">
            <div className="relative">
              <UserAvatar src={data.user.avatar_url} name={data.user.full_name} size="xl" />
              {uploadingAvatar && (
                <div className="absolute inset-0 flex items-center justify-center bg-black/60 rounded-full">
                  <Loader2 className="w-6 h-6 text-white animate-spin" />
                </div>
              )}
            </div>
            <div>
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                disabled={uploadingAvatar}
                className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium bg-white/10 hover:bg-white/15 text-white transition-colors disabled:opacity-50"
              >
                <Camera className="w-4 h-4" />
                Change Photo
              </button>
              <p className="text-xs text-gray-500 mt-1.5">JPEG, PNG or WebP · Max 5MB</p>
              <input ref={fileInputRef} type="file" accept="image/*" className="hidden" onChange={handleAvatarUpload} />
            </div>
          </div>
        </div>

        {/* Basic Info */}
        <div className="p-6 rounded-xl border" style={{ background: 'rgba(17,24,39,0.5)', borderColor: 'rgba(255,255,255,0.08)' }}>
          <h2 className="text-base font-semibold text-white mb-6">Basic Information</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <Field label="Full Name">
              <input type="text" value={form.full_name} onChange={e => setForm({ ...form, full_name: e.target.value })} className={inputClass} />
            </Field>
            <Field label="Phone">
              <input type="tel" value={form.phone} onChange={e => setForm({ ...form, phone: e.target.value })} className={inputClass} />
            </Field>
            <Field label="Gender">
              <select value={form.gender} onChange={e => setForm({ ...form, gender: e.target.value })} className={inputClass}>
                <option value="" className="bg-gray-900">Select Gender</option>
                <option value="Male" className="bg-gray-900">Male</option>
                <option value="Female" className="bg-gray-900">Female</option>
                <option value="Other" className="bg-gray-900">Other</option>
                <option value="Prefer not to say" className="bg-gray-900">Prefer not to say</option>
              </select>
            </Field>
            <Field label="Age">
              <input
                type="number"
                min="14"
                max="100"
                value={form.age}
                onChange={e => setForm({ ...form, age: e.target.value })}
                className={inputClass}
                placeholder="e.g. 21"
              />
            </Field>
            <Field label="City">
              <input type="text" value={form.city} onChange={e => setForm({ ...form, city: e.target.value })} className={inputClass} />
            </Field>
            <Field label="Country">
              <input type="text" value={form.country} onChange={e => setForm({ ...form, country: e.target.value })} className={inputClass} />
            </Field>
            <Field label="Region / State">
              <input type="text" value={form.region} onChange={e => setForm({ ...form, region: e.target.value })} className={inputClass} placeholder="e.g. Punjab, California" />
            </Field>
            <Field label="Primary Language">
              <input type="text" value={form.language} onChange={e => setForm({ ...form, language: e.target.value })} className={inputClass} placeholder="e.g. English, Urdu" />
            </Field>
            <div className="sm:col-span-2">
              <Field label="Bio">
                <textarea
                  value={form.bio}
                  onChange={e => setForm({ ...form, bio: e.target.value })}
                  rows={4}
                  className="w-full p-3 rounded-lg text-sm text-white bg-white/5 border border-white/10 outline-none focus:border-cyan-500/50 transition-colors resize-none"
                />
              </Field>
            </div>
            <Field label="Profile Visibility">
              <select value={form.visibility} onChange={e => setForm({ ...form, visibility: e.target.value })} className={inputClass}>
                <option value="public" className="bg-gray-900">Public</option>
                <option value="organization" className="bg-gray-900">Organization Only</option>
                <option value="private" className="bg-gray-900">Private</option>
              </select>
            </Field>
          </div>
        </div>

        {/* Skills */}
        <div className="p-6 rounded-xl border" style={{ background: 'rgba(17,24,39,0.5)', borderColor: 'rgba(255,255,255,0.08)' }}>
          <h2 className="text-base font-semibold text-white mb-4">Skills</h2>
          <div className="flex flex-wrap gap-2 mb-3">
            {form.skills.map((skill: string) => (
              <span key={skill} className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-cyan-500/10 text-cyan-400 text-xs font-medium border border-cyan-500/20">
                {skill}
                <button type="button" onClick={() => removeSkill(skill)} className="hover:text-white transition-colors"><X className="w-3 h-3" /></button>
              </span>
            ))}
          </div>
          <div className="flex gap-2">
            <input
              type="text"
              value={skillInput}
              onChange={e => setSkillInput(e.target.value)}
              onKeyDown={e => { if (e.key === 'Enter') { e.preventDefault(); addSkill(); } }}
              placeholder="Add a skill..."
              className="flex-1 h-9 px-3 rounded-lg text-sm text-white bg-white/5 border border-white/10 outline-none focus:border-cyan-500/50 transition-colors"
            />
            <button type="button" onClick={addSkill} className="h-9 px-3 rounded-lg text-cyan-400 bg-cyan-500/10 hover:bg-cyan-500/20 transition-colors flex items-center gap-1 text-sm font-medium">
              <Plus className="w-4 h-4" /> Add
            </button>
          </div>
        </div>

        {/* Social Links */}
        <div className="p-6 rounded-xl border" style={{ background: 'rgba(17,24,39,0.5)', borderColor: 'rgba(255,255,255,0.08)' }}>
          <h2 className="text-base font-semibold text-white mb-6">Social Links</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <Field label="LinkedIn URL">
              <input type="url" value={form.social_links.linkedin || ''} onChange={e => setForm({ ...form, social_links: { ...form.social_links, linkedin: e.target.value } })} className={inputClass} placeholder="https://linkedin.com/in/..." />
            </Field>
            <Field label="GitHub URL">
              <input type="url" value={form.social_links.github || ''} onChange={e => setForm({ ...form, social_links: { ...form.social_links, github: e.target.value } })} className={inputClass} placeholder="https://github.com/..." />
            </Field>
            <Field label="Portfolio URL">
              <input type="url" value={form.social_links.portfolio || ''} onChange={e => setForm({ ...form, social_links: { ...form.social_links, portfolio: e.target.value } })} className={inputClass} placeholder="https://yoursite.com" />
            </Field>
            <Field label="Twitter/X URL">
              <input type="url" value={form.social_links.twitter || ''} onChange={e => setForm({ ...form, social_links: { ...form.social_links, twitter: e.target.value } })} className={inputClass} placeholder="https://x.com/..." />
            </Field>
          </div>
        </div>

        {/* Intern-specific */}
        {(data.user.role === 'intern' || data.user.role === 'user') && (
          <div className="p-6 rounded-xl border" style={{ background: 'rgba(17,24,39,0.5)', borderColor: 'rgba(255,255,255,0.08)' }}>
            <h2 className="text-base font-semibold text-white mb-6">Internship Details</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <div className="sm:col-span-2">
                <Field label="Internship Track / Specialization">
                  <select
                    value={internForm.track_selected}
                    onChange={e => setInternForm({ ...internForm, track_selected: e.target.value })}
                    className={inputClass}
                  >
                    <option value="" className="bg-gray-900">Select Track</option>
                    {Object.values(tracks).map(t => (
                      <option key={t.id} value={t.id} className="bg-gray-900">{t.title}</option>
                    ))}
                  </select>
                </Field>
              </div>
              <Field label="College / University"><input type="text" value={internForm.university} onChange={e => setInternForm({ ...internForm, university: e.target.value })} className={inputClass} placeholder="e.g. Stanford, FAST NUCES" /></Field>
              <Field label="High Education"><input type="text" value={internForm.high_education} onChange={e => setInternForm({ ...internForm, high_education: e.target.value })} className={inputClass} placeholder="e.g. A Levels, FSC" /></Field>
              <Field label="Current Education"><input type="text" value={internForm.current_education} onChange={e => setInternForm({ ...internForm, current_education: e.target.value })} className={inputClass} placeholder="e.g. BSCS, BBA" /></Field>
              <Field label="Degree / Program"><input type="text" value={internForm.degree} onChange={e => setInternForm({ ...internForm, degree: e.target.value })} className={inputClass} placeholder="e.g. BS Computer Science" /></Field>
              <Field label="Semester / Year"><input type="text" value={internForm.semester} onChange={e => setInternForm({ ...internForm, semester: e.target.value })} className={inputClass} placeholder="e.g. 5th Semester" /></Field>
              <Field label="CGPA"><input type="text" value={internForm.cgpa} onChange={e => setInternForm({ ...internForm, cgpa: e.target.value })} className={inputClass} placeholder="e.g. 3.65" /></Field>
              <Field label="Department"><input type="text" value={internForm.department} onChange={e => setInternForm({ ...internForm, department: e.target.value })} className={inputClass} placeholder="e.g. Computer Science & Software Engineering" /></Field>
              <Field label="Roll Number"><input type="text" value={internForm.roll_number} onChange={e => setInternForm({ ...internForm, roll_number: e.target.value })} className={inputClass} placeholder="Assigned Roll Number" /></Field>
            </div>

            {/* Resume Upload (Interns Only) */}
            <div className="mt-6 pt-6 border-t border-white/5">
              <h3 className="text-md font-medium text-white mb-4">Resume / CV</h3>
              
              <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center">
                {internForm.resume_url ? (
                  <a 
                    href={internForm.resume_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm font-medium bg-blue-500/10 text-blue-400 hover:bg-blue-500/20 border border-blue-500/20 transition-colors"
                  >
                    <FileText className="w-4 h-4" />
                    View Current Resume
                  </a>
                ) : (
                  <div className="text-sm text-gray-500 italic px-2 py-2">
                    No resume uploaded yet.
                  </div>
                )}
                
                <div className="flex-1" />
                
                <input
                  type="file"
                  ref={resumeInputRef}
                  onChange={handleResumeUpload}
                  accept="application/pdf"
                  className="hidden"
                />
                
                <button
                  type="button"
                  onClick={() => resumeInputRef.current?.click()}
                  disabled={uploadingResume}
                  className="flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm font-medium bg-white/10 text-white hover:bg-white/20 transition-colors disabled:opacity-50"
                >
                  {uploadingResume ? <Loader2 className="w-4 h-4 animate-spin" /> : <Upload className="w-4 h-4" />}
                  {internForm.resume_url ? 'Replace Resume (PDF)' : 'Upload Resume (PDF)'}
                </button>
              </div>
              <p className="text-xs text-gray-500 mt-3">Upload a PDF format of your resume. Maximum file size 5MB.</p>
            </div>
          </div>
        )}

        {/* Mentor-specific */}
        {data.user.role === 'mentor' && (
          <div className="p-6 rounded-xl border" style={{ background: 'rgba(17,24,39,0.5)', borderColor: 'rgba(255,255,255,0.08)' }}>
            <h2 className="text-base font-semibold text-white mb-6">Professional Details</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <Field label="Department"><input type="text" value={mentorForm.department} onChange={e => setMentorForm({ ...mentorForm, department: e.target.value })} className={inputClass} /></Field>
              <Field label="Designation"><input type="text" value={mentorForm.designation} onChange={e => setMentorForm({ ...mentorForm, designation: e.target.value })} className={inputClass} /></Field>
              <Field label="Years of Experience"><input type="text" value={mentorForm.experience} onChange={e => setMentorForm({ ...mentorForm, experience: e.target.value })} className={inputClass} /></Field>
            </div>
          </div>
        )}

        <div className="flex gap-4 pb-4">
          <Link href="/profile" className="px-5 py-2.5 rounded-lg text-sm font-medium text-gray-300 border border-white/10 hover:bg-white/5 transition-colors">
            Cancel
          </Link>
          <button
            type="submit"
            disabled={saving}
            className="px-8 py-2.5 rounded-lg text-sm font-semibold flex items-center gap-2 text-white disabled:opacity-50 transition-all"
            style={{ background: 'linear-gradient(135deg,#0ea5e9,#6366f1)', boxShadow: '0 4px 16px rgba(14,165,233,0.3)' }}
          >
            {saving && <Loader2 className="w-4 h-4 animate-spin" />}
            Save Changes
          </button>
        </div>
      </form>

      {/* ── Change Password ───────────────────────────────────── */}
      <div className="mt-2 mb-8 p-6 rounded-xl border" style={{ background: 'rgba(17,24,39,0.5)', borderColor: 'rgba(255,255,255,0.08)' }}>
        <div className="flex items-center gap-2 mb-5">
          <KeyRound className="w-5 h-5 text-amber-400" />
          <h2 className="text-lg font-semibold text-white">Change Password</h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          <div>
            <label className="block text-sm text-gray-400 mb-1.5">New Password</label>
            <div className="relative">
              <input
                type={showPw ? 'text' : 'password'}
                value={pwForm.newPassword}
                onChange={e => setPwForm({ ...pwForm, newPassword: e.target.value })}
                placeholder="Min 8 characters"
                className="w-full h-10 px-3 pr-10 rounded-lg text-sm text-white bg-white/5 border border-white/10 outline-none focus:border-amber-400/50 transition-colors"
              />
              <button type="button" onClick={() => setShowPw(!showPw)} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-300">
                {showPw ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>
          <div>
            <label className="block text-sm text-gray-400 mb-1.5">Confirm Password</label>
            <input
              type={showPw ? 'text' : 'password'}
              value={pwForm.confirmPassword}
              onChange={e => setPwForm({ ...pwForm, confirmPassword: e.target.value })}
              placeholder="Repeat password"
              className="w-full h-10 px-3 rounded-lg text-sm text-white bg-white/5 border border-white/10 outline-none focus:border-amber-400/50 transition-colors"
            />
          </div>
        </div>
        <button
          type="button"
          disabled={changingPw || !pwForm.newPassword}
          onClick={async () => {
            if (pwForm.newPassword.length < 8) { toast.error('Password must be at least 8 characters'); return; }
            if (pwForm.newPassword !== pwForm.confirmPassword) { toast.error('Passwords do not match'); return; }
            setChangingPw(true);
            try {
              const res = await fetch('/api/auth/change-password', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ newPassword: pwForm.newPassword }),
              });
              const d = await res.json().catch(() => ({}));
              if (!res.ok) throw new Error(d.error || 'Failed to change password');
              toast.success('Password changed successfully!');
              setPwForm({ newPassword: '', confirmPassword: '' });
            } catch (err: any) {
              toast.error(err.message || 'Failed to change password');
            } finally {
              setChangingPw(false);
            }
          }}
          className="px-6 py-2.5 rounded-lg text-sm font-semibold flex items-center gap-2 text-white disabled:opacity-50 transition-all"
          style={{ background: 'linear-gradient(135deg,#f59e0b,#d97706)', boxShadow: '0 4px 16px rgba(245,158,11,0.2)' }}
        >
          {changingPw ? <Loader2 className="w-4 h-4 animate-spin" /> : <KeyRound className="w-4 h-4" />}
          {changingPw ? 'Updating...' : 'Update Password'}
        </button>
      </div>
    </div>
  );
}
