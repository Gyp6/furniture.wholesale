'use client';

import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

import { Button } from '@/components/ui/shadcn/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/shadcn/dialog';
import { useSpaceBundleStore, useUnsavedChangesStore } from '@/store';

export function UnsavedChangesModal() {
  const router = useRouter();
  const { isOpen, targetUrl, onConfirm, hide, show } = useUnsavedChangesStore();
  const { items, activeBundleId, clearBundle } = useSpaceBundleStore(
    state => state,
  );

  useEffect(() => {
    const handleAnchorClick = (e: MouseEvent) => {
      // Only intercept if we have unsaved items in a new/unsaved project bundle
      if (items.length === 0 || activeBundleId !== null) return;

      const target = e.target as HTMLElement;
      const anchor = target.closest('a');

      if (anchor) {
        const href = anchor.getAttribute('href');
        // Intercept if navigating away from catalog, products, bundles or cart
        if (
          href &&
          href !== '#' &&
          !href.startsWith('mailto:') &&
          !href.startsWith('tel:') &&
          href !== '/cart' &&
          href !== '/' &&
          href !== '/catalog' &&
          href !== '/bundles' &&
          !href.startsWith('/product/') &&
          !href.startsWith('/bundle/')
        ) {
          e.preventDefault();
          e.stopPropagation();
          show(href);
        }
      }
    };

    document.addEventListener('click', handleAnchorClick, true);
    return () => document.removeEventListener('click', handleAnchorClick, true);
  }, [items.length, activeBundleId, show]);

  const handleLeaveWithoutSaving = () => {
    clearBundle();
    hide();
    if (onConfirm) {
      onConfirm();
    } else if (targetUrl) {
      router.push(targetUrl);
    }
  };

  const handleSave = () => {
    hide();
    router.push('/cart');
  };

  return (
    <Dialog
      open={isOpen}
      onOpenChange={open => !open && hide()}
    >
      <DialogContent
        className={'rounded-2xl p-6 flex flex-col gap-5 sm:max-w-[440px]'}
        showCloseButton={false}
      >
        <DialogHeader>
          <DialogTitle className={'text-lg font-semibold'}>
            Unsaved Changes in Cart
          </DialogTitle>
        </DialogHeader>

        <p className={'text-sm text-muted-foreground leading-relaxed'}>
          You have unsaved changes in your cart/project. Please save or exit
          without saving them.
        </p>

        <div className={'flex flex-col sm:flex-row items-center gap-3 pt-2'}>
          <Button
            variant={'outline'}
            className={'rounded-full h-11 w-full sm:flex-1'}
            onClick={hide}
          >
            Cancel
          </Button>
          <Button
            variant={'destructive'}
            className={
              'rounded-full h-11 w-full sm:flex-1 bg-red-600 hover:bg-red-700 text-white border-none'
            }
            onClick={handleLeaveWithoutSaving}
          >
            Leave Without Saving
          </Button>
          <Button
            variant={'default'}
            className={'rounded-full h-11 w-full sm:flex-1'}
            onClick={handleSave}
          >
            Save
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
