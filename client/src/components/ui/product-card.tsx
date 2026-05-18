import { Plus } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';

import { Badge } from '@/components/ui/shadcn/badge';
import { Button } from '@/components/ui/shadcn/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/shadcn/card';
import { ROUTES } from '@/constants';
import { IProduct } from '@/shared/types';

interface Props {
  isAuthorized: boolean;
  product: IProduct;
}

export function ProductCard({ isAuthorized, product }: Props) {
  return (
    <Card
      className={
        'bg-white p-2.5 rounded-4xl border-transparent ring-transparent shadow-xl gap-2'
      }
    >
      <Link href={ROUTES.PRODUCT(product.id)}>
        <div className={'relative'}>
          <Image
            src={product.images[0]}
            alt={product.title}
            className={'w-full aspect-square object-cover rounded-3xl'}
            width={300}
            height={300}
            unoptimized
          />
          <Badge
            className={
              'absolute top-3 left-3 bg-white text-muted-foreground text-xs font-medium p-3 shadow-sm border-0'
            }
          >
            {product.spaceType}
          </Badge>
        </div>

        <CardHeader className={'pt-2 px-0 pb-0 gap-0.5'}>
          <CardTitle
            variant={'default'}
            className={'text-xl font-bold leading-tight'}
          >
            {product.title}
          </CardTitle>
          <CardDescription className={'text-sm text-primary'}>
            {product.vendor}
          </CardDescription>
        </CardHeader>
      </Link>
      
      <CardContent className={'p-0 mt-auto'}>
        {isAuthorized ? (
          <div className={'flex flex-col gap-2'}>
            <div className={'flex items-center justify-between'}>
              <p className={'text-sm text-muted-foreground'}>
                min. {product.minSellQuantity} pieces
              </p>
              <span className={'text-2xl font-bold'}>
                ${new Intl.NumberFormat('en-US').format(product.price)}
              </span>
            </div>
            <Button
              className={
                'w-full h-10 rounded-full text-sm font-bold bg-blue-100 text-blue-700'
              }
              variant={'default'}
            >
              <Plus className={'mr-1 w-3 h-3'} /> Add to Bundle
            </Button>
          </div>
        ) : (
          <Link href={ROUTES.AUTH.REGISTER}>
            <Button
              className={
                'w-full h-10 rounded-2xl text-xs whitespace-normal text-center leading-tight bg-neutral-300 hover:bg-neutral-200'
              }
              variant={'secondary'}
            >
              Price available after registration
            </Button>
          </Link>
        )}
      </CardContent>
    </Card>
  );
}
