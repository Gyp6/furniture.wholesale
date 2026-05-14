'use client';

import { Avatar, AvatarFallback, AvatarImage } from '@shadcn/avatar';
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from '@shadcn/input-group';
import type { User } from 'better-auth';
import { Search } from 'lucide-react';
import { useState } from 'react';

import { cn } from '@/lib/cn';

export function HeaderSearch({ user }: { user: User | null }) {
  const [showInput, setShowInput] = useState(false);

  return (
    <>
      <InputGroup
        className={cn(
          'h-10 transition-all duration-300 ease-in-out border-transparent',
          showInput ? 'w-64 border-white/20' : 'pl-0 w-8 bg-transparent',
        )}
      >
        <InputGroupAddon
          className={
            'text-white cursor-pointer hover:opacity-80 transition-opacity'
          }
          onClick={() => setShowInput(!showInput)}
        >
          <Search size={20} />
        </InputGroupAddon>

        <InputGroupInput
          id={'header-search-url'}
          placeholder={'Search...'}
          className={cn(
            'text-white placeholder:text-white/60 transition-all duration-300',
            showInput
              ? 'w-full opacity-100 visible'
              : 'hidden w-0 opacity-0 invisible p-0 bg-transparent border-none focus-visible:ring-0',
          )}
        />
      </InputGroup>
      <Avatar className={'w-10 h-10'}>
        <AvatarImage
          src={user?.image || 'https://github.com/shadcn.png'}
          alt={user?.name || 'avatar'}
        />
        <AvatarFallback />
      </Avatar>
    </>
  );
}
