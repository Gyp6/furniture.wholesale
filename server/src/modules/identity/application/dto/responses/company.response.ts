import type { TVerificationStatusValues } from '@/common/types';
import {
  IsCompanyImage,
  IsCompanyName,
  IsCompanyRatingAvg,
  IsCompanyRatingCount,
  IsCompanyVerified,
  IsHash,
  IsTaxId,
} from '@/common/validators';

export class CompanyResponse {
  @IsHash({ title: 'Id' })
  id!: string;

  @IsCompanyName()
  name!: string;

  @IsTaxId()
  taxId!: string;

  @IsCompanyImage()
  logoUrl!: string | null;

  @IsCompanyVerified()
  verificationStatus!: TVerificationStatusValues;

  @IsCompanyRatingAvg()
  ratingAvg!: number;

  @IsCompanyRatingCount()
  ratingCount!: number;
}
