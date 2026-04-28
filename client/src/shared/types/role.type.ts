import { ROLES } from '@/constants/role.constant';

export type TRole = (typeof ROLES)[keyof typeof ROLES];
