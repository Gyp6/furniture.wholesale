import { Metadata } from 'next';

import { LoginPage } from '@/components/pages/auth';

export const metadata: Metadata = {
  title: 'Login',
};

export default function Login() {
  return (
    <>
      <LoginPage />
    </>
  );
}
