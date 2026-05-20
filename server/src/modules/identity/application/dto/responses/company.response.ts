import type { TVerificationStatusValues } from '@/common/types';
import {
  IsCompanyImage,
  IsCompanyName,
  IsCompanyRatingAvg,
  IsCompanyVerified,
  IsHash,
  IsSpecialisations,
  IsTaxCode,
} from '@/common/validators';

export class CompanyResponse {
  @IsHash({ title: 'Id' })
  id!: string;

  @IsCompanyName()
  name!: string;

  @IsTaxCode()
  taxCode!: string;

  @IsSpecialisations()
  specializations!: string[];

  @IsCompanyImage()
  logoUrl!: string | null;

  @IsCompanyVerified()
  verificationStatus!: TVerificationStatusValues;

  @IsCompanyRatingAvg()
  ratingAvg!: number;
}
