import { Metadata } from 'next';

import AuthPage from '@/components/pages/auth';

export const metadata: Metadata = {
  title: 'Auth',
};

export default function Auth() {
  return (
    <>
      <AuthPage />
    </>
  );
}
