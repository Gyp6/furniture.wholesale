import { create } from 'zustand';
import { persist } from 'zustand/middleware';

import { IUser, TRole } from '@/shared/types';

interface UserState {
  user: IUser | null;

  id: string;
  name: string;
  email: string;
  emailVerified: boolean;
  image: null | string;
  role: null | TRole;
  companyId: null | string;
  banExpires: null | string;
  banReason: null | string;
  banned: boolean;
  createdAt: string;
  updatedAt: string;
}

interface UserAction {
  setUser: (user: IUser | null) => void;
  clearUser: () => void;
}

const initialState: UserState = {
  user: null,
  id: '',
  name: '',
  email: '',
  emailVerified: false,
  image: null,
  role: null,
  companyId: null,
  banExpires: null,
  banReason: null,
  banned: false,
  createdAt: '',
  updatedAt: '',
};

export const useUserStore = create<UserState & UserAction>()(
  persist(
    set => ({
      ...initialState,

      setUser: user => {
        if (!user) {
          set(initialState);
          return;
        }

        const cDate =
          (user.createdAt as unknown) instanceof Date
            ? (user.createdAt as unknown as Date).toISOString()
            : (user.createdAt as string);

        const uDate =
          (user.updatedAt as unknown) instanceof Date
            ? (user.updatedAt as unknown as Date).toISOString()
            : (user.updatedAt as string);

        set({
          user,
          ...user,
          createdAt: cDate,
          updatedAt: uDate,
        });
      },

      clearUser: () => set(initialState),
    }),
    {
      name: 'gyp6-user-storage',
    },
  ),
);
