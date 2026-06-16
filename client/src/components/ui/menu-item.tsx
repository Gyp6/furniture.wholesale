'use client';

import { ChevronDown } from 'lucide-react';
import Link from 'next/link';
import { useState } from 'react';

import { cn } from '@/lib/cn';
import type { TMenuItem } from '@/shared/types';

interface Props {
  menuItem: TMenuItem;
  isActive: boolean;
  className?: string;
}

export function MenuItem({ menuItem, isActive, className = '' }: Props) {
  const [open, setOpen] = useState(false);

  if (menuItem.children) {
    return (
      <div className={'relative'}>
        <button
          onClick={() => setOpen(!open)}
          className={cn(
            'flex items-center gap-1 text-base text-neutral-300 hover:text-white transition-colors',
            isActive ? 'text-white' : '',
            className,
          )}
        >
          {menuItem.label}
          <div
            className={`w-6 h-6 rounded border border-neutral-500 flex items-center justify-center transition-transform ${open ? 'rotate-180' : ''}`}
          >
            <ChevronDown className={'w-3 h-3'} />
          </div>
        </button>

        {open && (
          <div
            className={
              'absolute top-full left-0 mt-2 bg-primary rounded-2xl p-2 flex flex-col gap-1 min-w-[160px] z-50 shadow-lg'
            }
          >
            {menuItem.children.map(child => (
              <Link
                key={child.label}
                href={child.href}
                onClick={() => setOpen(false)}
                className={
                  'text-sm text-neutral-300 hover:text-white px-3 py-2 rounded-xl hover:bg-white/10 transition-colors'
                }
              >
                {child.label}
              </Link>
            ))}
          </div>
        )}
      </div>
    );
  }

  return (
    <Link
      href={menuItem.href}
      className={cn(
        'text-base text-neutral-300 hover:text-white transition-colors',
        isActive ? 'text-white hover:text-white/80' : '',
        className,
      )}
    >
      {menuItem.label}
    </Link>
  );
}
