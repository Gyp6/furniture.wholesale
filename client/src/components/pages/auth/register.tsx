'use client';

import Link from 'next/link';

import { RegisterForm } from '@/components/forms/auth';
import { SubmitButton } from '@/components/sections/auth';
import { Icon } from '@/components/ui';
import { Button } from '@/components/ui/shadcn/button';
import {
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/shadcn/card';
import { Field } from '@/components/ui/shadcn/field';
import { ROUTES } from '@/constants';
import { useAuthFormStore } from '@/store';

export function RegisterPage() {
  const { step, validatedGoNext, goBack } = useAuthFormStore();
  return (
    <>
      <CardHeader className={'pt-4'}>
        <CardTitle>Registration</CardTitle>
        <CardDescription>
          {step === 1 ? 'Create your account.' : 'Tell us about your business.'}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <RegisterForm />
      </CardContent>
      <CardFooter
        className={'flex flex-col gap-4 border-none bg-transparent pb-4'}
      >
        <Field className={'flex gap-2'}>
          {step === 2 && (
            <Button
              variant={'outline'}
              className={'w-full'}
              onClick={goBack}
              type={'button'}
            >
              <Icon name={'ArrowLeft'} /> Back
            </Button>
          )}

          {step === 1 ? (
            <Button
              className={'group w-full'}
              onClick={() => validatedGoNext?.()}
              type={'button'}
            >
              Continue
              <Icon
                name={'ArrowRight'}
                className={'transition-transform group-hover:translate-x-2'}
              />
            </Button>
          ) : (
            <SubmitButton
              forForm={'auth-register-form'}
              labels={{
                standard: 'Complete Registration',
                loading: 'Registering...',
              }}
            />
          )}
        </Field>

        <p className={'text-center text-xs text-muted-foreground'}>
          Already have an account?{' '}
          <Link
            href={ROUTES.AUTH.LOGIN}
            className={'text-secondary font-semibold link'}
          >
            Login
          </Link>
        </p>
      </CardFooter>
    </>
  );
}
