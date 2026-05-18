'use client';

import { FormStateSync } from '@/components/sections/auth';
import { Checkbox } from '@/components/ui/shadcn/checkbox';
import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
} from '@/components/ui/shadcn/field';
import { Input } from '@/components/ui/shadcn/input';
import { Label } from '@/components/ui/shadcn/label';
import { ROUTES } from '@/constants';
import { useLoginForm } from '@/hooks';
import { Eye, EyeOff } from 'lucide-react';

export function LoginForm() {
  const { form, showPassword, togglePassword, remember, setRemember, router } =
    useLoginForm();

  return (
    <form
      id={'auth-login-form'}
      onSubmit={e => {
        e.preventDefault();
        e.stopPropagation();
        form.handleSubmit();
      }}
    >
      <FieldGroup>
        <form.Field name={'email'}>
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

        <form.Field name={'password'}>
          {field => {
            const isInvalid =
              field.state.meta.isTouched && !field.state.meta.isValid;

            return (
              <Field data-invalid={isInvalid}>
                <div className={'flex items-center justify-between w-full'}>
                  <FieldLabel htmlFor={field.name}>Password</FieldLabel>
                  <Label
                    variant={'figma'}
                    size={'figma'}
                    className={'cursor-pointer link'}
                    onClick={() => router.push(ROUTES.AUTH.FORGOT_PASSWORD)}
                    accent
                  >
                    Forgot?
                  </Label>
                </div>

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

        <Field orientation={'horizontal'}>
          <Checkbox
            id={'remember-checkbox'}
            name={'remember-checkbox'}
            checked={remember}
            onCheckedChange={setRemember as (checked: boolean) => void}
          />
          <Label htmlFor={'remember-checkbox'}>Remember this device</Label>
        </Field>
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
