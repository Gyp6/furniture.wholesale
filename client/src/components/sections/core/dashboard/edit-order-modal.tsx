'use client';

import { Button } from '@/components/ui/shadcn/button';
import { OrderCardData } from '@/shared/data/core/catalog/catalog.data';
import { ICONS } from '@/shared/data/icons';

import { ItemFormModal } from '../item-form/item-form-modal';

type TEditOrderModalProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
};

export function EditOrderModal({ open, onOpenChange }: TEditOrderModalProps) {
  const close = () => onOpenChange(false);

  return (
    <ItemFormModal
      open={open}
      onOpenChange={onOpenChange}
      onSubmit={close}
      title={'Edit item'}
      cancelLabel={'Discard Changes'}
      submitLabel={'Confirm changes'}
      cancelWidth={'195px'}
      submitWidth={'293px'}
      defaultName={OrderCardData.name}
      stockAction={
        <Button
          variant={'destructive'}
          className={
            'rounded-full h-11 px-6 gap-2 bg-red-50 text-red-500 hover:bg-red-100 border-0'
          }
        >
          <ICONS.TrashFigma
            size={16}
            color={'currentColor'}
          />
          Delete item
        </Button>
      }
    />
  );
}
