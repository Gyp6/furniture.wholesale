import { create } from 'zustand';

import { TRole } from '@/shared/types';

interface AuthFormState {
  role: TRole | undefined;

  canSubmit: boolean;
  isSubmitting: boolean;

  step: 1 | 2;
  validatedGoNext: (() => Promise<void>) | null;
}

interface AuthFormAction {
  setRole: (role: TRole) => void;
  setStep: (step: 1 | 2) => void;
  setFormState: (state: { canSubmit: boolean; isSubmitting: boolean }) => void;

  goNext: () => void;
  goBack: () => void;
  setValidatedGoNext: (fn: () => Promise<void>) => void;
  reset: () => void;
}

const initialState = {
  role: undefined,
  step: 1 as const,
  canSubmit: false,
  isSubmitting: false,
  validatedGoNext: null,
};

export const useAuthFormStore = create<AuthFormState & AuthFormAction>(set => ({
  ...initialState,

  setRole: role => set({ role }),
  setStep: step => set({ step }),
  setFormState: state => set(state),

  goNext: () => set(s => ({ step: s.step === 1 ? 2 : s.step })),
  goBack: () => set(s => ({ step: s.step === 2 ? 1 : s.step })),
  setValidatedGoNext: fn => set({ validatedGoNext: fn }),

  reset: () => set(initialState),
}));
