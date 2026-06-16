'use client';

import { Separator } from '@shadcn/separator';
import { Slider } from '@shadcn/slider';
import { ChevronDown } from 'lucide-react';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { useCallback, useEffect, useState } from 'react';

import { useGetCategories, useGetTags, useGetSpaces } from '@/hooks/queries';
import { cn } from '@/lib/cn';
import { IFilter } from '@/shared/types';

export function AccordionSection({
  title,
  defaultOpen = true,
  children,
}: {
  title: string;
  defaultOpen?: boolean;
  children: React.ReactNode;
}) {
  const [open, setOpen] = useState(defaultOpen);

  return (
    <div>
      <button
        onClick={() => setOpen(!open)}
        className={'flex justify-between items-center w-full py-1.5 outline-none cursor-pointer group'}
      >
        <span className={'text-base font-semibold text-neutral-800 group-hover:text-neutral-900'}>{title}</span>
        <ChevronDown
          className={cn(
            'size-4 text-neutral-400 transition-transform duration-200 group-hover:text-neutral-500',
            { 'rotate-180': open },
          )}
        />
      </button>
      <div
        className={cn('overflow-hidden transition-all duration-200', {
          'max-h-140 mt-3 opacity-100': open,
          'max-h-0 opacity-0': !open,
        })}
      >
        {children}
      </div>
    </div>
  );
}

interface FilterGroupProps {
  title: string;
  items: IFilter[];
  selectedItems: string[];
  onItemChange: (id: string, checked: boolean) => void;
  isLoading?: boolean;
}

function RadioFilterGroup({
  title,
  items,
  selectedItems,
  onItemChange,
  isLoading,
}: FilterGroupProps) {
  return (
    <AccordionSection title={title}>
      <div className={'space-y-3.5'}>
        {isLoading ? (
          <div className={'text-sm text-neutral-400 animate-pulse'}>Loading...</div>
        ) : (
          items.map(item => {
            const isSelected = selectedItems.includes(item.slug);
            return (
              <div
                key={item.slug}
                onClick={() => onItemChange(item.slug, !isSelected)}
                className={'flex items-center gap-3 cursor-pointer group'}
              >
                {/* Custom Radio Circle selector */}
                <div
                  className={cn(
                    'w-[18px] h-[18px] rounded-full border flex items-center justify-center transition-all shrink-0',
                    isSelected
                      ? 'bg-blue-600 border-blue-600 text-white'
                      : 'border-neutral-300 group-hover:border-neutral-400 bg-white',
                  )}
                >
                  {isSelected && (
                    <div className={'w-1.5 h-1.5 rounded-full bg-white'} />
                  )}
                </div>
                <span
                  className={cn(
                    'text-sm transition-colors select-none',
                    isSelected
                      ? 'text-neutral-900 font-semibold'
                      : 'text-neutral-500 group-hover:text-neutral-700',
                  )}
                >
                  {item.title}
                </span>
              </div>
            );
          })
        )}
      </div>
    </AccordionSection>
  );
}

