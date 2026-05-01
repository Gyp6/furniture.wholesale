import Link from 'next/link';
import { Suspense } from 'react';

import { LoginForm } from '@/components/forms/auth/login-form';
import { Social, SubmitButton } from '@/components/sections/auth';
import {
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/shadcn/card';
import { Field, FieldSeparator } from '@/components/ui/shadcn/field';
import { ROUTES } from '@/constants';

export function LoginPage() {
  return (
    <>
      <CardHeader>
        <CardTitle>Welcome Back</CardTitle>
        <CardDescription>
          Enter your credentials to access your trade dashboard.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <LoginForm />
      </CardContent>
      <CardFooter className={'flex flex-col gap-8 border-none bg-transparent'}>
        <Field>
          <SubmitButton
            forForm={'auth-login-form'}
            labels={{ standard: 'Sign In', loading: 'Signing In...' }}
          />
        </Field>

        <FieldSeparator className={'w-full'}>Or continue with</FieldSeparator>

        <div className={'flex flex-col gap-6 w-full'}>
          <Suspense>
            <Social />
          </Suspense>

          <p className={'text-center text-xs text-muted-foreground'}>
            Don&apos;t have an account?{' '}
            <Link
              href={ROUTES.AUTH.REGISTER}
              className={'text-secondary font-semibold link'}
            >
              Create Account
            </Link>
          </p>
        </div>
      </CardFooter>
    </>
  );
}
