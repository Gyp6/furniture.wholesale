'use client';

import { Skeleton } from '@shadcn/skeleton';
import Link from 'next/link';
import { Suspense } from 'react';

import { Button } from '@/components/ui/shadcn/button';
import { ROUTES } from '@/constants';
import { authClient } from '@/lib';
import { LOGO } from '@/shared/data/icons';

import { HeaderNav } from './header-nav';
import { HeaderSearch } from './header-search';

export function HeaderContent() {
  const { data: sessionData, isPending } = authClient.useSession();
  const session = sessionData?.session;
  const user = sessionData?.user;

  if (isPending) {
    return <HeaderSkeleton />;
  }

  return (
    <div className={'flex items-center justify-end gap-2 min-w-80'}>
      {session ? (
        <Suspense fallback={<HeaderSkeleton />}>
          <HeaderSearch user={user || null} />
        </Suspense>
      ) : (
        <>
          <Link href={ROUTES.AUTH.LOGIN}>
            <Button
              variant={'outline'}
              size={'sm'}
              className={'hover:bg-white/80'}
            >
              Login
            </Button>
          </Link>
          <Link href={ROUTES.AUTH.REGISTER}>
            <Button
              variant={'outline'}
              size={'sm'}
              className={
                'border-neutral-500 text-white bg-transparent hover:bg-white/10 hover:text-white'
              }
            >
              Sign Up
            </Button>
          </Link>
        </>
      )}
    </div>
  );
}

export function HeaderSkeleton() {
  return (
    <>
      <Skeleton className={'w-12 h-8 rounded-full'} />
    </>
  );
}

export function Header() {
  const { data: sessionData, isPending } = authClient.useSession();
  const user = sessionData?.user;

  if (isPending) {
    return <HeaderSkeleton />;
  }

  return (
    <header
      className={
        'fixed h-18 left-10 right-10 bg-primary backdrop-blur-md p-10 flex items-center justify-between z-50 rounded-b-4xl'
      }
    >
      <Link
        href={ROUTES.HOME}
        className={'flex items-center gap-2'}
      >
        <LOGO.LogoProject
          color={'white'}
          size={40}
        />
        <span className={'text-white font-bold text-2xl tracking-tight'}>
          Furniture.wholesale
        </span>
      </Link>

      <HeaderNav user={user || null} />

      <HeaderContent />
    </header>
  );
}
