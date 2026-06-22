'use client';

import { Avatar, AvatarFallback, AvatarImage } from '@shadcn/avatar';
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from '@shadcn/input-group';
import { useQueryClient } from '@tanstack/react-query';
import type { User } from 'better-auth';
import { LogOut, Search } from 'lucide-react';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { useCallback, useEffect, useState } from 'react';

import { ROUTES } from '@/constants';
import { authClient } from '@/lib';
import { cn } from '@/lib/cn';
import { useUserStore } from '@/store';

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '../ui/shadcn/dropdown-menu';

export function HeaderSearch({ user }: { user: User | null }) {
  const router = useRouter();
  const queryClient = useQueryClient();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const [showInput, setShowInput] = useState(false);
  const [searchValue, setSearchValue] = useState(
    searchParams.get('search') || '',
  );

  useEffect(() => {
    setSearchValue(searchParams.get('search') || '');
  }, [searchParams]);

  const createQueryString = useCallback(
    (name: string, value: string) => {
      const params = new URLSearchParams(searchParams.toString());
      if (value) {
        params.set(name, value);
      } else {
        params.delete(name);
      }
      return params.toString();
    },
    [searchParams],
  );

  const handleSearch = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      router.push(`${pathname}?${createQueryString('search', searchValue)}`, {
        scroll: false,
      });
    }
  };

  const handleSignOut = async () => {
    await authClient.signOut({
      fetchOptions: {
        onSuccess: () => {
          useUserStore.getState().clearUser();
          queryClient.clear();
          router.push(ROUTES.AUTH.LOGIN);
          router.refresh();
        },
      },
    });
  };

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
          value={searchValue}
          onChange={e => setSearchValue(e.target.value)}
          onKeyDown={handleSearch}
          className={cn(
            'text-white placeholder:text-white/60 transition-all duration-300',
            showInput
              ? 'w-full opacity-100 visible'
              : 'hidden w-0 opacity-0 invisible p-0 bg-transparent border-none focus-visible:ring-0',
          )}
        />
      </InputGroup>

      <DropdownMenu>
        <DropdownMenuTrigger className={'focus:outline-none cursor-pointer'}>
          <Avatar className={'w-10 h-10'}>
            <AvatarImage
              src={user?.image || 'https://github.com/shadcn.png'}
              alt={user?.name || 'avatar'}
            />
            <AvatarFallback>
              {user?.name?.slice(0, 2).toUpperCase() || 'U'}
            </AvatarFallback>
          </Avatar>
        </DropdownMenuTrigger>

        <DropdownMenuContent
          align={'end'}
          className={'w-56'}
        >
          {user && (
            <>
              <DropdownMenuLabel className={'font-normal'}>
                <div className={'flex flex-col space-y-1'}>
                  <p className={'text-sm font-medium leading-none'}>
                    {user.name}
                  </p>
                  <p className={'text-xs leading-none text-muted-foreground'}>
                    {user.email}
                  </p>
                </div>
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
            </>
          )}

          <DropdownMenuItem
            onClick={handleSignOut}
            className={'text-destructive focus:text-destructive cursor-pointer'}
          >
            <LogOut className={'mr-2 size-4'} />
            <span>Logout</span>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </>
  );
}
