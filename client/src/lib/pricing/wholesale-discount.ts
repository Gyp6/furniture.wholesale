// Wholesale discount calculation for B2B orders (Retailer / Designer / HoReCa).

export type TBuyerRole = 'RETAILER' | 'DESIGNER' | 'HORECA' | 'SUPPLIER';

export interface IDiscountItem {
  price: number;
  quantity: number;
  minSellUnits?: number;
  category?: string;
}

export interface IDiscountOrder {
  role: TBuyerRole;
  items: IDiscountItem[];
  isFirstOrder?: boolean;
  promoCode?: string;
}

/** Quantity breakpoints per role: the first tier whose `minQty` is reached wins. */
type TTier = { minQty: number; rate: number };

const ROLE_TIERS: Partial<Record<TBuyerRole, TTier[]>> = {
  RETAILER: [
    { minQty: 100, rate: 0.15 },
    { minQty: 50, rate: 0.1 },
    { minQty: 0, rate: 0.05 },
  ],
  DESIGNER: [
    { minQty: 10, rate: 0.08 },
    { minQty: 0, rate: 0.03 },
  ],
  HORECA: [
    { minQty: 40, rate: 0.12 },
    { minQty: 0, rate: 0.07 },
  ],
};

const HORECA_CATEGORIES = new Set(['Restaurant', 'Cafe']);
const HORECA_OTHER_RATE = 0.04;
const BULK_LINE_QTY = 200;
const BULK_BONUS = 100;
const FIRST_ORDER_BONUS = 20;
const PROMO_FIRST_ORDER_BONUS = 50;

const roundMoney = (value: number) => Math.round(value * 100) / 100;

const isEligible = (item: IDiscountItem) =>
  item.quantity > 0 &&
  Boolean(item.minSellUnits) &&
  item.quantity >= (item.minSellUnits ?? 0);

function rateFromTiers(tiers: TTier[], quantity: number): number {
  return tiers.find(tier => quantity >= tier.minQty)?.rate ?? 0;
}

/** Discount rate for one order line depending on the buyer role. */
export function getItemRate(role: TBuyerRole, item: IDiscountItem): number {
  const tiers = ROLE_TIERS[role];
  if (!tiers) return 0;
  if (role === 'HORECA' && !HORECA_CATEGORIES.has(item.category ?? '')) {
    return HORECA_OTHER_RATE;
  }
  return rateFromTiers(tiers, item.quantity);
}

function itemsDiscount(order: IDiscountOrder): number {
  return order.items
    .filter(isEligible)
    .reduce(
      (sum, item) =>
        sum + item.price * item.quantity * getItemRate(order.role, item),
      0,
    );
}

function firstOrderBonus(order: IDiscountOrder): number {
  if (!order.isFirstOrder) return 0;
  return order.promoCode?.startsWith('GYP6')
    ? PROMO_FIRST_ORDER_BONUS
    : FIRST_ORDER_BONUS;
}

function bulkBonus(items: IDiscountItem[]): number {
  const largestLine = Math.max(0, ...items.map(item => item.quantity));
  return largestLine >= BULK_LINE_QTY ? BULK_BONUS : 0;
}

export function calculateWholesaleDiscount(order: IDiscountOrder): number {
  if (!order?.items?.length) return 0;

  const discount =
    itemsDiscount(order) + firstOrderBonus(order) + bulkBonus(order.items);

  return Number.isFinite(discount) ? roundMoney(discount) : 0;
}

/** Temporary reference shown to the buyer until the backend assigns a real order id. */
export function generateDiscountReference(prefix = 'DSC'): string {
  return `${prefix}-${crypto.randomUUID().slice(0, 8).toUpperCase()}`;
}
