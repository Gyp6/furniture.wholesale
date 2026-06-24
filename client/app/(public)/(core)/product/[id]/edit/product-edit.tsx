'use client'
import { ProductEditPage } from '@/components/pages/core/product/product-edit';
import { useAuthStatus } from '@/hooks';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

export default function ProductEdit({
	id,
}: {
	id: string
}) {
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
	return <ProductEditPage productId={id} />;
}
