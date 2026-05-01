import { TRole } from './role.type';

export interface IBaUser {
  id: string;
  name: string;
  email: string;
  emailVerified: boolean;
  image: null | string;
  role: TRole;
  banned: boolean;
  banReason: null | string;
  banExpires: null | string;
  createdAt: string;
  updatedAt: string;
}

export interface ICompany {
  id: string;
  name: string;
  taxId: string;
  description: null | string;
  verificationStatus: string;
  logoUrl: null | string;
  terms: null | string;
  ratingAvg: string;
  ratingCount: number;
  createdAt: string;
}

export interface IProfile {
  id: string;
  userId: string;
  companyId: string;
  specializations: string[];
  company: ICompany;
}

export interface IUser extends IBaUser {
  profile: IProfile;
}
