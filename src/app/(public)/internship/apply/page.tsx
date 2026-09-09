"use client";

import React, { useState, useEffect, Suspense } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import {
  ArrowLeft, CheckCircle2, User, Mail, Phone, Layers, ShieldCheck, Sparkles,
  AlertCircle, MapPin, FileText, GraduationCap, Globe, Send, Building2,
  Clock, Lock, ChevronDown, ChevronUp, Eye, EyeOff, X, KeyRound,
} from "lucide-react";
import { tracks } from "@/lib/curriculum";
import { createUserWithEmailAndPassword, signInWithEmailAndPassword, signInWithPopup, GoogleAuthProvider } from "firebase/auth";
import { auth } from "@/lib/firebase";

const inputClass = "w-full px-4 py-3 text-sm rounded-xl bg-white dark:bg-neutral-900 border border-slate-200 dark:border-neutral-700 text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-neutral-500 focus:outline-none focus:border-brand-500 focus:ring-2 focus:ring-brand-500/20 transition-all duration-200 font-medium";
const labelClass = "block text-[10px] font-bold uppercase tracking-widest text-slate-500 dark:text-slate-400 mb-1.5";

const TRACKS = [
  { id: "PYTHON", label: "Python Development", color: "bg-yellow-500" },
  { id: "UI_UX", label: "UI/UX Design", color: "bg-pink-500" },
  { id: "CPP", label: "C++ Engineering", color: "bg-blue-500" },
  { id: "WEB_DEV", label: "Web Development", color: "bg-emerald-500" },
  { id: "REACT", label: "React Development", color: "bg-cyan-500" },
  { id: "NEXT_JS", label: "Next.js Development", color: "bg-indigo-500" },
  { id: "MERN", label: "MERN Stack", color: "bg-green-500" },
];

function ApplyForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const trackParam = searchParams.get("track");

  // Step management
  const [step, setStep] = useState<"APPLY" | "ACCOUNT" | "SUCCESS">("APPLY");

  // Personal Info
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [city, setCity] = useState("");
  const [gender, setGender] = useState("");

  // Education
  const [university, setUniversity] = useState("");
  const [degree, setDegree] = useState("");
  const [graduationYear, setGraduationYear] = useState("");
  const [cgpa, setCgpa] = useState("");

  // Online presence
  const [linkedIn, setLinkedIn] = useState("");
  const [portfolio, setPortfolio] = useState("");
  const [github, setGithub] = useState("");
  const [summary, setSummary] = useState("");

  // Track & Covenant
  const [selectedTrack, setSelectedTrack] = useState("PYTHON");
  const [covenantChecked, setCovenantChecked] = useState(false);

  // Account step
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [otp, setOtp] = useState("");
  const [showOtpInput, setShowOtpInput] = useState(false);

  // State
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [rollNumber, setRollNumber] = useState("");

  // Accordion
  const [openSection, setOpenSection] = useState<string | null>("personal");
  const toggle = (s: string) => setOpenSection((prev) => (prev === s ? null : s));

  useEffect(() => {
    if (trackParam && tracks[trackParam.toUpperCase()]) {
      setSelectedTrack(trackParam.toUpperCase());
    }
  }, [trackParam]);

  const validateStep1 = () => {
    if (!firstName.trim() || !lastName.trim()) return "Please enter your full name.";
    if (!phone.trim()) return "WhatsApp Number is required.";
    if (!email.trim() || !email.includes("@")) return "A valid email address is required.";
    if (!gender) return "Please select your gender.";
    if (!selectedTrack) return "Please select a specialization track.";
    if (!covenantChecked) return "You must accept the Honor Covenant.";
    return null;
  };

  const handleStep1Next = async (e: React.FormEvent) => {
    e.preventDefault();
    const err = validateStep1();
    if (err) { setError(err); return; }
    setError(null);
    setIsSubmitting(true);

    try {
      const emailAddr = email.trim().toLowerCase();
      const checkRes = await fetch(`/api/internship/check-email?email=${encodeURIComponent(emailAddr)}`);
      const checkData = await checkRes.json();
      if (checkData.exists) {
        setError(checkData.message || "An application has already been submitted using this email address. Multiple submissions are not allowed.");
        return;
      }
      setStep("ACCOUNT");
      window.scrollTo({ top: 0, behavior: "smooth" });
    } catch {
      // Fallback: advance to next step, backend /api/internship/apply will enforce duplicate check
      setStep("ACCOUNT");
      window.scrollTo({ top: 0, behavior: "smooth" });
    } finally {
      setIsSubmitting(false);
    }
  };

  const finalizeApplication = async (firebaseUid: string, idToken: string) => {
    const res = await fetch("/api/internship/apply", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        firstName, lastName, email, phone, gender,
        city, university, degree, graduationYear, cgpa,
        linkedIn, github, portfolio, summary,
        track: selectedTrack, covenantAccepted: covenantChecked,
        firebaseUid, firebaseToken: idToken,
      }),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || "Application failed.");
    return data;
  };

  const handleEmailSignup = async () => {
    if (!password || password.length < 6) { setError("Password must be at least 6 characters."); return; }
    if (password !== confirmPassword) { setError("Passwords do not match."); return; }
    setIsSubmitting(true);
    setError(null);
    try {
      const emailAddr = email.trim().toLowerCase();

      // Check if application already submitted with this email
      const checkRes = await fetch(`/api/internship/check-email?email=${encodeURIComponent(emailAddr)}`);
      const checkData = await checkRes.json();
      if (checkData.exists) {
        setError(checkData.message || "An application has already been submitted using this email address.");
        return;
      }

      // Step 1: Request OTP
      const res = await fetch("/api/auth/send-email-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: emailAddr }),
      });
      const data = await res.json();
      
      if (!res.ok) {
        throw new Error(data.error || "Failed to send OTP.");
      }
      
      setShowOtpInput(true);
    } catch (err: any) {
      console.error(err);
      setError(err.message || "Failed to send verification code. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const verifyOTPAndSignup = async () => {
    if (!otp || otp.length !== 6) { setError("Please enter the 6-digit code."); return; }
    setIsSubmitting(true);
    setError(null);
    try {
      const emailAddr = email.trim().toLowerCase();
      
      // Step 2: Verify OTP
      const otpRes = await fetch("/api/auth/verify-email-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: emailAddr, otp }),
      });
      const otpData = await otpRes.json();
      
      if (!otpRes.ok) {
        throw new Error(otpData.error || "Invalid OTP code.");
      }

      // Step 3: Create Firebase Account
      let firebaseUser;
      try {
        const cred = await createUserWithEmailAndPassword(auth, emailAddr, password);
        firebaseUser = cred.user;
      } catch (err: any) {
        if (err.code === "auth/email-already-in-use") {
          const cred = await signInWithEmailAndPassword(auth, emailAddr, password);
          firebaseUser = cred.user;
        } else {
          throw err;
        }
      }
      const idToken = await firebaseUser.getIdToken();
      const data = await finalizeApplication(firebaseUser.uid, idToken);
      setRollNumber(data.rollNumber);
      setStep("SUCCESS");
    } catch (err: any) {
      console.error(err);
      if (err.code === "auth/wrong-password" || err.code === "auth/invalid-credential") {
        setError("This email is already registered with a different password.");
      } else if (err.code === "auth/weak-password") {
        setError("Password must be at least 6 characters.");
      } else {
        setError(err.message || "Account creation failed. Please try again.");
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleGoogleSignup = async () => {
    setIsSubmitting(true);
    setError(null);
    try {
      const provider = new GoogleAuthProvider();
      const cred = await signInWithPopup(auth, provider);
      const googleEmail = cred.user.email || email;

      if (googleEmail) {
        const checkRes = await fetch(`/api/internship/check-email?email=${encodeURIComponent(googleEmail.trim().toLowerCase())}`);
        const checkData = await checkRes.json();
        if (checkData.exists) {
          setError(checkData.message || "An application with this email has already been submitted.");
          return;
        }
      }

      const idToken = await cred.user.getIdToken();
      const data = await finalizeApplication(cred.user.uid, idToken);
      setRollNumber(data.rollNumber);
      setStep("SUCCESS");
    } catch (err: any) {
      console.error(err);
      setError(err.message || "Google sign-in failed.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const selectedTrackInfo = tracks[selectedTrack] || tracks["PYTHON"];

  // ─────────────────────── SUCCESS SCREEN ───────────────────────
  if (step === "SUCCESS") {
    return (
      <div className="flex-1 min-h-screen bg-gradient-to-br from-slate-50 via-white to-cyan-50 dark:from-neutral-950 dark:via-neutral-900 dark:to-cyan-950/10 flex items-center justify-center px-4 py-20">
        <div className="w-full max-w-lg text-center space-y-8">
          <div className="w-24 h-24 rounded-2xl bg-gradient-to-br from-cyan-500 to-blue-500 flex items-center justify-center mx-auto shadow-2xl shadow-cyan-500/30">
            <CheckCircle2 className="w-12 h-12 text-white" />
          </div>
          <div className="space-y-3">
            <div className="text-cyan-600 dark:text-cyan-400 font-mono text-[10px] font-bold uppercase tracking-[0.25em]">
              Application Accepted ✓
            </div>
            <h1 className="text-4xl font-extrabold text-slate-900 dark:text-white">
              Welcome to SAMStack!
            </h1>
            <p className="text-slate-500 dark:text-slate-400 text-sm leading-relaxed max-w-sm mx-auto">
              Your account has been created and your application is registered.
              {email && <> Check <strong className="text-slate-700 dark:text-slate-200">{email}</strong> for your offer letter.</>}
            </p>
          </div>

          {rollNumber && (
            <div className="relative p-6 rounded-2xl bg-white dark:bg-neutral-900 border border-slate-100 dark:border-neutral-800 shadow-lg">
              <div className="absolute top-0 left-6 right-6 h-0.5 bg-gradient-to-r from-transparent via-cyan-500 to-transparent" />
              <div className="text-[10px] font-mono font-bold uppercase tracking-widest text-slate-400 dark:text-slate-500 mb-2">Your Roll Number</div>
              <div className="text-3xl font-extrabold font-mono text-slate-900 dark:text-white tracking-wider">{rollNumber}</div>
            </div>
          )}

          <button
            onClick={() => router.push("/dashboard")}
            className="w-full inline-flex items-center justify-center gap-2 px-8 py-4 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-500 text-white font-bold text-sm hover:from-cyan-400 hover:to-blue-400 transition-all shadow-xl shadow-cyan-500/25"
          >
            Go to My Dashboard <CheckCircle2 className="w-4 h-4" />
          </button>
        </div>
      </div>
    );
  }

  // ─────────────────────── ACCOUNT STEP ───────────────────────
  if (step === "ACCOUNT") {
    return (
      <div className="flex-1 min-h-screen bg-gradient-to-br from-slate-50 via-white to-cyan-50/30 dark:from-neutral-950 dark:via-neutral-900 dark:to-cyan-950/10 flex items-center justify-center px-4 py-24">
        <div className="w-full max-w-md space-y-6">
          <button
            onClick={() => { setStep("APPLY"); setError(null); }}
            className="flex items-center gap-1.5 text-xs font-bold text-slate-400 hover:text-slate-700 dark:hover:text-white transition-colors"
          >
            <ArrowLeft className="w-3.5 h-3.5" /> Back to Application
          </button>

          <div className="text-center">
            <div className="text-[10px] font-mono font-bold uppercase tracking-widest text-cyan-600 dark:text-cyan-400 mb-2">Step 2 of 2</div>
            <h1 className="text-3xl font-extrabold text-slate-900 dark:text-white">Create Your LMS Account</h1>
            <p className="text-slate-500 dark:text-slate-400 text-sm mt-2">
              Set a password for <span className="font-bold text-slate-700 dark:text-slate-300">{email}</span> or sign in with Google
            </p>
          </div>

          {error && (
            <div className="flex items-start gap-3 p-4 rounded-xl bg-rose-50 dark:bg-rose-950/30 border border-rose-200 dark:border-rose-800/40 text-rose-700 dark:text-rose-400 text-sm">
              <AlertCircle className="w-5 h-5 shrink-0 mt-0.5" />
              <span className="flex-1">{error}</span>
              <button onClick={() => setError(null)}><X className="w-4 h-4" /></button>
            </div>
          )}

          <div className="bg-white/90 dark:bg-neutral-900/70 backdrop-blur-xl border border-slate-200 dark:border-neutral-800 rounded-2xl p-6 shadow-xl shadow-slate-200/30 dark:shadow-black/20 space-y-5">
            <div className="space-y-4">
                {!showOtpInput ? (
                  <>
                    <div>
                      <label className={labelClass}>Password <span className="text-rose-500">*</span></label>
                      <div className="relative">
                        <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                        <input
                          type={showPassword ? "text" : "password"}
                          value={password}
                          onChange={(e) => setPassword(e.target.value)}
                          placeholder="Min 6 characters"
                          className={`${inputClass} pl-10 pr-10`}
                        />
                        <button
                          type="button"
                          onClick={() => setShowPassword(!showPassword)}
                          className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-700 dark:hover:text-white"
                        >
                          {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                        </button>
                      </div>
                    </div>
                    <div>
                      <label className={labelClass}>Confirm Password <span className="text-rose-500">*</span></label>
                      <div className="relative">
                        <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                        <input
                          type="password"
                          value={confirmPassword}
                          onChange={(e) => setConfirmPassword(e.target.value)}
                          placeholder="Re-enter password"
                          className={`${inputClass} pl-10`}
                        />
                      </div>
                    </div>
                  </>
                ) : (
                  <div>
                    <label className={labelClass}>Verification Code <span className="text-rose-500">*</span></label>
                    <p className="text-xs text-slate-500 mb-2">We sent a 6-digit code to <b>{email}</b></p>
                    <div className="relative">
                      <KeyRound className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                      <input
                        type="text"
                        maxLength={6}
                        value={otp}
                        onChange={(e) => setOtp(e.target.value)}
                        placeholder="Enter 6-digit code"
                        className={`${inputClass} pl-10 tracking-widest font-mono text-center text-lg`}
                      />
                    </div>
                  </div>
                )}
                {!showOtpInput ? (
                  <button
                    onClick={handleEmailSignup}
                    disabled={isSubmitting}
                    className="w-full py-4 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-400 hover:to-blue-400 text-white font-bold text-sm shadow-xl shadow-cyan-500/25 disabled:opacity-60 disabled:cursor-not-allowed transition-all flex items-center justify-center gap-2"
                  >
                    {isSubmitting ? (
                      <><span className="w-4 h-4 border-2 border-white/50 border-t-white rounded-full animate-spin" /> Sending Code...</>
                    ) : (
                      <><Send className="w-4 h-4" /> Request OTP</>
                    )}
                  </button>
                ) : (
                  <button
                    onClick={verifyOTPAndSignup}
                    disabled={isSubmitting}
                    className="w-full py-4 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-400 hover:to-blue-400 text-white font-bold text-sm shadow-xl shadow-cyan-500/25 disabled:opacity-60 disabled:cursor-not-allowed transition-all flex items-center justify-center gap-2"
                  >
                    {isSubmitting ? (
                      <><span className="w-4 h-4 border-2 border-white/50 border-t-white rounded-full animate-spin" /> Verifying & Creating...</>
                    ) : (
                      <><CheckCircle2 className="w-4 h-4" /> Verify Code & Submit</>
                    )}
                  </button>
                )}
              </div>
          </div>
        </div>
      </div>
    );
  }

  // ─────────────────────── MAIN APPLY FORM ───────────────────────
  return (
    <div className="flex-1 w-full bg-slate-50 dark:bg-neutral-950 text-slate-900 dark:text-white">
      {/* Sticky Header */}
      <header className="sticky top-0 z-50 bg-white/90 dark:bg-neutral-900/90 backdrop-blur-xl border-b border-slate-100 dark:border-neutral-800 shadow-sm">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-4 py-4">
            <Link href="/internship" className="flex items-center gap-1.5 text-xs font-bold text-slate-400 hover:text-slate-700 dark:hover:text-white transition-colors shrink-0">
              <ArrowLeft className="w-3.5 h-3.5" /> Back
            </Link>
            <div className="w-px h-5 bg-slate-200 dark:bg-neutral-700 shrink-0" />
            <div className="flex-1 min-w-0">
              <h1 className="text-sm font-extrabold text-slate-900 dark:text-white truncate">SAMStack Tech — Engineering Internship</h1>
            </div>
            <div className="flex items-center gap-3 shrink-0">
              <span className="hidden sm:inline-flex items-center gap-1 text-[10px] font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/40 px-2.5 py-1 rounded-full border border-emerald-100 dark:border-emerald-800/40">
                <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse" /> Step 1 of 2
              </span>
              <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-brand-50 dark:bg-brand-950/40 border border-brand-100 dark:border-brand-800/40 text-brand-700 dark:text-brand-400 text-[10px] font-bold">
                <Sparkles className="w-3 h-3" /> Free • Zero Cost
              </span>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 lg:py-12 flex flex-col lg:flex-row gap-8 lg:gap-12 items-start">

        {/* ─── LEFT: Sticky sidebar ─── */}
        <aside className="w-full lg:w-80 xl:w-96 shrink-0 lg:sticky lg:top-24 space-y-4">
          <div className="bg-white dark:bg-neutral-900 rounded-2xl border border-slate-100 dark:border-neutral-800 overflow-hidden shadow-sm">
            <div className="h-1 w-full bg-gradient-to-r from-brand-500 via-cyan-500 to-indigo-500" />
            <div className="p-6 space-y-5">
              <div>
                <div className="text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-1">Position</div>
                <div className="text-xl font-extrabold text-slate-900 dark:text-white leading-tight">{selectedTrackInfo?.title || "Internship"}</div>
                <div className="text-xs text-brand-600 dark:text-brand-400 font-bold mt-0.5">Engineering Internship</div>
              </div>
              <div className="space-y-2">
                {[
                  { icon: Globe, label: "Remote (Async)" },
                  { icon: Clock, label: "3–6 Months" },
                  { icon: Building2, label: "SAMStack Tech, Lahore" },
                  { icon: Layers, label: "7 Tracks Available" },
                ].map(({ icon: Icon, label }) => (
                  <div key={label} className="flex items-center gap-2.5 text-sm text-slate-600 dark:text-slate-400">
                    <Icon className="w-4 h-4 text-slate-400 dark:text-slate-500 shrink-0" />
                    <span>{label}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Track Selector */}
          <div className="bg-white dark:bg-neutral-900 rounded-2xl border border-slate-100 dark:border-neutral-800 p-5 shadow-sm">
            <div className="text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-3">Select Track <span className="text-rose-500">*</span></div>
            <div className="space-y-2">
              {TRACKS.map((t) => (
                <button
                  key={t.id}
                  type="button"
                  onClick={() => setSelectedTrack(t.id)}
                  className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-left text-sm font-bold transition-all border ${
                    selectedTrack === t.id
                      ? "border-brand-300 dark:border-brand-700 bg-brand-50 dark:bg-brand-950/30 text-brand-700 dark:text-brand-300"
                      : "border-transparent hover:bg-slate-50 dark:hover:bg-neutral-800 text-slate-700 dark:text-slate-300"
                  }`}
                >
                  <span className={`w-2 h-2 rounded-full shrink-0 ${t.color}`} />
                  {t.label}
                  {selectedTrack === t.id && <CheckCircle2 className="w-4 h-4 ml-auto text-brand-600 dark:text-brand-400" />}
                </button>
              ))}
            </div>
          </div>

          {/* Honor Covenant */}
          <div className="bg-amber-50 dark:bg-amber-950/20 rounded-2xl border border-amber-100 dark:border-amber-800/30 p-5 space-y-3">
            <div className="flex items-center gap-2 text-amber-700 dark:text-amber-400">
              <ShieldCheck className="w-4 h-4 shrink-0" />
              <span className="text-[10px] font-bold uppercase tracking-widest">Honor Covenant</span>
            </div>
            <p className="text-xs text-amber-800 dark:text-amber-300 leading-relaxed">
              All work must be original. Plagiarism results in immediate disqualification.
            </p>
            <label className="flex items-start gap-2.5 cursor-pointer">
              <input
                type="checkbox"
                checked={covenantChecked}
                onChange={(e) => setCovenantChecked(e.target.checked)}
                className="mt-0.5 w-4 h-4 accent-brand-500 rounded cursor-pointer shrink-0"
              />
              <span className="text-xs text-amber-800 dark:text-amber-300 font-medium select-none">
                I accept the SAMStack Engineering Honor Covenant
              </span>
            </label>
          </div>
        </aside>

        {/* ─── RIGHT: Form ─── */}
        <main className="flex-1 min-w-0 space-y-4">
          {error && (
            <div className="flex items-start gap-3 p-4 rounded-xl bg-rose-50 dark:bg-rose-950/30 border border-rose-200 dark:border-rose-800/40 text-rose-700 dark:text-rose-400 text-sm">
              <AlertCircle className="w-5 h-5 shrink-0 mt-0.5" />
              <span className="flex-1 font-medium">{error}</span>
              <button onClick={() => setError(null)}><X className="w-4 h-4" /></button>
            </div>
          )}

          <form onSubmit={handleStep1Next} className="space-y-4">
            {/* Personal Information */}
            <div className="bg-white dark:bg-neutral-900 rounded-2xl border border-slate-100 dark:border-neutral-800 overflow-hidden shadow-sm">
              <button type="button" onClick={() => toggle("personal")} className="w-full flex items-center justify-between p-6 hover:bg-slate-50 dark:hover:bg-neutral-800/50 transition-colors">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-xl bg-brand-50 dark:bg-brand-950/40 border border-brand-100 dark:border-brand-900/50 flex items-center justify-center">
                    <User className="w-4 h-4 text-brand-600 dark:text-brand-400" />
                  </div>
                  <div className="text-left">
                    <div className="text-sm font-bold text-slate-900 dark:text-white">Personal Information</div>
                    <div className="text-[10px] text-slate-500">Name, phone & location</div>
                  </div>
                </div>
                {openSection === "personal" ? <ChevronUp className="w-4 h-4 text-slate-400" /> : <ChevronDown className="w-4 h-4 text-slate-400" />}
              </button>
              {openSection === "personal" && (
                <div className="px-6 pb-6 space-y-5">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                    <div>
                      <label className={labelClass}>First Name <span className="text-rose-500">*</span></label>
                      <input type="text" value={firstName} onChange={(e) => setFirstName(e.target.value)} placeholder="Ali" className={inputClass} />
                    </div>
                    <div>
                      <label className={labelClass}>Last Name <span className="text-rose-500">*</span></label>
                      <input type="text" value={lastName} onChange={(e) => setLastName(e.target.value)} placeholder="Hassan" className={inputClass} />
                    </div>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                    <div>
                      <label className={labelClass}>Phone Number <span className="text-rose-500">*</span></label>
                      <div className="relative">
                        <Phone className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                        <input type="tel" value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="+92 300 0000000" className={`${inputClass} pl-10`} />
                      </div>
                    </div>
                    <div>
                      <label className={labelClass}>Email Address <span className="text-rose-500">*</span></label>
                      <div className="relative">
                        <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                        <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@email.com" className={`${inputClass} pl-10`} required />
                      </div>
                    </div>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                    <div>
                      <label className={labelClass}>City / Location <span className="text-rose-500">*</span></label>
                      <div className="relative">
                        <MapPin className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                        <input type="text" value={city} onChange={(e) => setCity(e.target.value)} placeholder="Lahore, Pakistan" className={`${inputClass} pl-10`} />
                      </div>
                    </div>
                    <div>
                      <label className={labelClass}>Gender <span className="text-rose-500">*</span></label>
                      <div className="relative">
                        <User className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                        <select value={gender} onChange={(e) => setGender(e.target.value)} className={`${inputClass} pl-10 appearance-none`}>
                          <option value="" disabled>Select Gender</option>
                          <option value="MALE">Male</option>
                          <option value="FEMALE">Female</option>
                          <option value="OTHER">Other</option>
                        </select>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Education */}
            <div className="bg-white dark:bg-neutral-900 rounded-2xl border border-slate-100 dark:border-neutral-800 overflow-hidden shadow-sm">
              <button type="button" onClick={() => toggle("education")} className="w-full flex items-center justify-between p-6 hover:bg-slate-50 dark:hover:bg-neutral-800/50 transition-colors">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-xl bg-cyan-50 dark:bg-cyan-950/40 border border-cyan-100 dark:border-cyan-900/50 flex items-center justify-center">
                    <GraduationCap className="w-4 h-4 text-cyan-600 dark:text-cyan-400" />
                  </div>
                  <div className="text-left">
                    <div className="text-sm font-bold text-slate-900 dark:text-white">Education</div>
                    <div className="text-[10px] text-slate-500">University, degree & year</div>
                  </div>
                </div>
                {openSection === "education" ? <ChevronUp className="w-4 h-4 text-slate-400" /> : <ChevronDown className="w-4 h-4 text-slate-400" />}
              </button>
              {openSection === "education" && (
                <div className="px-6 pb-6 space-y-5">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                    <div>
                      <label className={labelClass}>University / Institute</label>
                      <input type="text" value={university} onChange={(e) => setUniversity(e.target.value)} placeholder="LUMS, NUST, FAST..." className={inputClass} />
                    </div>
                    <div>
                      <label className={labelClass}>Degree / Program</label>
                      <input type="text" value={degree} onChange={(e) => setDegree(e.target.value)} placeholder="BS Computer Science" className={inputClass} />
                    </div>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                    <div>
                      <label className={labelClass}>Graduation Year</label>
                      <input type="text" value={graduationYear} onChange={(e) => setGraduationYear(e.target.value)} placeholder="2025 or 2026" className={inputClass} />
                    </div>
                    <div>
                      <label className={labelClass}>CGPA (Optional)</label>
                      <input type="text" value={cgpa} onChange={(e) => setCgpa(e.target.value)} placeholder="3.5 / 4.0" className={inputClass} />
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Online Presence */}
            <div className="bg-white dark:bg-neutral-900 rounded-2xl border border-slate-100 dark:border-neutral-800 overflow-hidden shadow-sm">
              <button type="button" onClick={() => toggle("links")} className="w-full flex items-center justify-between p-6 hover:bg-slate-50 dark:hover:bg-neutral-800/50 transition-colors">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-xl bg-violet-50 dark:bg-violet-950/40 border border-violet-100 dark:border-violet-900/50 flex items-center justify-center">
                    <Globe className="w-4 h-4 text-violet-600 dark:text-violet-400" />
                  </div>
                  <div className="text-left">
                    <div className="text-sm font-bold text-slate-900 dark:text-white">Online Presence <span className="text-slate-400 font-normal text-xs">(Optional)</span></div>
                    <div className="text-[10px] text-slate-500">LinkedIn, GitHub, Portfolio</div>
                  </div>
                </div>
                {openSection === "links" ? <ChevronUp className="w-4 h-4 text-slate-400" /> : <ChevronDown className="w-4 h-4 text-slate-400" />}
              </button>
              {openSection === "links" && (
                <div className="px-6 pb-6 space-y-4">
                  <div>
                    <label className={labelClass}>LinkedIn URL</label>
                    <input type="url" value={linkedIn} onChange={(e) => setLinkedIn(e.target.value)} placeholder="https://linkedin.com/in/..." className={inputClass} />
                  </div>
                  <div>
                    <label className={labelClass}>GitHub URL</label>
                    <input type="url" value={github} onChange={(e) => setGithub(e.target.value)} placeholder="https://github.com/..." className={inputClass} />
                  </div>
                  <div>
                    <label className={labelClass}>Portfolio / Website</label>
                    <input type="url" value={portfolio} onChange={(e) => setPortfolio(e.target.value)} placeholder="https://yourportfolio.com" className={inputClass} />
                  </div>
                </div>
              )}
            </div>

            {/* Summary */}
            <div className="bg-white dark:bg-neutral-900 rounded-2xl border border-slate-100 dark:border-neutral-800 overflow-hidden shadow-sm">
              <button type="button" onClick={() => toggle("summary")} className="w-full flex items-center justify-between p-6 hover:bg-slate-50 dark:hover:bg-neutral-800/50 transition-colors">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-100 dark:border-emerald-900/50 flex items-center justify-center">
                    <FileText className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                  </div>
                  <div className="text-left">
                    <div className="text-sm font-bold text-slate-900 dark:text-white">Cover Letter <span className="text-slate-400 font-normal text-xs">(Optional)</span></div>
                    <div className="text-[10px] text-slate-500">Why do you want to join?</div>
                  </div>
                </div>
                {openSection === "summary" ? <ChevronUp className="w-4 h-4 text-slate-400" /> : <ChevronDown className="w-4 h-4 text-slate-400" />}
              </button>
              {openSection === "summary" && (
                <div className="px-6 pb-6">
                  <textarea
                    value={summary}
                    onChange={(e) => setSummary(e.target.value)}
                    rows={5}
                    placeholder="Tell us about yourself and your goals..."
                    className={`${inputClass} resize-y min-h-[120px]`}
                    maxLength={800}
                  />
                  <div className="flex justify-end text-[10px] text-slate-400 font-mono mt-1">{summary.length}/800</div>
                </div>
              )}
            </div>

            {/* Submit */}
            <div className="bg-white dark:bg-neutral-900 rounded-2xl border border-slate-100 dark:border-neutral-800 p-6 shadow-sm space-y-4">
              {/* Honor Covenant Checkbox right near submit button */}
              <div className={`p-4 rounded-xl border transition-all duration-200 ${
                covenantChecked 
                  ? "bg-emerald-50/60 dark:bg-emerald-950/20 border-emerald-200 dark:border-emerald-800/40" 
                  : "bg-amber-50/70 dark:bg-amber-950/30 border-amber-300 dark:border-amber-700/50 shadow-sm"
              }`}>
                <label className="flex items-start gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    id="honor-covenant-submit-checkbox"
                    checked={covenantChecked}
                    onChange={(e) => setCovenantChecked(e.target.checked)}
                    className="mt-0.5 w-4 h-4 accent-brand-500 rounded cursor-pointer shrink-0"
                  />
                  <div className="space-y-0.5 select-none">
                    <div className="text-xs font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
                      <ShieldCheck className={`w-4 h-4 shrink-0 ${covenantChecked ? "text-emerald-600 dark:text-emerald-400" : "text-amber-600 dark:text-amber-400"}`} />
                      I accept the SAMStack Engineering Honor Covenant
                    </div>
                    <p className="text-[11px] text-slate-600 dark:text-slate-400 leading-relaxed">
                      All work must be original. Plagiarism results in immediate disqualification. Your credential is cryptographically signed and publicly verifiable.
                    </p>
                  </div>
                </label>
              </div>

              <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between pt-1">
                <div>
                  <div className="text-sm font-bold text-slate-900 dark:text-white">Ready to apply?</div>
                  <div className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">Next step: create your LMS account.</div>
                </div>
                <button
                  type="submit"
                  disabled={!covenantChecked}
                  className="shrink-0 inline-flex items-center gap-2 px-8 py-3.5 rounded-xl bg-gradient-to-r from-brand-600 to-cyan-600 hover:from-brand-500 hover:to-cyan-500 disabled:opacity-50 disabled:cursor-not-allowed text-white font-bold text-sm transition-all shadow-lg shadow-brand-500/25 cursor-pointer"
                >
                  Next: Create Account <ArrowLeft className="w-4 h-4 rotate-180" />
                </button>
              </div>
            </div>
          </form>
        </main>
      </div>
    </div>
  );
}

export default function InternshipApplyPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-slate-50 dark:bg-black flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-brand-500 border-t-transparent rounded-full animate-spin" />
      </div>
    }>
      <ApplyForm />
    </Suspense>
  );
}
