'use client';

import { ItemFormModal } from '../item-form/item-form-modal';

type TEditItemModalProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit?: () => void;
  onDiscard?: () => void;
};

export function EditItemModal({
  open,
  onOpenChange,
  onSubmit,
  onDiscard,
}: TEditItemModalProps) {
  return (
    <ItemFormModal
      open={open}
      onOpenChange={onOpenChange}
      onSubmit={onSubmit}
      onCancel={onDiscard}
      title={'Edit item'}
      cancelLabel={'Discard changes'}
      submitLabel={'Confirm changes'}
      cancelWidth={'195px'}
      submitWidth={'293px'}
    />
  );
}
