'use client';

import { useSearchParams } from 'next/navigation';
import { useEffect } from 'react';
import { toast } from 'sonner';

import { Button } from '@/components/ui/shadcn/button';
import { Field } from '@/components/ui/shadcn/field';
import { OAUTH_ERRORS, ROUTES } from '@/constants';
import { authClient } from '@/lib';
import { BRANDS_MONOCHROME } from '@/shared/data/icons';

export function Social() {
  const searchParams = useSearchParams();

  useEffect(() => {
    const error = searchParams.get('error');
    if (error) {
      toast.error(
        OAUTH_ERRORS[error] ?? 'Authentication error. Please try again.',
        { position: 'top-center' },
      );
    }
  }, [searchParams]);

  const handleGoogleLogin = () => {
    authClient.signIn.social({
      provider: 'google',
      callbackURL: ROUTES.UI(ROUTES.DASHBOARD),
      errorCallbackURL: ROUTES.UI(ROUTES.AUTH.LOGIN + '?'),
    });
  };
  // const handleAppleLogin = () => {
  //   authClient.signIn.social({
  //     provider: 'apple',
  //     callbackURL: ROUTES.UI(ROUTES.DASHBOARD),
  //     errorCallbackURL: ROUTES.UI(ROUTES.AUTH.LOGIN + '?error=oauth_error'),
  //   });
  // };
  const handleFacebookLogin = () => {
    authClient.signIn.social({
      provider: 'facebook',
      callbackURL: ROUTES.UI(ROUTES.DASHBOARD),
      errorCallbackURL: ROUTES.UI(ROUTES.AUTH.LOGIN + '?error=oauth_error'),
    });
  };
  return (
    <Field className={'grid gap-4 sm:grid-cols-3'}>
      <Button
        variant={'outline'}
        size={'sm'}
        type={'button'}
        disabled
        // onClick={handleAppleLogin}
      >
        <BRANDS_MONOCHROME.AppleMonochrome
          // size={20}
        />
        <span className={'sr-only'}>Login with Apple</span>
      </Button>
      <Button
        variant={'outline'}
        size={'sm'}
        type={'button'}
        onClick={handleGoogleLogin}
      >
        <BRANDS_MONOCHROME.GoogleMonochrome
          // size={20}
        />
        <span className={'sr-only'}>Login with Google</span>
      </Button>
      <Button
        variant={'outline'}
        size={'sm'}
        type={'button'}
        onClick={handleFacebookLogin}
      >
        <BRANDS_MONOCHROME.MetaMonochrome
          // size={20}
        />
        <span className={'sr-only'}>Login with Meta</span>
      </Button>
    </Field>
  );
}
