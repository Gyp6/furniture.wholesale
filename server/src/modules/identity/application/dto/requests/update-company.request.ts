import { Transform } from 'class-transformer';
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
  @Transform(({ value }) => (value === '' ? null : value))
  description?: string | null;

  @IsOptional()
  @IsEmail()
  @Transform(({ value }) => (value === '' ? null : value))
  businessEmail?: string | null;

  @IsOptional()
  @IsAddress()
  @Transform(({ value }) => (value === '' ? null : value))
  showroomAddress?: string | null;

  @IsOptional()
  @IsSpecialisations()
  specializations?: string[];

  @IsOptional()
  @IsLeadTime()
  @Transform(({ value }) => (value === '' ? null : value))
  leadTime?: string | null;

  @IsOptional()
  @IsTerms()
  @Transform(({ value }) => (value === '' ? null : value))
  terms?: string | null;
}
