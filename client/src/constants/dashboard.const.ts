import { EOrderStatus } from '@/shared/enums/dashboard.enum';

export const ORDER_STATUS_STYLES: Record<EOrderStatus, string> = {
  [EOrderStatus.APPROVED]: 'bg-green-100 text-green-700',
  [EOrderStatus.PENDING]: 'bg-purple-100 text-purple-700',
  [EOrderStatus.REJECTED]: 'bg-red-100 text-red-600',
};