import { EOrderStatus } from '@/shared/enums/dashboard.enum';

const APPROVED_ORDER = {
  id: '#ORD-9283',
  items: 2,
  date: 'Oct 12, 2023',
  status: EOrderStatus.APPROVED,
  total: 4250.0,
};

const PENDING_ORDER = {
  id: '#ORD-9104',
  items: 0,
  date: 'Oct 10, 2023',
  status: EOrderStatus.PENDING,
  total: 2100.0,
};

const REJECTED_ORDER = {
  id: '#ORD-9104',
  items: 1,
  date: 'Oct 08, 2023',
  status: EOrderStatus.REJECTED,
  total: 1580.4,
};

const repeat = <T>(item: T, times: number): T[] =>
  Array.from({ length: times }, () => ({ ...item }));

/** Mock orders for the dashboard table (same sequence as the original fixture). */
export const OrdersData = [
  APPROVED_ORDER,
  PENDING_ORDER,
  ...repeat(APPROVED_ORDER, 6),
  ...repeat(REJECTED_ORDER, 6),
];
