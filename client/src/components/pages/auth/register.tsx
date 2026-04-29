import Link from 'next/link';

import { RegisterForm } from '@/components/forms/auth';
import { SubmitButton } from '@/components/sections/auth';
import {
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/shadcn/card';
import { Field } from '@/components/ui/shadcn/field';
import { ROUTES } from '@/constants';

export function RegisterPage() {
  return (
    <>
      <CardHeader className={'pt-4'}>
        <CardTitle>Registration</CardTitle>
        <CardDescription>
          Join the architectural procurement network.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <RegisterForm />
      </CardContent>
      <CardFooter className={'flex flex-col gap-4 border-none bg-transparent pb-4'}>
        <Field>
          <SubmitButton
            forForm={'auth-register-form'}
            labels={{
              standard: 'Complete Registration',
              loading: 'Registering...',
            }}
          />
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
