import { ApiProperty } from '@nestjs/swagger';

import { MESSAGE } from '@/common/constants';
import type { TRoleValues } from '@/common/types';
import {
  IsBool,
  IsEmail,
  IsEmbedded,
  IsHash,
  IsName,
  IsRole,
  IsUserImage,
} from '@/common/validators';

import { ProfileResponse } from './profile.response';

export class UserResponse {
  @IsHash({ title: 'Id' })
  id!: string;

  @IsName()
  name!: string;

  @IsEmail()
  email!: string;

  @IsBool({ title: 'Email verified' })
  emailVerified!: boolean;

  @IsUserImage()
  image!: string | null;

  @IsRole()
  role!: TRoleValues;

  @IsEmbedded({ to: ProfileResponse })
  profile!: ProfileResponse | null;
}

export class VerifiedUserResponse {
  @ApiProperty({
    example: MESSAGE.VERIFIED_EMAIL,
  })
  message!: string;

  @IsEmbedded({ to: UserResponse })
  user!: UserResponse;
}
