'use client';

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

const labelCls =
  'text-[11px] font-semibold tracking-[0.15em] text-[#1A1A2E] uppercase';
const inputCls =
  'h-11 w-full rounded-full border border-border bg-white px-4 text-sm placeholder:text-muted-foreground/60 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-foreground/10';

export function RegisterForm() {
  const [role, setRole] = useState<Role>('RETAILER');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  return (
    <form className="flex flex-col gap-5">
      <header>
        <h2 className="text-3xl font-semibold tracking-tight text-[#1A1A2E]">
          Registration
        </h2>
        <p className="mt-1 text-sm font-medium text-muted-foreground">
          Join the architectural procurement network.
        </p>
      </header>

      <div className="flex flex-col gap-2">
        <span className={labelCls}>I am a…</span>
        <div className="grid grid-cols-4 gap-2">
          {roleCards.map(({ value, label, Icon }) => (
            <button
              key={value}
              type="button"
              onClick={() => setRole(value)}
              className={cn(
                'flex flex-col items-center gap-1.5 rounded-full border py-3 px-2 text-xs font-medium transition-colors',
                role === value
                  ? 'border-[#1A1A2E] bg-white text-[#1A1A2E] shadow-sm'
                  : 'border-border bg-white text-muted-foreground hover:border-[#1A1A2E]/40',
              )}
            >
              <Icon className="h-4 w-4" />
              {label}
            </button>
          ))}
        </div>
      </div>

      <div className="flex flex-col gap-1.5">
        <label htmlFor="email" 
        className={labelCls}>
          Email
        </label>
        <input
          id="email"
          type="email"
          autoComplete="email"
          placeholder="name@company.com"
          className={inputCls}
        />
      </div>

      {role === 'RETAILER' && (
        <div className="flex gap-3">
          <div className="flex flex-1 flex-col gap-1.5">
            <label htmlFor="edrpou" 
            className={labelCls}>
              EDRPOU
            </label>
            <input
              id="edrpou"
              type="text"
              placeholder="123…"
              className={inputCls}
            />
          </div>
          <div className="flex flex-1 flex-col gap-1.5">
            <label htmlFor="companyName" 
            className={labelCls}>
              Company Name
            </label>
            <input
              id="companyName"
              type="text"
              placeholder="Str…."
              className={inputCls}
            />
          </div>
        </div>
      )}

      <div className="flex flex-col gap-1.5">
        <label htmlFor="password" 
        className={labelCls}>
          Password
        </label>
        <div className="relative">
          <input
            id="password"
            type={showPassword ? 'text' : 'password'}
            autoComplete="new-password"
            placeholder="••••••••"
            className={cn(inputCls, 'pr-11')}
          />
          <button
            type="button"
            onClick={() => setShowPassword((v) => !v)}
            className="absolute inset-y-0 right-4 flex items-center text-muted-foreground hover:text-foreground"
          >
            {showPassword ? (
              <EyeOff className="h-4 w-4" />
            ) : (
              <Eye className="h-4 w-4" />
            )}
          </button>
        </div>
      </div>

      <div className="flex flex-col gap-1.5">
        <label htmlFor="passwordConfirm" 
        className={labelCls}>
          Password Confirmation
        </label>
        <div className="relative">
          <input
            id="passwordConfirm"
            type={showConfirm ? 'text' : 'password'}
            autoComplete="new-password"
            placeholder="••••••••"
            className={cn(inputCls, 'pr-11')}
          />
          <button
            type="button"
            onClick={() => setShowConfirm((v) => !v)}
            className="absolute inset-y-0 right-4 flex items-center text-muted-foreground hover:text-foreground"
          >
            {showConfirm ? (
              <EyeOff className="h-4 w-4" />
            ) : (
              <Eye className="h-4 w-4" />
            )}
          </button>
        </div>
      </div>

      <button
        type="submit"
        className="mt-2 inline-flex h-12 w-full items-center justify-center gap-2 rounded-full bg-[#1A1A2E] text-sm font-semibold text-white transition-colors hover:bg-[#2a2a45]"
      >
        Complete Registration
        <ArrowRight className="h-4 w-4" />
      </button>

      <p className="text-center text-xs text-muted-foreground">
        Don&apos;t have an account?{' '}
        <Link
          href="/login"
          className="font-semibold text-blue-600 hover:underline"
        >
          Create account
        </Link>
      </p>
    </form>
  );
}
