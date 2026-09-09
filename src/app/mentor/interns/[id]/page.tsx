'use client';

import React, { useEffect, useState } from 'react';
import { PageHeader } from '@/components/ui/PageHeader';
import { UserAvatar } from '@/components/ui/UserAvatar';
import { Loader2, Mail, GraduationCap, MapPin, Calendar, Link as LinkIcon, CheckCircle2, XCircle, Clock, Sparkles } from 'lucide-react';
import Link from 'next/link';
import { toast } from 'sonner';

export default function MentorInternDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const [id, setId] = useState<string | null>(null);
  const [data, setData] = useState<any>(null);
  const [tasks, setTasks] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [tasksLoading, setTasksLoading] = useState(true);
  const [approving, setApproving] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    params.then(p => setId(p.id));
  }, [params]);

  useEffect(() => {
    async function fetchIntern() {
      if (!id) return;
      try {
        const res = await fetch(`/api/mentor/interns/${id}`);
        if (!res.ok) {
          const errData = await res.json().catch(() => ({}));
          throw new Error(errData.error || 'Failed to load intern details');
        }
        const json = await res.json();
        setData(json);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }
    
    async function fetchTasks() {
      if (!id) return;
      try {
        const res = await fetch(`/api/mentor/interns/${id}/tasks`);
        if (res.ok) {
          const json = await res.json();
          setTasks(json.tasks || []);
        }
      } catch (err) {
        console.error('Failed to fetch tasks', err);
      } finally {
        setTasksLoading(false);
      }
    }

    fetchIntern();
    fetchTasks();
  }, [id]);

  if (loading) return <div className="p-12 text-center text-gray-500"><Loader2 className="w-8 h-8 animate-spin mx-auto" /></div>;
  if (error || !data) return <div className="p-12 text-center text-red-500">{error || 'Intern not found'}</div>;

  const { intern, profile } = data;

  const handleApprove = async () => {
    if (!confirm(`Approve certificate for ${intern.full_name}? A unique certificate ID will be generated.`)) return;
    setApproving(true);
    try {
      const res = await fetch(`/api/mentor/interns/${id}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'approve_certificate' })
      });
      const d = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(d.error || 'Failed to approve');
      toast.success(`✓ Certificate approved for ${intern.full_name}`);
      setData((prev: any) => ({
        ...prev,
        profile: { ...prev.profile, certificate_status: 'approved', certificate_id: d.certificate_id || prev.profile?.certificate_id }
      }));
    } catch (err: any) {
      toast.error(err.message || 'Error approving certificate');
    } finally {
      setApproving(false);
    }
  };

  return (
    <div>
      <PageHeader
        title="Intern Details"
        breadcrumbs={[
          { label: 'My Interns', href: '/mentor/interns' },
          { label: intern.full_name },
        ]}
      />

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-1">
          <div className="p-6 rounded-xl border flex flex-col items-center text-center" style={{ background: 'rgba(17,24,39,0.5)', borderColor: 'rgba(255,255,255,0.08)' }}>
            <UserAvatar src={intern.avatar_url} name={intern.full_name} size="xl" className="mb-4" />
            <h2 className="text-xl font-bold text-white mb-1">{intern.full_name}</h2>
            <p className="text-sm text-gray-400 mb-4">{intern.email}</p>
            
            <a 
              href={`mailto:${intern.email}`}
              className="w-full py-2.5 rounded-lg text-sm font-semibold bg-white/10 hover:bg-white/20 text-white transition-colors flex items-center justify-center gap-2"
            >
              <Mail className="w-4 h-4" />
              Send Email
            </a>
            
            <Link 
              href={`/interns/${intern.id}`}
              className="w-full mt-3 py-2.5 rounded-lg text-sm font-semibold text-cyan-400 bg-cyan-500/10 hover:bg-cyan-500/20 transition-colors flex items-center justify-center"
            >
              View Public Profile
            </Link>

            {/* Certificate Status Panel */}
            {(() => {
              const cs = profile?.certificate_status;
              if (!cs) return null;
              if (cs === 'pending') return (
                <div className="w-full mt-3 rounded-xl overflow-hidden" style={{ border: '1px solid rgba(245,158,11,0.3)' }}>
                  <div className="px-4 py-3" style={{ background: 'rgba(245,158,11,0.08)' }}>
                    <div className="flex items-center gap-2 mb-2">
                      <Clock className="w-3.5 h-3.5 text-amber-400" />
                      <span className="text-xs font-bold text-amber-400 uppercase tracking-widest">Certificate Requested</span>
                    </div>
                    <p className="text-xs text-gray-400 mb-3">This intern has requested their certificate. Review and approve when ready.</p>
                    <button
                      onClick={handleApprove}
                      disabled={approving}
                      className="w-full py-2.5 rounded-lg text-sm font-bold text-white flex items-center justify-center gap-2 disabled:opacity-50 transition-all"
                      style={{ background: 'linear-gradient(135deg, #10b981, #059669)' }}
                    >
                      {approving ? <Loader2 className="w-4 h-4 animate-spin" /> : <CheckCircle2 className="w-4 h-4" />}
                      {approving ? 'Approving...' : 'Approve Certificate'}
                    </button>
                  </div>
                </div>
              );
              if (cs === 'approved' || cs === 'issued') return (
                <div className="w-full mt-3 p-3 rounded-xl" style={{ background: 'rgba(16,185,129,0.06)', border: '1px solid rgba(16,185,129,0.2)' }}>
                  <div className="flex items-center gap-2 mb-1">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                    <span className="text-xs font-bold text-emerald-400 uppercase tracking-widest">Certificate Approved</span>
                  </div>
                  {profile?.certificate_id && (
                    <div className="flex items-center gap-1.5 mt-2">
                      <Sparkles className="w-3 h-3 text-emerald-500" />
                      <span className="text-xs font-mono font-black text-emerald-300 select-all tracking-wider">{profile.certificate_id}</span>
                    </div>
                  )}
                </div>
              );
              return null;
            })()}
          </div>
        </div>

        <div className="md:col-span-2 space-y-6">
          <div className="p-6 rounded-xl border" style={{ background: 'rgba(17,24,39,0.5)', borderColor: 'rgba(255,255,255,0.08)' }}>
            <h3 className="text-lg font-semibold text-white mb-4 border-b border-white/5 pb-2">Internship Details</h3>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
              <div className="flex items-center gap-3 text-gray-300">
                <GraduationCap className="w-5 h-5 text-gray-500" />
                <div>
                  <p className="text-xs text-gray-500">Department</p>
                  <p className="text-sm">{profile?.department || 'Not specified'}</p>
                </div>
              </div>
              <div className="flex items-center gap-3 text-gray-300">
                <Calendar className="w-5 h-5 text-gray-500" />
                <div>
                  <p className="text-xs text-gray-500">Semester / Year</p>
                  <p className="text-sm">{profile?.semester || 'Not specified'}</p>
                </div>
              </div>
              <div className="flex items-center gap-3 text-gray-300">
                <MapPin className="w-5 h-5 text-gray-500" />
                <div>
                  <p className="text-xs text-gray-500">Location</p>
                  <p className="text-sm">{intern.city ? `${intern.city}, ${intern.country}` : 'Not specified'}</p>
                </div>
              </div>
            </div>

            <div>
              <p className="text-sm text-gray-500 mb-1">About</p>
              <p className="text-sm text-gray-300 leading-relaxed whitespace-pre-wrap">
                {intern.bio || 'This intern hasn\'t added a bio yet.'}
              </p>
            </div>

            {intern.skills && intern.skills.length > 0 && (
              <div className="mt-6">
                <p className="text-sm text-gray-500 mb-2">Skills & Technologies</p>
                <div className="flex flex-wrap gap-2">
                  {intern.skills.map((skill: string) => (
                    <span key={skill} className="px-2.5 py-1 rounded bg-white/5 text-gray-300 text-xs font-medium border border-white/10">
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>

          <div className="p-6 rounded-xl border" style={{ background: 'rgba(17,24,39,0.5)', borderColor: 'rgba(255,255,255,0.08)' }}>
            <h3 className="text-lg font-semibold text-white mb-4 border-b border-white/5 pb-2">Submitted Work</h3>
            
            {tasksLoading ? (
              <div className="py-8 text-center text-gray-500"><Loader2 className="w-6 h-6 animate-spin mx-auto" /></div>
            ) : tasks.length === 0 ? (
              <div className="py-8 text-center text-gray-500">
                <p>No work submitted yet.</p>
              </div>
            ) : (
              <div className="space-y-4">
                {tasks.map(task => (
                  <div key={task.id} className="p-4 rounded-lg border bg-gray-900/30 flex flex-col sm:flex-row sm:items-center justify-between gap-4" style={{ borderColor: 'rgba(255,255,255,0.08)' }}>
                    <div>
                      <h4 className="text-white font-medium">{task.title || task.task_id}</h4>
                      <p className="text-xs text-gray-500 mt-1">Submitted on {new Date(task.updated_at).toLocaleDateString()}</p>
                    </div>
                    <div className="flex flex-col items-end gap-2 shrink-0">
                      <a 
                        href={task.submission_link} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="flex items-center gap-1.5 text-sm text-cyan-400 hover:text-cyan-300 transition-colors"
                      >
                        <LinkIcon className="w-4 h-4" /> View GitHub Repo
                      </a>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
