'use client';

import { Upload, X } from 'lucide-react';
import Image from 'next/image';
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

export interface ProductFormData {
  title: string;
  price: number;
  stock: number;
  categoryId: string;
  spaces: string[];
  tags: string[];
  minSellUnits: number;
  width: number;
  height: number;
  depth: number;
}

type TOption = { id: string; title: string };

type TProductFormFieldsProps = {
  register: UseFormRegister<ProductFormData>;
  errors: FieldErrors<ProductFormData>;
  setValue: UseFormSetValue<ProductFormData>;
  categories?: TOption[];
  categoriesLoading: boolean;
  categoryValue?: string;
  spaces?: TOption[];
  tags?: TOption[];
  selectedSpaces: string[];
  selectedTags: string[];
  onToggleSpace: (title: string) => void;
  onToggleTag: (title: string) => void;
};

/** Adds the value to the list or removes it if it is already present. */
export function toggleInList(list: string[], value: string): string[] {
  return list.includes(value)
    ? list.filter(item => item !== value)
    : [...list, value];
}

/** Maps raw form values to the payload expected by the catalog API. */
export function buildProductPayload(data: ProductFormData, images: string[]) {
  return {
    title: data.title,
    price: Number(data.price),
    stock: Number(data.stock),
    categoryId: data.categoryId,
    minSellUnits: Number(data.minSellUnits),
    dimension: {
      width: Number(data.width) || 0,
      height: Number(data.height) || 0,
      depth: Number(data.depth) || 0,
    },
    spaces: data.spaces,
    tags: data.tags,
    images,
  };
}

/** Extracts a readable message from an API error response. */
export function getApiErrorMessage(error: unknown, fallback: string): string {
  const err = error as {
    response?: { data?: { message?: string | string[] } };
  };
  const message = err?.response?.data?.message;
  if (Array.isArray(message)) return message.join(', ');
  return message || fallback;
}

