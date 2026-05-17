import { Badge } from '@shadcn/badge';
import Image from 'next/image';
import Link from 'next/link';

import { Button } from '@/components/ui/shadcn/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/shadcn/card';
import { ROUTES } from '@/constants';
import { ICONS } from '@/shared/data/icons';
import { IBundle } from '@/shared/types';

type TBundleCardProps = {
  isAuthorized: boolean;
  bundle: IBundle;
  onAdd?: () => void;
};

export function BundleCard({ isAuthorized, bundle, onAdd }: TBundleCardProps) {
  return (
    <Card
      className={
        'bg-white flex flex-row gap-5 p-2.5 rounded-3xl border-transparent ring-transparent shadow-xl'
      }
    >
      <div
        className={
          'relative grid grid-cols-2 grid-rows-2 gap-1 rounded-3xl overflow-hidden self-center shrink-0'
        }
      >
        {bundle.images.map((src, i) => (
          <Image
            key={i}
            src={src}
            alt={`${bundle.title} ${i + 1}`}
            className={'w-full object-cover'}
            width={300}
            height={300}
            unoptimized
          />
        ))}
        <Badge
          className={
            'absolute bottom-3 right-3 bg-white rounded-full p-3 shadow-sm border-0'
          }
        >
          <ICONS.Bundles
            size={14}
            color={'currentColor'}
            className={'text-secondary'}
          />
          <span className={'text-xs font-medium text-muted-foreground'}>
            {bundle.itemsCount} ITEMS
          </span>
        </Badge>
      </div>

      <div className={'flex flex-col flex-1 justify-between min-w-0'}>
        <CardHeader className={'pt-3 px-0 pb-0 gap-0.5'}>
          <CardTitle
            variant={'default'}
            className={'text-xl font-bold leading-tight'}
          >
            {bundle.title}
          </CardTitle>
          <CardDescription className={'text-sm text-primary'}>
            {bundle.vendor}
          </CardDescription>
          <p className={'text-sm text-muted-foreground leading-relaxed'}>
            {bundle.description}
          </p>
        </CardHeader>

        <CardContent className={'p-0'}>
          {isAuthorized ? (
            <div className={'flex flex-col gap-2'}>
              <span className={'text-2xl font-bold text-right'}>
                ${new Intl.NumberFormat('en-US').format(bundle.price)}
              </span>
              <Button
                variant={'default'}
                className={
                  'w-full h-10 rounded-full text-sm font-bold bg-blue-100 text-blue-700'
                }
                onClick={onAdd}
              >
                <ICONS.Cart
                  size={18}
                  color={'currentColor'}
                />
                Add to your Bundle
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
      </div>
    </Card>
  );
}
