'use client';

import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

import { BundleEditPage } from '@/components/pages/core/bundle-edit/bundle-edit';
import { useAuthStatus } from '@/hooks';

export default function BundleEdit({ id }: { id: string }) {
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
  return <BundleEditPage bundleId={id} />;
}
