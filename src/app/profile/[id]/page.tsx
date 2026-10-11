"use client";

import React, { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { motion } from "framer-motion";
import {
  User, MapPin, GraduationCap, Globe, Link as LinkIcon,
  ShieldCheck, LayoutDashboard, CalendarDays, Code, ArrowLeft, Loader2
} from "lucide-react";
import { InstagramIcon } from "@/components/ui/InstagramIcon";
import Link from "next/link";
import Image from "next/image";

export default function ProfilePage() {
  const params = useParams();
  const router = useRouter();
  const id = params.id as string;

  const [profile, setProfile] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!id) return;
    const fetchProfile = async () => {
      try {
        const res = await fetch(`/api/profile/${id}`);
        if (!res.ok) throw new Error("Profile not found");
        const data = await res.json();
        setProfile(data.profile);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-black">
        <Loader2 className="w-8 h-8 text-cyan-500 animate-spin" />
      </div>
    );
  }

  if (error || !profile) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-slate-50 dark:bg-black p-4 text-center">
        <div className="w-20 h-20 rounded-full bg-rose-100 dark:bg-rose-900/30 flex items-center justify-center mb-6">
          <User className="w-10 h-10 text-rose-500" />
        </div>
        <h1 className="text-2xl font-extrabold text-slate-900 dark:text-white mb-2">Profile Not Found</h1>
        <p className="text-slate-500 dark:text-slate-400 mb-8 max-w-sm">The user you are looking for does not exist or their profile is private.</p>
        <button onClick={() => router.back()} className="px-6 py-3 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white font-bold transition-all shadow-lg shadow-cyan-500/25 flex items-center gap-2">
          <ArrowLeft className="w-4 h-4" /> Go Back
        </button>
      </div>
    );
  }

  const isMentor = profile.role === "mentor" || profile.role === "admin" || profile.role === "staff";
  const isIntern = profile.role === "intern";

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-black pb-24 relative overflow-hidden font-sans">
      
      {/* Background Orbs */}
      <div className="absolute top-0 inset-x-0 h-96 bg-gradient-to-b from-cyan-500/10 to-transparent pointer-events-none" />
      <div className="absolute top-[-10%] right-[-5%] w-[500px] h-[500px] rounded-full bg-cyan-500/10 blur-[120px] pointer-events-none" />
      <div className="absolute top-[20%] left-[-10%] w-[400px] h-[400px] rounded-full bg-blue-600/10 blur-[100px] pointer-events-none" />

      {/* Navigation */}
      <nav className="fixed top-0 w-full z-50 bg-white/70 dark:bg-black/70 backdrop-blur-xl border-b border-slate-200/50 dark:border-white/10">
        <div className="max-w-4xl mx-auto px-6 h-16 flex items-center justify-between">
          <button onClick={() => router.back()} className="flex items-center gap-2 text-sm font-bold text-slate-600 dark:text-slate-300 hover:text-cyan-600 dark:hover:text-cyan-400 transition-colors">
            <ArrowLeft className="w-4 h-4" /> Back
          </button>
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center shadow-lg shadow-cyan-500/30">
              <Code className="w-4 h-4 text-white" />
            </div>
            <span className="font-extrabold text-slate-900 dark:text-white tracking-tight">SAMStack</span>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="max-w-4xl mx-auto px-4 sm:px-6 pt-32 relative z-10">
        
        {/* Header Profile Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white/80 dark:bg-neutral-900/80 backdrop-blur-xl border border-slate-200 dark:border-neutral-800 rounded-3xl p-8 sm:p-12 shadow-xl shadow-slate-200/50 dark:shadow-none mb-6 relative overflow-hidden"
        >
          {/* Subtle gradient line on top */}
          <div className="absolute top-0 inset-x-0 h-1.5 bg-gradient-to-r from-cyan-500 via-blue-500 to-purple-500" />
          
          <div className="flex flex-col sm:flex-row items-center sm:items-start gap-8">
            
            {/* Avatar */}
            <div className="relative shrink-0 group">
              <div className="absolute inset-0 bg-gradient-to-br from-cyan-500 to-blue-600 rounded-3xl blur-lg opacity-40 group-hover:opacity-60 transition-opacity" />
              <div className="w-32 h-32 sm:w-40 sm:h-40 relative rounded-3xl overflow-hidden border-4 border-white dark:border-neutral-800 shadow-xl bg-slate-100 dark:bg-neutral-950 flex items-center justify-center z-10">
                {profile.avatar ? (
                  <img src={profile.avatar} alt={profile.name} className="w-full h-full object-cover" />
                ) : (
                  <User className="w-16 h-16 text-slate-300 dark:text-neutral-700" />
                )}
              </div>
              
              {isMentor && (
                <div className="absolute -bottom-3 -right-3 bg-gradient-to-r from-amber-500 to-orange-500 text-white p-2.5 rounded-xl shadow-lg border-2 border-white dark:border-neutral-900 z-20 tooltip" title="Verified Staff">
                  <ShieldCheck className="w-5 h-5" />
                </div>
              )}
            </div>

            {/* Basic Info */}
            <div className="flex-1 text-center sm:text-left mt-2">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-100 dark:bg-cyan-900/30 text-cyan-800 dark:text-cyan-300 text-xs font-bold uppercase tracking-widest mb-4">
                {isMentor ? "Staff / Mentor" : "Engineering Intern"}
              </div>
              
              <h1 className="text-3xl sm:text-4xl font-black text-slate-900 dark:text-white tracking-tight mb-2">
                {profile.name}
              </h1>
              
              {isIntern && profile.track && (
                <p className="text-lg text-slate-600 dark:text-slate-400 font-medium mb-6">
                  {profile.track} Specialization
                </p>
              )}

              {isMentor && profile.tracks && profile.tracks.length > 0 && (
                <div className="mb-6">
                  <p className="text-xs font-bold text-slate-500 dark:text-slate-500 uppercase tracking-widest mb-2">Mentoring Tracks</p>
                  <div className="flex flex-wrap gap-2 justify-center sm:justify-start">
                    {profile.tracks.map((t: string) => (
                      <span key={t} className="px-3 py-1 bg-slate-100 dark:bg-neutral-800 border border-slate-200 dark:border-neutral-700 rounded-lg text-xs font-bold text-slate-700 dark:text-slate-300">
                        {t}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Social Links */}
              <div className="flex items-center justify-center sm:justify-start gap-4">
                {profile.instagram && (
                  <a href={profile.instagram.startsWith("http") ? profile.instagram : `https://${profile.instagram}`} target="_blank" rel="noreferrer" className="w-10 h-10 rounded-xl bg-slate-100 dark:bg-neutral-800 flex items-center justify-center text-slate-600 dark:text-slate-400 hover:bg-pink-600 hover:text-white transition-all" title="Instagram">
                    <InstagramIcon className="w-5 h-5" />
                  </a>
                )}
                {profile.linkedin && (
                  <a href={profile.linkedin.startsWith("http") ? profile.linkedin : `https://${profile.linkedin}`} target="_blank" rel="noreferrer" className="w-10 h-10 rounded-xl bg-slate-100 dark:bg-neutral-800 flex items-center justify-center text-slate-600 dark:text-slate-400 hover:bg-[#0A66C2] hover:text-white transition-all" title="LinkedIn">
                    <LinkIcon className="w-5 h-5" />
                  </a>
                )}
                {profile.github && (
                  <a href={profile.github.startsWith("http") ? profile.github : `https://${profile.github}`} target="_blank" rel="noreferrer" className="w-10 h-10 rounded-xl bg-slate-100 dark:bg-neutral-800 flex items-center justify-center text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-neutral-700 hover:text-slate-900 dark:hover:text-white transition-all" title="GitHub">
                    <Globe className="w-5 h-5" />
                  </a>
                )}
              </div>

            </div>
          </div>
        </motion.div>

        {/* Detailed Info Grid */}
        {isIntern && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6"
          >
            {/* Academic Info */}
            <div className="bg-white/60 dark:bg-neutral-900/60 backdrop-blur-md border border-slate-200 dark:border-neutral-800 rounded-3xl p-6 sm:p-8">
              <div className="w-10 h-10 rounded-xl bg-indigo-100 dark:bg-indigo-900/30 flex items-center justify-center mb-5">
                <GraduationCap className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
              </div>
              <h3 className="text-sm font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest mb-1">Academic Background</h3>
              <p className="text-lg font-bold text-slate-900 dark:text-white mb-2">{profile.university || "University not provided"}</p>
              <p className="text-sm text-slate-600 dark:text-slate-400">{profile.degree || "Degree not specified"}</p>
            </div>

            {/* Program Info */}
            <div className="bg-white/60 dark:bg-neutral-900/60 backdrop-blur-md border border-slate-200 dark:border-neutral-800 rounded-3xl p-6 sm:p-8">
              <div className="w-10 h-10 rounded-xl bg-emerald-100 dark:bg-emerald-900/30 flex items-center justify-center mb-5">
                <LayoutDashboard className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
              </div>
              <h3 className="text-sm font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest mb-1">Roll Number</h3>
              <p className="text-xl font-black text-slate-900 dark:text-white font-mono tracking-wider mb-2">
                {profile.rollNumber || "PENDING"}
              </p>
              <div className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-400">
                <CalendarDays className="w-4 h-4" /> 
                Joined {profile.joinedAt ? new Date(profile.joinedAt).toLocaleDateString("en-US", { month: "short", year: "numeric" }) : "Recently"}
              </div>
            </div>
            
            {/* Location (if any) */}
            {profile.city && (
              <div className="bg-white/60 dark:bg-neutral-900/60 backdrop-blur-md border border-slate-200 dark:border-neutral-800 rounded-3xl p-6 sm:p-8 sm:col-span-2 flex items-center gap-4">
                <div className="w-10 h-10 rounded-xl bg-rose-100 dark:bg-rose-900/30 flex items-center justify-center shrink-0">
                  <MapPin className="w-5 h-5 text-rose-600 dark:text-rose-400" />
                </div>
                <div>
                  <h3 className="text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest mb-1">Location</h3>
                  <p className="text-base font-bold text-slate-900 dark:text-white">{profile.city}</p>
                </div>
              </div>
            )}
          </motion.div>
        )}
        
      </main>
    </div>
  );
}
