'use client';

import { Icon } from '@/components/ui';
import { Button } from '@/components/ui/shadcn/button';
import { cn } from '@/lib/cn';
import { useAuthFormStore } from '@/store';

type TLabels = {
  loading: string;
  standard: string;
};

interface Props {
  className?: string;
  forForm: string;
  labels: TLabels;
}

export function SubmitButton({ className, forForm, labels }: Props) {
  const { canSubmit, isSubmitting } = useAuthFormStore();

  return (
    <Button
      type={'submit'}
      form={forForm}
      className={cn('group w-full', className)}
      isLoading={isSubmitting}
      disabled={!canSubmit || isSubmitting}
    >
      {isSubmitting ? labels.loading : labels.standard}
      {!isSubmitting && (
        <Icon
          name={'ArrowRight'}
          className={'transition-transform group-hover:translate-x-2'}
        />
      )}
    </Button>
  );
}
