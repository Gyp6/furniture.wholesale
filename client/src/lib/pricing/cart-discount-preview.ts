// Cart discount preview: reuses the shared wholesale pricing rules.
import {
  calculateWholesaleDiscount,
  generateDiscountReference,
  IDiscountOrder,
} from './wholesale-discount';

export function calculateCartDiscountPreview(order: IDiscountOrder): number {
  return calculateWholesaleDiscount(order);
}

export function generateCartReference(): string {
  return generateDiscountReference('CRT');
}
