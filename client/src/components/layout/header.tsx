import { Skeleton } from '@shadcn/skeleton';
import Link from 'next/link';
import { Suspense } from 'react';

import { Button } from '@/components/ui/shadcn/button';
import { ROUTES } from '@/constants';
import { getServerSession } from '@/services';

import { Icon } from '../ui';

import { HeaderNav } from './header-nav';
import { HeaderSearch } from './header-search';

export async function HeaderContent() {
  const { user, session } = (await getServerSession()) || {};

  return (
    <div className={'flex items-center justify-end gap-2 min-w-80'}>
      {session ? (
        <HeaderSearch user={user} />
      ) : (
        <>
          <Link href={ROUTES.AUTH.LOGIN}>
            <Button
              variant={'outline'}
              size={'sm'}
              className={
                'rounded-full border-neutral-500 text-white bg-transparent hover:bg-white/10'
              }
            >
              Login
            </Button>
          </Link>
          <Link href={ROUTES.AUTH.REGISTER}>
            <Button
              variant={'outline'}
              size={'sm'}
              className={
                'rounded-full border-neutral-500 text-white bg-transparent hover:bg-white/10'
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
        <Icon
          name={'LogoProject'}
          color={'white'}
          size={40}
        />
        <span className={'text-white font-bold text-2xl tracking-tight'}>
          Furniture.wholesale
        </span>
      </Link>

      <HeaderNav />

      <Suspense fallback={<HeaderSkeleton />}>
        <HeaderContent />
      </Suspense>
    </header>
  );
}
