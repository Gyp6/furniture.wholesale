'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import {
  ArrowRight,
  Eye,
  EyeOff,
  Package,
  PenTool,
  Store,
  UtensilsCrossed,
} from 'lucide-react';
import Link from 'next/link';
import { useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { z } from 'zod';

import { cn } from '@/lib/utils';

const ROLES = ['DESIGNER', 'RETAILER', 'HORECA', 'SUPPLIER'] as const;
type Role = (typeof ROLES)[number];

const roleCards: {
  value: Role;
  label: string;
  Icon: React.ComponentType<{ className?: string }>;
}[] = [
  { value: 'DESIGNER', label: 'Designer', Icon: PenTool },
  { value: 'RETAILER', label: 'Retailer', Icon: Store },
  { value: 'HORECA', label: 'HoReCa', Icon: UtensilsCrossed },
  { value: 'SUPPLIER', label: 'Supplier', Icon: Package },
];

const schema = z
  .object({
    role: z.enum(ROLES, { message: 'Please select a role' }),
    email: z.string().email('Please enter a valid email address'),
    password: z.string().min(8, 'Password must be at least 8 characters'),
    passwordConfirm: z.string().min(1, 'Please confirm your password'),
    companyName: z.string().optional(),
    taxId: z.string().optional(),
  })
  .refine(data => data.password === data.passwordConfirm, {
    message: "Passwords don't match",
    path: ['passwordConfirm'],
  })
  .refine(
    data =>
      data.role !== 'RETAILER' || (data.companyName?.trim().length ?? 0) > 0,
    {
      message: 'Company name is required',
      path: ['companyName'],
    },
  )
  .refine(
    data => data.role !== 'RETAILER' || (data.taxId?.trim().length ?? 0) > 0,
    {
      message: 'EDRPOU is required',
      path: ['taxId'],
    },
  );

type FormValues = z.infer<typeof schema>;
type FieldName = keyof FormValues;

function getStrength(pwd: string): 0 | 1 | 2 | 3 | 4 {
  if (!pwd) return 0;
  let score = 0;
  if (pwd.length >= 8) score++;
  if (/[a-z]/.test(pwd) && /[A-Z]/.test(pwd)) score++;
  if (/\d/.test(pwd)) score++;
  if (/[^A-Za-z0-9]/.test(pwd)) score++;
  return score as 0 | 1 | 2 | 3 | 4;
}

const strengthLabel: Record<0 | 1 | 2 | 3 | 4, string> = {
  0: '',
  1: 'Weak',
  2: 'Fair',
  3: 'Good',
  4: 'Strong',
};

const strengthColor: Record<0 | 1 | 2 | 3 | 4, string> = {
  0: 'bg-muted',
  1: 'bg-red-500',
  2: 'bg-orange-400',
  3: 'bg-yellow-500',
  4: 'bg-emerald-500',
};

// Shared Tailwind classes
const labelCls =
  'text-[11px] font-semibold tracking-[0.15em] text-[#1A1A2E] uppercase';
const inputCls =
  'h-11 w-full rounded-full border border-border bg-white px-4 text-sm placeholder:text-muted-foreground/60 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-foreground/10 aria-invalid:border-destructive aria-invalid:ring-destructive/20';
const validCls =
  'border-blue-500 focus-visible:border-blue-500 focus-visible:ring-blue-500/20';

export function RegisterForm() {
  const [showPassword, setShowPassword] = useState(false);
  const [showPasswordConfirm, setShowPasswordConfirm] = useState(false);

  const { control, register, handleSubmit, watch, formState } =
    useForm<FormValues>({
      resolver: zodResolver(schema),
      mode: 'onChange',
      defaultValues: {
        role: 'RETAILER',
        email: '',
        password: '',
        passwordConfirm: '',
        companyName: '',
        taxId: '',
      },
    });

  const { errors, dirtyFields, isValid, isSubmitting } = formState;

  const role = watch('role');
  const password = watch('password') ?? '';
  const strength = getStrength(password);
  const isRetailer = role === 'RETAILER';

  const isFieldValid = (name: FieldName) =>
    Boolean(dirtyFields[name]) && !errors[name];

  const onSubmit = (values: FormValues) => {
    console.log('register:', values);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className={"flex flex-col gap-5"}>
      <header>
        <h2 className={"text-3xl font-semibold tracking-tight text-[#1A1A2E]"}>
          Registration
        </h2>
        <p className={"mt-1 text-sm font-medium text-muted-foreground"}>
          Join the architectural procurement network.
        </p>
      </header>

      <div className={"flex flex-col gap-2"}>
        <span className={labelCls}>I am a…</span>
        <Controller
          control={control}
          name={"role"}
          render={({ field }) => (
            <div role={"radiogroup"} className={"grid grid-cols-4 gap-2"}>
              {roleCards.map(({ value, label, Icon }) => {
                const active = field.value === value;
                return (
                  <label
                    key={value}
                    className={cn(
                      'flex cursor-pointer flex-col items-center justify-center gap-1.5 rounded-full px-2 py-4 text-xs transition-all',
                      active
                        ? 'border-2 border-[#1A1A2E] bg-white font-semibold text-[#1A1A2E] shadow-md'
                        : 'border border-black/10 bg-white font-medium text-black/35 hover:border-black/40 hover:text-[#1A1A2E]',
                    )}
                  >
                    <input
                      type={"radio"}
                      className={"sr-only"}
                      value={value}
                      checked={active}
                      onChange={() => field.onChange(value)}
                      name={field.name}
                      onBlur={field.onBlur}
                      aria-label={label}
                    />
                    <Icon
                      className={cn(
                        'size-5',
                        active ? 'text-[#1A1A2E]' : 'text-black/30',
                      )}
                    />
                    <span>{label}</span>
                  </label>
                );
              })}
            </div>
          )}
        />
        {errors.role && (
          <span className={"text-xs text-destructive"}>
            {errors.role.message}
          </span>
        )}
      </div>

      <div className={"flex flex-col gap-1.5"}>
        <label htmlFor={"email"} className={labelCls}>
          Email
        </label>
        <input
          id={"email"}
          type={"email"}
          autoComplete={"email"}
          placeholder={"name@company.com"}
          aria-invalid={!!errors.email}
          className={cn(inputCls, isFieldValid('email') && validCls)}
          {...register('email')}
        />
        {errors.email && (
          <span className={"text-xs text-destructive"}>
            {errors.email.message}
          </span>
        )}
      </div>

      {isRetailer && (
        <div className={"grid grid-cols-2 gap-3"}>
          <div className={"flex flex-col gap-1.5"}>
            <label htmlFor={"taxId"} className={labelCls}>
              EDRPOU
            </label>
            <input
              id={"taxId"}
              type={"text"}
              inputMode={"numeric"}
              placeholder={"123…"}
              aria-invalid={!!errors.taxId}
              className={cn(inputCls, isFieldValid('taxId') && validCls)}
              {...register('taxId')}
            />
            {errors.taxId && (
              <span className={"text-xs text-destructive"}>
                {errors.taxId.message}
              </span>
            )}
          </div>
          <div className={"flex flex-col gap-1.5"}>
            <label htmlFor={"companyName"} className={labelCls}>
              Company Name
            </label>
            <input
              id={"companyName"}
              type={"text"}
              autoComplete={"organization"}
              placeholder={"Your company"}
              aria-invalid={!!errors.companyName}
              className={cn(
                inputCls,
                isFieldValid('companyName') && validCls,
              )}
              {...register('companyName')}
            />
            {errors.companyName && (
              <span className={"text-xs text-destructive"}>
                {errors.companyName.message}
              </span>
            )}
          </div>
        </div>
      )}

      <div className={"flex flex-col gap-1.5"}>
        <label htmlFor={"password"} className={labelCls}>
          Password
        </label>
        <div className={"relative"}>
          <input
            id={"password"}
            type={showPassword ? 'text' : 'password'}
            autoComplete={"new-password"}
            placeholder={"••••••••"}
            aria-invalid={!!errors.password}
            className={cn(
              inputCls,
              'pr-11',
              isFieldValid('password') && validCls,
            )}
            {...register('password')}
          />
          <button
            type={"button"}
            onClick={() => setShowPassword(v => !v)}
            aria-label={showPassword ? 'Hide password' : 'Show password'}
            className={"absolute inset-y-0 right-4 flex items-center text-muted-foreground hover:text-foreground"}
          >
            {showPassword ? (
              <Eye className={"size-4"} />
            ) : (
              <EyeOff className={"size-4"} />
            )}
          </button>
        </div>

        <div className={"mt-1 flex items-center gap-2"}>
          <div className={"flex flex-1 gap-1"}>
            {[1, 2, 3, 4].map(seg => (
              <div
                key={seg}
                className={cn(
                  'h-1 flex-1 rounded-full transition-colors',
                  seg <= strength ? strengthColor[strength] : 'bg-muted',
                )}
              />
            ))}
          </div>
          {strength > 0 && (
            <span className={"min-w-12 text-right text-[11px] font-medium text-muted-foreground"}>
              {strengthLabel[strength]}
            </span>
          )}
        </div>

        {errors.password && (
          <span className={"text-xs text-destructive"}>
            {errors.password.message}
          </span>
        )}
      </div>

      <div className={"flex flex-col gap-1.5"}>
        <label htmlFor={"passwordConfirm"} className={labelCls}>
          Password Confirmation
        </label>
        <div className={"relative"}>
          <input
            id={"passwordConfirm"}
            type={showPasswordConfirm ? 'text' : 'password'}
            autoComplete={"new-password"}
            placeholder={"••••••••"}
            aria-invalid={!!errors.passwordConfirm}
            className={cn(
              inputCls,
              'pr-11',
              isFieldValid('passwordConfirm') && validCls,
            )}
            {...register('passwordConfirm')}
          />
          <button
            type={"button"}
            onClick={() => setShowPasswordConfirm(v => !v)}
            aria-label={
              showPasswordConfirm ? 'Hide password' : 'Show password'
            }
            className={"absolute inset-y-0 right-4 flex items-center text-muted-foreground hover:text-foreground"}
          >
            {showPasswordConfirm ? (
              <Eye className={"size-4"} />
            ) : (
              <EyeOff className={"size-4"} />
            )}
          </button>
        </div>
        {errors.passwordConfirm && (
          <span className={"text-xs text-destructive"}>
            {errors.passwordConfirm.message}
          </span>
        )}
      </div>

      <button
        type={"submit"}
        disabled={!isValid || isSubmitting}
        className={"mt-2 inline-flex h-12 w-full items-center justify-center gap-2 rounded-full bg-[#1A1A2E] text-sm font-semibold text-white transition-colors hover:bg-[#2a2a45] disabled:cursor-not-allowed disabled:opacity-50"}
      >
        {isSubmitting ? 'Creating account…' : 'Complete Registration'}
        {!isSubmitting && <ArrowRight className={"size-4"} />}
      </button>

      <p className={"text-center text-xs text-muted-foreground"}>
        Don&apos;t have an account?{' '}
        <Link
          href={"/login"}
          className={"font-semibold text-blue-600 hover:underline"}
        >
          Create account
        </Link>
      </p>
    </form>
  );
}
