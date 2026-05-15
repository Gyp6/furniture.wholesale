'use client';

import { useRouter } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/shadcn/card';
import { Button } from '@/components/ui/shadcn/button';
import { Badge } from '@/components/ui/shadcn/badge';
import { ICONS } from '@/shared/data/icons';
import { ROUTES } from '@/constants';

type TProductRelatedCardProps = {
  name: string;
  vendor: string;
  category: string;
  minPieces: number;
  price: number;
  image: string;
};

export function ProductRelatedCard({
  name,
  vendor,
  category,
  minPieces,
  price,
  image,
}: TProductRelatedCardProps) {
  const router = useRouter();

  return (
    <Card className="flex flex-col ring-0 border border-neutral-100 gap-0 p-[10px] rounded-[40px] shadow-[0_8px_40px_rgba(0,0,0,0.08)]">

      <div className="relative rounded-[30px] overflow-hidden">
        <img
          src={image}
          alt={name}
          className="w-full aspect-square object-cover"
        />
        <Badge className="absolute top-3 left-3 bg-white text-black text-[15px] font-medium px-3 py-1 rounded-full shadow-sm border-0">
          {category}
        </Badge>
      </div>

     
      <div className="flex flex-col mt-5 px-2 gap-4">
        <CardHeader className="px-0 pt-0 pb-0 gap-1">
          <CardTitle variant="default" size="default" className="text-base font-bold leading-tight">
            {name}
          </CardTitle>
          <CardDescription className="text-s">{vendor}</CardDescription>
        </CardHeader>

        <div className="flex items-center justify-between">
          <span className="text-s text-muted-foreground">min. {minPieces} pieces</span>
          <span className="text-base font-bold">${price.toLocaleString()}</span>
        </div>

        <CardContent className="px-0 pb-2">
          <Button
            variant="secondary"
            className="w-full rounded-full gap-2 bg-secondary/10 text-secondary hover:bg-secondary/20 text-xs h-10"
            onClick={() => router.push(ROUTES.CATALOG)}
          >
            <ICONS.Cart size={14} color="currentColor" />
            Add to Bundle
          </Button>
        </CardContent>
      </div>

    </Card>
  );
}