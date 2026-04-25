import {
  LucideIcon,
  Package,
  PenTool,
  Store,
  UtensilsCrossed,
} from 'lucide-react';

import { ROLES } from '@/constants';
import { ERole } from '@/shared/enums';
import { TRole } from '@/shared/types';

export const RoleCardsConfig: {
  value: TRole;
  label: ERole;
  Icon: LucideIcon;
}[] = [
  { value: ROLES.DESIGNER, label: ERole.DESIGNER, Icon: PenTool },
  { value: ROLES.RETAILER, label: ERole.RETAILER, Icon: Store },
  { value: ROLES.HORECA, label: ERole.HORECA, Icon: UtensilsCrossed },
  { value: ROLES.SUPPLIER, label: ERole.SUPPLIER, Icon: Package },
];
