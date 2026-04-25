import { Metadata } from 'next';

import { RegisterPage } from './registerForm';

export const metadata: Metadata = {
  title: 'Auth',
};

export default function Auth() {
  return <RegisterPage />;
}
