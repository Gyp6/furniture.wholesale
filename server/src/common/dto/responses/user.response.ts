import { ApiProperty } from '@nestjs/swagger';

import type { TRole } from '@/common/types';
import {
  IsBanExpires,
  IsBanReason,
  IsBool,
  IsDate,
  IsEmail,
  IsEmbedded,
  IsHash,
  IsName,
  IsRole,
  IsUserImage,
} from '@/common/validators';

import { ProfileResponse } from './profile.response';

export class BA_UserResponse {
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
  role!: TRole;

  @IsBool({ title: 'Banned' })
  banned!: boolean;

  @IsBanReason()
  banReason!: string | null;

  @IsBanExpires()
  banExpires!: string | null;

  @IsDate()
  createdAt!: string;

  @IsDate()
  updatedAt!: string;
}

export class UserResponse extends BA_UserResponse {
  @IsEmbedded({ to: ProfileResponse })
  profile!: ProfileResponse;
}

export class VerifiedUserResponse {
  @ApiProperty({
    example: 'Email verified successfully',
  })
  message!: string;

  @IsEmbedded({ to: UserResponse })
  user!: UserResponse;
}
