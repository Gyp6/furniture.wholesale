'use client';

import { ArrowRight } from 'lucide-react';
import Link from 'next/link';

const labelCls =
  'text-[11px] font-semibold tracking-[0.15em] text-[#1A1A2E] uppercase';
const inputCls =
  'h-11 w-full rounded-full border border-border bg-white px-4 text-sm placeholder:text-muted-foreground/60 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-foreground/10';

export function ForgotPasswordForm() {
  return (
    <form className={'flex flex-col gap-5'}>
      <header>
        <h2 className={'text-3xl font-semibold tracking-tight text-[#1A1A2E]'}>
          Forgot Password?
        </h2>
        <p className={'mt-2 text-sm font-medium text-muted-foreground'}>
          Enter your email address to receive a recovery link.
          <br />
          We'll help you get back to your profile.
        </p>
      </header>

      <div className={'flex flex-col gap-1.5'}>
        <label
          htmlFor={'email'}
          className={labelCls}
        >
          Email
        </label>
        <input
          id={'email'}
          type={'email'}
          autoComplete={'email'}
          placeholder={'name@company.com'}
          className={inputCls}
        />
      </div>

      <Link
        href={'/check-email'}
        className={
          'mt-2 inline-flex h-12 w-full items-center justify-center gap-2 rounded-full bg-[#1A1A2E] text-sm font-semibold text-white transition-colors hover:bg-[#2a2a45]'
        }
      >
        Send Recovery Link
        <ArrowRight className={'h-4 w-4'} />
      </Link>

      <p className={'text-center text-xs'}>
        <Link
          href={'/login'}
          className={'font-semibold text-blue-600 hover:underline'}
        >
          Back in Login
        </Link>
      </p>
    </form>
  );
}
