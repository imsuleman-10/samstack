'use client';

import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import {
  signInWithEmailAndPassword,
  signInWithPopup,
  GoogleAuthProvider,
} from 'firebase/auth';
import { auth } from '@/lib/firebase';
import { motion, AnimatePresence } from 'framer-motion';
import { KeyRound, Loader2, User, Mail, ArrowRight, ArrowLeft, Eye, EyeOff, RefreshCw, ShieldCheck, Lock, Check, Clock } from 'lucide-react';

type Mode = 'LOGIN' | 'SIGNUP' | 'FORGOT' | 'OTP_SIGNUP' | 'OTP_FORGOT' | 'NEW_PASSWORD';

/** Convert raw Firebase error codes to human-readable Urdu/English messages */
const firebaseErrorMessage = (code: string): string => {
  const map: Record<string, string> = {
    'auth/too-many-requests':        'Too many attempts. Please wait a minute and try again.',
    'auth/invalid-credential':       'Invalid email or password. Please check and try again.',
    'auth/wrong-password':           'Incorrect password. Please try again.',
    'auth/user-not-found':           'No account found with this email. Please sign up.',
    'auth/email-already-in-use':     '__EMAIL_EXISTS__',
    'auth/weak-password':            'Password is too weak. Please use at least 6 characters.',
    'auth/invalid-email':            'Please enter a valid email address.',
    'auth/user-disabled':            'This account has been disabled. Contact support.',
    'auth/popup-closed-by-user':     'Google sign-in was cancelled. Please try again.',
    'auth/popup-blocked':            'Popup was blocked. Please allow popups and try again.',
    'auth/network-request-failed':   'Network error. Please check your internet connection.',
    'auth/expired-action-code':      'This link has expired. Please request a new one.',
    'auth/invalid-action-code':      'Invalid or already used reset link.',
    'auth/requires-recent-login':    'Please log out and log in again before making this change.',
    'auth/operation-not-allowed':    'This sign-in method is not enabled. Contact support.',
    'auth/account-exists-with-different-credential': '__EMAIL_EXISTS__',
    'auth/unauthorized-domain':      'This domain/IP is not authorized for Google Sign-In. Please access the app via localhost:3000 to use Google Login.',
  };
  return map[code] || code;
};

