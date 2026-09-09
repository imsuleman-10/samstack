'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Loader2, ArrowRight } from 'lucide-react';
import Link from 'next/link';

export default function InternDocumentsPage() {
  const router = useRouter();

  useEffect(() => {
    // Redirect to unified intern dashboard documents tab
    router.replace('/intern/dashboard?tab=documents');
  }, [router]);

  return (
    <div className="py-24 text-center text-gray-400 space-y-4">
      <Loader2 className="w-8 h-8 animate-spin mx-auto text-cyan-400" />
      <p className="text-sm">Redirecting to My Documents in Dashboard...</p>
      <div>
        <Link
          href="/intern/dashboard?tab=documents"
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl font-bold text-xs text-slate-900 bg-cyan-400 hover:bg-cyan-300 transition-all"
        >
          Go to Documents <ArrowRight className="w-4 h-4" />
        </Link>
      </div>
    </div>
  );
}
