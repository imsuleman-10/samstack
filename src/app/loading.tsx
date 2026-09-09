"use client";

import { useState, useEffect } from "react";

export default function Loading() {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    let mounted = true;
    const interval = setInterval(() => {
      if (!mounted) return;
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          return 100;
        }
        return prev + Math.random() * 15 + 5;
      });
    }, 120);
    return () => { mounted = false; clearInterval(interval); };
  }, []);

  return (
    <div className="min-h-screen flex items-center justify-center bg-white dark:bg-black relative overflow-hidden">
      {/* Ambient blurs */}

      <div className="relative z-10 flex flex-col items-center gap-10">
        {/* Logo */}
        <div className="relative">
          {/* Glow */}
          <div className="absolute inset-0 rounded-2xl bg-brand-500/20 blur-3xl animate-pulse" />

          {/* Spinning ring */}
          <div className="absolute -inset-4 rounded-2xl border-[2px] border-transparent border-t-brand-500/60 border-r-brand-500/20 animate-spin" style={{ animationDuration: "2.5s" }} />

          {/* Reverse ring */}
          <div className="absolute -inset-7 rounded-2xl border-[2px] border-transparent border-b-indigo-500/40 border-l-indigo-500/10 animate-spin" style={{ animationDuration: "3.5s", animationDirection: "reverse" }} />

          {/* Logo container */}
          <div className="relative w-20 h-20 sm:w-24 sm:h-24 rounded-2xl bg-white dark:bg-neutral-900 border border-slate-200 dark:border-neutral-800 shadow-2xl flex items-center justify-center overflow-hidden">
            <img src="/logo.png" alt="SAMStack Tech" className="w-14 h-14 sm:w-16 sm:h-16 object-contain p-1" />
          </div>
        </div>

        {/* Brand name */}
        <div className="flex flex-col items-center gap-4">
          <div className="flex items-baseline gap-1">
            <span className="text-xl sm:text-2xl font-black tracking-tight text-slate-900 dark:text-white font-heading">
              SAMStack
            </span>
            <span className="text-xl sm:text-2xl font-black tracking-tight text-brand-600 dark:text-brand-400 font-heading">
              Tech
            </span>
          </div>

          {/* Progress bar */}
          <div className="w-48 sm:w-56 relative">
            <div className="h-[3px] w-full bg-slate-200 dark:bg-neutral-800 rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-brand-500 via-indigo-500 to-brand-400 rounded-full transition-all duration-300 ease-out"
                style={{ width: `${Math.min(progress, 100)}%` }}
              />
            </div>
          </div>

          {/* Status text */}
          <div className="flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-brand-500 animate-pulse" />
            <span className="text-[10px] font-mono text-slate-400 dark:text-slate-500 tracking-[0.2em] uppercase">
              {progress < 30 ? "Initializing..." : progress < 70 ? "Loading assets..." : progress < 100 ? "Almost ready..." : "Ready"}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