const isEmailInput = (str: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(str);

export default function LoginPage() {
  const router = useRouter();
  const [mode, setMode] = useState<Mode>('LOGIN');

  const [otp, setOtp] = useState('');

  // Login
  const [loginId, setLoginId] = useState('');
  const [loginPw, setLoginPw] = useState('');
  const [showLoginPw, setShowLoginPw] = useState(false);

  // Signup
  const [sigName, setSigName] = useState('');
  const [sigEmail, setSigEmail] = useState('');
  const [sigPw, setSigPw] = useState('');
  const [showSigPw, setShowSigPw] = useState(false);
  const [sigGender, setSigGender] = useState('Male');
  const [sigTrack, setSigTrack] = useState('WEB_DEV');

  // Forgot Password
  const [forgotId, setForgotId] = useState('');
  const [forgotSent, setForgotSent] = useState(false);
  const [newPassword, setNewPassword] = useState('');
  const [showNewPw, setShowNewPw] = useState(false);
  const [resetToken, setResetToken] = useState('');

  // State
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [emailExists, setEmailExists] = useState(false);
  
  // Rate limiting countdown
  const [countdown, setCountdown] = useState(0);

  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (countdown > 0) {
      timer = setTimeout(() => setCountdown(c => c - 1), 1000);
    }
    return () => clearTimeout(timer);
  }, [countdown]);

  const clear = () => { setError(''); setSuccess(''); setEmailExists(false); };
  const switchMode = (m: Mode) => { setMode(m); clear(); setForgotSent(false); setOtp(''); };

  const verifyOnServer = async (user: any, n?: string, p?: string, e?: string, track?: string, gender?: string) => {
    const token = await user.getIdToken();
    const res = await fetch('/api/auth/verify', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ token, fullName: n, phone: p, email: e, track, gender }),
    });
    const data = await res.json().catch(() => ({}));
    if (!res.ok) throw new Error(data.error || 'Server error');
    // Role-based redirect is driven by the server
    router.push(data.dashboard || '/intern/dashboard');
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault(); setLoading(true); clear();
    try {
      let fbEmail = loginId.trim();
      if (!isEmailInput(fbEmail)) {
        const res = await fetch('/api/auth/lookup', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ phone: fbEmail }),
        });
        const d = await res.json().catch(() => ({}));
        if (!res.ok) throw new Error(d.error || 'Failed to look up account.');
        // Fallback email format for legacy phone accounts
        const cleaned = fbEmail.replace(/[^0-9+]/g, '');
        const std = cleaned.startsWith('+') ? cleaned : `+92${cleaned.replace(/^0/, '')}`;
        fbEmail = d.firebaseEmail || `${std}@samstack.com`;
      }
      const cred = await signInWithEmailAndPassword(auth, fbEmail, loginPw);
      await verifyOnServer(cred.user);
    } catch (err: any) {
      if (err.code === 'auth/too-many-requests') {
        setCountdown(60);
      }
      setError(firebaseErrorMessage(err.code) || err.message || 'Login failed.');
    } finally { setLoading(false); }
  };

  // Step 1 Signup: Validate & Send OTP (Phone or Email)
  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!sigName.trim()) { setError('Full name is required.'); return; }
    if (!sigEmail.trim() || !sigEmail.includes('@')) { setError('Valid email is required.'); return; }
    if (!sigPw || sigPw.length < 6) { setError('Password must be at least 6 characters.'); return; }
    
    setLoading(true); clear();
    try {
      // Check email uniqueness
      const chk = await fetch('/api/auth/check-unique', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: sigEmail.trim() }),
      });
      const chkData = await chk.json().catch(() => ({}));
      if (!chk.ok) {
        // Show email-already-exists inline prompt with Login button
        setEmailExists(true);
        return;
      }

      // Only email flow supported now
      const res = await fetch('/api/auth/send-email-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: sigEmail.trim() })
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(data.error || 'Failed to send verification code');
      setSuccess(`Verification code sent to ${sigEmail}`);
      setMode('OTP_SIGNUP');
    } catch (err: any) {
      if (err.code === 'auth/too-many-requests') setCountdown(60);
      // Check if firebase threw email-already-in-use
      if (err.code === 'auth/email-already-in-use' || err.code === 'auth/account-exists-with-different-credential') {
        setEmailExists(true);
      } else {
        setError(firebaseErrorMessage(err.code) || err.message || 'Failed to send verification code.');
      }
    } finally { setLoading(false); }
  };

  // Step 2 Signup: Verify OTP & Create Account
  const verifySignupOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!otp || otp.length < 6) return;
    setLoading(true); clear();
    try {
      const res = await fetch('/api/auth/verify-email-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: sigEmail.trim(), otp })
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(data.error || 'Invalid verification code');
      
      // Create intern account using the new API
      const signupRes = await fetch('/api/auth/intern-signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: sigEmail.trim(),
          password: sigPw,
          fullName: sigName.trim(),
          gender: sigGender,
          track: sigTrack,
        })
      });
      const signupData = await signupRes.json().catch(() => ({}));
      if (!signupRes.ok) {
        // If account already existed at intern-signup stage, show login prompt
        if (signupData.error?.toLowerCase().includes('already') || signupData.error?.toLowerCase().includes('exists')) {
          setEmailExists(true);
          setMode('SIGNUP');
          return;
        }
        throw new Error(signupData.error || 'Failed to create intern account.');
      }
      
      // Small delay to allow Firebase Auth to propagate the new user before sign-in
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      try {
        const cred = await signInWithEmailAndPassword(auth, sigEmail.trim(), sigPw);
        await verifyOnServer(cred.user, sigName.trim(), undefined, sigEmail.trim());
      } catch (loginErr: any) {
        // Account created but login failed. Switch to login mode to avoid deadlock.
        setSuccess('Account created successfully! Please sign in.');
        setMode('LOGIN');
        return;
      }
    } catch (err: any) {
      setError(firebaseErrorMessage(err.code) || err.message || 'Invalid verification code.');
    } finally { setLoading(false); }
  };

  // Step 1 Forgot: Send Email OTP
  const handleForgot = async (e: React.FormEvent) => {
    e.preventDefault();
    const id = forgotId.trim();
    if (!id) { setError('Enter your email.'); return; }
    if (!/^\S+@\S+\.\S+$/.test(id)) { setError("Please enter a valid email address."); return; }
    
    setLoading(true); clear();

    try {
      const res = await fetch('/api/auth/send-email-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: id })
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(data.error || 'Failed to send reset code');
      
      setForgotSent(true);
      setSuccess(`Verification code sent to ${id}`);
      setMode('OTP_FORGOT');
    } catch (err: any) {
      if (err.code === 'auth/too-many-requests') setCountdown(60);
      setError(firebaseErrorMessage(err.code) || err.message || 'Failed to process request.');
    } finally { setLoading(false); }
  };

  // Step 2 Forgot: Verify OTP
  const verifyForgotOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!otp || otp.length < 6) return;
    setLoading(true); clear();
    try {
      const res = await fetch('/api/auth/verify-email-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: forgotId.trim(), otp, isPasswordReset: true })
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(data.error || 'Invalid verification code');
      
      setResetToken(data.resetToken);
      setMode('NEW_PASSWORD');
      setSuccess('Email verified. Enter your new password.');
    } catch (err: any) {
      setError(firebaseErrorMessage(err.code) || err.message || 'Invalid verification code.');
    } finally { setLoading(false); }
  };

  // Step 3 Forgot: Set New Password
  const handleNewPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (newPassword.length < 6) { setError('Password must be at least 6 characters.'); return; }
    if (!resetToken) { setError('Session expired. Please try again.'); return; }
    
    setLoading(true); clear();
    try {
      const res = await fetch('/api/auth/reset', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: forgotId.trim(), newPassword, resetToken })
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(data.error || 'Failed to update password');

      setSuccess('Password updated successfully! You can now sign in.');
      setResetToken('');
      setTimeout(() => switchMode('LOGIN'), 2000);
    } catch (err: any) {
      setError(err.message || 'Failed to update password.');
    } finally { setLoading(false); }
  };

  const handleGoogle = async () => {
    setLoading(true); clear();
    try {
      const cred = await signInWithPopup(auth, new GoogleAuthProvider());
      await verifyOnServer(
        cred.user,
        cred.user.displayName || 'Google User',
        undefined,
        cred.user.email || undefined,
        sigTrack,
        sigGender
      );
    } catch (err: any) {
      if (err.code === 'auth/email-already-in-use' || err.code === 'auth/account-exists-with-different-credential') {
        setEmailExists(true);
        if (mode === 'SIGNUP') {
          // Stay on signup, show the inline prompt
        } else {
          setError('An account with this email already exists. Please sign in instead.');
        }
      } else {
        setError(firebaseErrorMessage(err.code) || err.message || 'Google login failed.');
      }
    }
    finally { setLoading(false); }
  };

  const inp = "w-full bg-slate-50 dark:bg-neutral-800/60 border border-slate-200 dark:border-neutral-700 rounded-xl px-4 py-3 text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-neutral-500 focus:outline-none focus:border-brand-500 focus:ring-2 focus:ring-brand-500/20 transition-all text-sm font-medium";
  const lbl = "block text-[11px] font-bold text-slate-400 dark:text-neutral-500 uppercase tracking-widest mb-1.5";
  const btn = "w-full bg-gradient-to-r from-brand-500 to-blue-500 hover:from-brand-400 hover:to-blue-400 text-white font-extrabold py-3.5 rounded-xl transition-all shadow-lg shadow-brand-500/30 hover:shadow-brand-500/40 disabled:opacity-50 flex items-center justify-center gap-2 text-sm active:scale-[0.98]";
  return (
    <div className="flex-1 flex flex-col items-center justify-center px-4 py-12 pt-28 lg:pt-32 pb-24 relative transition-colors duration-300 min-h-screen">
      
      {/* Decorative Glows */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-10 left-1/4 w-[300px] h-[300px] bg-brand-500/10 dark:bg-brand-500/15 rounded-full blur-[100px]" />
        <div className="absolute bottom-10 right-1/4 w-[300px] h-[300px] bg-blue-500/10 dark:bg-blue-600/15 rounded-full blur-[100px]" />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="relative w-full max-w-[420px]"
      >
        <div className="bg-white/80 dark:bg-neutral-900/80 backdrop-blur-xl border border-slate-200 dark:border-neutral-800 rounded-3xl p-6 sm:p-8 shadow-xl dark:shadow-black/40">

          {/* Back button (Forgot/OTP modes) */}
          {(mode === 'FORGOT' || mode.startsWith('OTP_') || mode === 'NEW_PASSWORD') && (
            <button type="button" onClick={() => switchMode(mode === 'OTP_SIGNUP' ? 'SIGNUP' : 'LOGIN')}
              className="flex items-center gap-2 text-slate-400 dark:text-neutral-500 hover:text-brand-600 dark:hover:text-brand-400 text-xs font-bold mb-6 transition-colors">
              <ArrowLeft className="w-3.5 h-3.5" /> Back
            </button>
          )}

          {/* Heading */}
          <div className="mb-7 text-center">
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
              {mode === 'LOGIN' && 'Welcome back'}
              {mode === 'SIGNUP' && 'Create your account'}
              {mode === 'FORGOT' && 'Reset password'}
              {mode === 'OTP_SIGNUP' && 'Verify Details'}
              {mode === 'OTP_FORGOT' && 'Verify Email'}
              {mode === 'NEW_PASSWORD' && 'Set New Password'}
            </h1>
            <p className="text-slate-500 dark:text-neutral-400 text-sm mt-1.5 font-medium">
              {mode === 'LOGIN' && 'Sign in to access your dashboard'}
              {mode === 'SIGNUP' && 'Start your internship journey'}
              {mode === 'FORGOT' && "Enter your email to reset password"}
              {mode.startsWith('OTP_') && "We sent a 6-digit code to your email"}
              {mode === 'NEW_PASSWORD' && "Enter your new secure password"}
            </p>
          </div>

          {/* Tabs */}
          {(mode === 'LOGIN' || mode === 'SIGNUP') && (
            <div className="flex bg-slate-100 dark:bg-neutral-800/70 p-1 rounded-xl mb-7 border border-slate-200 dark:border-neutral-700/60">
              {(['LOGIN', 'SIGNUP'] as Mode[]).map(m => (
                <button key={m} type="button" onClick={() => switchMode(m)}
                  className={`flex-1 py-2.5 text-xs font-extrabold rounded-lg transition-all uppercase tracking-wider ${
                    mode === m
                      ? 'bg-white dark:bg-neutral-900 text-brand-600 dark:text-brand-400 shadow-sm border border-slate-200 dark:border-neutral-700'
                      : 'text-slate-400 dark:text-neutral-500 hover:text-slate-700 dark:hover:text-neutral-300'
                  }`}>
                  {m === 'LOGIN' ? 'Sign In' : 'Sign Up'}
                </button>
              ))}
            </div>
          )}

          {/* Email Already Exists Banner */}
          <AnimatePresence>
            {emailExists && (
              <motion.div
                initial={{ opacity: 0, y: -8, height: 0 }}
                animate={{ opacity: 1, y: 0, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="mb-5 overflow-hidden"
              >
                <div className="p-4 rounded-xl bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-700/50 flex flex-col gap-2.5">
                  <div className="flex items-start gap-2.5">
                    <span className="text-amber-500 text-lg leading-none mt-0.5">⚠️</span>
                    <div>
                      <p className="text-amber-800 dark:text-amber-300 text-sm font-bold leading-snug">
                        Is Gmail pe pehle se account hai
                      </p>
                      <p className="text-amber-700 dark:text-amber-400 text-xs font-medium mt-0.5">
                        This email is already registered. Please sign in instead.
                      </p>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => switchMode('LOGIN')}
                    className="w-full bg-amber-500 hover:bg-amber-400 text-white text-xs font-extrabold py-2.5 rounded-lg transition-all flex items-center justify-center gap-2 shadow-sm"
                  >
                    <ArrowRight className="w-3.5 h-3.5" />
                    Sign In Instead
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Alert */}
          <AnimatePresence>
            {(error || success) && (
              <motion.div
                initial={{ opacity: 0, y: -8, height: 0 }}
                animate={{ opacity: 1, y: 0, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className={`mb-5 p-3.5 rounded-xl text-sm font-semibold border overflow-hidden ${
                  error
                    ? 'bg-red-50 dark:bg-red-950/30 border-red-200 dark:border-red-800/40 text-red-600 dark:text-red-400'
                    : 'bg-emerald-50 dark:bg-emerald-950/30 border-emerald-200 dark:border-emerald-800/40 text-emerald-700 dark:text-emerald-400'
                }`}>
                {error || success}
              </motion.div>
            )}
          </AnimatePresence>

          <AnimatePresence mode="wait">
            {/* ─── LOGIN FORM ─── */}
            {mode === 'LOGIN' && (
              <motion.form key="login" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} transition={{ duration: 0.2 }}
                onSubmit={handleLogin} className="space-y-4">
                <div>
                  <label className={lbl}>Email</label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                      <Mail className="w-4 h-4 text-slate-400 dark:text-neutral-500" />
                    </div>
                    <input type="email" value={loginId} onChange={e => setLoginId(e.target.value)}
                      placeholder="you@gmail.com" className={`${inp} pl-11`} required />
                  </div>
                </div>

                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <label className={lbl.replace('mb-1.5', 'm-0')}>Password</label>
                    <button type="button" onClick={() => switchMode('FORGOT')}
                      className="text-[11px] font-bold text-brand-600 dark:text-brand-400 hover:text-brand-500 transition-colors">
                      Forgot password?
                    </button>
                  </div>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                      <KeyRound className="w-4 h-4 text-slate-400 dark:text-neutral-500" />
                    </div>
                    <input type={showLoginPw ? 'text' : 'password'} value={loginPw} onChange={e => setLoginPw(e.target.value)}
                      placeholder="Your password" className={`${inp} pl-11 pr-11`} required />
                    <button type="button" onClick={() => setShowLoginPw(p => !p)}
                      className="absolute inset-y-0 right-0 pr-4 flex items-center text-slate-400 dark:text-neutral-500 hover:text-brand-500 transition-colors">
                      {showLoginPw ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                <button type="submit" disabled={loading || countdown > 0} className={`${btn} mt-1 ${countdown > 0 ? 'opacity-50 cursor-not-allowed' : ''}`}>
                  {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : (countdown > 0 ? <><span>Wait {countdown}s</span><Clock className="w-4 h-4" /></> : <><span>Sign In</span><ArrowRight className="w-4 h-4" /></>)}
                </button>
                <Divider />
                <GoogleBtn onClick={handleGoogle} disabled={loading || countdown > 0} countdown={countdown} />
              </motion.form>
            )}

            {/* ─── SIGNUP FORM ─── */}
            {mode === 'SIGNUP' && (
              <motion.form key="signup" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} transition={{ duration: 0.2 }}
                onSubmit={handleSignup} className="space-y-4">
                


                <div>
                  <label className={lbl}>Full Name</label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                      <User className="w-4 h-4 text-slate-400 dark:text-neutral-500" />
                    </div>
                    <input type="text" value={sigName} onChange={e => setSigName(e.target.value)}
                      placeholder="Muhammad Ali" className={`${inp} pl-11`} required />
                  </div>
                </div>

                <div>
                  <label className={lbl}>Email <span className="text-brand-500 normal-case tracking-normal">*</span></label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                      <Mail className="w-4 h-4 text-slate-400 dark:text-neutral-500" />
                    </div>
                    <input type="email" value={sigEmail} onChange={e => setSigEmail(e.target.value)}
                      placeholder="you@gmail.com" className={`${inp} pl-10`} required />
                  </div>
                </div>

                <div>
                  <label className={lbl}>Password</label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                      <KeyRound className="w-4 h-4 text-slate-400 dark:text-neutral-500" />
                    </div>
                    <input type={showSigPw ? 'text' : 'password'} value={sigPw} onChange={e => setSigPw(e.target.value)}
                      placeholder="Min. 6 characters" className={`${inp} pl-11 pr-11`} required minLength={6} />
                    <button type="button" onClick={() => setShowSigPw(p => !p)}
                      className="absolute inset-y-0 right-0 pr-4 flex items-center text-slate-400 dark:text-neutral-500 hover:text-brand-500 transition-colors">
                      {showSigPw ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className={lbl}>Gender</label>
                    <select value={sigGender} onChange={e => setSigGender(e.target.value)} className={inp} required>
                      <option value="Male">Male</option>
                      <option value="Female">Female</option>
                    </select>
                  </div>
                  <div>
                    <label className={lbl}>Track</label>
                    <select value={sigTrack} onChange={e => setSigTrack(e.target.value)} className={inp} required>
                      <option value="WEB_DEV">Web Development Basics (HTML/CSS/JS)</option>
                      <option value="REACT">React.js Basics</option>
                      <option value="PYTHON">Python Development Basics</option>
                      <option value="CPP">C++ Programming Basics</option>
                      <option value="UI_UX">Basic UI/UX Design</option>
                      <option value="NEXT_JS">Next.js Fundamentals</option>
                      <option value="MERN">MERN Stack Introduction</option>
                    </select>
                  </div>
                </div>

                <button type="submit" disabled={loading || countdown > 0} className={`${btn} mt-1 ${countdown > 0 ? 'opacity-50 cursor-not-allowed' : ''}`}>
                  {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : (countdown > 0 ? <><span>Wait {countdown}s</span><Clock className="w-4 h-4" /></> : <><span>Continue</span><ArrowRight className="w-4 h-4" /></>)}
                </button>
                <Divider />
                <GoogleBtn onClick={handleGoogle} disabled={loading || countdown > 0} countdown={countdown} />
              </motion.form>
            )}

            {/* ─── FORGOT PASSWORD ─── */}
            {mode === 'FORGOT' && (
              <motion.form key="forgot" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} transition={{ duration: 0.2 }}
                onSubmit={handleForgot} className="space-y-4">
                {!forgotSent ? (
                  <>


                    <div>
                      <label className={lbl}>Email Address</label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                          <Mail className="w-4 h-4 text-slate-400 dark:text-neutral-500" />
                        </div>
                        <input type="email" value={forgotId} onChange={e => setForgotId(e.target.value)}
                          placeholder="you@gmail.com" className={`${inp} pl-11`} required />
                      </div>
                    </div>

                    <button type="submit" disabled={loading} className={`${btn} mt-2`}>
                      {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <><RefreshCw className="w-4 h-4" /><span>Send Reset Link</span></>}
                    </button>
                  </>
                ) : (
                  <div className="text-center py-6 space-y-5">
                    <div className="w-16 h-16 bg-emerald-50 dark:bg-emerald-900/20 border border-emerald-200 dark:border-emerald-700/40 rounded-2xl flex items-center justify-center mx-auto shadow-sm">
                      <Mail className="w-7 h-7 text-emerald-500" />
                    </div>
                    <div>
                      <p className="text-slate-900 dark:text-white font-extrabold text-lg">Check your inbox!</p>
                      <p className="text-slate-500 dark:text-neutral-400 text-sm mt-1.5">
                        Reset link sent to <span className="text-brand-600 dark:text-brand-400 font-bold">{forgotId}</span>
                      </p>
                    </div>
                    <button type="button" onClick={() => switchMode('LOGIN')}
                      className="inline-flex items-center gap-2 text-sm text-brand-600 dark:text-brand-400 hover:text-brand-500 font-bold transition-colors">
                      <ArrowLeft className="w-4 h-4" /> Back to Sign In
                    </button>
                  </div>
                )}
              </motion.form>
            )}

            {/* ─── OTP VERIFICATION ─── */}
            {(mode === 'OTP_SIGNUP' || mode === 'OTP_FORGOT') && (
              <motion.form key="otp" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} transition={{ duration: 0.2 }}
                onSubmit={mode === 'OTP_SIGNUP' ? verifySignupOtp : verifyForgotOtp} className="space-y-4">
                
                <div className="bg-brand-50 dark:bg-brand-900/20 border border-brand-200 dark:border-brand-800/50 rounded-xl p-4 flex items-start gap-3 mb-4">
                  <ShieldCheck className="w-5 h-5 text-brand-600 dark:text-brand-400 shrink-0 mt-0.5" />
                  <div>
                    <h3 className="text-sm font-bold text-slate-900 dark:text-white">Verification Code</h3>
                    <p className="text-xs text-slate-600 dark:text-neutral-400 mt-1 font-medium leading-relaxed">
                      We sent a 6-digit code to your email. Please enter it below.
                    </p>
                  </div>
                </div>

                <div>
                  <label className={lbl}>6-Digit Code</label>
                  <input type="text" value={otp} onChange={e => setOtp(e.target.value.replace(/\D/g, ''))}
                    placeholder="123456" maxLength={6} className={`${inp} text-center tracking-[0.5em] text-lg font-bold`} required />
                </div>
                
                <button type="submit" disabled={loading || otp.length < 6} className={btn}>
                  {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <><span>Verify Code</span><ArrowRight className="w-4 h-4" /></>}
                </button>
              </motion.form>
            )}

            {/* ─── SET NEW PASSWORD ─── */}
            {mode === 'NEW_PASSWORD' && (
              <motion.form key="newpw" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} transition={{ duration: 0.2 }}
                onSubmit={handleNewPassword} className="space-y-4">
                
                <div className="bg-brand-50 dark:bg-brand-900/20 border border-brand-200 dark:border-brand-800/50 rounded-xl p-4 flex items-start gap-3 mb-4">
                  <Lock className="w-5 h-5 text-brand-600 dark:text-brand-400 shrink-0 mt-0.5" />
                  <div>
                    <h3 className="text-sm font-bold text-slate-900 dark:text-white">Create New Password</h3>
                    <p className="text-xs text-slate-600 dark:text-neutral-400 mt-1 font-medium leading-relaxed">
                      Your phone is verified. Set a new password for your account.
                    </p>
                  </div>
                </div>

                <div>
                  <label className={lbl}>New Password</label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                      <KeyRound className="w-4 h-4 text-slate-400 dark:text-neutral-500" />
                    </div>
                    <input type={showNewPw ? 'text' : 'password'} value={newPassword} onChange={e => setNewPassword(e.target.value)}
                      placeholder="Min. 6 characters" className={`${inp} pl-11 pr-11`} required minLength={6} />
                    <button type="button" onClick={() => setShowNewPw(p => !p)}
                      className="absolute inset-y-0 right-0 pr-4 flex items-center text-slate-400 dark:text-neutral-500 hover:text-brand-500 transition-colors">
                      {showNewPw ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                <button type="submit" disabled={loading} className={btn}>
                  {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <><span>Save Password & Login</span><ArrowRight className="w-4 h-4" /></>}
                </button>
              </motion.form>
            )}
          </AnimatePresence>
        </div>
      </motion.div>
    </div>
  );
}

function Divider() {
  return (
    <div className="relative my-2">
      <div className="absolute inset-0 flex items-center">
        <div className="w-full border-t border-slate-200 dark:border-neutral-700/60" />
      </div>
      <div className="relative flex justify-center">
        <span className="bg-white dark:bg-neutral-900 px-3 text-slate-400 dark:text-neutral-500 text-[11px] font-bold uppercase tracking-widest transition-colors duration-300">
          or
        </span>
      </div>
    </div>
  );
}

function GoogleBtn({ onClick, disabled, countdown = 0 }: { onClick: () => void; disabled: boolean; countdown?: number }) {
  return (
    <button type="button" onClick={onClick} disabled={disabled || countdown > 0}
      className={`w-full flex items-center justify-center gap-3 bg-slate-50 dark:bg-neutral-800/60 border border-slate-200 dark:border-neutral-700 hover:border-brand-400 dark:hover:border-brand-500/60 hover:bg-white dark:hover:bg-neutral-800 text-slate-700 dark:text-neutral-200 font-bold py-3.5 rounded-xl transition-all text-sm disabled:opacity-50 shadow-sm ${countdown > 0 ? 'cursor-not-allowed' : ''}`}>
      <svg className="w-5 h-5 shrink-0" viewBox="0 0 24 24">
        <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
        <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
        <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
        <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
      </svg>
      {countdown > 0 ? `Wait ${countdown}s` : "Continue with Google"}
    </button>
  );
}
