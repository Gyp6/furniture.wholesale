import { create } from 'zustand';

import { TRole } from '@/shared/types';

interface AuthFormState {
  role: TRole | undefined;

  canSubmit: boolean;
  isSubmitting: boolean;
}

interface AuthFormAction {
  setRole: (role: TRole) => void;
  setFormState: (state: { canSubmit: boolean; isSubmitting: boolean }) => void;
}

export const useAuthFormStore = create<AuthFormState & AuthFormAction>(set => ({
  role: undefined,
  setRole: role => set({ role }),

  canSubmit: false,
  isSubmitting: false,
  setFormState: state => set(state),
}));
