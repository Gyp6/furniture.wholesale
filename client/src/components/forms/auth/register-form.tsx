'use client';

import {
  FormStateSync,
  RoleButton,
  RolePicker,
} from '@/components/sections/auth';
import { ComboboxSelect, Icon } from '@/components/ui';
import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
} from '@/components/ui/shadcn/field';
import { Input } from '@/components/ui/shadcn/input';
import { RoleButtonsConfig } from '@/config';
import { useRegisterForm } from '@/hooks';
import { cn } from '@/lib/cn';
import { horecaType, specifications } from '@/shared/data/auth';

export function RegisterForm() {
  const {
    form,
    step,
    showPassword,
    togglePassword,
    showConfirm,
    toggleConfirm,
    role,
    handleRoleChange,
  } = useRegisterForm();

  return (
    <>
      {role && (
        <form
          id={'auth-register-form'}
          onSubmit={e => {
            e.preventDefault();
            e.stopPropagation();
            form.handleSubmit();
          }}
          className={cn(
            ' flex flex-col items-center justify-center',
            step === 1 ? 'min-h-110' : 'min-h-96.75',
          )}
        >
          <FieldGroup className={'gap-4'}>
            {/* ── КРОК 1 ─────────────────────────────── */}
            {step === 1 && (
              <>
                <Field>
                  <FieldLabel>I am a…</FieldLabel>
                  <div className={'grid grid-cols-4 gap-2'}>
                    {RoleButtonsConfig.map(item => (
                      <RoleButton
                        key={item.value}
                        {...item}
                        isActive={role === item.value}
                        onClick={handleRoleChange}
                      />
                    ))}
                  </div>
                </Field>

                <form.Field name={'name'}>
                  {field => {
                    const isInvalid =
                      field.state.meta.isTouched && !field.state.meta.isValid;
                    return (
                      <Field data-invalid={isInvalid}>
                        <FieldLabel
                          htmlFor={field.name}
                          required
                        >
                          Name
                        </FieldLabel>
                        <Input
                          id={field.name}
                          name={field.name}
                          type={'text'}
                          value={field.state.value ?? ''}
                          onBlur={field.handleBlur}
                          onChange={e => field.handleChange(e.target.value)}
                          aria-invalid={isInvalid}
                          placeholder={'e.g. Peter...'}
                          autoComplete={field.name}
                        />
                        {isInvalid && (
                          <FieldError errors={field.state.meta.errors} />
                        )}
                      </Field>
                    );
                  }}
                </form.Field>

                <form.Field name={'email'}>
                  {field => {
                    const isInvalid =
                      field.state.meta.isTouched && !field.state.meta.isValid;
                    return (
                      <Field data-invalid={isInvalid}>
                        <FieldLabel
                          htmlFor={field.name}
                          required
                        >
                          Business Email
                        </FieldLabel>
                        <Input
                          id={field.name}
                          name={field.name}
                          type={'email'}
                          value={field.state.value ?? ''}
                          onBlur={field.handleBlur}
                          onChange={e => field.handleChange(e.target.value)}
                          aria-invalid={isInvalid}
                          placeholder={'e.g. name@mail.com'}
                          autoComplete={field.name}
                        />
                        {isInvalid && (
                          <FieldError errors={field.state.meta.errors} />
                        )}
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
                        <FieldLabel
                          htmlFor={field.name}
                          required
                        >
                          Password
                        </FieldLabel>
                        <div className={'relative'}>
                          <Input
                            id={field.name}
                            name={field.name}
                            type={showPassword ? 'text' : 'password'}
                            value={field.state.value ?? ''}
                            onBlur={field.handleBlur}
                            onChange={e => field.handleChange(e.target.value)}
                            aria-invalid={isInvalid}
                            autoComplete={'new-password'}
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
                            <Icon
                              name={showPassword ? 'Eye' : 'EyeOff'}
                              size={18}
                            />
                          </button>
                        </div>
                        {isInvalid && (
                          <FieldError errors={field.state.meta.errors} />
                        )}
                      </Field>
                    );
                  }}
                </form.Field>

                <form.Field
                  name={'passwordConfirm'}
                  validators={{
                    onChangeListenTo: ['password'], // ре-валідує коли password змінюється
                    onChange: ({ value, fieldApi }) => {
                      const password = fieldApi.form.getFieldValue('password');
                      return value !== password
                        ? "Passwords don't match"
                        : undefined;
                    },
                  }}
                >
                  {field => {
                    const isInvalid =
                      field.state.meta.isTouched && !field.state.meta.isValid;
                    return (
                      <Field data-invalid={isInvalid}>
                        <FieldLabel
                          htmlFor={field.name}
                          required
                        >
                          Confirm Password
                        </FieldLabel>
                        <div className={'relative'}>
                          <Input
                            id={field.name}
                            name={field.name}
                            type={showConfirm ? 'text' : 'password'}
                            value={field.state.value ?? ''}
                            onBlur={field.handleBlur}
                            onChange={e => field.handleChange(e.target.value)}
                            aria-invalid={isInvalid}
                            autoComplete={'new-password'}
                            placeholder={'••••••••'}
                            className={'pr-11'}
                          />
                          <button
                            type={'button'}
                            onClick={toggleConfirm}
                            className={
                              'absolute inset-y-0 right-4 flex items-center text-muted-foreground hover:text-primary'
                            }
                          >
                            <Icon
                              name={showConfirm ? 'Eye' : 'EyeOff'}
                              size={18}
                            />
                          </button>
                        </div>
                        {isInvalid && (
                          <FieldError errors={field.state.meta.errors} />
                        )}
                      </Field>
                    );
                  }}
                </form.Field>
              </>
            )}

            {/* ── КРОК 2 ─────────────────────────────── */}
            {step === 2 && (
              <>
                <form.Field name={'specialisations'}>
                  {field => {
                    const isInvalid =
                      field.state.meta.isTouched && !field.state.meta.isValid;
                    return (
                      <Field data-invalid={isInvalid}>
                        <FieldLabel
                          htmlFor={field.name}
                          required
                        >
                          Specialisation
                        </FieldLabel>
                        <ComboboxSelect
                          id={field.name}
                          name={field.name}
                          value={field.state.value ?? null}
                          onBlur={field.handleBlur}
                          onValueChange={val => {
                            console.log('specialisations val:', val);
                            field.handleChange(val ?? []);
                          }}
                          aria-invalid={isInvalid}
                          placeholder={'e.g. Interior Design'}
                          items={[...specifications, ...horecaType]}
                        />
                        {isInvalid && (
                          <FieldError errors={field.state.meta.errors} />
                        )}
                      </Field>
                    );
                  }}
                </form.Field>

                <form.Field name={'companyName'}>
                  {field => {
                    const isInvalid =
                      field.state.meta.isTouched && !field.state.meta.isValid;
                    return (
                      <Field data-invalid={isInvalid}>
                        <FieldLabel
                          htmlFor={field.name}
                          required
                        >
                          Company Name
                        </FieldLabel>
                        <Input
                          id={field.name}
                          name={field.name}
                          type={'text'}
                          value={field.state.value ?? ''}
                          onBlur={field.handleBlur}
                          onChange={e => field.handleChange(e.target.value)}
                          aria-invalid={isInvalid}
                          placeholder={'e.g. Apple Inc...'}
                          autoComplete={field.name}
                        />
                        {isInvalid && (
                          <FieldError errors={field.state.meta.errors} />
                        )}
                      </Field>
                    );
                  }}
                </form.Field>

                <form.Field name={'taxId'}>
                  {field => {
                    const isInvalid =
                      field.state.meta.isTouched && !field.state.meta.isValid;
                    return (
                      <Field data-invalid={isInvalid}>
                        <FieldLabel
                          htmlFor={field.name}
                          required
                        >
                          EDRPOU
                        </FieldLabel>
                        <Input
                          id={field.name}
                          name={field.name}
                          type={'text'}
                          value={field.state.value ?? ''}
                          onBlur={field.handleBlur}
                          onChange={e => field.handleChange(e.target.value)}
                          aria-invalid={isInvalid}
                          placeholder={'e.g. 12345678'}
                          autoComplete={'off'}
                        />
                        {isInvalid && (
                          <FieldError errors={field.state.meta.errors} />
                        )}
                      </Field>
                    );
                  }}
                </form.Field>
              </>
            )}
          </FieldGroup>
          <form.Subscribe
            selector={s => [s.canSubmit, s.isSubmitting, s.isValidating]}
          >
            {([canSubmit, isSubmitting, isValidating]) => (
              <FormStateSync
                canSubmit={!!canSubmit && !isValidating}
                isSubmitting={!!isSubmitting as boolean}
              />
            )}
          </form.Subscribe>
        </form>
      )}
      {!role && <RolePicker />}
    </>
  );
}
