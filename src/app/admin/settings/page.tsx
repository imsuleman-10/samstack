'use client';

import React from 'react';
import { PageHeader } from '@/components/ui/PageHeader';
import { Settings, Bell, Shield, Globe, Database, Mail } from 'lucide-react';

function SettingsSection({ title, icon: Icon, children }: { title: string; icon: React.ElementType; children: React.ReactNode }) {
  return (
    <div
      className="p-6 rounded-2xl border border-slate-200 dark:border-zinc-800 bg-white dark:bg-zinc-900/60 shadow-sm"
    >
      <h3 className="text-base font-bold text-slate-900 dark:text-white mb-5 flex items-center gap-2">
        <Icon className="w-4 h-4 text-slate-500 dark:text-zinc-400" />
        {title}
      </h3>
      {children}
    </div>
  );
}

function SettingRow({ label, description, children }: { label: string; description?: string; children: React.ReactNode }) {
  return (
    <div className="flex items-center justify-between py-3.5 border-b border-slate-100 dark:border-zinc-800/60 last:border-0">
      <div>
        <p className="text-sm font-semibold text-slate-800 dark:text-zinc-200">{label}</p>
        {description && <p className="text-xs text-slate-500 dark:text-zinc-400 mt-0.5">{description}</p>}
      </div>
      <div className="ml-4 shrink-0">{children}</div>
    </div>
  );
}

function Toggle({ defaultChecked = false }: { defaultChecked?: boolean }) {
  const [on, setOn] = React.useState(defaultChecked);
  return (
    <button
      onClick={() => setOn(!on)}
      className={`w-11 h-6 rounded-full transition-colors ${on ? 'bg-cyan-600 dark:bg-cyan-500' : 'bg-slate-300 dark:bg-zinc-700'} relative shadow-inner`}
    >
      <span
        className={`block w-4 h-4 bg-white rounded-full absolute top-1 transition-transform shadow ${on ? 'translate-x-6' : 'translate-x-1'}`}
      />
    </button>
  );
}

export default function AdminSettingsPage() {
  return (
    <div>
      <PageHeader
        title="Platform Settings"
        description="Configure global settings for the SAMStack Tech platform."
      />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <SettingsSection title="Notifications" icon={Bell}>
          <SettingRow label="Email Notifications" description="Send emails on important events">
            <Toggle defaultChecked={true} />
          </SettingRow>
          <SettingRow label="New User Alerts" description="Notify admin when a new user registers">
            <Toggle defaultChecked={true} />
          </SettingRow>
          <SettingRow label="Intern Submission Alerts" description="Notify mentor on task submission">
            <Toggle defaultChecked={true} />
          </SettingRow>
        </SettingsSection>

        <SettingsSection title="Security" icon={Shield}>
          <SettingRow label="Two-Factor Authentication" description="Require 2FA for admin accounts">
            <Toggle />
          </SettingRow>
          <SettingRow label="Session Timeout" description="Auto-logout after inactivity">
            <select className="bg-slate-50 dark:bg-zinc-800 border border-slate-200 dark:border-zinc-700 text-slate-800 dark:text-zinc-200 text-sm rounded-xl px-3 py-1.5 outline-none font-medium">
              <option>30 minutes</option>
              <option>1 hour</option>
              <option>4 hours</option>
              <option>24 hours</option>
            </select>
          </SettingRow>
          <SettingRow label="Google Login" description="Allow users to sign in with Google">
            <Toggle defaultChecked={true} />
          </SettingRow>
        </SettingsSection>

        <SettingsSection title="Platform" icon={Globe}>
          <SettingRow label="Maintenance Mode" description="Take the platform offline for maintenance">
            <Toggle />
          </SettingRow>
          <SettingRow label="Open Registrations" description="Allow anyone to create a new account">
            <Toggle defaultChecked={true} />
          </SettingRow>
        </SettingsSection>

        <SettingsSection title="Email Service" icon={Mail}>
          <SettingRow label="SMTP Provider" description="Currently using Resend (resend.com)">
            <span className="text-xs font-bold px-2.5 py-1 rounded-full bg-emerald-100 text-emerald-900 border border-emerald-300 dark:bg-emerald-500/15 dark:text-emerald-300 dark:border-emerald-500/30">
              Connected
            </span>
          </SettingRow>
          <SettingRow label="Certificate Emails" description="Auto-send certificate on generation">
            <Toggle defaultChecked={true} />
          </SettingRow>
          <SettingRow label="Welcome Email" description="Send welcome email to new users">
            <Toggle defaultChecked={true} />
          </SettingRow>
        </SettingsSection>

        <div className="lg:col-span-2">
          <SettingsSection title="Database" icon={Database}>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="p-4 rounded-xl bg-slate-50 dark:bg-zinc-800/60 border border-slate-200 dark:border-zinc-700/60">
                <p className="text-xs font-semibold text-slate-500 dark:text-zinc-400 mb-1">Database Provider</p>
                <p className="text-sm font-bold text-slate-900 dark:text-white">Firebase Firestore</p>
              </div>
              <div className="p-4 rounded-xl bg-slate-50 dark:bg-zinc-800/60 border border-slate-200 dark:border-zinc-700/60">
                <p className="text-xs font-semibold text-slate-500 dark:text-zinc-400 mb-1">Auth Provider</p>
                <p className="text-sm font-bold text-slate-900 dark:text-white">Firebase Auth</p>
              </div>
              <div className="p-4 rounded-xl bg-slate-50 dark:bg-zinc-800/60 border border-slate-200 dark:border-zinc-700/60">
                <p className="text-xs font-semibold text-slate-500 dark:text-zinc-400 mb-1">Storage</p>
                <p className="text-sm font-bold text-slate-900 dark:text-white">Firebase Storage</p>
              </div>
            </div>
          </SettingsSection>
        </div>
      </div>
    </div>
  );
}
