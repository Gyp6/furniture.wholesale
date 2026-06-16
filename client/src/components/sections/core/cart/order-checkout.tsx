'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { MapPin, X } from 'lucide-react';

import { Button } from '@/components/ui/shadcn/button';
import { Input } from '@/components/ui/shadcn/input';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/shadcn/dialog';
import { useCreateOrder, useGetSpaces, useCheckStock } from '@/hooks/queries';
import { ICONS } from '@/shared/data/icons';
import { useSpaceBundleStore } from '@/store/use-space-bundle.store';
import { bundleService } from '@/services';

function OrderSummaryHeader() {
  return <h2 className={'text-xl font-bold'}>Order Summary</h2>;
}

function OrderSummaryContent() {
  const store = useSpaceBundleStore(state => state);

  if (!store) {
    return <div className={"h-40 animate-pulse bg-neutral-50 rounded-[60px]"} />;
  }

  const { items, totalPrice } = store;

  const totalItems = items.reduce((sum, item) => sum + item.quantity, 0);
  const platformFee = totalPrice * 0.04; // 4% from explanatory note
  const freightEstimation = totalItems > 0 ? 1250 : 0; // Static mock for now
  const totalPayable = totalPrice + platformFee + freightEstimation;

  return (
    <div className={'grid grid-cols-1 lg:grid-cols-2 gap-10'}>
      <div className={'flex flex-col gap-0'}>
        <div
          className={
            'flex items-center justify-between py-5 border-b border-neutral-100'
          }
        >
          <span className={'text-sm text-muted-foreground'}>
            Subtotal ({totalItems} items)
          </span>
          <span className={'text-base font-semibold'}>
            ${totalPrice.toLocaleString()}
          </span>
        </div>
        <div
          className={
            'flex items-center justify-between py-5 border-b border-neutral-100'
          }
        >
          <span className={'text-sm text-muted-foreground'}>
            Freight Estimation
          </span>
          <span className={'text-base font-semibold'}>
            ${freightEstimation.toLocaleString()}
          </span>
        </div>
        <div
          className={
            'flex items-center justify-between py-5 border-b border-neutral-100'
          }
        >
          <div className={'flex items-center gap-2'}>
            <span className={'text-sm text-muted-foreground'}>
              Platform Fee (4%)
            </span>
            <div
              className={
                'w-5 h-5 rounded-full border border-secondary flex items-center justify-center cursor-pointer'
              }
            >
              <span className={'text-[10px] text-secondary font-bold'}>i</span>
            </div>
          </div>
          <span className={'text-base font-semibold'}>
            ${platformFee.toLocaleString()}
          </span>
        </div>
      </div>

      <div
        className={
          'bg-secondary/10 rounded-[60px] flex flex-col items-center justify-center gap-2 p-8'
        }
      >
        <span
          className={
            'text-[10px] uppercase tracking-widest text-muted-foreground font-semibold text-center'
          }
        >
          Total Payable Amount
        </span>
        <span className={'text-4xl font-bold'}>
          ${totalPayable.toLocaleString()}
        </span>
        <span
          className={
            'text-[10px] uppercase tracking-widest text-muted-foreground'
          }
        >
          Excluding VAT
        </span>
      </div>
    </div>
  );
}

