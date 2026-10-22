'use client';

import { ItemFormModal } from '../item-form/item-form-modal';

type TCreateItemModalProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit?: () => void;
};

export function CreateItemModal({
  open,
  onOpenChange,
  onSubmit,
}: TCreateItemModalProps) {
  return (
    <ItemFormModal
      open={open}
      onOpenChange={onOpenChange}
      onSubmit={onSubmit}
      title={'Create item'}
      cancelLabel={'Cancel'}
      submitLabel={'Create item'}
      cancelWidth={'119px'}
      submitWidth={'369px'}
    />
  );
}
