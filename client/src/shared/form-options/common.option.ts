import { formOptions } from '@tanstack/react-form-nextjs';

import { emailSchema, passwordSchema } from '@/shared/schemas';

export const emailOpts = formOptions({
  validators: {
    onChange: emailSchema,
    onChangeDebounceMs: 300,
  },
});

export const passwordOpts = formOptions({
  validators: {
    onChange: passwordSchema,
    onChangeDebounceMs: 300,
  },
});
