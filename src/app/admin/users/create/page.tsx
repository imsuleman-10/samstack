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
        <div className="p-6 rounded-xl border" style={{ background: 'rgba(17,24,39,0.5)', borderColor: 'rgba(255,255,255,0.08)' }}>
          <h2 className="text-lg font-semibold text-white mb-6">Account Details</h2>
          
          {error && (
            <div className="p-3 mb-6 rounded bg-red-500/10 border border-red-500/20 text-red-400 text-sm">
              {error}
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <div>
              <label className="block text-sm font-medium text-gray-400 mb-1.5">Full Name *</label>
              <input
                type="text"
                name="full_name"
                required
                value={formData.full_name}
                onChange={handleChange}
                className="w-full h-10 px-3 rounded-lg text-sm text-white outline-none transition-all focus:ring-2"
                style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)' }}
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-400 mb-1.5">Email Address *</label>
              <input
                type="email"
                name="email"
                required
                value={formData.email}
                onChange={handleChange}
                className="w-full h-10 px-3 rounded-lg text-sm text-white outline-none transition-all focus:ring-2"
                style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)' }}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-400 mb-1.5">Authentication Provider *</label>
              <select
                name="authProvider"
                required
                value={formData.authProvider}
                onChange={handleChange}
                className="w-full h-10 px-3 rounded-lg text-sm text-white outline-none transition-all focus:ring-2"
                style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)' }}
              >
                <option value="email" className="bg-gray-900">Email & Password</option>
                <option value="google" className="bg-gray-900">Google Login</option>
              </select>
            </div>

            {formData.authProvider === 'email' && (
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-1.5">Temporary Password *</label>
                <input
                  type="text"
                  name="password"
                  required
                  minLength={6}
                  value={formData.password}
                  onChange={handleChange}
                  className="w-full h-10 px-3 rounded-lg text-sm text-white outline-none transition-all focus:ring-2"
                  style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)' }}
                />
              </div>
            )}

            <div>
              <label className="block text-sm font-medium text-gray-400 mb-1.5">Phone Number</label>
              <input
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                className="w-full h-10 px-3 rounded-lg text-sm text-white outline-none transition-all focus:ring-2"
                style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)' }}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-400 mb-1.5">Role *</label>
              <select
                name="role"
                required
                value={formData.role}
                onChange={handleChange}
                className="w-full h-10 px-3 rounded-lg text-sm text-white outline-none transition-all focus:ring-2"
                style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)' }}
              >
                <option value="intern" className="bg-gray-900">Intern</option>
                <option value="mentor" className="bg-gray-900">Mentor</option>
                <option value="staff" className="bg-gray-900">Staff</option>
                <option value="member" className="bg-gray-900">Member</option>
                <option value="user" className="bg-gray-900">User</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-400 mb-1.5">Initial Status</label>
              <select
                name="status"
                value={formData.status}
                onChange={handleChange}
                className="w-full h-10 px-3 rounded-lg text-sm text-white outline-none transition-all focus:ring-2"
                style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)' }}
              >
                <option value="active" className="bg-gray-900">Active</option>
                <option value="inactive" className="bg-gray-900">Inactive</option>
                <option value="pending" className="bg-gray-900">Pending</option>
              </select>
            </div>
          </div>
          
          {(formData.role === 'intern' || formData.role === 'mentor' || formData.role === 'staff') && (
            <>
              <h3 className="text-md font-medium text-white mb-4 mt-8 border-t border-white/5 pt-6">Role Details</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-1.5">Department</label>
                  {formData.role === 'staff' ? (
                    <select
                      name="department"
                      value={formData.department}
                      onChange={handleChange}
                      className="w-full h-10 px-3 rounded-lg text-sm text-white outline-none transition-all focus:ring-2"
                      style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)' }}
                    >
                      <option value="" className="bg-gray-900">Select Department</option>
                      <option value="Support + Marketing" className="bg-gray-900">Support + Marketing</option>
                      <option value="Development" className="bg-gray-900">Development</option>
                      <option value="Design" className="bg-gray-900">Design</option>
                      <option value="HR" className="bg-gray-900">HR</option>
                      <option value="Operations" className="bg-gray-900">Operations</option>
                      <option value="Finance" className="bg-gray-900">Finance</option>
                      <option value="Sales" className="bg-gray-900">Sales</option>
                    </select>
                  ) : (
                    <input
                      type="text"
                      name="department"
                      value={formData.department}
                      onChange={handleChange}
                      className="w-full h-10 px-3 rounded-lg text-sm text-white outline-none transition-all focus:ring-2"
                      style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)' }}
                    />
                  )}
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-1.5">Position / Designation</label>
                  <input
                    type="text"
                    name="position"
                    value={formData.position}
                    onChange={handleChange}
                    className="w-full h-10 px-3 rounded-lg text-sm text-white outline-none transition-all focus:ring-2"
                    style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)' }}
                  />
                </div>
              </div>
            </>
          )}
        </div>

        <div className="flex gap-4">
          <Link
            href="/admin/users"
            className="px-5 py-2.5 rounded-lg text-sm font-medium text-gray-300 transition-colors hover:bg-white/5 border border-white/10"
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
