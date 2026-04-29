import { ROLES } from '@/shared/constants';

export type TRole = (typeof ROLES)[keyof typeof ROLES];
