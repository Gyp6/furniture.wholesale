import { adminClient } from 'better-auth/client/plugins';
import { createAuthClient } from 'better-auth/react';

export const authClient = createAuthClient({
  baseURL: process.env.NEXT_PUBLIC_BA_API_URL,
  basePath: process.env.NEXT_PUBLIC_BA_BASE_PATH,
  plugins: [adminClient()],
});