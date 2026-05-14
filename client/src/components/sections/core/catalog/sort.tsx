'use client';

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@shadcn/dropdown-menu';
import { ChevronDown } from 'lucide-react';

export function Sort() {
  return (
    <div
      className={
        'flex items-center gap-1.5 text-xs text-muted-foreground shrink-0'
      }
    >
      Sort by:
      <DropdownMenu>
        <DropdownMenuTrigger
          className={
            'flex items-center gap-1 text-xs font-medium text-foreground outline-none'
          }
        >
          Curated Popularity <ChevronDown className={'w-3 h-3'} />
        </DropdownMenuTrigger>
        <DropdownMenuContent align={'end'}>
          <DropdownMenuItem className={'text-xs'}>
            Curated Popularity
          </DropdownMenuItem>
          <DropdownMenuItem className={'text-xs'}>
            Price: Low to High
          </DropdownMenuItem>
          <DropdownMenuItem className={'text-xs'}>
            Price: High to Low
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}
