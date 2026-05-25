'use client';

import { Eye, EyeOff } from 'lucide-react';

import { FormStateSync } from '@/components/sections/auth';
import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
} from '@/components/ui/shadcn/field';
import { Input } from '@/components/ui/shadcn/input';
import { useForgotPasswordForm } from '@/hooks';
import { emailSchema, passwordSchema } from '@/shared/schemas';

export function ForgotPasswordForm() {
  const { form, isResetMode, showPassword, togglePassword } =
    useForgotPasswordForm();
  return (
    <form
      id={'auth-forgot-password-form'}
      onSubmit={e => {
        e.preventDefault();
        e.stopPropagation();
        form.handleSubmit();
      }}
    >
      <FieldGroup>
        {!isResetMode ? (
          <form.Field
            name={'email'}
            validators={{ onChange: emailSchema }}
          >
            {field => {
              const isInvalid =
                field.state.meta.isTouched && !field.state.meta.isValid;

              return (
                <Field data-invalid={isInvalid}>
                  <FieldLabel htmlFor={field.name}>Business Email</FieldLabel>
                  <Input
                    id={field.name}
                    name={field.name}
                    type={field.name}
                    value={field.state.value}
                    onBlur={field.handleBlur}
                    onChange={e => field.handleChange(e.target.value)}
                    aria-invalid={isInvalid}
                    placeholder={'name@mail.com'}
                    autoComplete={field.name}
                  />
                  {isInvalid && <FieldError errors={field.state.meta.errors} />}
                </Field>
              );
            }}
          </form.Field>
        ) : (
          <form.Field
            name={'password'}
            validators={{ onChange: passwordSchema }}
          >
            {field => {
              const isInvalid =
                field.state.meta.isTouched && !field.state.meta.isValid;

              return (
                <Field data-invalid={isInvalid}>
                  <FieldLabel htmlFor={field.name}>New Password</FieldLabel>

                  <div className={'relative'}>
                    <Input
                      id={field.name}
                      name={field.name}
                      type={showPassword ? 'text' : 'password'}
                      value={field.state.value}
                      onBlur={field.handleBlur}
                      onChange={e => field.handleChange(e.target.value)}
                      aria-invalid={isInvalid}
                      autoComplete={'current-password'}
                      placeholder={'••••••••'}
                      className={'pr-11'}
                    />
                    <button
                      type={'button'}
                      onClick={togglePassword}
                      className={
                        'absolute inset-y-0 right-4 flex items-center text-muted-foreground hover:text-primary'
                      }
                    >
                      {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                    </button>
                  </div>
                  {isInvalid && <FieldError errors={field.state.meta.errors} />}
                </Field>
              );
            }}
          </form.Field>
        )}
      </FieldGroup>

      <form.Subscribe selector={s => [s.canSubmit, s.isSubmitting]}>
        {([canSubmit, isSubmitting]) => (
          <FormStateSync
            canSubmit={canSubmit}
            isSubmitting={isSubmitting as boolean}
          />
        )}
      </form.Subscribe>
    </form>
  );
}
