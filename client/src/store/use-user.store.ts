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
  role: TRole;
  companyId: null | string;
  banExpires: null | string;
  banReason: null | string;
  banned: boolean;
  createdAt: string;
  updatedAt: string;
}

interface UserAction {
  setUser: (user: IUser | null) => void;

  setId: (id: string) => void;
  setName: (name: string) => void;
  setEmail: (email: string) => void;
  setEmailVerified: (emailVerified: boolean) => void;
  setImage: (image: null | string) => void;
  setRole: (role: TRole) => void;
  setCompanyId: (companyId: null | string) => void;
  setBanExpires: (banExpires: null | string) => void;
  setBanReason: (banReason: null | string) => void;
  setBanned: (banned: boolean) => void;
  setCreatedAt: (createdAt: string) => void;
  setUpdatedAt: (updatedAt: string) => void;

  clearUser: () => void;
}

const initialState: UserState = {
  user: null,
  id: '',
  name: '',
  email: '',
  emailVerified: false,
  image: null,
  role: 'DESIGNER',
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

      setId: id =>
        set(state => ({ id, user: state.user ? { ...state.user, id } : null })),
      setName: name =>
        set(state => ({
          name,
          user: state.user ? { ...state.user, name } : null,
        })),
      setEmail: email =>
        set(state => ({
          email,
          user: state.user ? { ...state.user, email } : null,
        })),
      setEmailVerified: emailVerified =>
        set(state => ({
          emailVerified,
          user: state.user ? { ...state.user, emailVerified } : null,
        })),
      setImage: image =>
        set(state => ({
          image,
          user: state.user ? { ...state.user, image } : null,
        })),
      setRole: role =>
        set(state => ({
          role,
          user: state.user ? { ...state.user, role } : null,
        })),
      setCompanyId: companyId =>
        set(state => ({
          companyId,
          user: state.user ? { ...state.user, companyId } : null,
        })),
      setBanExpires: banExpires =>
        set(state => ({
          banExpires,
          user: state.user ? { ...state.user, banExpires } : null,
        })),
      setBanReason: banReason =>
        set(state => ({
          banReason,
          user: state.user ? { ...state.user, banReason } : null,
        })),
      setBanned: banned =>
        set(state => ({
          banned,
          user: state.user ? { ...state.user, banned } : null,
        })),
      setCreatedAt: createdAt =>
        set(state => ({
          createdAt,
          user: state.user ? { ...state.user, createdAt } : null,
        })),
      setUpdatedAt: updatedAt =>
        set(state => ({
          updatedAt,
          user: state.user ? { ...state.user, updatedAt } : null,
        })),

      clearUser: () => set(initialState),
    }),
    {
      name: 'gyp6-user-storage',
    },
  ),
);
