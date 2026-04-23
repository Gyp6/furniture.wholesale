'use client';

import Link from 'next/link';
import { useRef, useState } from 'react';

import { cn } from '@/lib/utils';

const labelCls =
  'text-[11px] font-semibold tracking-[0.15em] text-[#1A1A2E] uppercase';

const digitCls =
  'h-14 w-full rounded-2xl border border-border bg-white text-center text-xl font-semibold text-[#1A1A2E] focus:outline-none focus:ring-2 focus:ring-foreground/10 caret-transparent';

export function VerifyForm() {
  const [digits, setDigits] = useState<string[]>(Array(6).fill(''));
  const refs = useRef<(HTMLInputElement | null)[]>([]);

  const handleChange = (index: number, val: string) => {
    const char = val.replace(/\D/g, '').slice(-1);
    const next = [...digits];
    next[index] = char;
    setDigits(next);
    if (char && index < 5) refs.current[index + 1]?.focus();
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent) => {
    if (e.key === 'Backspace' && !digits[index] && index > 0) {
      refs.current[index - 1]?.focus();
    }
  };

  return (
    <form className="flex flex-col gap-5">
      <header>
        <h2 className="text-3xl font-semibold tracking-tight text-[#1A1A2E]">
          Account verification
        </h2>
        <p className="mt-1 text-sm font-medium text-muted-foreground">
          Enter the 6-digit code sent to your email to successfully register
          your account.
        </p>
      </header>

      <div className="flex flex-col gap-1.5">
        <span className={labelCls}>Verification code</span>
        <div className="flex items-center gap-2">
          <div className="grid flex-1 grid-cols-3 gap-2">
            {[0, 1, 2].map((i) => (
              <input
                key={i}
                ref={(el) => { refs.current[i] = el; }}
                type="text"
                inputMode="numeric"
                maxLength={1}
                value={digits[i]}
                onChange={(e) => handleChange(i, e.target.value)}
                onKeyDown={(e) => handleKeyDown(i, e)}
                className={digitCls}
              />
            ))}
          </div>

          <span className="text-2xl font-light text-muted-foreground">—</span>

          <div className="grid flex-1 grid-cols-3 gap-2">
            {[3, 4, 5].map((i) => (
              <input
                key={i}
                ref={(el) => { refs.current[i] = el; }}
                type="text"
                inputMode="numeric"
                maxLength={1}
                value={digits[i]}
                onChange={(e) => handleChange(i, e.target.value)}
                onKeyDown={(e) => handleKeyDown(i, e)}
                className={digitCls}
              />
            ))}
          </div>
        </div>
      </div>

  
      <button
        type="submit"
        className="mt-2 inline-flex h-12 w-full items-center justify-center rounded-full bg-[#1A1A2E] text-sm font-semibold text-white transition-colors hover:bg-[#2a2a45]"
      >
        Verify
      </button>

      <p className="text-center text-xs">
        <Link
          href="/login"
          className="font-semibold text-blue-600 hover:underline"
        >
          Back in Login
        </Link>
      </p>
    </form>
  );
}