import type { TRole } from '@/shared/types';
import {
  IsCompanyName,
  IsName,
  IsPassword,
  IsRole,
  IsSpecialisations,
  IsTaxId,
  IsUniqueEmail,
} from '@/shared/validators';

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

  @IsTaxId()
  taxId!: string;
}
