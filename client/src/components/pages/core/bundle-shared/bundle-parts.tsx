'use client';

import { Package, Plus, Search, X } from 'lucide-react';
import Image from 'next/image';
import { ReactNode } from 'react';
import { FieldErrors, UseFormRegister, UseFormSetValue } from 'react-hook-form';

import { Button } from '@/components/ui/shadcn/button';
import { Card } from '@/components/ui/shadcn/card';
import { Input } from '@/components/ui/shadcn/input';
import { Label } from '@/components/ui/shadcn/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/shadcn/select';
import { Skeleton } from '@/components/ui/shadcn/skeleton';
import { Textarea } from '@/components/ui/shadcn/textarea';
import { ROUTES } from '@/constants';
import { IProduct } from '@/shared/types';

export interface BundleFormData {
  name: string;
  description: string;
  spaceTypeId: string;
}

const formatPrice = (value: number) =>
  value.toLocaleString('en-US', { minimumFractionDigits: 2 });

/** Product thumbnail with a placeholder icon when the product has no images. */
function ProductThumb({
  product,
  iconClassName,
}: {
  product: IProduct;
  iconClassName: string;
}) {
  if (!product.images?.[0]) {
    return (
      <div className={'w-full h-full flex items-center justify-center'}>
        <Package className={iconClassName} />
      </div>
    );
  }
  return (
    <Image
      src={ROUTES.S3(product.images[0])}
      alt={product.title}
      className={'w-full h-full object-cover'}
      unoptimized
      fill
    />
  );
}

type TBundleInfoFieldsProps = {
  register: UseFormRegister<BundleFormData>;
  errors: FieldErrors<BundleFormData>;
  setValue: UseFormSetValue<BundleFormData>;
  spaces?: { id: string; title: string }[];
  spacesLoading: boolean;
  spaceValue?: string;
};

