'use client';

import React from 'react';
import {
  AreaChart, Area, BarChart, Bar, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
} from 'recharts';

// ─── Shared custom tooltip ───────────────────────────────────────────────────
const CustomTooltip = ({ active, payload, label }: any) => {
  if (!active || !payload?.length) return null;
  return (
    <div
      className="px-3 py-2 rounded-lg text-xs text-white"
      style={{ background: 'rgba(15,20,35,0.95)', border: '1px solid rgba(255,255,255,0.12)', boxShadow: '0 8px 24px rgba(0,0,0,0.4)' }}
    >
      {label && <p className="font-semibold text-gray-300 mb-1">{label}</p>}
      {payload.map((p: any, i: number) => (
        <p key={i} style={{ color: p.color || p.fill || '#22d3ee' }}>
          {p.name}: <span className="font-bold text-white">{p.value}</span>
        </p>
      ))}
    </div>
  );
};

// ─── Chart Card wrapper ───────────────────────────────────────────────────────
function ChartCard({ title, subtitle, children, minHeight = 200 }: { title: string; subtitle?: string; children: React.ReactNode; minHeight?: number }) {
  const [mounted, setMounted] = React.useState(false);
  React.useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <div
      className="p-5 rounded-2xl border"
      style={{ background: 'rgba(17,24,39,0.6)', borderColor: 'rgba(255,255,255,0.08)', backdropFilter: 'blur(12px)' }}
    >
      <div className="mb-4">
        <h3 className="font-semibold text-white text-sm">{title}</h3>
        {subtitle && <p className="text-xs text-gray-500 mt-0.5">{subtitle}</p>}
      </div>
      {mounted ? children : (
        <div style={{ height: minHeight }} className="flex items-center justify-center animate-pulse">
          <div className="w-full h-full rounded-xl bg-white/[0.03] border border-white/[0.04]" />
        </div>
      )}
    </div>
  );
}

// ─── 1. Weekly Registrations — Area Chart ────────────────────────────────────
export function WeeklyRegistrationsChart({ data }: { data: { week: string; users: number }[] }) {
  return (
    <ChartCard title="Weekly Registrations" subtitle="New users over the last 8 weeks">
      <ResponsiveContainer width="100%" height={200}>
        <AreaChart data={data} margin={{ top: 5, right: 10, left: -20, bottom: 0 }}>
          <defs>
            <linearGradient id="colorUsers" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%"  stopColor="#22d3ee" stopOpacity={0.25} />
              <stop offset="95%" stopColor="#22d3ee" stopOpacity={0} />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
          <XAxis dataKey="week" tick={{ fill: '#6b7280', fontSize: 11 }} axisLine={false} tickLine={false} />
          <YAxis allowDecimals={false} tick={{ fill: '#6b7280', fontSize: 11 }} axisLine={false} tickLine={false} />
          <Tooltip content={<CustomTooltip />} />
          <Area
            type="monotone"
            dataKey="users"
            name="New Users"
            stroke="#22d3ee"
            strokeWidth={2}
            fill="url(#colorUsers)"
            dot={{ fill: '#22d3ee', r: 3, strokeWidth: 0 }}
            activeDot={{ r: 5, fill: '#22d3ee', strokeWidth: 0 }}
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
    <text x={x} y={y} fill="white" textAnchor="middle" dominantBaseline="central" fontSize={11} fontWeight={600}>
      {`${(percent * 100).toFixed(0)}%`}
    </text>
  );
};

export function RoleDistributionChart({ data }: { data: { name: string; value: number; color: string }[] }) {
  const total = data.reduce((sum, d) => sum + d.value, 0);
  return (
    <ChartCard title="Role Distribution" subtitle={`${total} users total`} minHeight={180}>
      <div className="flex items-center gap-4">
        <ResponsiveContainer width="55%" height={180}>
          <PieChart>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              innerRadius={50}
              outerRadius={80}
              dataKey="value"
              labelLine={false}
              label={renderCustomLabel}
            >
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} stroke="rgba(0,0,0,0.3)" strokeWidth={1} />
              ))}
            </Pie>
            <Tooltip content={<CustomTooltip />} />
          </PieChart>
        </ResponsiveContainer>
        <div className="flex-1 space-y-2">
          {data.map((d, i) => (
            <div key={i} className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-2.5 h-2.5 rounded-full" style={{ background: d.color }} />
                <span className="text-xs text-gray-400">{d.name}</span>
              </div>
              <span className="text-xs font-bold text-white">{d.value}</span>
            </div>
          ))}
        </div>
      </div>
    </ChartCard>
  );
}

// ─── 3. Track Distribution — Bar Chart ───────────────────────────────────────
export function TrackDistributionChart({ data }: { data: { name: string; value: number }[] }) {
  const TRACK_COLORS = ['#22d3ee', '#a78bfa', '#34d399', '#fb923c', '#f472b6', '#fbbf24'];
  return (
    <ChartCard title="Track Distribution" subtitle="Interns enrolled per track">
      {data.length === 0 ? (
        <div className="flex items-center justify-center h-48 text-gray-500 text-sm">No data yet</div>
      ) : (
        <ResponsiveContainer width="100%" height={200}>
          <BarChart data={data} margin={{ top: 5, right: 10, left: -20, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" vertical={false} />
            <XAxis dataKey="name" tick={{ fill: '#6b7280', fontSize: 10 }} axisLine={false} tickLine={false} />
            <YAxis allowDecimals={false} tick={{ fill: '#6b7280', fontSize: 11 }} axisLine={false} tickLine={false} />
            <Tooltip content={<CustomTooltip />} />
            <Bar dataKey="value" name="Interns" radius={[4, 4, 0, 0]}>
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
    <ChartCard title="Task Submissions" subtitle="Current status of all submitted tasks">
      {total === 0 ? (
        <div className="flex items-center justify-center h-48 text-gray-500 text-sm">No submissions yet</div>
      ) : (
        <>
          {/* Stacked progress bar */}
          <div className="flex rounded-full overflow-hidden h-3 mb-5 mt-2">
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
                <div className="w-2.5 h-2.5 rounded-full flex-shrink-0" style={{ background: d.color }} />
                <div className="flex-1">
                  <div className="flex items-center justify-between text-xs mb-1">
                    <span className="text-gray-400">{d.name}</span>
                    <span className="font-bold text-white">{d.value}</span>
                  </div>
                  <div className="h-1.5 rounded-full overflow-hidden" style={{ background: 'rgba(255,255,255,0.06)' }}>
                    <div
                      className="h-full rounded-full transition-all duration-700"
                      style={{ width: `${total > 0 ? (d.value / total) * 100 : 0}%`, background: d.color }}
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
          <p className="text-xs text-gray-600 mt-3 text-right">{total} total submissions</p>
        </>
      )}
    </ChartCard>
  );
}
