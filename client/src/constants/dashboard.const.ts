import { EInventoryStatus, EOrderStatus } from '@/shared/enums/dashboard.enum';

export const ORDER_STATUS_STYLES: Record<string, string> = {
  [EOrderStatus.APPROVED]: 'bg-green-100 text-green-700',
  [EOrderStatus.PENDING]: 'bg-purple-100 text-purple-700',
  [EOrderStatus.REJECTED]: 'bg-red-100 text-red-600',
  NEW: 'bg-purple-100 text-purple-700',
  PROCESSING: 'bg-yellow-100 text-yellow-700',
  SHIPPED: 'bg-blue-100 text-blue-700',
  DELIVERED: 'bg-green-100 text-green-700',
  COMPLETED: 'bg-green-100 text-green-700',
  CANCELLED: 'bg-red-100 text-red-600',
};

export const INVENTORY_STATUS_STYLES: Record<string, string> = {
  [EInventoryStatus.ACTIVE]: 'text-green-600',
  [EInventoryStatus.INACTIVE]: 'text-neutral-400',
};

export const CATEGORY_STYLES: Record<string, string> = {
  'Hotel Room': 'bg-purple-100 text-purple-700',
  Coworking: 'bg-blue-100 text-blue-700',
  Restaurant: 'bg-orange-100 text-orange-700',
};
