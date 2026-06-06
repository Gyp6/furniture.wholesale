'use client';

import { ChevronDown, Plus, X } from 'lucide-react';
import { useState } from 'react';

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/shadcn/dropdown-menu';
import { LeadTimeOptions } from '@/shared/data/core/profile-data/profile-data';

export function BusinessTerms() {
  const [segments, setSegments] = useState([
    'Restaurant',
    'Coworking',
    'Retail',
  ]);
  const [selectedLeadTime, setSelectedLeadTime] = useState(LeadTimeOptions[0]);

  const removeSegment = (segment: string) => {
    setSegments(segments.filter(s => s !== segment));
  };

  return (
    <div className={'flex flex-col gap-4'}>
      <div className={'flex items-center gap-2'}>
        <div
          className={
            'w-7 h-7 rounded-full bg-white flex items-center justify-center shadow-md'
          }
        >
          <span className={'text-sm font-bold text-secondary'}>02</span>
        </div>
        <h2 className={'text-2xl font-bold'}>Business Terms</h2>
      </div>

      <div className={'bg-white rounded-[30px] p-6'}>
        <div className={'grid grid-cols-2 gap-6'}>
          <div className={'flex flex-col gap-2'}>
            <span
              className={
                'text-[14px] font-bold uppercase tracking-widest text-muted-foreground'
              }
            >
              Company's Terms of Use
            </span>
            <div
              className={
                'rounded-2xl border-2 border-dashed border-neutral-200 bg-secondary/5 flex flex-col items-center justify-center gap-2 h-[120px] cursor-pointer hover:bg-secondary/10 transition-colors'
              }
            >
              <div
                className={
                  'w-8 h-8 rounded-lg bg-secondary/10 flex items-center justify-center'
                }
              >
                <span className={'text-secondary text-lg'}>↑</span>
              </div>
              <p className={'text-[12px] text-muted-foreground text-center'}>
                PDF. Max 5MB.
              </p>
            </div>
          </div>

          <div className={'flex flex-col gap-4'}>
            <div className={'flex flex-col gap-2'}>
              <span
                className={
                  'text-[14px] font-bold uppercase tracking-widest text-muted-foreground'
                }
              >
                Standard Lead Time
              </span>
              <DropdownMenu>
                <DropdownMenuTrigger
                  className={
                    'w-full rounded-full border border-neutral-200 bg-neutral-50 px-5 py-3 text-sm outline-none flex items-center justify-between hover:bg-neutral-100 transition-colors cursor-pointer'
                  }
                >
                  {selectedLeadTime}
                  <ChevronDown className={'w-4 h-4 text-muted-foreground'} />
                </DropdownMenuTrigger>
                <DropdownMenuContent className={'w-[280px]'}>
                  {LeadTimeOptions.map(option => (
                    <DropdownMenuItem
                      key={option}
                      onClick={() => setSelectedLeadTime(option)}
                      className={'text-sm cursor-pointer'}
                    >
                      {option}
                    </DropdownMenuItem>
                  ))}
                </DropdownMenuContent>
              </DropdownMenu>
            </div>

            <div className={'flex flex-col gap-2'}>
              <span
                className={
                  'text-[14px] font-bold uppercase tracking-widest text-muted-foreground'
                }
              >
                Focus Segments
              </span>
              <div className={'flex items-center gap-2 flex-wrap'}>
                {segments.map(segment => (
                  <div
                    key={segment}
                    className={
                      'flex items-center gap-1.5 bg-neutral-100 rounded-full px-3 py-1.5 text-sm font-medium'
                    }
                  >
                    {segment}
                    <button onClick={() => removeSegment(segment)}>
                      <X className={'w-3 h-3 text-muted-foreground'} />
                    </button>
                  </div>
                ))}
                <button
                  className={
                    'flex items-center gap-1 bg-secondary/10 text-secondary rounded-full px-3 py-1.5 text-sm font-medium hover:bg-secondary/20 transition-colors'
                  }
                >
                  More <Plus className={'w-3 h-3'} />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
