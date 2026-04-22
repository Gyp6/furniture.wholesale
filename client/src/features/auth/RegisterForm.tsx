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

const labelCls =
  'text-[11px] font-semibold tracking-[0.15em] text-[#1A1A2E] uppercase';
const inputCls =
  'h-11 w-full rounded-full border border-border bg-white px-4 text-sm placeholder:text-muted-foreground/60 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-foreground/10 aria-invalid:border-destructive aria-invalid:ring-destructive/20';
const validCls =
  'border-blue-500 focus-visible:border-blue-500 focus-visible:ring-blue-500/20';

export function RegisterForm() {

  return (
    <form  className={"flex flex-col gap-5"}>
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
        />
      </div>

      <div className={"flex flex-col gap-1.5"}>
        <label htmlFor={"password"} className={labelCls}>
          Password
        </label>
        <div className={"relative"}>
          <input
            id={"password"}
            autoComplete={"new-password"}
            placeholder={"••••••••"}
          />
          <button
            type={"button"}
            className={"absolute inset-y-0 right-4 flex items-center text-muted-foreground hover:text-foreground"}
          >
          </button>
        </div>

        <div className={"mt-1 flex items-center gap-2"}>
          <div className={"flex flex-1 gap-1"}>
          </div>
        </div>

      </div>

      <div className={"flex flex-col gap-1.5"}>
        <label htmlFor={"passwordConfirm"} className={labelCls}>
          Password Confirmation
        </label>
        <div className={"relative"}>
          <input
            id={"passwordConfirm"}
            autoComplete={"new-password"}
            placeholder={"••••••••"}
            className={cn(
              inputCls,
              'pr-11',
            )}
          />
          <button
            type={"button"}
            className={"absolute inset-y-0 right-4 flex items-center text-muted-foreground hover:text-foreground"}
          >
          </button>
        </div>
      </div>

      <button
        type={"submit"}
        className={"mt-2 inline-flex h-12 w-full items-center justify-center gap-2 rounded-full bg-[#1A1A2E] text-sm font-semibold text-white transition-colors hover:bg-[#2a2a45] disabled:cursor-not-allowed disabled:opacity-50"}
      >
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
