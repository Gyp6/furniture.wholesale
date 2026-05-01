'use client';

import { useSearchParams } from 'next/navigation';
import { Suspense } from 'react';

import { ForgotPasswordForm } from '@/components/forms/auth';
import { SubmitButton } from '@/components/sections/auth';
import {
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/shadcn/card';

export function ForgotPasswordPage() {
  const searchParams = useSearchParams();
  const isResetMode = !!searchParams.get('token');

  return (
    <>
      <CardHeader>
        <CardTitle>
          {isResetMode ? 'Reset Password' : 'Forgot Password?'}
        </CardTitle>
        <CardDescription>
          {isResetMode
            ? 'Please enter your new password below.'
            : 'Enter your email address to receive a recovery link.'}
        </CardDescription>
      </CardHeader>

      <CardContent>
        <Suspense>
          <ForgotPasswordForm />
        </Suspense>
      </CardContent>

      <CardFooter>
        <SubmitButton
          forForm={'auth-forgot-password-form'}
          labels={{
            standard: isResetMode ? 'Update Password' : 'Send Recovery Link',
            loading: 'Processing...',
          }}
        />
      </CardFooter>
    </>
  );
}
