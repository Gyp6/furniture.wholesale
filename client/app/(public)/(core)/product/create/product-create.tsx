'use client';

import { useRouter } from 'next/navigation';
import { Suspense, useEffect } from 'react';

import { ProductCreatePage } from '@/components/pages/core/product/product-create';
import { useAuthStatus } from '@/hooks';

export default function CreateProduct() {
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
  return (
    <Suspense
      fallback={
        <div className={'p-10 text-center text-muted-foreground'}>
          Loading...
        </div>
      }
    >
      <ProductCreatePage />
    </Suspense>
  );
}
