import { Metadata } from 'next';
import { Suspense } from 'react';

import { ForgotPasswordPage } from '@/components/pages/auth';

export const metadata: Metadata = {
  title: 'Forgot Password',
};

export default function ForgotPassword() {
  return (
    <>
      <Suspense>
        <ForgotPasswordPage />
      </Suspense>
    </>
  );
}
