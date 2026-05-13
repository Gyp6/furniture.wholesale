import { applyDecorators, Type } from '@nestjs/common';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { VerificationStatus } from '@prisma/client';
import { Type as TransformType } from 'class-transformer';
import {
  IsArray,
  IsBoolean,
  IsEmail as IsEmailValidator,
  IsEnum,
  IsNumberString,
  IsString,
  IsUrl,
  Matches,
  MaxLength,
  MinLength,
  ValidateNested,
} from 'class-validator';

import { ROLES } from '../constants';

import { IsUnique } from './is-unique.validator';

export const IsHash = ({ title }: { title: string }) =>
  applyDecorators(
    ApiProperty({
      example: 'n4JGynlh1xgvTxfCG8PNCFhdqi84Z0mL',
    }),
    IsString({ message: `${title} must be a string` }),
  );

export const IsEmbedded = ({ to }: { to: Type }) =>
  applyDecorators(
    ApiProperty({ type: () => to }),
    ValidateNested(),
    TransformType(() => to),
  );

export const IsBool = ({ title }: { title: string }) =>
  applyDecorators(
    ApiProperty({
      example: true,
    }),
    IsBoolean({ message: `${title} must be a boolean` }),
  );

export const IsRole = () =>
  applyDecorators(
    ApiProperty({
      enum: ROLES,
      example: ROLES.DESIGNER,
    }),
    IsEnum(ROLES, { message: 'Invalid role' }),
  );

export const IsCompanyVerified = () =>
  applyDecorators(
    ApiProperty({
      enum: VerificationStatus,
      example: VerificationStatus.PENDING,
    }),
    IsEnum(VerificationStatus, { message: 'Invalid verification status' }),
  );

export const IsName = () =>
  applyDecorators(
    ApiProperty({
      example: 'Peter',
    }),
    MinLength(2, { message: 'Name must be at least 2 characters long' }),
    MaxLength(50, { message: 'Name must be less than 50 characters long' }),
  );

export const isUniqueName = () =>
  applyDecorators(
    IsName(),
    IsUnique('user', 'name', {
      message: 'User with this name already exists',
    }) as PropertyDecorator,
  );

export const IsEmail = () =>
  applyDecorators(
    ApiProperty({
      example: 'name@company.com',
    }),
    IsEmailValidator({}, { message: 'Invalid email address' }),
  );

export const IsUniqueEmail = () =>
  applyDecorators(
    IsEmail(),
    IsUnique('user', 'email', {
      message: 'User with this email already exists',
    }) as PropertyDecorator,
  );

export const IsPassword = () =>
  applyDecorators(
    ApiProperty({
      example: 'Password123',
    }),
    MinLength(8, { message: 'Password must be at least 8 characters long' }),
    MaxLength(100, {
      message: 'Password must be less than 100 characters long',
    }),
    Matches(/[a-z]/, {
      message: 'Password must contain at least one lowercase letter',
    }),
    Matches(/[A-Z]/, {
      message: 'Password must contain at least one uppercase letter',
    }),
    Matches(/[0-9]/, { message: 'Password must contain at least one number' }),
  );

export const IsCompanyName = () =>
  applyDecorators(
    ApiProperty({
      example: 'Apple Inc',
    }),
    MinLength(2, {
      message: 'Company name must be at least 2 characters long',
    }),
    MaxLength(100, {
      message: 'Company name must be less than 100 characters long',
    }),
  );

export const IsUniqueCompanyName = () =>
  applyDecorators(
    IsCompanyName(),
    IsUnique('company', 'name', {
      message: 'Company with this name already exists',
    }) as PropertyDecorator,
  );

export const IsTaxId = () =>
  applyDecorators(
    ApiProperty({
      example: '12345678',
      description: 'EDRPOU: 8 or 10 digits',
    }),
    IsNumberString({}, { message: 'EDRPOU must contain only digits' }),
    MinLength(8, { message: 'EDRPOU must be at least 8 characters long' }),
    MaxLength(10, { message: 'EDRPOU must be less than 10 characters long' }),
  );

export const IsUniqueTaxId = () =>
  applyDecorators(
    IsTaxId(),
    IsUnique('company', 'taxId', {
      message: 'Company with this EDRPOU already exists',
    }) as PropertyDecorator,
  );

export const IsSpecialisations = () =>
  applyDecorators(
    ApiProperty({
      example: ['Interior Design', 'Architecture'],
      type: [String],
    }),
    IsArray({
      message: 'Specialisations must be an array of strings',
    }),
    IsString({
      each: true,
      message: 'Each specialisation must be a string',
    }),
    MinLength(2, {
      each: true,
      message: 'Each specialisation must be at least 2 characters long',
    }),
    MaxLength(100, {
      each: true,
      message: 'Each specialisation must be less than 100 characters long',
    }),
  );

export const IsDate = () =>
  applyDecorators(
    ApiProperty({
      example: '2026-03-21T21:30:00.000Z',
    }),
  );

export const IsUserImage = () =>
  applyDecorators(
    ApiProperty({
      example: 'user/<user-id>/profile.png',
      nullable: true,
      default: null,
    }),
  );

export const IsCompanyImage = () =>
  applyDecorators(
    ApiPropertyOptional({
      example: 'company/<company-id>/logo.png',
      nullable: true,
      default: null,
    }),
  );

export const IsBanReason = () =>
  applyDecorators(
    ApiProperty({
      example: "Cause you've been used hate-speach",
      nullable: true,
      default: null,
    }),
  );

export const IsBanExpires = () =>
  applyDecorators(
    ApiProperty({
      example: '2026-03-21T21:30:00.000Z',
      nullable: true,
      default: null,
    }),
  );

export const IsCompanyDescription = () =>
  applyDecorators(
    ApiPropertyOptional({
      example: 'We sell furniture',
      nullable: true,
      default: null,
    }),
  );

export const IsCompanyTerms = () =>
  applyDecorators(
    ApiPropertyOptional({
      example: 'Our terms...',
      nullable: true,
      default: null,
    }),
  );

export const IsCompanyRatingAvg = () =>
  applyDecorators(
    ApiProperty({
      example: '4.50',
    }),
  );

export const IsCompanyRatingCount = () =>
  applyDecorators(
    ApiProperty({
      example: 0,
    }),
  );

export const IsOtpCode = () =>
  applyDecorators(
    ApiProperty({
      example: '123456',
    }),
    IsString({ message: 'Code must be a string' }),
  );

export const IsLink = () =>
  applyDecorators(
    ApiProperty({
      example: 'http://localhost:3000/auth/reset-password',
    }),
    IsUrl(
      {
        require_tld: false, // Дозволяє localhost без .com/.net
        require_protocol: true, // Обов'язково http:// або https://
        allow_underscores: true,
      },
      { message: 'Invalid URL' },
    ),
    // note: in prod change to real domen, not localhost
    Matches(/^(http:\/\/localhost:3000|https:\/\/your-app\.com)/, {
      message: 'Redirect URL is not allowed',
    }),
  );