/** Shared product details card used by the create and edit pages. */
export function ProductFormFields({
  register,
  errors,
  setValue,
  categories,
  categoriesLoading,
  categoryValue,
  spaces,
  tags,
  selectedSpaces,
  selectedTags,
  onToggleSpace,
  onToggleTag,
}: TProductFormFieldsProps) {
  return (
    <Card className={'p-6 rounded-[30px] border-0 shadow-md space-y-6'}>
      <div className={'space-y-4'}>
        <div>
          <Label htmlFor={'title'}>Product Name *</Label>
          <Input
            id={'title'}
            {...register('title', { required: 'Product name is required' })}
            placeholder={'Enter product name'}
            className={'mt-2'}
          />
          {errors.title && (
            <p className={'text-sm text-red-500 mt-1'}>
              {errors.title.message}
            </p>
          )}
        </div>

        <div className={'grid grid-cols-2 gap-4'}>
          <div>
            <Label htmlFor={'price'}>Price ($) *</Label>
            <Input
              id={'price'}
              type={'number'}
              step={'0.01'}
              {...register('price', {
                required: 'Price is required',
                min: { value: 0, message: 'Price must be positive' },
              })}
              placeholder={'0.00'}
              className={'mt-2'}
            />
            {errors.price && (
              <p className={'text-sm text-red-500 mt-1'}>
                {errors.price.message}
              </p>
            )}
          </div>

          <div>
            <Label htmlFor={'stock'}>Stock *</Label>
            <Input
              id={'stock'}
              type={'number'}
              {...register('stock', {
                required: 'Stock is required',
                min: { value: 1, message: 'Must be at least 1' },
              })}
              placeholder={'1'}
              className={'mt-2'}
            />
            {errors.stock && (
              <p className={'text-sm text-red-500 mt-1'}>
                {errors.stock.message}
              </p>
            )}
          </div>
        </div>

        <div>
          <Label htmlFor={'minSellUnits'}>Minimum Sell Units *</Label>
          <Input
            id={'minSellUnits'}
            type={'number'}
            {...register('minSellUnits', {
              required: 'Min sell units is required',
              min: { value: 1, message: 'Must be at least 1' },
            })}
            placeholder={'1'}
            className={'mt-2'}
          />
          {errors.minSellUnits && (
            <p className={'text-sm text-red-500 mt-1'}>
              {errors.minSellUnits.message}
            </p>
          )}
        </div>

        <div>
          <Label htmlFor={'categoryId'}>Category *</Label>
          <Select
            value={categoryValue}
            onValueChange={value =>
              setValue('categoryId', value, { shouldDirty: true })
            }
            disabled={categoriesLoading}
          >
            <SelectTrigger className={'mt-2'}>
              <SelectValue placeholder={'Select category'} />
            </SelectTrigger>
            <SelectContent>
              {categories?.map(category => (
                <SelectItem
                  key={category.id}
                  value={category.id}
                >
                  {category.title}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {errors.categoryId && (
            <p className={'text-sm text-red-500 mt-1'}>
              {errors.categoryId.message}
            </p>
          )}
        </div>

        <div>
          <Label>Spaces *</Label>
          <div className={'grid grid-cols-3 gap-2 mt-2'}>
            {spaces?.map(space => (
              <Button
                key={space.id}
                type={'button'}
                variant={
                  selectedSpaces.includes(space.title) ? 'default' : 'outline'
                }
                onClick={() => onToggleSpace(space.title)}
                className={'justify-start'}
              >
                {space.title}
              </Button>
            ))}
          </div>
        </div>

        <div>
          <Label>Tags *</Label>
          <div className={'flex flex-wrap gap-2 mt-2'}>
            {tags?.map(tag => (
              <Button
                key={tag.id}
                type={'button'}
                variant={
                  selectedTags.includes(tag.title) ? 'default' : 'outline'
                }
                onClick={() => onToggleTag(tag.title)}
                className={'justify-start'}
              >
                {tag.title}
              </Button>
            ))}
          </div>
        </div>

        <div>
          <Label>Dimensions (cm)</Label>
          <div className={'grid grid-cols-3 gap-4 mt-2'}>
            <Input
              type={'number'}
              step={'0.1'}
              {...register('width', { min: 0 })}
              placeholder={'Width'}
            />
            <Input
              type={'number'}
              step={'0.1'}
              {...register('height', { min: 0 })}
              placeholder={'Height'}
            />
            <Input
              type={'number'}
              step={'0.1'}
              {...register('depth', { min: 0 })}
              placeholder={'Depth'}
            />
          </div>
        </div>
      </div>
    </Card>
  );
}

type TImageTileProps = {
  src: string;
  alt: string;
  onRemove: () => void;
  unoptimized?: boolean;
};

/** Square image preview with a remove button. */
export function ImageTile({
  src,
  alt,
  onRemove,
  unoptimized,
}: TImageTileProps) {
  return (
    <div
      className={
        'relative aspect-square rounded-[20px] overflow-hidden bg-neutral-100'
      }
    >
      <Image
        src={src}
        alt={alt}
        fill
        unoptimized={unoptimized}
        className={'object-cover'}
      />
      <button
        type={'button'}
        onClick={onRemove}
        className={
          'absolute top-2 right-2 w-6 h-6 rounded-full bg-red-500 text-white flex items-center justify-center hover:bg-red-600'
        }
      >
        <X className={'w-4 h-4'} />
      </button>
    </div>
  );
}

/** Dashed "Upload" tile that opens the file picker. */
export function UploadTile({
  onChange,
}: {
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}) {
  return (
    <label
      className={
        'aspect-square rounded-[20px] border-2 border-dashed border-neutral-300 hover:border-secondary transition-colors cursor-pointer flex flex-col items-center justify-center gap-2'
      }
    >
      <Upload className={'w-6 h-6 text-muted-foreground'} />
      <span className={'text-xs text-muted-foreground'}>Upload</span>
      <input
        type={'file'}
        accept={'image/*'}
        multiple
        onChange={onChange}
        className={'hidden'}
      />
    </label>
  );
}
