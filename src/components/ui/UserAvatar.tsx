'use client';

import React from 'react';

interface UserAvatarProps {
  src?: string | null;
  name: string;
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  status?: 'active' | 'inactive' | 'suspended' | 'pending' | null;
  className?: string;
}

const SIZE_MAP = {
  xs: 'w-6 h-6 text-xs',
  sm: 'w-8 h-8 text-sm',
  md: 'w-10 h-10 text-base',
  lg: 'w-14 h-14 text-xl',
  xl: 'w-20 h-20 text-2xl',
};

const STATUS_COLOR = {
  active: 'bg-green-500',
  inactive: 'bg-gray-400',
  suspended: 'bg-red-500',
  pending: 'bg-yellow-400',
};

export function UserAvatar({ src, name, size = 'md', status, className = '' }: UserAvatarProps) {
  const initials = name
    .split(' ')
    .map(p => p[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);

  return (
    <div className={`relative inline-flex shrink-0 ${className}`}>
      <div
        className={`${SIZE_MAP[size]} rounded-full overflow-hidden flex items-center justify-center font-semibold select-none`}
        style={{
          background: src
            ? 'transparent'
            : 'linear-gradient(135deg, hsl(220,80%,50%) 0%, hsl(260,70%,55%) 100%)',
          color: '#fff',
        }}
      >
        {src ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={src} alt={name} className="w-full h-full object-cover" />
        ) : (
          <span>{initials}</span>
        )}
      </div>
      {status && (
        <span
          className={`absolute bottom-0 right-0 block rounded-full border-2 border-white dark:border-zinc-900 ${STATUS_COLOR[status]}`}
          style={{ width: '28%', height: '28%', minWidth: 6, minHeight: 6 }}
        />
      )}
    </div>
  );
}