function OrderSummaryFooter() {
  const store = useSpaceBundleStore(state => state);
  const router = useRouter();
  const { mutateAsync: createOrder, isPending } = useCreateOrder();
  const { mutateAsync: checkStock, isPending: isChecking } = useCheckStock();
  const { data: spaces } = useGetSpaces();
  const [isSavingProject, setIsSavingProject] = useState(false);
  const [addressModalOpen, setAddressModalOpen] = useState(false);
  const [shippingAddress, setShippingAddress] = useState('');

  if (!store) return null;
  const { items, clearBundle } = store;

  const handlePlaceOrderClick = async () => {
    if (items.length === 0) {
      toast.error('Your Space Bundle is empty');
      return;
    }

    const productItems = items.filter(item => item.productId);

    if (productItems.length > 0) {
      try {
        const stockResults = await checkStock(
          productItems.map(i => ({ productId: i.productId!, quantity: i.quantity })),
        );

        const outOfStock = stockResults.filter(r => !r.sufficient);
        if (outOfStock.length > 0) {
          const names = outOfStock
            .map(r => `"${r.title}" (need ${r.requested}, have ${r.available})`)
            .join(', ');
          toast.error(`Insufficient stock: ${names}`, { duration: 6000 });
          return;
        }
      } catch {
        toast.error('Failed to verify stock availability. Please try again.');
        return;
      }
    }

    setAddressModalOpen(true);
  };

  const handleConfirmOrder = () => {
    if (!shippingAddress.trim()) {
      toast.error('Please enter a delivery address');
      return;
    }

    const orderItems = items.map(item => ({
      productId: item.productId,
      bundleId: item.nestedBundleId,
      quantity: item.quantity,
      priceSnapshot: item.priceSnapshot,
    }));

    const createPromise = createOrder({
      items: orderItems,
      shippingAddress: shippingAddress.trim(),
    });

    setAddressModalOpen(false);

    toast.promise(createPromise, {
      loading: 'Placing your order...',
      success: (data) => {
        clearBundle();
        setShippingAddress('');
        setTimeout(() => router.push(`/orders/${data.id}/confirmation`), 1500);
        return 'Order placed successfully!';
      },
      error: err => err?.message || 'Failed to place order. Please try again.',
      position: 'top-center',
    });
  };

  const handleSaveToProjects = async () => {
    if (items.length === 0) {
      toast.error('Your Space Bundle is empty');
      return;
    }

    if (!spaces || spaces.length === 0) {
      toast.error('No space types found to assign the project to');
      return;
    }

    setIsSavingProject(true);
    const isEditing = !!store.activeBundleId;

    const savePromise = (async () => {
      if (isEditing && store.activeBundleId) {
        // 1. Fetch current bundle to get its item list
        const currentBundle = await bundleService.getOne(store.activeBundleId);

        // 2. Remove all current items sequentially
        for (const currentItem of currentBundle.items) {
          await bundleService.removeItem(store.activeBundleId, currentItem.id);
        }

        // 3. Add all current store items sequentially
        for (const item of items) {
          await bundleService.addItem(store.activeBundleId, {
            productId: item.productId,
            nestedBundleId: item.nestedBundleId,
            quantity: item.quantity,
            priceSnapshot: item.priceSnapshot,
          });
        }

        // 4. Update the bundle title/name
        await bundleService.update(store.activeBundleId, {
          name: store.name || 'New Project Bundle',
        });
      } else {
        // 1. Create the bundle (user bundle, DRAFT status by default on backend)
        const newBundle = await bundleService.create({
          name: store.name || 'New Project Bundle',
          description: 'Saved from Cart',
          bundleType: 'USER',
          spaceTypeId: spaces[0].id,
        });

        // 2. Add all items sequentially to prevent race conditions on NestJS database writes
        for (const item of items) {
          await bundleService.addItem(newBundle.id, {
            productId: item.productId,
            nestedBundleId: item.nestedBundleId,
            quantity: item.quantity,
            priceSnapshot: item.priceSnapshot,
          });
        }
      }

      // 5. Clear cart and redirect
      clearBundle();
      setTimeout(() => router.push('/dashboard'), 1000);
    })();

    toast.promise(savePromise, {
      loading: isEditing ? 'Updating Project...' : 'Saving to Projects...',
      success: isEditing
        ? 'Project updated successfully! Redirecting...'
        : 'Project saved successfully as draft! Redirecting...',
      error: isEditing ? 'Failed to update project.' : 'Failed to save project.',
    });

    try {
      await savePromise;
    } catch (e) {
      console.error(e);
    } finally {
      setIsSavingProject(false);
    }
  };

  return (
    <>
      <div
        className={'flex flex-col sm:flex-row items-center justify-center gap-4'}
      >
        <Button
          variant={'secondary'}
          className={
            'rounded-full px-8 gap-2 bg-secondary/10 text-secondary hover:bg-secondary/20 h-12 w-full sm:w-[220px]'
          }
          onClick={handleSaveToProjects}
          disabled={items.length === 0 || isPending || isSavingProject || isChecking}
        >
          <ICONS.Bundles
            size={20}
            color={'currentColor'}
          />
          {isSavingProject
            ? 'Saving...'
            : store.activeBundleId
              ? 'Update Project'
              : 'Save to Projects'}
        </Button>
        <Button
          variant={'default'}
          className={'rounded-full px-8 gap-2 h-12 w-full sm:w-[280px]'}
          onClick={handlePlaceOrderClick}
          disabled={items.length === 0 || isPending || isSavingProject || isChecking}
        >
          <ICONS.Bundle
            size={20}
            color={'currentColor'}
          />
          {isChecking ? 'Checking stock...' : isPending ? 'Placing Order...' : 'Confirm and Place Order'}
        </Button>
      </div>

      <Dialog open={addressModalOpen} onOpenChange={setAddressModalOpen}>
        <DialogContent
          className={"rounded-2xl p-6 flex flex-col gap-5 sm:max-w-[500px]"}
          showCloseButton={false}
        >
          <button
            onClick={() => setAddressModalOpen(false)}
            className={"absolute top-4 right-4 w-7 h-7 rounded-full flex items-center justify-center hover:bg-neutral-100 transition-colors"}
          >
            <X className={"w-4 h-4 text-muted-foreground"} />
          </button>
          <DialogHeader>
            <DialogTitle className={"text-lg font-semibold"}>
              Delivery Address
            </DialogTitle>
          </DialogHeader>

          <div className={"flex flex-col gap-4"}>
            <p className={"text-sm text-muted-foreground"}>
              Enter the delivery address for your order
            </p>
            <div className={"relative"}>
              <MapPin className={"absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground"} />
              <Input
                placeholder={"Enter full delivery address"}
                value={shippingAddress}
                onChange={e => setShippingAddress(e.target.value)}
                className={"pl-10 h-12 rounded-xl"}
                onKeyDown={e => {
                  if (e.key === 'Enter') handleConfirmOrder();
                }}
              />
            </div>
          </div>

          <div className={"flex items-center gap-3 pt-2 border-t border-neutral-100"}>
            <Button
              variant={"outline"}
              className={"rounded-full h-11 flex-1"}
              onClick={() => setAddressModalOpen(false)}
            >
              Cancel
            </Button>
            <Button
              variant={"default"}
              className={"rounded-full h-11 flex-1 gap-2"}
              onClick={handleConfirmOrder}
              disabled={!shippingAddress.trim() || isPending}
            >
              <ICONS.Bundle size={16} color={"currentColor"} />
              Place Order
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}

export function OrderSummary() {
  return (
    <div
      className={
        'bg-white rounded-[60px] p-10 flex flex-col gap-8 shadow-[0_8px_40px_rgba(0,0,0,0.06)]'
      }
    >
      <OrderSummaryHeader />
      <OrderSummaryContent />
      <OrderSummaryFooter />
    </div>
  );
}
