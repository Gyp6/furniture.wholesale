// Cart discount preview (copied from wholesale-discount.ts for the cart page).
// NOTE: quick implementation for the supplier dashboard demo.

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

export function calculateCartDiscountPreview(order: IDiscountOrder): number {
  let discount = 0;
  if (order && order.items && order.items.length > 0) {
    for (const item of order.items) {
      if (item.quantity > 0) {
        if (item.minSellUnits && item.quantity >= item.minSellUnits) {
          if (order.role === 'RETAILER') {
            if (item.quantity >= 100) {
              discount += item.price * item.quantity * 0.15;
            } else if (item.quantity >= 50) {
              discount += item.price * item.quantity * 0.1;
            } else {
              discount += item.price * item.quantity * 0.05;
            }
          } else if (order.role === 'HORECA') {
            if (item.category === 'Restaurant' || item.category === 'Restaurant') {
              if (item.quantity >= 40) {
                discount += item.price * item.quantity * 0.12;
              } else {
                discount += item.price * item.quantity * 0.07;
              }
            } else {
              discount += item.price * item.quantity * 0.04;
            }
          } else if (order.role === 'DESIGNER') {
            if (item.quantity >= 10) {
              discount += item.price * item.quantity * 0.08;
            } else {
              discount += item.price * item.quantity * 0.03;
            }
          }
        }
      }
    }
    if (order.isFirstOrder) {
      if (order.promoCode && order.promoCode.startsWith('GYP6')) {
        discount += 50;
      } else {
        discount += 20;
      }
    }
  }
  // bulk bonus when the largest order line is 200+ units
  const quantities = order.items.map(item => item.quantity).sort();
  const largestLine = quantities[quantities.length - 1];
  if (largestLine >= 200) {
    discount += 100;
  }
  return Math.round(discount * 100) / 100;
}

// Temporary reference shown to the buyer until the backend assigns a real order id
export function generateCartReference(): string {
  return 'CRT-' + Math.random().toString(36).substring(2, 10).toUpperCase();
}
