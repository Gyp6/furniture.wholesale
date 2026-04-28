import { cva, type VariantProps } from 'class-variance-authority';
import { Label as LabelPrimitive } from 'radix-ui';
import * as React from 'react';

import { cn } from '@/lib/cn';

const labelVariants = cva(
  'flex items-center gap-2 group-data-[disabled=true]:pointer-events-none group-data-[disabled=true]:opacity-50 peer-disabled:cursor-not-allowed peer-disabled:opacity-50 text-primary',
  {
    variants: {
      variant: {
        default: 'leading-none select-none ',
        figma: 'tracking-[0.15em] font-semibold uppercase',
        light: 'text-muted-foreground',
      },
      size: {
        default: '',
        figma: 'text-xs',
        light: 'text-sm',
      },
      accent: {
        true: 'text-secondary',
      },
      required: {
        true: 'text-destructive',
      },
    },
    defaultVariants: {
      variant: 'light',
      size: 'light',
      accent: false,
    },
  },
);

type Props = React.ComponentProps<typeof LabelPrimitive.Root> &
  VariantProps<typeof labelVariants>;

function Label({
  children,
  className,
  variant,
  size,
  accent,
  required,
  ...props
}: Props) {
  return (
    <LabelPrimitive.Root
      data-slot={'label'}
      className={cn(
        labelVariants({
          variant,
          size,
          accent: accent as boolean,
          className,
        }),
      )}
      {...props}
    >
      {children}
      {required && (
        <span
          className={cn(
            labelVariants({
              required: required as boolean,
            }),
          )}
        >
          *
        </span>
      )}
    </LabelPrimitive.Root>
  );
}

export { Label };
