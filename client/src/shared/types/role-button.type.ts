import { RoleIconName } from '../data/icons';
import { ERole } from '../enums';

import { TRole } from './role.type';

export type TRoleButton = {
  value: TRole;
  label: ERole;
  icon: RoleIconName;
};
