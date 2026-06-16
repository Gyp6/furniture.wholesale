'use client';

import { useForm } from '@tanstack/react-form-nextjs';
import { useRouter, useSearchParams } from 'next/navigation';
import { useState } from 'react';
import { toast } from 'sonner';

import { ROUTES } from '@/constants';
import { authClient } from '@/lib';
import { forgotPasswordFormOpts } from '@/shared/form-options';

export function useForgotPasswordForm() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const token = searchParams.get('token');

  const [showPassword, setShowPassword] = useState(false);
  const togglePassword = () => setShowPassword(prev => !prev);

  const form = useForm({
    ...forgotPasswordFormOpts,
    onSubmit: async ({ value }) => {
      let promise;

      if (token) {
        promise = authClient.resetPassword({
          newPassword: value.password,
          token: token,
        });
      } else {
        promise = authClient.requestPasswordReset({
          email: value.email,
          redirectTo: window.location.href,
        });
      }

      toast.promise(promise, {
        loading: token ? 'Resetting password...' : 'Sending email...',
        success: () => {
          if (token) {
            router.push(ROUTES.AUTH.LOGIN);
            return 'Password reset successfully! You can now login.';
          }
          return 'Recovery link sent! Check your email.';
        },
        error: err => err.message,
        position: 'top-center',
      });
    },
  });

  return { form, isResetMode: !!token, showPassword, togglePassword };
}
