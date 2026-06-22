'use client';

import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

import {
  DesignerDashboardPage,
  HoRecaDashboardPage,
  RetailorDashboardPage,
  SupplierPersonalDashboardPage,
} from '@/components/sections/core/dashboard';
import { useAuthStatus } from '@/hooks/use-auth-status.hook';

export default function DashboardPage() {
  const { user, isLoading, isLoggedIn } = useAuthStatus();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading && !isLoggedIn) {
      router.push('/login');
    }
  }, [isLoading, isLoggedIn, router]);

  if (isLoading) {
    return (
      <div className={'flex items-center justify-center min-h-[400px]'}>
        <div
          className={
            'animate-spin rounded-full h-8 w-8 border-b-2 border-secondary'
          }
        />
      </div>
    );
  }

  if (!isLoggedIn || !user) {
    return null;
  }

  switch (user.role) {
    case 'SUPPLIER':
      return <SupplierPersonalDashboardPage />;
    case 'DESIGNER':
      return <DesignerDashboardPage />;
    case 'RETAILER':
      return <RetailorDashboardPage />;
    case 'HORECA':
      return <HoRecaDashboardPage />;
    default:
      return <>Unsupported role: {user.role}</>;
  }
}
