'use client';

import { Button } from '@shadcn/button';
import { ArrowLeft, ArrowRight } from 'lucide-react';

import { cn } from '@/lib/cn';

interface Props {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  className?: string;
}

export function Pagination({
  currentPage,
  totalPages,
  onPageChange,
  className,
}: Props) {
  const formatPage = (num: number) => (num < 10 ? `0${num}` : num);

  const handlePrev = () => {
    if (currentPage > 1) onPageChange(currentPage - 1);
  };

  const handleNext = () => {
    if (currentPage < totalPages) onPageChange(currentPage + 1);
  };

  return (
    <div
      className={cn(
        'flex items-center justify-between mt-10 text-base text-muted-foreground',
        className,
      )}
    >
      <span className={'select-none font-medium'}>
        Page {formatPage(currentPage)} — {formatPage(totalPages)}
      </span>
      <div className={'flex items-center gap-3'}>
        {/* <button
          className={
            'w-8 h-8 rounded-full border border-neutral-200 flex items-center justify-center hover:bg-neutral-100'
          }
        >
          <ArrowLeft className={'size-4'} />
        </button>
        <button
          className={
            'w-8 h-8 rounded-full bg-foreground text-background flex items-center justify-center'
          }
        >
          <ArrowRight className={'size-4'} />
        </button> */}
        <Button
          variant={'outline'}
          size={'icon'}
          onClick={handlePrev}
          disabled={currentPage <= 1}
          className={'rounded-full w-10 h-10 border-neutral-200'}
        >
          <ArrowLeft className={'size-4 text-foreground'} />
          <span className={'sr-only'}>Previous page</span>
        </Button>

        <Button
          variant={'default'}
          size={'icon'}
          onClick={handleNext}
          disabled={currentPage >= totalPages}
          className={'rounded-full w-10 h-10'}
        >
          <ArrowRight className={'size-4'} />
          <span className={'sr-only'}>Next page</span>
        </Button>
      </div>
    </div>
  );
}
