'use client';

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@shadcn/dropdown-menu';
import { ChevronDown } from 'lucide-react';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { useCallback } from 'react';

const sortOptions = [
  'Curated Popularity',
  'Price: Low to High',
  'Price: High to Low',
  'Newest Arrivals',
];

export function Sort() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const selected = searchParams.get('sort') || sortOptions[0];

  const createQueryString = useCallback(
    (name: string, value: string) => {
      const params = new URLSearchParams(searchParams.toString());
      params.set(name, value);
      return params.toString();
    },
    [searchParams],
  );

  const handleSortChange = (option: string) => {
    router.push(`${pathname}?${createQueryString('sort', option)}`, {
      scroll: false,
    });
  };

  return (
    <div
      className={
        'flex items-center gap-2 text-sm text-muted-foreground shrink-0'
      }
    >
      Sort by:
      <DropdownMenu>
        <DropdownMenuTrigger
          className={
            'flex items-center gap-1.5 text-sm font-semibold text-foreground outline-none border border-neutral-200 rounded-full px-4 py-2 bg-white hover:bg-neutral-50 transition-colors cursor-pointer shadow-sm'
          }
        >
          {selected}{' '}
          <ChevronDown className={'w-3.5 h-3.5 text-muted-foreground'} />
        </DropdownMenuTrigger>

        <DropdownMenuContent
          align={'end'}
          className={'bg-white'}
        >
          {sortOptions.map(option => (
            <DropdownMenuItem
              key={option}
              className={'text-sm cursor-pointer'}
              onClick={() => handleSortChange(option)}
            >
              {option}
            </DropdownMenuItem>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}
