'use client';

import React from 'react';
import { Search, X } from 'lucide-react';

interface SearchBarProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  className?: string;
  id?: string;
}

export function SearchBar({ value, onChange, placeholder = 'Search...', className = '', id }: SearchBarProps) {
  return (
    <div className={`relative ${className}`}>
      <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 pointer-events-none text-slate-400 dark:text-zinc-500" />
      <input
        id={id}
        type="search"
        value={value}
        onChange={e => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full h-10 pl-9 pr-9 rounded-xl text-sm text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-zinc-500 bg-white dark:bg-zinc-800 border border-slate-200 dark:border-zinc-700 shadow-xs outline-none transition-all focus:border-brand-500 focus:ring-2 focus:ring-brand-500/20"
      />
      {value && (
        <button
          type="button"
          onClick={() => onChange('')}
          className="absolute right-3 top-1/2 -translate-y-1/2 p-0.5 rounded-md hover:bg-slate-100 dark:hover:bg-zinc-700 text-slate-400 hover:text-slate-600 dark:text-zinc-500 dark:hover:text-zinc-300 transition-colors"
        >
          <X className="w-3.5 h-3.5" />
        </button>
      )}
    </div>
  );
}
