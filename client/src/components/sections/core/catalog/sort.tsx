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
    [searchParams]
  );

  const handleSortChange = (option: string) => {
    router.push(`${pathname}?${createQueryString('sort', option)}`, { scroll: false });
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        className={'flex items-center gap-1 text-base font-medium outline-none'}
      >
        <div
          className={
            'flex items-center gap-1.5 py-1.5 px-5 text-sm text-primary/80 shrink-0 border border-input rounded-full'
          }
        >
          Sort by:
          <span className={'text-secondary'}>{selected}</span>
          <ChevronDown className={'size-4'} />
        </div>
      </DropdownMenuTrigger>

      <DropdownMenuContent align={'end'}>
        {sortOptions.map(option => (
          <DropdownMenuItem
            key={option}
            className={'text-xs'}
            onClick={() => handleSortChange(option)}
          >
            {option}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
