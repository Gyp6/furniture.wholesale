'use client';

import { useRouter } from 'next/navigation';

import { Button } from '@/components/ui/button';

export default function CrmNotFound() {
  const router = useRouter();

  return (
    <main className='flex h-screen flex-col items-center justify-center gap-6 bg-primary-foreground'>
      <h1 className='text-9xl font-black'>404</h1>
      <p className='text-xl max-w-xl text-center'>
        Sorry, the page you’re looking for does not exist or has been moved
        please go back
      </p>
      <Button
        size={'lg'}
        onClick={() => router.back()}
        className='gap-2'
      >
        {/*<Icon name="arrowLeft" size={18} />*/}
        Back
      </Button>
    </main>
  );
}