/** Name, description and space type of a bundle. */
export function BundleInfoFields({
  register,
  errors,
  setValue,
  spaces,
  spacesLoading,
  spaceValue,
}: TBundleInfoFieldsProps) {
  return (
    <Card className={'p-6 rounded-[30px] border-0 shadow-md space-y-6'}>
      <div className={'space-y-4'}>
        <div>
          <Label htmlFor={'name'}>Bundle Name *</Label>
          <Input
            id={'name'}
            {...register('name', { required: 'Bundle name is required' })}
            placeholder={'Enter bundle name'}
            className={'mt-2'}
          />
          {errors.name && (
            <p className={'text-sm text-red-500 mt-1'}>{errors.name.message}</p>
          )}
        </div>

        <div>
          <Label htmlFor={'description'}>Description</Label>
          <Textarea
            id={'description'}
            {...register('description')}
            placeholder={'Describe your bundle'}
            className={'mt-2'}
            rows={3}
          />
        </div>

        <div>
          <Label>Space Type *</Label>
          <Select
            value={spaceValue}
            onValueChange={value =>
              setValue('spaceTypeId', value, { shouldDirty: true })
            }
            disabled={spacesLoading}
          >
            <SelectTrigger className={'mt-2'}>
              <SelectValue placeholder={'Select space type'} />
            </SelectTrigger>
            <SelectContent>
              {spaces?.map(space => (
                <SelectItem
                  key={space.id}
                  value={space.id}
                >
                  {space.title}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>
    </Card>
  );
}

type TBundleProductCardProps = {
  product: IProduct;
  unitPrice: number;
  onRemove: () => void;
  /** Quantity display or stepper rendered after the "Qty:" label. */
  quantitySlot: ReactNode;
};

/** Card of a product that is already part of the bundle. */
export function BundleProductCard({
  product,
  unitPrice,
  onRemove,
  quantitySlot,
}: TBundleProductCardProps) {
  return (
    <div
      className={
        'relative rounded-[20px] border border-neutral-100 bg-white overflow-hidden shadow-sm'
      }
    >
      <button
        type={'button'}
        onClick={onRemove}
        className={
          'absolute top-2 right-2 z-10 w-6 h-6 rounded-full bg-red-500 text-white flex items-center justify-center hover:bg-red-600'
        }
      >
        <X className={'w-4 h-4'} />
      </button>

      <div className={'aspect-square bg-neutral-50 relative'}>
        <ProductThumb
          product={product}
          iconClassName={'w-10 h-10 text-neutral-300'}
        />
      </div>

      <div className={'p-3 space-y-2'}>
        <p className={'text-sm font-semibold leading-tight line-clamp-2'}>
          {product.title}
        </p>
        <p className={'text-xs text-muted-foreground'}>
          ${formatPrice(unitPrice)} / unit
        </p>
        <div className={'flex items-center gap-2'}>
          <span className={'text-xs text-muted-foreground'}>Qty:</span>
          {quantitySlot}
        </div>
      </div>
    </div>
  );
}

/** Dashed tile that opens the product picker. */
export function AddProductTile({ onClick }: { onClick: () => void }) {
  return (
    <button
      type={'button'}
      onClick={onClick}
      className={
        'aspect-square rounded-[20px] border-2 border-dashed border-neutral-300 hover:border-secondary transition-colors cursor-pointer flex flex-col items-center justify-center gap-2'
      }
    >
      <div
        className={
          'w-10 h-10 rounded-full bg-secondary/10 flex items-center justify-center'
        }
      >
        <Plus className={'w-5 h-5 text-secondary'} />
      </div>
      <span className={'text-xs font-medium text-muted-foreground'}>
        Add Product
      </span>
    </button>
  );
}

/** Search input of the product picker dialog. */
export function PickerSearch({
  value,
  onChange,
}: {
  value: string;
  onChange: (value: string) => void;
}) {
  return (
    <div className={'relative'}>
      <Search
        className={
          'absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground'
        }
      />
      <Input
        placeholder={'Search your products...'}
        value={value}
        onChange={e => onChange(e.target.value)}
        className={'pl-9'}
      />
    </div>
  );
}

type TPickerProductRowProps = {
  product: IProduct;
  isSelected: boolean;
  onAdd: (product: IProduct) => void;
};

/** One selectable row of the product picker. */
export function PickerProductRow({
  product,
  isSelected,
  onAdd,
}: TPickerProductRowProps) {
  const stateClass = isSelected
    ? 'border-secondary/30 bg-secondary/5 opacity-60'
    : 'border-neutral-100 hover:bg-neutral-50 cursor-pointer';

  return (
    <div
      className={`flex items-center gap-3 p-3 rounded-xl border transition-colors ${stateClass}`}
      onClick={() => {
        if (!isSelected) onAdd(product);
      }}
    >
      <div
        className={
          'relative w-12 h-12 rounded-lg bg-neutral-100 overflow-hidden shrink-0'
        }
      >
        <ProductThumb
          product={product}
          iconClassName={'w-5 h-5 text-neutral-300'}
        />
      </div>

      <div className={'flex-1 min-w-0'}>
        <p className={'text-sm font-medium truncate'}>{product.title}</p>
        <p className={'text-xs text-muted-foreground'}>
          ${formatPrice(product.price)}
          {product.stock !== undefined && ` · ${product.stock} in stock`}
        </p>
      </div>

      {isSelected ? (
        <span
          className={
            'text-xs font-medium text-secondary px-2 py-1 rounded-full bg-secondary/10'
          }
        >
          Added
        </span>
      ) : (
        <Button
          type={'button'}
          variant={'outline'}
          size={'sm'}
          className={'rounded-full text-xs shrink-0'}
          onClick={e => {
            e.stopPropagation();
            onAdd(product);
          }}
        >
          <Plus className={'w-3 h-3 mr-1'} />
          Add
        </Button>
      )}
    </div>
  );
}

type TPickerProductListProps = {
  loading: boolean;
  products: IProduct[];
  selectedIds: Set<string | undefined>;
  search: string;
  onAdd: (product: IProduct) => void;
  emptyHint?: string;
};

/** Loading / list / empty states of the product picker. */
export function PickerProductList({
  loading,
  products,
  selectedIds,
  search,
  onAdd,
  emptyHint,
}: TPickerProductListProps) {
  if (loading) {
    return (
      <div className={'space-y-2'}>
        {[...Array(4)].map((_, i) => (
          <Skeleton
            key={i}
            className={'h-16 rounded-xl'}
          />
        ))}
      </div>
    );
  }

  if (products.length === 0) {
    return (
      <div
        className={
          'flex flex-col items-center justify-center py-12 text-muted-foreground'
        }
      >
        <Package className={'w-10 h-10 mb-2 text-neutral-300'} />
        <p className={'text-sm'}>
          {search ? 'No products match your search' : 'No products found'}
        </p>
        {emptyHint && <p className={'text-xs mt-1'}>{emptyHint}</p>}
      </div>
    );
  }

  return (
    <>
      {products.map(product => (
        <PickerProductRow
          key={product.id}
          product={product}
          isSelected={selectedIds.has(product.id)}
          onAdd={onAdd}
        />
      ))}
    </>
  );
}
