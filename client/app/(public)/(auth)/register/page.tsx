import { Metadata } from 'next';

import { RegisterPage } from '@/components/pages/auth';

export const metadata: Metadata = {
  title: 'Register',
};

export default function Register() {
  return (
    <>
      <RegisterPage />
    </>
  );
}
