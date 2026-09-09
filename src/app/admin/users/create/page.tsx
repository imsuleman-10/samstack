'use client';

import React, { useState } from 'react';
import { PageHeader } from '@/components/ui/PageHeader';
import { useRouter } from 'next/navigation';
import { Loader2, ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import { toast } from 'sonner';

export default function CreateUserPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  
  const [formData, setFormData] = useState({
    full_name: '',
    email: '',
    password: '',
    role: 'intern',
    phone: '',
    department: '',
    position: '',
    status: 'active',
    authProvider: 'email',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const res = await fetch('/api/admin/users', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const data = await res.json();
      
      if (!res.ok) {
        throw new Error(data.error || 'Failed to create user');
      }

      toast.success('User created successfully!');
      router.push('/admin/users');
    } catch (err: any) {
      setError(err.message);
      toast.error(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl">
      <PageHeader
        title="Create User"
        description="Add a new user to the platform."
        breadcrumbs={[
          { label: 'Users', href: '/admin/users' },
          { label: 'Create' },
        ]}
      />

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="p-6 rounded-2xl border border-slate-200 dark:border-zinc-800 bg-white dark:bg-zinc-900/60 shadow-sm">
          <h2 className="text-lg font-bold text-slate-900 dark:text-white mb-6">Account Details</h2>
          
          {error && (
            <div className="p-3 mb-6 rounded-xl bg-rose-50 dark:bg-red-500/10 border border-rose-200 dark:border-red-500/20 text-rose-700 dark:text-red-400 text-sm font-medium">
              {error}
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <div>
              <label className="block text-sm font-semibold text-slate-700 dark:text-zinc-300 mb-1.5">Full Name *</label>
              <input
                type="text"
                name="full_name"
                required
                value={formData.full_name}
                onChange={handleChange}
                className="w-full h-10 px-3 rounded-xl text-sm text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-zinc-500 bg-slate-50 dark:bg-zinc-800 border border-slate-200 dark:border-zinc-700 outline-none transition-all focus:ring-2 focus:ring-cyan-500"
              />
            </div>
            
            <div>
              <label className="block text-sm font-semibold text-slate-700 dark:text-zinc-300 mb-1.5">Email Address *</label>
              <input
                type="email"
                name="email"
                required
                value={formData.email}
                onChange={handleChange}
                className="w-full h-10 px-3 rounded-xl text-sm text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-zinc-500 bg-slate-50 dark:bg-zinc-800 border border-slate-200 dark:border-zinc-700 outline-none transition-all focus:ring-2 focus:ring-cyan-500"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-slate-700 dark:text-zinc-300 mb-1.5">Authentication Provider *</label>
              <select
                name="authProvider"
                required
                value={formData.authProvider}
                onChange={handleChange}
                className="w-full h-10 px-3 rounded-xl text-sm text-slate-900 dark:text-white bg-slate-50 dark:bg-zinc-800 border border-slate-200 dark:border-zinc-700 outline-none transition-all focus:ring-2 focus:ring-cyan-500"
              >
                <option value="email">Email & Password</option>
                <option value="google">Google Login</option>
              </select>
            </div>

            {formData.authProvider === 'email' && (
              <div>
                <label className="block text-sm font-semibold text-slate-700 dark:text-zinc-300 mb-1.5">Temporary Password *</label>
                <input
                  type="text"
                  name="password"
                  required
                  minLength={6}
                  value={formData.password}
                  onChange={handleChange}
                  className="w-full h-10 px-3 rounded-xl text-sm text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-zinc-500 bg-slate-50 dark:bg-zinc-800 border border-slate-200 dark:border-zinc-700 outline-none transition-all focus:ring-2 focus:ring-cyan-500"
                />
              </div>
            )}

            <div>
              <label className="block text-sm font-semibold text-slate-700 dark:text-zinc-300 mb-1.5">Phone Number</label>
              <input
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                className="w-full h-10 px-3 rounded-xl text-sm text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-zinc-500 bg-slate-50 dark:bg-zinc-800 border border-slate-200 dark:border-zinc-700 outline-none transition-all focus:ring-2 focus:ring-cyan-500"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-slate-700 dark:text-zinc-300 mb-1.5">Role *</label>
              <select
                name="role"
                required
                value={formData.role}
                onChange={handleChange}
                className="w-full h-10 px-3 rounded-xl text-sm text-slate-900 dark:text-white bg-slate-50 dark:bg-zinc-800 border border-slate-200 dark:border-zinc-700 outline-none transition-all focus:ring-2 focus:ring-cyan-500"
              >
                <option value="intern">Intern</option>
                <option value="mentor">Mentor</option>
                <option value="staff">Staff</option>
                <option value="member">Member</option>
                <option value="user">User</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-semibold text-slate-700 dark:text-zinc-300 mb-1.5">Initial Status</label>
              <select
                name="status"
                value={formData.status}
                onChange={handleChange}
                className="w-full h-10 px-3 rounded-xl text-sm text-slate-900 dark:text-white bg-slate-50 dark:bg-zinc-800 border border-slate-200 dark:border-zinc-700 outline-none transition-all focus:ring-2 focus:ring-cyan-500"
              >
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
                <option value="pending">Pending</option>
              </select>
            </div>
          </div>
          
          {(formData.role === 'intern' || formData.role === 'mentor' || formData.role === 'staff') && (
            <>
              <h3 className="text-md font-bold text-slate-900 dark:text-white mb-4 mt-8 border-t border-slate-100 dark:border-zinc-800 pt-6">Role Details</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-semibold text-slate-700 dark:text-zinc-300 mb-1.5">Department</label>
                  {formData.role === 'staff' ? (
                    <select
                      name="department"
                      value={formData.department}
                      onChange={handleChange}
                      className="w-full h-10 px-3 rounded-xl text-sm text-slate-900 dark:text-white bg-slate-50 dark:bg-zinc-800 border border-slate-200 dark:border-zinc-700 outline-none transition-all focus:ring-2 focus:ring-cyan-500"
                    >
                      <option value="">Select Department</option>
                      <option value="Support + Marketing">Support + Marketing</option>
                      <option value="Development">Development</option>
                      <option value="Design">Design</option>
                      <option value="HR">HR</option>
                      <option value="Operations">Operations</option>
                      <option value="Finance">Finance</option>
                      <option value="Sales">Sales</option>
                    </select>
                  ) : (
                    <input
                      type="text"
                      name="department"
                      value={formData.department}
                      onChange={handleChange}
                      className="w-full h-10 px-3 rounded-xl text-sm text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-zinc-500 bg-slate-50 dark:bg-zinc-800 border border-slate-200 dark:border-zinc-700 outline-none transition-all focus:ring-2 focus:ring-cyan-500"
                    />
                  )}
                </div>
                
                <div>
                  <label className="block text-sm font-semibold text-slate-700 dark:text-zinc-300 mb-1.5">Position / Designation</label>
                  <input
                    type="text"
                    name="position"
                    value={formData.position}
                    onChange={handleChange}
                    className="w-full h-10 px-3 rounded-xl text-sm text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-zinc-500 bg-slate-50 dark:bg-zinc-800 border border-slate-200 dark:border-zinc-700 outline-none transition-all focus:ring-2 focus:ring-cyan-500"
                  />
                </div>
              </div>
            </>
          )}
        </div>

        <div className="flex gap-4">
          <Link
            href="/admin/users"
            className="px-5 py-2.5 rounded-xl text-sm font-semibold text-slate-700 dark:text-zinc-300 transition-colors hover:bg-slate-100 dark:hover:bg-white/5 border border-slate-200 dark:border-zinc-800"
          >
            Cancel
          </Link>
          <button
            type="submit"
            disabled={loading}
            className="px-6 py-2.5 rounded-lg text-sm font-semibold flex items-center gap-2 transition-all disabled:opacity-50"
            style={{
              background: 'linear-gradient(135deg,#0ea5e9,#6366f1)',
              color: '#fff',
              boxShadow: '0 4px 16px rgba(14,165,233,0.3)',
            }}
          >
            {loading && <Loader2 className="w-4 h-4 animate-spin" />}
            Create User
          </button>
        </div>
      </form>
    </div>
  );
}
