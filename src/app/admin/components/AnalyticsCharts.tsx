'use client';

import React from 'react';
import {
  AreaChart, Area, BarChart, Bar, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
} from 'recharts';

// ─── Shared custom tooltip ───────────────────────────────────────────────────
const CustomTooltip = ({ active, payload, label }: any) => {
  if (!active || !payload?.length) return null;
  return (
    <div
      className="px-3.5 py-2.5 rounded-xl text-xs bg-slate-900 dark:bg-zinc-800 text-white border border-slate-700/60 dark:border-zinc-700 shadow-xl"
    >
      {label && <p className="font-bold text-slate-300 mb-1">{label}</p>}
      {payload.map((p: any, i: number) => (
        <p key={i} className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full" style={{ background: p.color || p.fill || '#0284c7' }} />
          <span className="text-slate-400">{p.name}:</span>
          <span className="font-bold text-white">{p.value}</span>
        </p>
      ))}
    </div>
  );
};

// ─── Chart Card wrapper ───────────────────────────────────────────────────────
function ChartCard({ title, subtitle, children }: { title: string; subtitle?: string; children: React.ReactNode }) {
  return (
    <div className="p-5 rounded-2xl bg-white dark:bg-zinc-900 border border-slate-200/80 dark:border-zinc-800 shadow-xs transition-colors">
      <div className="mb-4">
        <h3 className="font-bold text-slate-900 dark:text-white text-sm">{title}</h3>
        {subtitle && <p className="text-xs text-slate-500 dark:text-zinc-400 mt-0.5">{subtitle}</p>}
      </div>
      {children}
    </div>
  );
}

// ─── 1. Weekly Registrations — Area Chart ────────────────────────────────────
export function WeeklyRegistrationsChart({ data }: { data: { week: string; users: number }[] }) {
  return (
    <ChartCard title="Weekly Registrations" subtitle="New user signups over the last 8 weeks">
      <ResponsiveContainer width="100%" height={210}>
        <AreaChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
          <defs>
            <linearGradient id="colorUsers" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#0ea5e9" stopOpacity={0.3} />
              <stop offset="95%" stopColor="#0ea5e9" stopOpacity={0} />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="currentColor" className="text-slate-100 dark:text-zinc-800/80" />
          <XAxis dataKey="week" tick={{ fill: '#94a3b8', fontSize: 11 }} axisLine={false} tickLine={false} />
          <YAxis allowDecimals={false} tick={{ fill: '#94a3b8', fontSize: 11 }} axisLine={false} tickLine={false} />
          <Tooltip content={<CustomTooltip />} />
          <Area
            type="monotone"
            dataKey="users"
            name="New Users"
            stroke="#0ea5e9"
            strokeWidth={2.5}
            fill="url(#colorUsers)"
            dot={{ fill: '#0ea5e9', r: 3, strokeWidth: 0 }}
            activeDot={{ r: 5, fill: '#0284c7', strokeWidth: 0 }}
          />
        </AreaChart>
      </ResponsiveContainer>
    </ChartCard>
  );
}

// ─── 2. Role Distribution — Donut Chart ──────────────────────────────────────
const RADIAN = Math.PI / 180;
const renderCustomLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, percent }: any) => {
  if (percent < 0.05) return null;
  const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
  const x = cx + radius * Math.cos(-midAngle * RADIAN);
  const y = cy + radius * Math.sin(-midAngle * RADIAN);
  return (
    <text x={x} y={y} fill="white" textAnchor="middle" dominantBaseline="central" fontSize={11} fontWeight={700}>
      {`${(percent * 100).toFixed(0)}%`}
    </text>
  );
};

