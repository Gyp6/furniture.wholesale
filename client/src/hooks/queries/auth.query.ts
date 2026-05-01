// hooks/queries/auth.queries.ts
import { useMutation } from '@tanstack/react-query';

import { authService } from '@/services/auth.service';
import { useUserStore } from '@/store';

export const authKeys = {
  all: ['auth'] as const,
  verify: () => [...authKeys.all, 'verify'] as const,
};

export const useVerifyEmail = () => {
  const { setUser } = useUserStore();

  return useMutation({
    mutationKey: authKeys.verify(),
    mutationFn: (code: string) => authService.verifyEmail(code),
    onSuccess: data => {
      if (data.user) {
        setUser(data.user);
      }
    },
  });
};

export const useResendOtp = () => {
  return useMutation({
    mutationFn: () => authService.resendOtp(),
  });
};
