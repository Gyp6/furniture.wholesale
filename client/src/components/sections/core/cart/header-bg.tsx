'use client';

import { ExternalLink } from 'lucide-react';
import { useState } from 'react';
import { toast } from 'sonner';

import { ShareModal } from '@/components/sections/core/cart/share-file';
import { Button } from '@/components/ui/shadcn/button';
import { bundleService } from '@/services';
import { ICONS } from '@/shared/data/icons';
import { useSpaceBundleStore } from '@/store/use-space-bundle.store';

export function ProjectHeader() {
  const store = useSpaceBundleStore();
  const name = store.name || 'New Project Bundle';
  const [isEditing, setIsEditing] = useState(false);
  const [title, setTitle] = useState<string>(String(name));
  const [shareOpen, setShareOpen] = useState(false);
  const [shareLink, setShareLink] = useState<string>('');

  const handleSave = () => {
    setIsEditing(false);
    if (title.trim()) {
      useSpaceBundleStore.setState({ name: title.trim() });
    }
  };

  const handleShareClick = async () => {
    if (store.items.length === 0) {
      toast.error('Cart is empty. There is nothing to share.');
      return;
    }

    if (!store.activeBundleId) {
      toast.warning('Please save your project before sharing it.');
      return;
    }

    const sharePromise = (async () => {
      // 1. Fetch current bundle state from database
      const dbBundle = await bundleService.getOne(store.activeBundleId!);

      // 2. Compare database state with store state to check for unsaved changes
      const hasChanges =
        dbBundle.name !== store.name ||
        dbBundle.items.length !== store.items.length ||
        store.items.some(storeItem => {
          const dbItem = dbBundle.items.find(
            di =>
              (storeItem.productId && di.product?.id === storeItem.productId) ||
              (storeItem.nestedBundleId &&
                di.nestedBundle?.id === storeItem.nestedBundleId),
          );
          return !dbItem || dbItem.quantity !== storeItem.quantity;
        });

      if (hasChanges) {
        throw new Error('UNSAVED_CHANGES');
      }

      // 3. Request sharing token
      const updatedBundle = await bundleService.share(store.activeBundleId!);
      const link = `${window.location.origin}/bundle/share/${updatedBundle.shareToken}`;
      setShareLink(link);
      setShareOpen(true);
    })();

    toast.promise(sharePromise, {
      loading: 'Creating public link...',
      success: 'Public link created!',
      error: (err: any) => {
        if (err?.message === 'UNSAVED_CHANGES') {
          return 'You have unsaved changes. Please save your project before sharing it.';
        }
        return 'Failed to create public link.';
      },
    });
  };

  return (
    <>
      <div className={'flex items-center justify-between'}>
        <div className={'flex items-center gap-3'}>
          {isEditing ? (
            <input
              autoFocus
              value={title || ''}
              onChange={e => setTitle(e.target.value)}
              onBlur={handleSave}
              onKeyDown={e => e.key === 'Enter' && handleSave()}
              className={
                'text-2xl font-bold tracking-tight border-b border-neutral-300 outline-none bg-transparent'
              }
            />
          ) : (
            <h1 className={'text-4xl font-medium tracking-tight'}>{title}</h1>
          )}
          <button
            onClick={() => setIsEditing(true)}
            className={
              'w-10 h-10 rounded-4xl bg-white flex items-center justify-center hover:bg-neutral-50 transition-colors border-0 shadow-sm'
            }
          >
            <ICONS.PenFigma
              size={20}
              color={'currentColor'}
              className={'text-secondary'}
            />
          </button>
        </div>

        <Button
          variant={'default'}
          className={'rounded-full gap-2'}
          style={{ width: '240px', height: '56px' }}
          onClick={handleShareClick}
        >
          Share Project
          <ExternalLink size={16} />
        </Button>
      </div>

      <ShareModal
        open={shareOpen}
        onOpenChange={setShareOpen}
        link={shareLink}
      />
    </>
  );
}
