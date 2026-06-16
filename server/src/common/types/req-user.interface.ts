import { Role } from '@prisma/client';

export interface IReqUser {
  id: string;
  name: string;
  email: string;
  emailVerified: boolean;
  image: null | string;
  role: Role;
  banExpires: null | string;
  banReason: null | string;
  banned: boolean;
  createdAt: string;
  updatedAt: string;
}
