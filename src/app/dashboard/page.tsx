'use client';

import React, { useEffect, useState } from 'react';
import { PageHeader } from '@/components/ui/PageHeader';
import { FileText, Bell, Users, Loader2, MessageSquare, Shield, FolderGit2, CheckCircle2, Upload, Trash2, Download, Lock } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import type { PlatformUser, InternProfile, StaffProfile, CompanyProject } from '@/lib/firestore-schema';
import { toast } from 'sonner';

const QuickLinkCard = ({ href, icon: Icon, title, desc, color }: { href: string; icon: any; title: string; desc: string; color: string }) => (
  <Link
    href={href}
    className="p-6 rounded-xl border block transition-all duration-300 hover:-translate-y-1 hover:shadow-lg group"
    style={{ background: 'rgba(17,24,39,0.5)', borderColor: 'rgba(255,255,255,0.08)' }}
  >
    <div className="w-12 h-12 rounded-xl flex items-center justify-center mb-4 transition-transform group-hover:scale-110" style={{ background: `${color}18` }}>
      <Icon className="w-6 h-6" style={{ color }} />
    </div>
    <h3 className="text-lg font-semibold text-white mb-1">{title}</h3>
    <p className="text-sm text-gray-400">{desc}</p>
  </Link>
);

const StatPill = ({ label, value, color }: { label: string; value: string | number; color: string }) => (
  <div className="flex flex-col items-center justify-center p-4 rounded-xl border" style={{ background: 'rgba(17,24,39,0.4)', borderColor: 'rgba(255,255,255,0.06)' }}>
    <span className="text-2xl font-bold" style={{ color }}>{value}</span>
    <span className="text-xs text-gray-500 mt-1">{label}</span>
  </div>
);

