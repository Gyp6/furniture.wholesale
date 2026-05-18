'use client';

import { Checkbox } from '@shadcn/checkbox';
import { Label } from '@shadcn/label';
import { Separator } from '@shadcn/separator';
import { Slider } from '@shadcn/slider';
import { ChevronDown } from 'lucide-react';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { useCallback, useState } from 'react';

import { SPACE_TYPES } from '@/constants';
import { useGetCategories, useGetTags } from '@/hooks/queries';
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
        className={'flex justify-between items-center w-full py-1 outline-none'}
      >
        <span className={'text-base font-semibold'}>{title}</span>
        <ChevronDown
          className={cn(
            'size-4 text-muted-foreground transition-transform duration-200',
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

export function CheckboxFilterGroup({
  title,
  defaultOpen = true,
  items,
  selectedItems,
  onItemChange,
  isLoading,
}: Readonly<{
  title: string;
  defaultOpen?: boolean;
  items: IFilter[];
  selectedItems: string[];
  onItemChange: (id: string, checked: boolean) => void;
  isLoading?: boolean;
}>) {
  return (
    <AccordionSection
      title={title}
      defaultOpen={defaultOpen}
    >
      <div className={'space-y-2.5'}>
        {isLoading ? (
          <div className={'text-sm text-muted-foreground'}>Loading...</div>
        ) : (
          items.map(item => (
            <div
              key={item.id}
              id={item.slug}
              className={'flex items-center space-x-2.5'}
            >
              <Checkbox
                id={item.id}
                checked={selectedItems.includes(item.id)}
                onCheckedChange={checked => onItemChange(item.id, !!checked)}
              />
              <Label
                htmlFor={item.id}
                className={'text-sm text-muted-foreground cursor-pointer'}
              >
                {item.title}
              </Label>
            </div>
          ))
        )}
      </div>
    </AccordionSection>
  );
}

export function CatalogSidebar() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const [priceRange, setPriceRange] = useState([4000, 16000]);

  const { data: categories, isLoading: isCategoriesLoading } =
    useGetCategories();
  const { data: tags, isLoading: isTagsLoading } = useGetTags();

  const selectedSpaces =
    searchParams.get('spaces')?.split(',').filter(Boolean) || [];
  const selectedCategories =
    searchParams.get('categories')?.split(',').filter(Boolean) || [];
  const selectedTags =
    searchParams.get('tags')?.split(',').filter(Boolean) || [];
  const minPrice = Number(searchParams.get('minPrice')) || 0;
  const maxPrice = Number(searchParams.get('maxPrice')) || 50000;

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
      // Reset page on filter change
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
    <aside className={'w-full lg:w-60 shrink-0 space-y-4'}>
      <h4
        className={
          'text-sm font-bold uppercase tracking-widest text-muted-foreground'
        }
      >
        Filters
      </h4>

      <div className={'space-y-6'}>
        <CheckboxFilterGroup
          title={'Category'}
          items={categories || []}
          selectedItems={selectedCategories}
          onItemChange={(id, checked) =>
            handleFilterChange('categories', selectedCategories, id, checked)
          }
          isLoading={isCategoriesLoading}
        />

        <Separator />

        <CheckboxFilterGroup
          title={'Style'}
          items={tags || []}
          selectedItems={selectedTags}
          onItemChange={(id, checked) =>
            handleFilterChange('tags', selectedTags, id, checked)
          }
          isLoading={isTagsLoading}
        />

        <Separator />

        <CheckboxFilterGroup
          title={'Space Type'}
          items={SPACE_TYPES.map(s => ({ id: s, title: s, slug: s }))}
          selectedItems={selectedSpaces}
          onItemChange={(id, checked) =>
            handleFilterChange('spaces', selectedSpaces, id, checked)
          }
        />

        <Separator />

        <AccordionSection title={'Price'}>
          <div
            className={
              'flex justify-between text-xs text-muted-foreground mb-2'
            }
          >
            <Label className={'text-sm text-muted-foreground'}>
              ${priceRange[0]}
            </Label>
            <Label className={'text-sm text-muted-foreground'}>
              ${priceRange[1]}
            </Label>
          </div>
          <div className={'space-y-4 py-4 px-1'}>
            <Slider
              value={priceRange}
              onValueChange={setPriceRange}
              defaultValue={[minPrice, maxPrice]}
              max={20000}
              step={100}
              onValueCommit={handlePriceChange}
            />
            <div
              className={
                'items-center justify-between text-sm text-muted-foreground hidden'
              }
            >
              <span>${minPrice}</span>
              <span>${maxPrice}</span>
            </div>
          </div>
        </AccordionSection>
      </div>
    </aside>
  );
}
