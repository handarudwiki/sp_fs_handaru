"use client";
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/store/authStore';

interface GuestGuardProps {
  children: React.ReactNode;
}

export function GuestGuard({ children }: GuestGuardProps) {
  const router = useRouter();
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const hasHydrated = useAuthStore((state) => state.hasHydrated);

  useEffect(() => {
    if (hasHydrated && isAuthenticated) {
      router.push('/dashboard'); // arahkan ke halaman yang sesuai
    }
  }, [isAuthenticated, hasHydrated, router]);

  if (!hasHydrated) {
    return <div>Loading...</div>; // hindari render sebelum state siap
  }

  if (isAuthenticated) {
    return <div>Redirecting...</div>;
  }

  return <>{children}</>;
}
