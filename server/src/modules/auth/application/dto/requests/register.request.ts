import type { TRole } from '@/common/types';
import {
  IsCompanyName,
  IsName,
  IsPassword,
  IsRole,
  IsSpecialisations,
  IsTaxCode,
  IsUniqueEmail,
} from '@/common/validators';

export class RegisterRequest {
  @IsRole()
  type!: TRole;

  @IsName()
  name!: string;

  @IsUniqueEmail()
  email!: string;

  @IsPassword()
  password!: string;

  @IsSpecialisations()
  specialisations!: string[];

  @IsCompanyName()
  companyName!: string;

  @IsTaxCode()
  taxCode!: string;
}