export default function UserDashboardPage() {
  const router = useRouter();
  const [user, setUser] = useState<PlatformUser | null>(null);
  const [internProfile, setInternProfile] = useState<InternProfile | null>(null);
  const [staffProfile, setStaffProfile] = useState<StaffProfile | null>(null);
  const [loading, setLoading] = useState(true);

  // Staff projects state
  const [projects, setProjects] = useState<CompanyProject[]>([]);
  const [uploading, setUploading] = useState(false);
  const [fetchingProjects, setFetchingProjects] = useState(false);

  useEffect(() => {
    fetch('/api/profile')
      .then(r => (r.ok ? r.json() : null))
      .then(d => { 
        if (!d) return;
        if (d.user?.role === 'intern' || d.user?.role === 'user') {
          router.replace('/intern/dashboard');
          return;
        }
        if (d.user) setUser(d.user);
        if (d.internProfile) setInternProfile(d.internProfile);
        if (d.staffProfile) setStaffProfile(d.staffProfile);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [router]);

  useEffect(() => {
    if (user?.role === 'staff' && staffProfile?.department === 'Support + Marketing') {
      setFetchingProjects(true);
      fetch('/api/staff-projects')
        .then(r => (r.ok ? r.json() : null))
        .then(d => {
          if (d?.projects) setProjects(d.projects);
        })
        .catch(console.error)
        .finally(() => setFetchingProjects(false));
    }
  }, [user, staffProfile]);

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 10 * 1024 * 1024) {
      toast.error('File size must be less than 10MB.');
      return;
    }

    setUploading(true);
    try {
      const fd = new FormData();
      fd.append('file', file);
      
      const res = await fetch('/api/staff-projects', { method: 'POST', body: fd });
      const json = await res.json().catch(() => ({}));
      
      if (!res.ok) throw new Error(json.error || 'Failed to upload');
      
      toast.success('Project uploaded successfully!');
      setProjects([json.project, ...projects]);
    } catch (err: any) {
      toast.error(err.message);
    } finally {
      setUploading(false);
    }
  };

  const handleDeleteProject = async (id: string) => {
    if (!confirm('Are you sure you want to delete this project?')) return;
    
    try {
      const res = await fetch(`/api/staff-projects/${id}`, { method: 'DELETE' });
      if (!res.ok) throw new Error('Failed to delete');
      
      toast.success('Project deleted');
      setProjects(projects.filter(p => p.id !== id));
    } catch (err: any) {
      toast.error(err.message);
    }
  };

  const greeting = () => {
    const h = new Date().getHours();
    if (h < 12) return 'Good morning';
    if (h < 18) return 'Good afternoon';
    return 'Good evening';
  };

  return (
    <div>
      <PageHeader
        title={loading ? 'Dashboard' : `${greeting()}, ${user?.full_name?.split(' ')[0] ?? 'Welcome'}!`}
        description="Here's what's happening on the SAMStack platform."
      />

      {/* Quick Stats */}
      {!loading && user && (
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
          <StatPill label="Role" value={user.role.charAt(0).toUpperCase() + user.role.slice(1)} color="#22d3ee" />
          <StatPill label="Status" value={user.status.charAt(0).toUpperCase() + user.status.slice(1)} color="#10b981" />
          <StatPill label="Member Since" value={new Date(user.created_at).toLocaleDateString('en-US', { month: 'short', year: 'numeric' })} color="#a78bfa" />
          <StatPill label="Skills" value={user.skills?.length ?? 0} color="#fbbf24" />
        </div>
      )}

      {loading && (
        <div className="flex items-center justify-center py-12 mb-8">
          <Loader2 className="w-6 h-6 animate-spin text-cyan-400" />
        </div>
      )}

      {/* Quick Nav */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <QuickLinkCard href="/interns"       icon={Users}          title="Directory"      desc="Browse public profiles."             color="#22d3ee" />
        <QuickLinkCard href="/profile"       icon={FileText}       title="My Profile"     desc="Update your professional details."   color="#10b981" />
        <QuickLinkCard href="/notifications" icon={Bell}           title="Notifications"  desc="Check your latest updates."         color="#f59e0b" />
      </div>

      {/* Profile completion nudge */}
      {!loading && user && (!user.bio || !user.avatar_url) && (
        <div className="p-5 rounded-xl border border-amber-500/20 bg-amber-500/5 flex items-start gap-4 mb-8">
          <Shield className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
          <div>
            <p className="text-sm font-semibold text-amber-300">Complete your profile</p>
            <p className="text-xs text-amber-400/70 mt-0.5">Add a bio, profile photo, skills and social links to unlock your mini-projects.</p>
            <Link href="/profile/edit" className="inline-block mt-2 text-xs font-bold text-amber-400 hover:text-amber-300 underline underline-offset-2">
              Edit Profile →
            </Link>
          </div>
        </div>
      )}

      {/* My Documents (Only for Interns) */}
      {!loading && user?.role === 'intern' && internProfile && (
        <div className="mt-8 mb-8">
          <div className="flex items-center gap-2 mb-6">
            <FileText className="w-6 h-6 text-brand-400" />
            <h2 className="text-xl font-bold text-white">My Documents</h2>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Offer Letter */}
            <div className="p-5 rounded-xl border border-white/10 bg-white/5 flex flex-col justify-between">
              <div>
                <div className="flex justify-between items-start mb-3">
                  <h3 className="font-semibold text-white text-lg">Offer Letter</h3>
                  <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-green-500/20 text-green-400 border border-green-500/20">Available</span>
                </div>
                <p className="text-sm text-gray-400 mb-6">Your official SAMStack Tech internship offer letter containing your track details.</p>
              </div>
              <a 
                href="/api/user/documents/offer-letter"
                target="_blank"
                rel="noopener noreferrer"
                className="w-full py-2.5 rounded-lg text-sm font-medium bg-brand-500 hover:bg-brand-400 text-gray-900 transition-colors flex items-center justify-center gap-2"
              >
                <Download className="w-4 h-4" />
                Download Offer Letter
              </a>
            </div>

            {/* Certificate */}
            <div className="p-5 rounded-xl border border-white/10 bg-white/5 flex flex-col justify-between">
              <div>
                <div className="flex justify-between items-start mb-3">
                  <h3 className="font-semibold text-white text-lg">Internship Certificate</h3>
                  {internProfile.roll_number ? (
                    <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-green-500/20 text-green-400 border border-green-500/20">Available</span>
                  ) : (
                    <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-gray-500/20 text-gray-400 border border-gray-500/20">Locked</span>
                  )}
                </div>
                <p className="text-sm text-gray-400 mb-6">
                  {internProfile.roll_number 
                    ? "Your official internship completion certificate with your unique roll number."
                    : "This document will be unlocked once your internship is approved and certified by the administration."}
                </p>
              </div>
              {internProfile.roll_number ? (
                <a 
                  href="/api/user/documents/certificate"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full py-2.5 rounded-lg text-sm font-medium bg-brand-500 hover:bg-brand-400 text-gray-900 transition-colors flex items-center justify-center gap-2"
                >
                  <Download className="w-4 h-4" />
                  Download Certificate
                </a>
              ) : (
                <button 
                  disabled
                  className="w-full py-2.5 rounded-lg text-sm font-medium bg-white/5 text-gray-500 cursor-not-allowed flex items-center justify-center gap-2 border border-white/5"
                >
                  <Lock className="w-4 h-4" />
                  Certificate Locked
                </button>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Mini Projects (Only for Interns with Complete Profiles) */}
      {!loading && user?.role === 'intern' && user.bio && user.avatar_url && internProfile && (
        <div className="mt-8">
          <div className="flex items-center gap-2 mb-6">
            <FolderGit2 className="w-6 h-6 text-brand-400" />
            <h2 className="text-xl font-bold text-white">Your Mini Projects</h2>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Project 1 */}
            <div className="p-5 rounded-xl border border-white/10 bg-white/5 hover:bg-white/10 transition-colors">
              <div className="flex justify-between items-start mb-3">
                <h3 className="font-semibold text-white">Project Alpha</h3>
                <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-amber-500/20 text-amber-400 border border-amber-500/20">Pending</span>
              </div>
              <p className="text-sm text-gray-400 mb-4 line-clamp-2">Build the foundational UI components and basic routing for a standard web application.</p>
              <button className="w-full py-2 rounded-lg text-sm font-medium bg-brand-500/10 text-brand-400 hover:bg-brand-500/20 transition-colors border border-brand-500/20">
                View Requirements
              </button>
            </div>

            {/* Project 2 */}
            <div className="p-5 rounded-xl border border-white/10 bg-white/5 hover:bg-white/10 transition-colors">
              <div className="flex justify-between items-start mb-3">
                <h3 className="font-semibold text-white">Project Beta</h3>
                <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-amber-500/20 text-amber-400 border border-amber-500/20">Pending</span>
              </div>
              <p className="text-sm text-gray-400 mb-4 line-clamp-2">Integrate external APIs and handle data fetching, state management, and loading states.</p>
              <button className="w-full py-2 rounded-lg text-sm font-medium bg-brand-500/10 text-brand-400 hover:bg-brand-500/20 transition-colors border border-brand-500/20">
                View Requirements
              </button>
            </div>

            {/* Project 3 */}
            <div className="p-5 rounded-xl border border-white/10 bg-white/5 hover:bg-white/10 transition-colors">
              <div className="flex justify-between items-start mb-3">
                <h3 className="font-semibold text-white">Project Gamma</h3>
                <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-gray-500/20 text-gray-400 border border-gray-500/20">Locked</span>
              </div>
              <p className="text-sm text-gray-400 mb-4 line-clamp-2">Implement full authentication, database integration, and deploy the application to production.</p>
              <button disabled className="w-full py-2 rounded-lg text-sm font-medium bg-white/5 text-gray-500 cursor-not-allowed">
                Complete previous first
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Support & Marketing Staff Projects Section */}
      {!loading && user?.role === 'staff' && staffProfile?.department === 'Support + Marketing' && (
        <div className="mt-12 mb-8">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-2">
              <FolderGit2 className="w-6 h-6 text-emerald-400" />
              <h2 className="text-xl font-bold text-white">Project Submissions</h2>
            </div>
            
            <label className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold bg-emerald-500/10 text-emerald-400 hover:bg-emerald-500/20 transition-colors border border-emerald-500/20 cursor-pointer disabled:opacity-50">
              {uploading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Upload className="w-4 h-4" />}
              {uploading ? 'Uploading...' : 'Upload Project'}
              <input type="file" className="hidden" onChange={handleFileUpload} disabled={uploading} />
            </label>
          </div>

          <div className="bg-gray-900/50 rounded-xl border border-white/10 overflow-hidden">
            {fetchingProjects ? (
              <div className="p-8 flex justify-center"><Loader2 className="w-6 h-6 animate-spin text-emerald-400" /></div>
            ) : projects.length === 0 ? (
              <div className="p-12 text-center">
                <FolderGit2 className="w-12 h-12 text-gray-600 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-white">No projects yet</h3>
                <p className="text-gray-400 text-sm mt-1">Upload your first project file above.</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left text-sm whitespace-nowrap">
                  <thead className="bg-white/5 border-b border-white/10 text-gray-400">
                    <tr>
                      <th className="px-6 py-4 font-medium">File Name</th>
                      <th className="px-6 py-4 font-medium">Size</th>
                      <th className="px-6 py-4 font-medium">Uploaded Date</th>
                      <th className="px-6 py-4 font-medium text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/5">
                    {projects.map((proj) => (
                      <tr key={proj.id} className="hover:bg-white/5 transition-colors group">
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-3">
                            <FileText className="w-5 h-5 text-gray-500" />
                            <span className="font-medium text-gray-200">{proj.file_name}</span>
                          </div>
                        </td>
                        <td className="px-6 py-4 text-gray-400">{(proj.file_size / 1024 / 1024).toFixed(2)} MB</td>
                        <td className="px-6 py-4 text-gray-400">{new Date(proj.created_at).toLocaleDateString()}</td>
                        <td className="px-6 py-4 text-right">
                          <div className="flex justify-end gap-2">
                            <a 
                              href={proj.file_url} 
                              target="_blank" 
                              rel="noopener noreferrer"
                              className="p-2 rounded-lg bg-white/5 text-gray-300 hover:text-white hover:bg-white/10 transition-colors"
                              title="Download"
                            >
                              <Download className="w-4 h-4" />
                            </a>
                            <button
                              onClick={() => handleDeleteProject(proj.id)}
                              className="p-2 rounded-lg bg-red-500/10 text-red-400 hover:bg-red-500/20 transition-colors"
                              title="Delete"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
