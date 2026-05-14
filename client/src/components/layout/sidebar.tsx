'use client';

import { Checkbox } from '@shadcn/checkbox';
import { Label } from '@shadcn/label';
import { Separator } from '@shadcn/separator';
import { Slider } from '@shadcn/slider';
import { ChevronDown } from 'lucide-react';
import { useState } from 'react';

import { CATEGORIES, SPACE_TYPES, STYLES } from '@/constants';
import { cn } from '@/lib/cn';
import { ESpaceType } from '@/shared/enums';

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
}: Readonly<{
  title: string;
  defaultOpen?: boolean;
  items: string[];
}>) {
  return (
    <AccordionSection
      title={title}
      defaultOpen={defaultOpen}
    >
      <div className={'space-y-2.5'}>
        {items.map(item => (
          <div
            key={item}
            className={'flex items-center space-x-2.5'}
          >
            <Checkbox id={item} />
            <Label
              htmlFor={item}
              className={'text-sm text-muted-foreground cursor-pointer'}
            >
              {item}
            </Label>
          </div>
        ))}
      </div>
    </AccordionSection>
  );
}

export function CatalogSidebar() {
  const [priceRange, setPriceRange] = useState([2000, 18000]);
  return (
    <aside className={'w-full lg:w-60 shrink-0 space-y-4'}>
      <h4
        className={
          'text-sm font-bold uppercase tracking-widest text-muted-foreground'
        }
      >
        Filters
      </h4>

      <CheckboxFilterGroup
        title={'Category'}
        items={CATEGORIES}
      />

      <Separator />

      <CheckboxFilterGroup
        title={'Style'}
        items={STYLES}
      />

      <Separator />

      <AccordionSection title={'Space type'}>
        <div className={'space-y-2.5'}>
          {SPACE_TYPES.map(space => (
            <div
              key={space}
              className={'flex items-center space-x-2.5'}
            >
              <Checkbox
                id={space}
                defaultChecked={space === ESpaceType.RESTAURANT}
              />
              <Label
                htmlFor={space}
                className={`text-xs cursor-pointer ${space === ESpaceType.RESTAURANT ? 'font-semibold text-foreground' : 'text-muted-foreground'}`}
              >
                {space}
              </Label>
            </div>
          ))}
        </div>
      </AccordionSection>

      <Separator />

      <AccordionSection title={'Price'}>
        <div>
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
          <Slider
            value={priceRange}
            onValueChange={setPriceRange}
            min={100}
            max={20000}
            step={5}
            className={'mx-auto w-full max-w-xs h-4'}
          />
        </div>
      </AccordionSection>
    </aside>
  );
}