export function CatalogSidebar() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const { data: categories, isLoading: isCategoriesLoading } =
    useGetCategories();
  const { data: tags, isLoading: isTagsLoading } = useGetTags();
  const { data: spaces, isLoading: isSpacesLoading } = useGetSpaces();

  const selectedSpaces =
    searchParams.get('spaces')?.split(',').filter(Boolean) || [];
  const selectedCategories =
    searchParams.get('categories')?.split(',').filter(Boolean) || [];
  const selectedTags =
    searchParams.get('tags')?.split(',').filter(Boolean) || [];

  const minPrice = Number(searchParams.get('minPrice')) || 0;
  const maxPrice = Number(searchParams.get('maxPrice')) || 20000;

  const [priceRange, setPriceRange] = useState([minPrice, maxPrice]);

  useEffect(() => {
    setPriceRange([minPrice, maxPrice]);
  }, [minPrice, maxPrice]);

  const createQueryString = useCallback(
    (params: Record<string, string | null>) => {
      const newSearchParams = new URLSearchParams(searchParams.toString());

      for (const [key, value] of Object.entries(params)) {
        if (value === null) {
          newSearchParams.delete(key);
        } else {
          newSearchParams.set(key, value);
        }
      }
      if (!params.page) newSearchParams.delete('page');

      return newSearchParams.toString();
    },
    [searchParams],
  );

  const handleFilterChange = (
    key: string,
    selected: string[],
    item: string,
    checked: boolean,
  ) => {
    const newSelected = checked
      ? [...selected, item]
      : selected.filter(s => s !== item);

    router.push(
      `${pathname}?${createQueryString({ [key]: newSelected.length ? newSelected.join(',') : null })}`,
      { scroll: false },
    );
  };

  const handlePriceChange = (values: number[]) => {
    router.push(
      `${pathname}?${createQueryString({ minPrice: values[0].toString(), maxPrice: values[1].toString() })}`,
      { scroll: false },
    );
  };

  return (
    <aside className={'w-full lg:w-60 shrink-0 space-y-6'}>
      <h4
        className={
          'text-xs font-bold uppercase tracking-widest text-neutral-400'
        }
      >
        Filters
      </h4>

      <div className={'space-y-6'}>
        <RadioFilterGroup
          title={'Category'}
          items={categories || []}
          selectedItems={selectedCategories}
          onItemChange={(id, checked) =>
            handleFilterChange('categories', selectedCategories, id, checked)
          }
          isLoading={isCategoriesLoading}
        />

        <Separator className={'bg-neutral-100'} />

        <RadioFilterGroup
          title={'Style'}
          items={tags || []}
          selectedItems={selectedTags}
          onItemChange={(id, checked) =>
            handleFilterChange('tags', selectedTags, id, checked)
          }
          isLoading={isTagsLoading}
        />

        <Separator className={'bg-neutral-100'} />

        <AccordionSection title={'Space type'}>
          <div className={'flex items-center gap-2 flex-wrap py-1.5'}>
            {isSpacesLoading ? (
              <div className={'text-sm text-neutral-400 animate-pulse'}>Loading...</div>
            ) : (
              (spaces || []).map(space => {
                const isSelected = selectedSpaces.includes(space.slug);
                return (
                  <button
                    key={space.slug}
                    onClick={() => {
                      const isChecked = !isSelected;
                      const newSelected = isChecked
                        ? [...selectedSpaces, space.slug]
                        : selectedSpaces.filter(s => s !== space.slug);
                      router.push(
                        `${pathname}?${createQueryString({ spaces: newSelected.length ? newSelected.join(',') : null })}`,
                        { scroll: false },
                      );
                    }}
                    className={cn(
                      'px-4 py-2 rounded-full text-xs font-semibold border transition-all cursor-pointer shadow-sm outline-none',
                      isSelected
                        ? 'bg-neutral-900 border-neutral-900 text-white hover:bg-neutral-800'
                        : 'bg-white border-neutral-200 text-neutral-600 hover:bg-neutral-50',
                    )}
                  >
                    {space.title}
                  </button>
                );
              })
            )}
          </div>
        </AccordionSection>

        <Separator className={'bg-neutral-100'} />

        <AccordionSection title={'Price'}>
          <div className={'space-y-4 py-2 px-1'}>
            <div className={'flex items-center gap-2'}>
              <div className={'relative flex-1'}>
                <input
                  type={'text'}
                  value={new Intl.NumberFormat('en-US').format(priceRange[0])}
                  disabled
                  className={
                    'w-full text-center border border-neutral-200 rounded-xl py-2 px-3 text-sm bg-white text-neutral-800 font-semibold'
                  }
                />
              </div>
              <span className={'text-xs text-neutral-400 font-medium select-none'}>to</span>
              <div className={'relative flex-1'}>
                <input
                  type={'text'}
                  value={new Intl.NumberFormat('en-US').format(priceRange[1])}
                  disabled
                  className={
                    'w-full text-center border border-neutral-200 rounded-xl py-2 px-3 text-sm bg-white text-neutral-800 font-semibold'
                  }
                />
              </div>
            </div>

            <Slider
              value={priceRange}
              onValueChange={setPriceRange}
              min={0}
              max={20000}
              step={100}
              onValueCommit={handlePriceChange}
              className={'py-2 cursor-pointer'}
            />

            <div className={'flex justify-between text-xs text-neutral-400 font-semibold select-none'}>
              <span>$0k</span>
              <span>$20k</span>
            </div>
          </div>
        </AccordionSection>
      </div>
    </aside>
  );
}
