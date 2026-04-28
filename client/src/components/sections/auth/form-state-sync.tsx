'use client';

import { useEffect } from 'react';

import { useAuthFormStore } from '@/store';

interface Props {
  canSubmit: boolean;
  isSubmitting: boolean;
}

export function FormStateSync({ canSubmit, isSubmitting }: Props) {
  const setFormState = useAuthFormStore(s => s.setFormState);

  useEffect(() => {
    setFormState({ canSubmit, isSubmitting });
  }, [canSubmit, isSubmitting, setFormState]);

  return null;
}
