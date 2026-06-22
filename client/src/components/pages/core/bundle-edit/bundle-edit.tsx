'use client';

import { ArrowLeft, Package, Plus, Search, X } from 'lucide-react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';

import { Button } from '@/components/ui/shadcn/button';
import { Card } from '@/components/ui/shadcn/card';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/shadcn/dialog';
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
import {
  useAddBundleItem,
  useGetBundle,
  useRemoveBundleItem,
  useUpdateBundle,
} from '@/hooks/queries/bundle.query';
import { useGetMyProducts, useGetSpaces } from '@/hooks/queries/catalog.query';
import { IProduct } from '@/shared/types';

interface BundleFormData {
  name: string;
  description: string;
  spaceTypeId: string;
}

export function BundleEditPage({ bundleId }: { bundleId: string }) {
  const router = useRouter();
  const [pickerOpen, setPickerOpen] = useState(false);
  const [pickerSearch, setPickerSearch] = useState('');
  const [isSaving, setIsSaving] = useState(false);

  const { data: bundle, isLoading: bundleLoading } = useGetBundle(bundleId);
  const { data: spaces, isLoading: spacesLoading } = useGetSpaces();
  const { data: myProducts, isLoading: productsLoading } = useGetMyProducts();
  const updateBundle = useUpdateBundle(bundleId);
  const addBundleItem = useAddBundleItem(bundleId);
  const removeBundleItem = useRemoveBundleItem(bundleId);

  const {
    register,
    handleSubmit,
    setValue,
    reset,
    formState: { errors, isDirty },
  } = useForm<BundleFormData>();

  useEffect(() => {
    if (bundle) {
      reset({
        name: bundle.name,
        description: bundle.description || '',
        spaceTypeId: bundle.space?.id || '',
      });
    }
  }, [bundle, reset]);

  const bundleItemProductIds = new Set(
    bundle?.items?.map(item => item.product?.id).filter(Boolean) ?? [],
  );

  const filteredProducts = (myProducts ?? []).filter(p => {
    if (!pickerSearch) return true;
    const search = pickerSearch.toLowerCase();
    return (
      p.title.toLowerCase().includes(search) ||
      p.sku.toLowerCase().includes(search)
    );
  });

  const handleAddProduct = async (product: IProduct) => {
    try {
      await addBundleItem.mutateAsync({
        productId: product.id,
        quantity: product.minSellUnits ?? 1,
        priceSnapshot: product.price,
      });
      toast.success(`Added "${product.title}" to bundle`);
    } catch (error: any) {
      toast.error(error?.response?.data?.message || 'Failed to add product');
    }
  };

  const handleRemoveItem = async (itemId: string) => {
    try {
      await removeBundleItem.mutateAsync(itemId);
      toast.success('Product removed from bundle');
    } catch (error: any) {
      toast.error(error?.response?.data?.message || 'Failed to remove product');
    }
  };

  const onSubmit = async (data: BundleFormData) => {
    setIsSaving(true);
    try {
      await updateBundle.mutateAsync({
        name: data.name,
        description: data.description || undefined,
        spaceTypeId: data.spaceTypeId,
      });
      toast.success('Bundle updated successfully!');
      router.push('/professional');
    } catch (error: any) {
      toast.error(error?.response?.data?.message || 'Failed to update bundle');
    } finally {
      setIsSaving(false);
    }
  };

  const totalPrice =
    bundle?.items?.reduce(
      (sum, item) => sum + item.priceSnapshot * item.quantity,
      0,
    ) ?? 0;

  if (bundleLoading) {
    return (
      <div className={'w-full max-w-4xl mx-auto p-6 space-y-6'}>
        <Skeleton className={'h-10 w-40'} />
        <Skeleton className={'h-12 w-80'} />
        <Skeleton className={'h-64 w-full rounded-[30px]'} />
        <Skeleton className={'h-64 w-full rounded-[30px]'} />
      </div>
    );
  }

  if (!bundle) {
    return (
      <div className={'w-full max-w-4xl mx-auto p-6 text-center py-20'}>
        <p className={'text-muted-foreground'}>Bundle not found</p>
        <Button
          variant={'outline'}
          className={'mt-4'}
          onClick={() => router.push('/professional')}
        >
          Back to Dashboard
        </Button>
      </div>
    );
  }

  return (
    <div className={'w-full max-w-4xl mx-auto p-6 space-y-6'}>
      <Button
        variant={'ghost'}
        className={'mb-4'}
        onClick={() => router.push('/professional')}
      >
        <ArrowLeft className={'w-4 h-4 mr-2'} />
        Back to Dashboard
      </Button>

      <div>
        <h1 className={'text-4xl font-medium tracking-tight mb-2'}>
          Edit Bundle
        </h1>
        <p className={'text-muted-foreground'}>
          Update your bundle details and manage products
        </p>
      </div>

      <form
        onSubmit={handleSubmit(onSubmit)}
        className={'space-y-6'}
      >
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
                <p className={'text-sm text-red-500 mt-1'}>
                  {errors.name.message}
                </p>
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
                value={bundle.space?.id}
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

        <Card className={'p-6 rounded-[30px] border-0 shadow-md space-y-4'}>
          <div className={'flex items-center justify-between'}>
            <div>
              <Label>Products in Bundle</Label>
              <p className={'text-sm text-muted-foreground mt-1'}>
                {bundle.items?.length ?? 0} products in this bundle
              </p>
            </div>
            <div className={'text-right'}>
              <p
                className={
                  'text-xs uppercase tracking-widest text-muted-foreground font-semibold'
                }
              >
                Total Price
              </p>
              <p className={'text-xl font-bold'}>
                $
                {totalPrice.toLocaleString('en-US', {
                  minimumFractionDigits: 2,
                })}
              </p>
            </div>
          </div>

          <div className={'grid grid-cols-2 md:grid-cols-3 gap-4'}>
            {bundle.items?.map(item => {
              const product = item.product;
              if (!product) return null;
              return (
                <div
                  key={item.id}
                  className={
                    'relative rounded-[20px] border border-neutral-100 bg-white overflow-hidden shadow-sm'
                  }
                >
                  <button
                    type={'button'}
                    onClick={() => handleRemoveItem(item.id)}
                    className={
                      'absolute top-2 right-2 z-10 w-6 h-6 rounded-full bg-red-500 text-white flex items-center justify-center hover:bg-red-600'
                    }
                  >
                    <X className={'w-4 h-4'} />
                  </button>

                  <div className={'aspect-square bg-neutral-50 relative'}>
                    {product.images?.[0] ? (
                      <Image
                        src={ROUTES.S3(product.images[0])}
                        alt={product.title}
                        className={'w-full h-full object-cover'}
                        unoptimized
                        fill
                      />
                    ) : (
                      <div
                        className={
                          'w-full h-full flex items-center justify-center'
                        }
                      >
                        <Package className={'w-10 h-10 text-neutral-300'} />
                      </div>
                    )}
                  </div>

                  <div className={'p-3 space-y-2'}>
                    <p
                      className={
                        'text-sm font-semibold leading-tight line-clamp-2'
                      }
                    >
                      {product.title}
                    </p>
                    <p className={'text-xs text-muted-foreground'}>
                      $
                      {item.priceSnapshot.toLocaleString('en-US', {
                        minimumFractionDigits: 2,
                      })}{' '}
                      / unit
                    </p>
                    <div className={'flex items-center gap-2'}>
                      <span className={'text-xs text-muted-foreground'}>
                        Qty:
                      </span>
                      <span className={'text-sm font-semibold text-secondary'}>
                        {item.quantity}
                      </span>
                    </div>
                  </div>
                </div>
              );
            })}

            <button
              type={'button'}
              onClick={() => setPickerOpen(true)}
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
          </div>
        </Card>

        <div className={'flex items-center justify-end gap-4'}>
          <Button
            type={'button'}
            variant={'outline'}
            onClick={() => router.push('/professional')}
          >
            Cancel
          </Button>
          <Button
            type={'submit'}
            disabled={isSaving || !isDirty}
          >
            {isSaving ? 'Saving...' : 'Save Changes'}
          </Button>
        </div>
      </form>

      <Dialog
        open={pickerOpen}
        onOpenChange={setPickerOpen}
      >
        <DialogContent
          className={
            'rounded-[30px] p-6 sm:max-w-[640px] max-h-[80vh] flex flex-col'
          }
          showCloseButton={false}
        >
          <DialogHeader>
            <DialogTitle className={'text-lg font-semibold'}>
              Add Products to Bundle
            </DialogTitle>
          </DialogHeader>

          <div className={'relative'}>
            <Search
              className={
                'absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground'
              }
            />
            <Input
              placeholder={'Search your products...'}
              value={pickerSearch}
              onChange={e => setPickerSearch(e.target.value)}
              className={'pl-9'}
            />
          </div>

          <div
            className={'flex-1 overflow-y-auto space-y-2 min-h-0 max-h-[50vh]'}
          >
            {productsLoading ? (
              <div className={'space-y-2'}>
                {[...Array(4)].map((_, i) => (
                  <Skeleton
                    key={i}
                    className={'h-16 rounded-xl'}
                  />
                ))}
              </div>
            ) : filteredProducts.length > 0 ? (
              filteredProducts.map(product => {
                const isSelected = bundleItemProductIds.has(product.id);
                return (
                  <div
                    key={product.id}
                    className={`flex items-center gap-3 p-3 rounded-xl border transition-colors ${
                      isSelected
                        ? 'border-secondary/30 bg-secondary/5 opacity-60'
                        : 'border-neutral-100 hover:bg-neutral-50 cursor-pointer'
                    }`}
                    onClick={() => {
                      if (!isSelected) handleAddProduct(product);
                    }}
                  >
                    <div
                      className={
                        'w-12 h-12 rounded-lg bg-neutral-100 overflow-hidden shrink-0'
                      }
                    >
                      {product.images?.[0] ? (
                        <Image
                          src={ROUTES.S3(product.images[0])}
                          alt={product.title}
                          className={'w-full h-full object-cover'}
                          unoptimized
                          fill
                        />
                      ) : (
                        <div
                          className={
                            'w-full h-full flex items-center justify-center'
                          }
                        >
                          <Package className={'w-5 h-5 text-neutral-300'} />
                        </div>
                      )}
                    </div>

                    <div className={'flex-1 min-w-0'}>
                      <p className={'text-sm font-medium truncate'}>
                        {product.title}
                      </p>
                      <p className={'text-xs text-muted-foreground'}>
                        $
                        {product.price.toLocaleString('en-US', {
                          minimumFractionDigits: 2,
                        })}
                        {product.stock !== undefined &&
                          ` · ${product.stock} in stock`}
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
                          handleAddProduct(product);
                        }}
                      >
                        <Plus className={'w-3 h-3 mr-1'} />
                        Add
                      </Button>
                    )}
                  </div>
                );
              })
            ) : (
              <div
                className={
                  'flex flex-col items-center justify-center py-12 text-muted-foreground'
                }
              >
                <Package className={'w-10 h-10 mb-2 text-neutral-300'} />
                <p className={'text-sm'}>
                  {pickerSearch
                    ? 'No products match your search'
                    : 'No products found'}
                </p>
              </div>
            )}
          </div>

          <div className={'flex justify-end pt-2'}>
            <Button
              variant={'default'}
              className={'rounded-full'}
              onClick={() => {
                setPickerOpen(false);
                setPickerSearch('');
              }}
            >
              Done
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
