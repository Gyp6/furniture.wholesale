import { CheckCircle2 } from 'lucide-react';
import Link from 'next/link';

export function CheckEmailForm() {
  return (
    <div className={'flex flex-col items-center gap-5 text-center'}>
      <div
        className={
          'flex size-14 items-center justify-center rounded-full bg-green-500'
        }
      >
        <CheckCircle2
          className={'size-7 text-emerald-500'}
          strokeWidth={2.5}
        />
      </div>

      <div className={'space-y-4'}>
        <h2 className={'text-3xl font-semibold tracking-tight text-[#1A1A2E]'}>
          Check Your Email
        </h2>
        <p className={'text-sm font-medium text-muted-foreground max-w-65'}>
          We have sent a password recovery link to your email address. Please
          follow the instructions in the email to reset your credentials.
        </p>
      </div>

      <p className={'text-xs text-muted-foreground'}>
        Didn't receive the email?{' '}
        <Link
          href={'/forgot-password'}
          className={'font-semibold text-blue-600 hover:underline'}
        >
          Resend link
        </Link>
      </p>

      <Link
        href={'/login'}
        className={'font-semibold text-blue-600 text-sm hover:underline'}
      >
        Back in Login
      </Link>
    </div>
  );
}
