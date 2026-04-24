'use client';

import {
  ArrowRight,
  ChevronDown,
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
  'h-9 w-full rounded-full border border-border bg-white px-4 text-sm placeholder:text-muted-foreground/60 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-foreground/10';

export function RegisterForm() {
  const [role, setRole] = useState<Role>('RETAILER');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  return (
    <form className="flex flex-col gap-3">
      <header>
        <h2 className="text-2xl font-semibold tracking-tight text-[#1A1A2E]">
          Registration
        </h2>
        <p className="text-xs font-medium text-muted-foreground">
          Join the architectural procurement network.
        </p>
      </header>

      <div className="flex flex-col gap-5">
        <span className={labelCls}>I am a…</span>
        <div className="grid grid-cols-4 gap-2">
          {roleCards.map(({ value, label, Icon }) => (
            <button
              key={value}
              type="button"
              onClick={() => setRole(value)}
              className={cn(
                'flex flex-col items-center gap-1 rounded-full border py-1.5 px-2 text-xs font-medium transition-colors',
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

      <div className="flex flex-col gap-3">
        <label htmlFor="email" className={labelCls}>Email</label>
        <input
          id="email"
          type="email"
          autoComplete="email"
          placeholder="name@company.com"
          className={inputCls}
        />
      </div>

      {role === 'DESIGNER' && (
        <div className="flex flex-col gap-1">
          <label htmlFor="specialisation" className={labelCls}>Specialisation</label>
          <div className="relative">
            <select
              id="specialisation"
              defaultValue=""
              className={cn(inputCls, 'appearance-none pr-10 cursor-pointer text-[#1A1A2E]')}
              style={{ WebkitAppearance: 'none', MozAppearance: 'none' }}
            >
              <option value="" disabled>Select specialisation…</option>
              <option value="smart_apartments">Smart Apartments</option>
              <option value="commercial">Commercial</option>
              <option value="both">Both</option>
            </select>
            <ChevronDown className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          </div>
        </div>
      )}

      {role === 'RETAILER' && (
        <div className="flex gap-3">
          <div className="flex flex-1 flex-col gap-1">
            <label htmlFor="edrpou" className={labelCls}>EDRPOU</label>
            <input id="edrpou" type="text" placeholder="123…" className={inputCls} />
          </div>
          <div className="flex flex-1 flex-col gap-1">
            <label htmlFor="companyName" className={labelCls}>Company Name</label>
            <input id="companyName" type="text" placeholder="Str…." className={inputCls} />
          </div>
        </div>
      )}

      {role === 'HORECA' && (
        <div className="flex flex-col gap-1">
          <label htmlFor="establishment" className={labelCls}>Type of Establishment</label>
          <div className="relative">
            <select
              id="establishment"
              defaultValue=""
              className={cn(inputCls, 'appearance-none pr-10 cursor-pointer text-[#1A1A2E]')}
              style={{ WebkitAppearance: 'none', MozAppearance: 'none' }}
            >
              <option value="" disabled>Select type…</option>
              <option value="hotel">Hotel</option>
              <option value="restaurant">Restaurant</option>
              <option value="cafe">Cafe</option>
              <option value="coworking">Coworking</option>
              <option value="office">Office</option>
            </select>
            <ChevronDown className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          </div>
        </div>
      )}

      {role === 'SUPPLIER' && (
        <div className="flex gap-3">
          <div className="flex flex-1 flex-col gap-1">
            <label htmlFor="supplierCompanyName" className={labelCls}>Company Name</label>
            <input id="supplierCompanyName" type="text" placeholder="Company…" className={inputCls} />
          </div>
          <div className="flex flex-1 flex-col gap-1">
            <label htmlFor="contactPerson" className={labelCls}>Contact Person</label>
            <input id="contactPerson" type="text" placeholder="Full name…" className={inputCls} />
          </div>
        </div>
      )}

      <div className="flex flex-col gap-3">
        <label htmlFor="password" className={labelCls}>Password</label>
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
            className="absolute inset-y-0 right-4 flex items-center text-muted-foreground hover:text-[#1A1A2E]"
          >
            {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
          </button>
        </div>
      </div>

      <div className="flex flex-col gap-3">
        <label htmlFor="passwordConfirm" className={labelCls}>Password Confirmation</label>
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
            className="absolute inset-y-0 right-4 flex items-center text-muted-foreground hover:text-[#1A1A2E]"
          >
            {showConfirm ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
          </button>
        </div>
      </div>

      <div className="pt-6">
      <Link
        href="/verify-password"
        className="inline-flex h-12 w-full items-center justify-center gap-2 rounded-full bg-[#1A1A2E] text-sm font-semibold text-white transition-colors hover:bg-[#2a2a45]"
      >
        Complete Registration
        <ArrowRight className="h-4 w-4" />
      </Link>
     </div>

      <p className="text-center text-xs text-muted-foreground">
        Already have an account?{' '}
        <Link href="/login" className="font-semibold text-blue-600 hover:underline">
          Sign in
        </Link>
      </p>
    </form>
  );
}
