import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/shadcn/card';
import { Button } from '@/components/ui/shadcn/button';
import { ICONS } from '@/shared/data/icons';

type TBundleCardProps = {
  name: string;
  vendor: string;
  description: string;
  price: number;
  itemsCount: number;
  images: string[];
  onAdd?: () => void;
};

export function BundleCard({ name, vendor, description, price, itemsCount, images, onAdd }: TBundleCardProps) {
  return (
    <Card className="flex flex-row ring-0 shadow-[0_8px_40px_rgba(0,0,0,0.08)] border border-neutral-100 gap-0 p-5 rounded-[40px] h-[340px] w-full">

    
      <div
        className="relative grid grid-cols-2 grid-rows-2 gap-1.5 rounded-2xl overflow-hidden self-center shrink-0"
        style={{ width: '195px', height: '300px' }}
      >
        {images.map((src, i) => (
          <img
            key={i}
            src={src}
            alt={`${name} ${i + 1}`}
            className="w-full h-full object-cover"
          />
        ))}
        <div className="absolute bottom-3 right-3 bg-white rounded-full px-3 py-1.5 flex items-center gap-2 shadow-sm">
          <ICONS.Bundles size={14} color="currentColor" className="text-secondary" />
          <span className="text-[11px] font-bold text-foreground">{itemsCount} ITEMS</span>
        </div>
      </div>

     
      <div className="flex flex-col flex-1 justify-between pl-5 min-w-0">
        <CardHeader className="px-0 pt-0 pb-0">
          <div className="flex flex-col gap-[15px]">
            <CardTitle variant="default" size="default" className="text-[24px] font-bold leading-tight">
              {name}
            </CardTitle>
            <div className="flex flex-col gap-1">
              <CardDescription className="text-[14px]">{vendor}</CardDescription>
              <p className="text-[14px] text-muted-foreground leading-relaxed">
                {description}
              </p>
            </div>
          </div>
        </CardHeader>

        <CardContent className="px-0 pb-0">
          <div className="flex flex-col gap-[30px]">
            <span className="text-[24px] font-bold text-right">${price.toLocaleString()}</span>
            <Button
              variant="secondary"
              size="default"
              className="rounded-full gap-2 bg-secondary/10 text-secondary hover:bg-secondary/20 w-full"
              onClick={onAdd}
            >
              <ICONS.Cart size={16} color="currentColor" />
              Add to your Bundle
            </Button>
          </div>
        </CardContent>
      </div>

    </Card>
  );
}