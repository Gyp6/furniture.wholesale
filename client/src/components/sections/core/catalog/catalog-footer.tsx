'use client';

import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
} from '@/components/ui/shadcn/pagination';
import { ChevronLeft, ChevronRight } from 'lucide-react';

const TOTAL_PAGES = 24;

type TCatalogFooterProps = {
  currentPage: number;
  onPageChange: (page: number) => void;
};

export function CatalogFooter({ currentPage, onPageChange }: TCatalogFooterProps) {
  const visiblePages = Array.from({ length: TOTAL_PAGES }, (_, i) => i + 1).filter(
    (p) => p === 1 || p === TOTAL_PAGES || (p >= currentPage - 1 && p <= currentPage + 1)
  );

  return (
    <div className="flex items-center justify-between mt-10 px-1">
      <span className="text-xs text-muted-foreground">
        Page {String(currentPage).padStart(2, '0')} — {String(TOTAL_PAGES).padStart(2, '0')}
      </span>

      <Pagination className="w-auto mx-0">
        <PaginationContent>

          <PaginationItem>
            <button
              onClick={() => onPageChange(Math.max(1, currentPage - 1))}
              disabled={currentPage === 1}
              className="w-9 h-9 rounded-full border border-neutral-200 bg-white hover:bg-neutral-50 flex items-center justify-center transition-colors disabled:opacity-40"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
          </PaginationItem>

          {visiblePages.map((page, i) => {
            const prev = visiblePages[i - 1];
            const showEllipsis = prev && page - prev > 1;
            return (
              <span key={page} className="flex items-center gap-0.5">
                {showEllipsis && (
                  <PaginationItem>
                    <PaginationEllipsis />
                  </PaginationItem>
                )}
                <PaginationItem>
                  <button
                    onClick={() => onPageChange(page)}
                    className={`w-9 h-9 rounded-full text-xs font-medium flex items-center justify-center transition-colors ${
                      currentPage === page
                        ? 'bg-foreground text-background'
                        : 'hover:bg-neutral-100 text-foreground'
                    }`}
                  >
                    {page}
                  </button>
                </PaginationItem>
              </span>
            );
          })}

          <PaginationItem>
            <button
              onClick={() => onPageChange(Math.min(TOTAL_PAGES, currentPage + 1))}
              disabled={currentPage === TOTAL_PAGES}
              className="w-9 h-9 rounded-full bg-foreground text-background hover:bg-foreground/80 flex items-center justify-center transition-colors disabled:opacity-40"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </PaginationItem>

        </PaginationContent>
      </Pagination>
    </div>
  );
}