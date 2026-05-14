import { authClient } from '@/lib';

export function useAuthStatus() {
  const { data: session, isPending: isLoading } = authClient.useSession();
  
  return {
    isLoggedIn: !!session,
    user: session?.user,
    isLoading
  };
}