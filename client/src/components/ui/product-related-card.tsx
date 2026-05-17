import Image from 'next/image';

import { Badge } from '@/components/ui/shadcn/badge';
import { Button } from '@/components/ui/shadcn/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/shadcn/card';
import { ICONS } from '@/shared/data/icons';
import { IProduct } from '@/shared/types';

type Props = {
  product: IProduct;
};

export function ProductRelatedCard({ product }: Props) {
  return (
    <Card
			className={
        'bg-white p-2.5 rounded-3xl border-transparent ring-transparent shadow-xl'
      }
    >
      <div className={'relative'}>
        <Image
          src={product.image}
          alt={product.title}
          className={'w-full aspect-square object-cover rounded-2xl'}
          width={300}
          height={300}
          unoptimized
        />
        <Badge
          className={
            'absolute top-3 left-3 bg-white text-muted-foreground text-xs font-medium p-3 shadow-sm border-0'
          }
        >
          {product.space}
        </Badge>
      </div>

      <div className={'flex flex-col mt-5 px-2 gap-4'}>
        <CardHeader className={'px-0 pt-0 pb-0 gap-1'}>
          <CardTitle
            variant={'default'}
            size={'default'}
            className={'text-base font-bold leading-tight'}
          >
            {product.title}
          </CardTitle>
          <CardDescription className={'text-s'}>{product.vendor}</CardDescription>
        </CardHeader>

        <div className={'flex items-center justify-between'}>
          <span className={'text-s text-muted-foreground'}>
            min. {product.minPieces} pieces
          </span>
          <span className={'text-base font-bold'}>
            ${new Intl.NumberFormat('en-US').format(product.price)}
          </span>
        </div>

        <CardContent className={'px-0 pb-2'}>
          <Button
            variant={'secondary'}
            className={
              'w-full rounded-full gap-2 bg-secondary/10 text-secondary hover:bg-secondary/20 text-xs h-10'
            }
            // onClick={() => router.push(ROUTES.CATALOG)}
          >
            <ICONS.Cart
              size={14}
              color={'currentColor'}
            />
            Add to Bundle
          </Button>
        </CardContent>
      </div>
    </Card>
  );
}
