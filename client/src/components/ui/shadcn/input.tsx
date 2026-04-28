import { cva, type VariantProps } from 'class-variance-authority';
import * as React from 'react';

import { cn } from '@/lib/cn';

const inputVariants = cva(
  'w-full border border-border bg-transparent text-sm focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 disabled:pointer-events-none disabled:cursor-not-allowed disabled:bg-input/50 disabled:opacity-50 aria-invalid:border-destructive aria-invalid:bg-destructive/10 aria-invalid:text-primary',
  {
    variants: {
      variant: {
        default:
          'min-w-0 rounded-lg transition-colors outline-none file:inline-flex file:h-6 file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground md:text-sm dark:bg-input/30 dark:disabled:bg-input/80 dark:aria-invalid:border-destructive/50 dark:aria-invalid:ring-destructive/40 h-8 px-2.5 py-1',
        figma:
          'rounded-full placeholder:text-muted-foreground/60 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-foreground/10 h-11 px-4',
      },
    },
    defaultVariants: {
      variant: 'figma',
    },
  },
);

type Props = React.ComponentProps<'input'> & VariantProps<typeof inputVariants>;

function Input({ className, type, variant, ...props }: Props) {
  return (
    <input
      type={type}
      data-slot={'input'}
      data-variant={variant}
      className={cn(inputVariants({ variant, className }))}
      {...props}
    />
  );
}

export { Input };
