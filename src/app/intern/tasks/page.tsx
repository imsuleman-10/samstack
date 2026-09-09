'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Loader2, ArrowRight } from 'lucide-react';
import Link from 'next/link';

export default function InternTasksPage() {
  const router = useRouter();

  useEffect(() => {
    // Redirect to dashboard where tasks are submitted directly
    router.replace('/intern/dashboard?tab=submit_task');
  }, [router]);

  return (
    <div className="py-24 text-center text-gray-400 space-y-4">
      <Loader2 className="w-8 h-8 animate-spin mx-auto text-cyan-400" />
      <p className="text-sm">Redirecting to Submit Tasks...</p>
      <div>
        <Link
          href="/intern/dashboard?tab=submit_task"
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl font-bold text-xs text-slate-900 bg-cyan-400 hover:bg-cyan-300 transition-all"
        >
          Go to Submit Tasks <ArrowRight className="w-4 h-4" />
        </Link>
      </div>
    </div>
  );
}
