'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { ArrowRight, Eye, EyeOff } from 'lucide-react';
import Link from 'next/link';
import { useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { z } from 'zod';

import { cn } from '@/lib/utils';


const labelCls =
  'text-[11px] font-semibold tracking-[0.15em] text-[#1A1A2E] uppercase';
const inputCls =
  'h-11 w-full rounded-full border border-border bg-white px-4 text-sm placeholder:text-muted-foreground/60 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-foreground/10 aria-invalid:border-destructive aria-invalid:ring-destructive/20';
const validCls =
  'border-blue-500 focus-visible:border-blue-500 focus-visible:ring-blue-500/20';

export function LoginForm() {


  return (
    <form  className={"flex flex-col gap-5"}>
      <header>
        <h2 className={"text-3xl font-semibold tracking-tight text-[#1A1A2E]"}>
          Welcome Back
        </h2>
        <p className={"mt-1 text-sm font-medium text-muted-foreground"}>
          Enter your credentials to access your trade dashboard.
        </p>
      </header>

      <div className={"flex flex-col gap-1.5"}>
        <label htmlFor={"email"} className={labelCls}>
          Business Email
        </label>
        <input
          id={"email"}
          type={"email"}
          autoComplete={"email"}
          placeholder={"name@company.com"}
        />
      </div>

      <div className={"flex flex-col gap-1.5"}>
        <div className={"flex items-center justify-between"}>
          <label htmlFor={"password"} className={labelCls}>
            Password
          </label>
          <Link
            href={"/forgot-password"}
            className={"text-[11px] font-semibold tracking-[0.15em] text-blue-600 uppercase hover:underline"}
          >
            Forgot?
          </Link>
        </div>
        <div className={"relative"}>
          <input
            id={"password"}
            autoComplete={"current-password"}
            placeholder={"••••••••"}
          />
          <button
            type={"button"}
            className={"absolute inset-y-0 right-4 flex items-center text-muted-foreground hover:text-[#1A1A2E]"}
          >
          </button>
        </div>
      </div>

      <Controller
        name={"remember"}
        render={({ field }) => (
          <label className={"flex cursor-pointer items-center gap-2 text-sm text-muted-foreground select-none"}>
            <input
              type={"checkbox"}
              className={"size-4 rounded-full border border-border accent-[#1A1A2E]"}
              checked={!!field.value}
              onChange={e => field.onChange(e.target.checked)}
              onBlur={field.onBlur}
              name={field.name}
            />
            Remember this device
          </label>
        )}
      />

      <button
        type={"submit"}
        className={"mt-2 inline-flex h-12 w-full items-center justify-center gap-2 rounded-full bg-[#1A1A2E] text-sm font-semibold text-white transition-colors hover:bg-[#2a2a45] disabled:cursor-not-allowed disabled:opacity-50"}
      >
      </button>

      <p className={"text-center text-xs text-muted-foreground"}>
        Don&apos;t have an account?{' '}
        <Link
          href={"/register"}
          className={"font-semibold text-blue-600 hover:underline"}
        >
          Create Account
        </Link>
      </p>
    </form>
  );
}
