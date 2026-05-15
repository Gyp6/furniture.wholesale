'use client';

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@shadcn/dropdown-menu';
import { ChevronDown } from 'lucide-react';
import { useState } from 'react';

const sortOptions = [
  'Curated Popularity',
  'Price: Low to High',
  'Price: High to Low',
  'Newest Arrivals',
];

export function Sort() {
  const [selected, setSelected] = useState(sortOptions[0]);

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
            onClick={() => setSelected(option)}
          >
            {option}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
