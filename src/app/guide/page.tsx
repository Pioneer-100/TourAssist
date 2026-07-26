'use client';

export const dynamic = 'force-dynamic';

import React, { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import GuideDashboard from '@/components/GuideDashboard';

export default function GuidePage() {
  const { user, profile, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading) {
      if (!user) {
        router.push('/');
      } else if (profile?.role !== 'guide' && profile?.role !== 'admin') {
        router.push('/');
      }
    }
  }, [user, profile, loading, router]);

  if (loading || !user || (profile?.role !== 'guide' && profile?.role !== 'admin')) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-900 text-white">
        <p className="text-xl animate-pulse">Authenticating Guide Access...</p>
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-[#04070c]">
      <GuideDashboard />
    </main>
  );
}
