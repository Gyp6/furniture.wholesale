import { ExternalLink, History } from 'lucide-react';
import Link from 'next/link';

export function LinkExpiredForm() {
  return (
    <div className={'flex flex-col items-center gap-5 text-center'}>
      <div
        className={
          'flex size-14 items-center justify-center rounded-full bg-red-100'
        }
      >
        <History
          className={'size-7 text-red-500'}
          strokeWidth={2.5}
        />
      </div>

      <div className={'space-y-4'}>
        <h2 className={'text-3xl font-semibold tracking-tight text-[#1A1A2E]'}>
          Security link expired
        </h2>
        <p className={'text-sm font-medium text-muted-foreground max-w-70'}>
          For your protection, password reset and confirmation links expire
          after 24 hours. Don't worry, we can send you a new one right away.
        </p>
      </div>

      <Link
        href={'/forgot-password'}
        className={
          'inline-flex h-12 w-full items-center justify-center gap-2 rounded-full bg-[#1A1A2E] text-sm font-semibold text-white transition-colors hover:bg-[#2a2a45]'
        }
      >
        Send New Recovery Link
        <ExternalLink className={'h-4 w-4'} />
      </Link>

      <Link
        href={'/login'}
        className={'font-semibold text-blue-600 text-sm hover:underline'}
      >
        Back in Login
      </Link>
    </div>
  );
}
