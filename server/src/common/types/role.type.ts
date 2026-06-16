import { ROLES } from '@/common/constants';

export type TRole = Omit<typeof ROLES, 'ADMIN'>;
export type TRoleKeys = keyof TRole;
export type TRoleValues = TRole[TRoleKeys];
