import type { BetterAuthOptions } from 'better-auth';

export const AUTH_LIMITS = {
  MIN_PASSWORD_LENGTH: 8,
  MAX_PASSWORD_LENGTH: 32,
} as const;

export const emailAndPasswordConfig: BetterAuthOptions['emailAndPassword'] = {
  enabled: true,
  minPasswordLength: AUTH_LIMITS.MIN_PASSWORD_LENGTH,
  maxPasswordLength: AUTH_LIMITS.MAX_PASSWORD_LENGTH,
};

