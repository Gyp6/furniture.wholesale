import { Checkbox } from "@/components/ui/shadcn/checkbox";
import { Label } from "@/components/ui/shadcn/label";

const CATEGORIES = ["Seating", "Tables & Desks", "Storage", "Lounge", "Dining"];

export function CatalogFilters() {
  return (
    <aside className="w-full lg:w-[240px] space-y-10">
      <div>
        <h4 className="text-[12px] font-bold uppercase tracking-widest text-muted-foreground mb-6">Category</h4>
        <div className="space-y-4">
          {CATEGORIES.map((cat) => (
            <div key={cat} className="flex items-center space-x-3">
              <Checkbox id={cat} className="rounded-full border-neutral-300" />
              <Label htmlFor={cat} className="text-sm font-medium text-[#475467] cursor-pointer">{cat}</Label>
            </div>
          ))}
        </div>
      </div>
    </aside>
  );
}