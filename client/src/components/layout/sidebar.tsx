'use client';

import { useState } from 'react';
import { ChevronDown } from 'lucide-react';
import { Checkbox } from "@/components/ui/shadcn/checkbox";
import { Label } from "@/components/ui/shadcn/label";
import { Separator } from "@/components/ui/shadcn/separator";
import { CATEGORIES, STYLES, MATERIALS, SPACE_TYPES, CATALOG_COLORS } from '@/constants/catalog.const';
import { ESpaceType } from '@/shared/enums';

function AccordionSection({
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
        className="flex justify-between items-center w-full py-1 outline-none"
      >
        <span className="text-[13px] font-semibold">{title}</span>
        <ChevronDown
          className={`w-3.5 h-3.5 text-muted-foreground transition-transform duration-200 ${open ? 'rotate-180' : ''}`}
        />
      </button>
      <div
        className={`overflow-hidden transition-all duration-200 ${open ? 'max-h-96 mt-3 opacity-100' : 'max-h-0 opacity-0'}`}
      >
        {children}
      </div>
    </div>
  );
}

export function CatalogSidebar() {
  return (
    <aside className="w-full lg:w-[200px] shrink-0 space-y-4">
      <h4 className="text-[11px] font-bold uppercase tracking-widest text-muted-foreground">
        Filters
      </h4>

      <AccordionSection title="Category">
        <div className="space-y-2.5">
          {CATEGORIES.map((cat) => (
            <div key={cat} className="flex items-center space-x-2.5">
              <Checkbox id={cat} />
              <Label htmlFor={cat} className="text-xs text-[#475467] cursor-pointer">{cat}</Label>
            </div>
          ))}
        </div>
      </AccordionSection>

      <Separator />

      <AccordionSection title="Style">
        <div className="space-y-2.5">
          {STYLES.map((style) => (
            <div key={style} className="flex items-center space-x-2.5">
              <Checkbox id={style} />
              <Label htmlFor={style} className="text-xs text-[#475467] cursor-pointer">{style}</Label>
            </div>
          ))}
        </div>
      </AccordionSection>

      <Separator />

      <AccordionSection title="Color">
        <div className="flex gap-2 flex-wrap">
          {CATALOG_COLORS.map((color) => (
            <button
              key={color}
              className="w-5 h-5 rounded-full border border-neutral-300 hover:ring-2 ring-offset-1 ring-neutral-400 transition-all"
              style={{ backgroundColor: color }}
            />
          ))}
        </div>
      </AccordionSection>

      <Separator />

      <AccordionSection title="Material">
        <div className="space-y-2.5">
          {MATERIALS.map((mat) => (
            <div key={mat} className="flex items-center space-x-2.5">
              <Checkbox id={mat} />
              <Label htmlFor={mat} className="text-xs text-[#475467] cursor-pointer">{mat}</Label>
            </div>
          ))}
        </div>
      </AccordionSection>

      <Separator />

      <AccordionSection title="Space type">
        <div className="space-y-2.5">
          {SPACE_TYPES.map((space) => (
            <div key={space} className="flex items-center space-x-2.5">
              <Checkbox
                id={space}
                defaultChecked={space === ESpaceType.RESTAURANT}
              />
              <Label
                htmlFor={space}
                className={`text-xs cursor-pointer ${space === ESpaceType.RESTAURANT ? 'font-semibold text-foreground' : 'text-[#475467]'}`}
              >
                {space}
              </Label>
            </div>
          ))}
        </div>
      </AccordionSection>

      <Separator />

      <AccordionSection title="Price">
        <div className="flex justify-between text-xs text-muted-foreground mb-2">
          <span>$100</span>
          <span>$20,000</span>
        </div>
        <div className="relative h-1 bg-neutral-200 rounded-full">
          <div
            className="absolute h-full bg-foreground rounded-full"
            style={{ left: '5%', right: '15%' }}
          />
        </div>
      </AccordionSection>
    </aside>
  );
}