export function RoleDistributionChart({ data }: { data: { name: string; value: number; color: string }[] }) {
  const total = data.reduce((sum, d) => sum + d.value, 0);
  return (
    <ChartCard title="Role Distribution" subtitle={`${total} platform accounts total`}>
      <div className="flex items-center gap-4">
        <ResponsiveContainer width="55%" height={180}>
          <PieChart>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              innerRadius={45}
              outerRadius={75}
              dataKey="value"
              labelLine={false}
              label={renderCustomLabel}
            >
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} stroke="transparent" />
              ))}
            </Pie>
            <Tooltip content={<CustomTooltip />} />
          </PieChart>
        </ResponsiveContainer>
        <div className="flex-1 space-y-2">
          {data.map((d, i) => (
            <div key={i} className="flex items-center justify-between text-xs">
              <div className="flex items-center gap-2">
                <div className="w-2.5 h-2.5 rounded-full" style={{ background: d.color }} />
                <span className="text-slate-600 dark:text-zinc-400 font-medium">{d.name}</span>
              </div>
              <span className="font-bold text-slate-900 dark:text-white">{d.value}</span>
            </div>
          ))}
        </div>
      </div>
    </ChartCard>
  );
}

// ─── 3. Track Distribution — Bar Chart ───────────────────────────────────────
export function TrackDistributionChart({ data }: { data: { name: string; value: number }[] }) {
  const TRACK_COLORS = ['#0ea5e9', '#8b5cf6', '#10b981', '#f97316', '#ec4899', '#f59e0b'];
  return (
    <ChartCard title="Track Distribution" subtitle="Interns enrolled per tech track">
      {data.length === 0 ? (
        <div className="flex items-center justify-center h-48 text-slate-400 dark:text-zinc-500 text-sm">
          No track data yet
        </div>
      ) : (
        <ResponsiveContainer width="100%" height={200}>
          <BarChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="currentColor" className="text-slate-100 dark:text-zinc-800/80" vertical={false} />
            <XAxis dataKey="name" tick={{ fill: '#94a3b8', fontSize: 10 }} axisLine={false} tickLine={false} />
            <YAxis allowDecimals={false} tick={{ fill: '#94a3b8', fontSize: 11 }} axisLine={false} tickLine={false} />
            <Tooltip content={<CustomTooltip />} />
            <Bar dataKey="value" name="Interns" radius={[6, 6, 0, 0]}>
              {data.map((_, index) => (
                <Cell key={`cell-${index}`} fill={TRACK_COLORS[index % TRACK_COLORS.length]} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      )}
    </ChartCard>
  );
}

// ─── 4. Task Status — Horizontal Bar Chart ───────────────────────────────────
export function TaskStatusChart({ data }: { data: { name: string; value: number; color: string }[] }) {
  const total = data.reduce((s, d) => s + d.value, 0);
  return (
    <ChartCard title="Task Submissions" subtitle="Current status of all submitted milestones">
      {total === 0 ? (
        <div className="flex items-center justify-center h-48 text-slate-400 dark:text-zinc-500 text-sm">
          No submissions yet
        </div>
      ) : (
        <>
          {/* Stacked progress bar */}
          <div className="flex rounded-full overflow-hidden h-2.5 mb-5 mt-2 bg-slate-100 dark:bg-zinc-800">
            {data.map((d, i) =>
              d.value > 0 ? (
                <div
                  key={i}
                  style={{ width: `${(d.value / total) * 100}%`, background: d.color }}
                  className="transition-all"
                  title={`${d.name}: ${d.value}`}
                />
              ) : null
            )}
          </div>
          <div className="space-y-3">
            {data.map((d, i) => (
              <div key={i} className="flex items-center gap-3">
                <div className="w-2.5 h-2.5 rounded-full shrink-0" style={{ background: d.color }} />
                <div className="flex-1">
                  <div className="flex items-center justify-between text-xs mb-1">
                    <span className="text-slate-600 dark:text-zinc-400 font-medium">{d.name}</span>
                    <span className="font-bold text-slate-900 dark:text-white">{d.value}</span>
                  </div>
                  <div className="h-1.5 rounded-full overflow-hidden bg-slate-100 dark:bg-zinc-800">
                    <div
                      className="h-full rounded-full transition-all duration-700"
                      style={{ width: `${total > 0 ? (d.value / total) * 100 : 0}%`, background: d.color }}
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
          <p className="text-xs text-slate-400 dark:text-zinc-500 mt-3 text-right font-medium">
            {total} total recorded milestones
          </p>
        </>
      )}
    </ChartCard>
  );
}
