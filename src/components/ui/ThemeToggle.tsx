'use client';

import React, { useState, useEffect } from 'react';
import { useTheme } from '@/app/components/ThemeProvider';
import { Sun, Moon } from 'lucide-react';

export function ThemeToggle() {
  const { theme, toggleTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <button
      type="button"
      onClick={toggleTheme}
      className="p-2 rounded-full bg-[var(--border)]/30 hover:bg-[var(--border)] transition-colors text-[var(--foreground)] cursor-pointer shrink-0 flex items-center justify-center w-8 h-8"
      title="Toggle Theme"
      aria-label="Toggle Theme"
      suppressHydrationWarning
    >
      {!mounted ? (
        <span className="w-4 h-4 block" aria-hidden="true" />
      ) : theme === 'dark' ? (
        <Sun className="w-4 h-4 text-amber-400" />
      ) : (
        <Moon className="w-4 h-4 text-slate-700" />
      )}
    </button>
  );
}
