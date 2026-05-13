import { TRole } from './role.type';

export interface IReqUser {
  id: string;
  name: string;
  email: string;
  emailVerified: boolean;
  image: null | string;
  role: TRole;
  banExpires: null | string;
  banReason: null | string;
  banned: boolean;
  createdAt: string;
  updatedAt: string;
}
