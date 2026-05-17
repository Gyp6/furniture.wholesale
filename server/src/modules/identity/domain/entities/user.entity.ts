import { TRoleValues } from '@/common/types';

import { Profile } from './profile.entity';

export class User {
  constructor(
    public readonly id: string,
    public readonly name: string,
    public readonly email: string,
    public readonly emailVerified: boolean,
    public readonly image: string | null,
    public readonly role: TRoleValues,
    public readonly banned: boolean,
    public readonly profile: Profile | null,
    public readonly createdAt: Date,
    public readonly updatedAt: Date,
  ) {}
}
