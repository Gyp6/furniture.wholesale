'use client';

import {
  FormStateSync,
  RoleButton,
  RolePicker,
} from '@/components/sections/auth';
import { ComboboxSelect } from '@/components/sections/auth/combobox-select';
import { Icon } from '@/components/ui';
import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
} from '@/components/ui/shadcn/field';
import { Input } from '@/components/ui/shadcn/input';
import { RoleButtonsConfig } from '@/config';
import { useRegisterForm } from '@/hooks';
import { horecaType, specifications } from '@/shared/data/auth';

export function RegisterForm() {
  const {
    form,
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
        >
          <FieldGroup className={'gap-3'}>
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

            <div className={'flex gap-3'}>
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

              {role === 'DESIGNER' && (
                <form.Field name={'specialisation'}>
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
                          type={'text'}
                          value={field.state.value ?? ''}
                          onBlur={field.handleBlur}
                          onValueChange={e => field.handleChange(e ?? '')}
                          aria-invalid={isInvalid}
                          placeholder={'e.g. Web'}
                          items={specifications}
                        />
                        {isInvalid && (
                          <FieldError errors={field.state.meta.errors} />
                        )}
                      </Field>
                    );
                  }}
                </form.Field>
              )}
              {role === 'HORECA' && (
                <form.Field name={'horecaType'}>
                  {field => {
                    const isInvalid =
                      field.state.meta.isTouched && !field.state.meta.isValid;

                    return (
                      <Field data-invalid={isInvalid}>
                        <FieldLabel
                          htmlFor={field.name}
                          required
                        >
                          Type of Establishment
                        </FieldLabel>
                        <ComboboxSelect
                          id={field.name}
                          name={field.name}
                          type={'text'}
                          value={field.state.value ?? ''}
                          onBlur={field.handleBlur}
                          onValueChange={e => field.handleChange(e ?? '')}
                          aria-invalid={isInvalid}
                          placeholder={'e.g. Restaurant'}
                          items={horecaType}
                        />
                        {isInvalid && (
                          <FieldError errors={field.state.meta.errors} />
                        )}
                      </Field>
                    );
                  }}
                </form.Field>
              )}
              {(role === 'SUPPLIER' || role === 'RETAILER') && (
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
              )}
            </div>

            <div className={'flex gap-3'}>
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
                        type={field.name}
                        value={field.state.value ?? ''}
                        onBlur={field.handleBlur}
                        onChange={e => field.handleChange(e.target.value)}
                        aria-invalid={isInvalid}
                        placeholder={'e.g. name@company.com'}
                        autoComplete={field.name}
                      />
                      {isInvalid && (
                        <FieldError errors={field.state.meta.errors} />
                      )}
                    </Field>
                  );
                }}
              </form.Field>

              {(role === 'RETAILER' || role === 'SUPPLIER') && (
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
                          placeholder={'e.g. 123...'}
                          autoComplete={'off'}
                        />
                        {isInvalid && (
                          <FieldError errors={field.state.meta.errors} />
                        )}
                      </Field>
                    );
                  }}
                </form.Field>
              )}
            </div>

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

            <form.Field name={'passwordConfirm'}>
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
