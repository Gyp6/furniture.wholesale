import {
  IsEmail,
  IsEnum,
  IsString,
  IsStrongPassword,
  MaxLength,
  MinLength,
} from 'class-validator';

import { IsUnique } from '@/core/validators/is-unique.validator';
import { UserTypeEnum } from '@/shared/enums/user-type.enum';

export class RegisterRetailerRequest {
  @IsEmail({}, { message: 'Email must be a valid email address' })
  @IsUnique('user', 'email', {
    message: 'User with this email already exists',
  })
  email!: string;

  @IsStrongPassword(
    {
      minLength: 8,
      minLowercase: 1,
      minUppercase: 1,
      minNumbers: 1,
      minSymbols: 0,
    },
    {
      message:
        'Password must be at least 8 characters long and include uppercase letters, lowercase letters, and numbers',
    },
  )
  @MaxLength(100, { message: 'Password must be less than 100 characters long' })
  password!: string;

  @IsString()
  @MinLength(2, { message: 'Name must be at least 2 characters long' })
  name!: string;

  @IsEnum(UserTypeEnum, {
    message: 'Incorrect user type',
  })
  type!: UserTypeEnum;

  @IsString()
  @MinLength(2, { message: 'Company name must be at least 2 characters long' })
  @MaxLength(100, {
    message: 'Company name must be less than 100 characters long',
  })
  @IsUnique('company', 'name', {
    message: 'Company with this name already exists',
  })
  companyName!: string;

  @IsString()
  @IsUnique('company', 'taxId', {
    message: 'Company with this Tax ID already exists',
  })
  taxId!: string;
}
