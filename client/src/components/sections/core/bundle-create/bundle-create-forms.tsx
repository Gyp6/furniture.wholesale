'use client';

import { useState } from 'react';
import { ChevronDown } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/shadcn/dropdown-menu';
import { StyleOptions, SpaceTypeOptions, BundleCardData } from '@/shared/data/core/catalog/catalog.data';

export function BundleCreateForm() {
  const [style, setStyle] = useState(StyleOptions[0]);
  const [spaceType, setSpaceType] = useState(SpaceTypeOptions[0]);

  return (
    <div className="bg-white rounded-[30px] p-6">
      <div className="flex items-end gap-4">

        <div className="flex flex-col gap-2" style={{ width: '278px' }}>
          <span className="text-[12px] font-bold uppercase tracking-widest text-muted-foreground">
            Title <span className="text-red-500">*</span>
          </span>
          <input
            type="text"
            defaultValue={BundleCardData.title}
            className="rounded-full border border-neutral-200 bg-secondary/5 px-4 py-2.5 text-sm outline-none focus:border-secondary transition-colors"
          />
        </div>

        <div className="flex flex-col gap-2" style={{ width: '278px' }}>
          <span className="text-[12px] font-bold uppercase tracking-widest text-muted-foreground">Style</span>
          <DropdownMenu>
            <DropdownMenuTrigger className="rounded-full border border-neutral-200 bg-secondary/5 px-4 py-2.5 text-sm outline-none flex items-center justify-between hover:bg-secondary/10 transition-colors cursor-pointer">
              {style}
              <ChevronDown className="w-4 h-4 text-muted-foreground" />
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              {StyleOptions.map((option) => (
                <DropdownMenuItem key={option} onClick={() => setStyle(option)} className="text-sm cursor-pointer">
                  {option}
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        <div className="flex flex-col gap-2" style={{ width: '278px' }}>
          <span className="text-[12px] font-bold uppercase tracking-widest text-muted-foreground">Space Type</span>
          <DropdownMenu>
            <DropdownMenuTrigger className="rounded-full border border-neutral-200 bg-secondary/5 px-4 py-2.5 text-sm outline-none flex items-center justify-between hover:bg-secondary/10 transition-colors cursor-pointer">
              {spaceType}
              <ChevronDown className="w-4 h-4 text-muted-foreground" />
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              {SpaceTypeOptions.map((option) => (
                <DropdownMenuItem key={option} onClick={() => setSpaceType(option)} className="text-sm cursor-pointer">
                  {option}
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        <div className="flex flex-col gap-2 flex-1">
          <span className="text-[12px] font-bold uppercase tracking-widest text-muted-foreground">Description</span>
          <input
            type="text"
            defaultValue={BundleCardData.description}
            className="rounded-full border border-neutral-200 bg-secondary/5 px-4 py-2.5 text-sm outline-none focus:border-secondary transition-colors w-full"
          />
        </div>

      </div>
    </div>
  );
}