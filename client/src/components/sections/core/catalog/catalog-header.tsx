'use client';

import { ChevronDown, Search, X } from 'lucide-react';
import { useRouter } from 'next/navigation';

import { Badge } from '@/components/ui/shadcn/badge';
import { Button } from '@/components/ui/shadcn/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/shadcn/dropdown-menu';
import { Input } from '@/components/ui/shadcn/input';
import { ROUTES } from '@/constants';

const ACTIVE_FILTERS = ['Seating', 'Cafe'];

export function CatalogHeader() {
  const router = useRouter();

  return (
    <div className={"flex flex-col gap-8"}>

     
      <div className={"flex flex-wrap items-center justify-between gap-8"}>
        <h2 className={"text-5xl font-bold tracking-tight text-foreground whitespace-nowrap"}>
          Catalog with Prebuilt Bundles
        </h2>
        <div className={'flex items-center gap-4'}>
          <div className={'relative w-[280px]'}>
            <Search
              className={
                'absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground'
              }
            />
            <Input
              placeholder={"Search curated catalog..."}
              className={"pl-10 h-[56px] text-sm rounded-full bg-white border border-neutral-200 text-foreground placeholder:text-muted-foreground shadow-none"}
            />
          </div>
          <Button
            className={"h-[56px] rounded-full px-6 whitespace-nowrap text-sm"}
            variant={"default"}
            onClick={() => router.push(ROUTES.CATALOG)}
          >
            View single Items
          </Button>
        </div>
      </div>

      <div className={"flex items-center justify-between gap-8 flex-wrap"}>
        <div className={"flex items-center gap-3 flex-wrap"}>
          {ACTIVE_FILTERS.map((filter) => (
            <Badge
              key={filter}
              variant={"secondary"}
              className={"rounded-full px-4 h-[40px] text-sm flex items-center gap-2 cursor-pointer bg-secondary/10 text-secondary hover:bg-secondary/20 border-0"}
            >
              {filter} <X className={'w-3.5 h-3.5'} />
            </Badge>
          ))}
          <button
            className={
              'text-sm text-secondary hover:underline underline-offset-2 font-medium'
            }
          >
            Clear all
          </button>
        </div>

        <div
          className={
            'flex items-center gap-2 text-sm text-muted-foreground shrink-0'
          }
        >
          Sort by:
          <DropdownMenu>
            <DropdownMenuTrigger
              className={
                'flex items-center gap-1.5 text-sm font-medium text-foreground outline-none border border-neutral-200 rounded-full px-4 py-2 bg-white hover:bg-neutral-50 transition-colors'
              }
            >
              Curated Popularity <ChevronDown className={'w-3.5 h-3.5'} />
            </DropdownMenuTrigger>
            <DropdownMenuContent align={'end'}>
              <DropdownMenuItem className={'text-sm'}>
                Curated Popularity
              </DropdownMenuItem>
              <DropdownMenuItem className={'text-sm'}>
                Price: Low to High
              </DropdownMenuItem>
              <DropdownMenuItem className={'text-sm'}>
                Price: High to Low
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </div>
  );
}
