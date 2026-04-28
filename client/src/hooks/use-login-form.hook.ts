'use client';

import { useForm } from '@tanstack/react-form-nextjs';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { toast } from 'sonner';

import { ROUTES } from '@/constants';
import { authClient } from '@/lib';
import { loginFormOpts } from '@/shared/form-options';
import type { IUser } from '@/shared/types';
import { useUserStore } from '@/store';

export function useLoginForm() {
  const router = useRouter();
  const { setUser } = useUserStore();

  const [showPassword, setShowPassword] = useState(false);
  const [remember, setRemember] = useState(false);

  const togglePassword = () => setShowPassword(prev => !prev);

  const form = useForm({
    ...loginFormOpts,
    onSubmit: async ({ value }) => {
      const loginPromise = authClient.signIn
        .email({
          email: value.email,
          password: value.password,
        })
        .then(result => {
          if (result.error) {
            throw new Error(result.error.message || 'Something went wrong');
          }
          return result.data;
        });

      toast.promise(loginPromise, {
        loading: 'Logging in...',
        success: data => {
          const user = data.user as unknown as IUser;

          setUser(user);

          setTimeout(() => {
            router.push(ROUTES.PROFILE(user.id));
            router.refresh();
          }, 1000);

          return `Welcome back, ${user.name}!`;
        },
        error: err => err.message,
        position: 'top-center',
      });
    },
  });

  return {
    form,
    showPassword,
    togglePassword,
    remember,
    setRemember,
    router,
  };
}
