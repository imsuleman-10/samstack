'use client';

import { useEffect, useState } from 'react';
import type { PlatformUser, InternProfile, MentorProfile } from '@/lib/firestore-schema';

export function useAuth() {
  const [user, setUser] = useState<PlatformUser | null>(null);
  const [internProfile, setInternProfile] = useState<InternProfile | null>(null);
  const [mentorProfile, setMentorProfile] = useState<MentorProfile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;
    async function fetchUser() {
      try {
        const res = await fetch('/api/profile');
        if (!mounted) return;
        if (res.ok) {
          const data = await res.json();
          if (!mounted) return;
          setUser(data.user);
          setInternProfile(data.internProfile);
          setMentorProfile(data.mentorProfile);
        } else {
          setUser(null);
          setInternProfile(null);
          setMentorProfile(null);
        }
      } catch (err) {
        if (!mounted) return;
        setUser(null);
        setInternProfile(null);
        setMentorProfile(null);
      } finally {
        if (mounted) setLoading(false);
      }
    }

    fetchUser();
    return () => { mounted = false; };
  }, []);

  return { user, internProfile, mentorProfile, loading };
}
