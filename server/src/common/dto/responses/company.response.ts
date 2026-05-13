import { VerificationStatus } from '@prisma/client';

import {
  IsCompanyDescription,
  IsCompanyImage,
  IsCompanyName,
  IsCompanyRatingAvg,
  IsCompanyRatingCount,
  IsCompanyTerms,
  IsCompanyVerified,
  IsDate,
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

  @IsCompanyDescription()
  description!: string | null;

  @IsCompanyVerified()
  verificationStatus!: VerificationStatus;

  @IsCompanyImage()
  logoUrl!: string | null;

  @IsCompanyTerms()
  terms!: string | null;

  @IsCompanyRatingAvg()
  ratingAvg!: string;

  @IsCompanyRatingCount()
  ratingCount!: number;

  @IsDate()
  createdAt!: string;
}
