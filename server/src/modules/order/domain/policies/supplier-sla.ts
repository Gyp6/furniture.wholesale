import { OrderStatus } from '@prisma/client';

export type BuyerSegment = 'RETAILER' | 'DESIGNER' | 'HORECA';
type Speed = 'express' | 'standard';

/**
 * Hours the supplier has to move a sub-order to its next status.
 * Data-driven: every former branch is one cell of the table (CC 2).
 * Statuses without an SLA (SHIPPED, DELIVERED, CANCELLED) are simply absent.
 */
const SLA_HOURS: Readonly<
  Partial<Record<OrderStatus, Record<BuyerSegment, Record<Speed, number>>>>
> = {
  NEW: {
    HORECA: { express: 4, standard: 12 },
    RETAILER: { express: 8, standard: 24 },
    DESIGNER: { express: 24, standard: 48 },
  },
  PROCESSING: {
    HORECA: { express: 24, standard: 48 },
    RETAILER: { express: 48, standard: 72 },
    DESIGNER: { express: 96, standard: 96 },
  },
};

const SPEED: Record<string, Speed> = { true: 'express', false: 'standard' };

export function supplierSlaHours(
  status: OrderStatus,
  segment: BuyerSegment,
  express: boolean,
): number {
  return SLA_HOURS[status]?.[segment][SPEED[String(express)]] ?? 0;
}
