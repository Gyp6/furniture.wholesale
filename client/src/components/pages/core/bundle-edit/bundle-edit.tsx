'use client';

import { ArrowLeft } from 'lucide-react';
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
import { Label } from '@/components/ui/shadcn/label';
import { Skeleton } from '@/components/ui/shadcn/skeleton';
import {
  useAddBundleItem,
  useGetBundle,
  useRemoveBundleItem,
  useUpdateBundle,
} from '@/hooks/queries/bundle.query';
import { useGetMyProducts, useGetSpaces } from '@/hooks/queries/catalog.query';
import { IProduct } from '@/shared/types';

import {
  AddProductTile,
  BundleFormData,
  BundleInfoFields,
  BundleProductCard,
  PickerProductList,
  PickerSearch,
} from '../bundle-shared/bundle-parts';

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
        <BundleInfoFields
          register={register}
          errors={errors}
          setValue={setValue}
          spaces={spaces}
          spacesLoading={spacesLoading}
          spaceValue={bundle.space?.id}
        />

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
            {bundle.items?.map(item =>
              item.product ? (
                <BundleProductCard
                  key={item.id}
                  product={item.product}
                  unitPrice={item.priceSnapshot}
                  onRemove={() => handleRemoveItem(item.id)}
                  quantitySlot={
                    <span className={'text-sm font-semibold text-secondary'}>
                      {item.quantity}
                    </span>
                  }
                />
              ) : null,
            )}

            <AddProductTile onClick={() => setPickerOpen(true)} />
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

          <PickerSearch
            value={pickerSearch}
            onChange={setPickerSearch}
          />

          <div
            className={'flex-1 overflow-y-auto space-y-2 min-h-0 max-h-[50vh]'}
          >
            <PickerProductList
              loading={productsLoading}
              products={filteredProducts}
              selectedIds={bundleItemProductIds}
              search={pickerSearch}
              onAdd={handleAddProduct}
            />
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
