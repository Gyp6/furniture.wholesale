import { ERole } from '@/shared/enums';

export const ROLES = {
  DESIGNER: ERole.DESIGNER.toUpperCase(),
  RETAILER: ERole.RETAILER.toUpperCase(),
  HORECA: ERole.HORECA.toUpperCase(),
  SUPPLIER: ERole.SUPPLIER.toUpperCase(),
} as const;
