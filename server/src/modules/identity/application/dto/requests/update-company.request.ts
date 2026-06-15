import { IsOptional } from 'class-validator';

import {
  IsAddress,
  IsCompanyDescription,
  IsCompanyName,
  IsEmail,
  IsLeadTime,
  IsSpecialisations,
  IsTerms,
} from '@/common/validators';

export class UpdateCompanyRequest {
  @IsOptional()
  @IsCompanyName()
  name?: string;

  @IsOptional()
  @IsCompanyDescription()
  description?: string | null;

  @IsOptional()
  @IsEmail()
  businessEmail?: string | null;

  @IsOptional()
  @IsAddress()
  showroomAddress?: string | null;

  @IsOptional()
  @IsSpecialisations()
  specializations?: string[];

  @IsOptional()
  @IsLeadTime()
  leadTime?: string | null;

  @IsOptional()
  @IsTerms()
  terms?: string | null;
}
