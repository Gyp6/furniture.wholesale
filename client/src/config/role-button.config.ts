import { ROLES } from '@/constants';
import { ERole } from '@/shared/enums';
import { TRoleButton } from '@/shared/types';

export const RoleButtonsConfig: TRoleButton[] = [
  { value: ROLES.RETAILER, label: ERole.RETAILER, icon: 'Retailer' },
  { value: ROLES.DESIGNER, label: ERole.DESIGNER, icon: 'Designer' },
  { value: ROLES.HORECA, label: ERole.HORECA, icon: 'HoReCa' },
  { value: ROLES.SUPPLIER, label: ERole.SUPPLIER, icon: 'Supplier' },
];
