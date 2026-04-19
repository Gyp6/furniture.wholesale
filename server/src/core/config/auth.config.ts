import type { BetterAuthOptions } from 'better-auth';

import { AUTH_LIMITS } from '@/shared/constants';

export const emailAndPasswordConfig: BetterAuthOptions['emailAndPassword'] = {
  enabled: true,
  minPasswordLength: AUTH_LIMITS.MIN_PASSWORD_LENGTH,
  maxPasswordLength: AUTH_LIMITS.MAX_PASSWORD_LENGTH,
};
