import { ROLES } from '@/common/constants';

export type TRole = (typeof ROLES)[keyof typeof ROLES];
