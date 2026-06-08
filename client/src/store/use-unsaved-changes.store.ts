import { create } from 'zustand';

interface UnsavedChangesState {
  isOpen: boolean;
  targetUrl: string | null;
  onConfirm: (() => void) | null;
}

interface UnsavedChangesAction {
  show: (targetUrl: string | null, onConfirm?: (() => void) | null) => void;
  hide: () => void;
}

export const useUnsavedChangesStore = create<
  UnsavedChangesState & UnsavedChangesAction
>(set => ({
  isOpen: false,
  targetUrl: null,
  onConfirm: null,

  show: (targetUrl, onConfirm = null) =>
    set({ isOpen: true, targetUrl, onConfirm }),
  hide: () => set({ isOpen: false, targetUrl: null, onConfirm: null }),
}));
