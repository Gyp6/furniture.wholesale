import {
  IsAbbreviation,
  IsAddress,
  IsCompanyDescription,
  IsCompanyName,
  IsCompanyRatingAvg,
  IsEmail,
  IsHash,
  IsLeadTime,
  IsSpecialisations,
  IsTaxCode,
  IsTerms,
  IsVerified,
} from '@/common/validators';

export class CompanyResponse {
  @IsHash({ title: 'id' })
  id!: string;

  @IsCompanyName()
  name!: string;

  @IsAbbreviation()
  abbreviation!: string;

  @IsCompanyDescription()
  description!: string | null;

  @IsEmail()
  businessEmail!: string | null;

  @IsAddress()
  showroomAddress!: string | null;

  @IsTaxCode()
  taxCode!: string;

  @IsSpecialisations()
  specializations!: string[];

  @IsVerified()
  isVerified!: boolean;

  @IsTerms()
  terms!: string | null;

  @IsLeadTime()
  leadTime!: string | null;

  @IsCompanyRatingAvg()
  ratingAvg!: number;
}
