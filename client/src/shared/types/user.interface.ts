import { authClient } from '@/lib';

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
// 1. Get the return type of the hook WITHOUT executing it
type SessionHookReturn = ReturnType<typeof authClient.useSession>;

// 2. Extract the 'data' property from that return type
type SessionData = SessionHookReturn['data'];

// 3. Safely extract the 'user' object from the data using NonNullable, and use '|' for the union
export type IFullBaUser = NonNullable<SessionData>['user'] | null;

export interface ICompany {
  id: string;
  name: string;
  abbreviation: string;
  description: string | null;
  businessEmail: string | null;
  showroomAddress: string | null;
  taxCode: string;
  specializations: string[];
  isVerified: boolean;
  terms: string | null;
  leadTime: string | null;
  ratingAvg: string;
}

export interface IProfile {
  id: string;
  userId: string;
  companyId: string;
  // specializations: string[];
  company: ICompany;
}

export type IUser = IBaUser & {
  profile: IProfile;
};
