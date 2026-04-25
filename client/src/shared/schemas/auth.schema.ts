import z from 'zod';

import { EHoReCaType } from '../enums';

export const nameSchema = z
  .string()
  .min(2, { message: 'Name must be at least 2 characters long' })
  .max(50, { message: 'Name must be less than 50 characters long' });
export const emailSchema = z.email({ message: 'Invalid email address' });
export const passwordSchema = z
  .string()
  .min(8, { message: 'Password must be at least 8 characters long' })
  .max(100, { message: 'Password must be less than 100 characters long' });
export const specificationSchema = z
  .string()
  .min(2, { message: 'Specification must be at least 2 characters long' })
  .max(100, { message: 'Specification must be less than 100 characters long' });
export const companyNameSchema = z
  .string()
  .min(2, { message: 'Company name must be at least 2 characters long' })
  .max(100, { message: 'Company name must be less than 100 characters long' });
export const taxIdSchema = z
  .string()
  .min(8, { message: 'Tax ID must be at least 8 characters long' })
  .max(10, { message: 'Tax ID must be less than 10 characters long' });
export const horecaType = z.enum(EHoReCaType, {
  message: 'Invalid HoReCa type',
});

export const loginSchema = z.object({
  email: emailSchema,
  password: passwordSchema,
});

export const registerSchema = z.object({
  name: nameSchema,
  email: emailSchema,
  password: passwordSchema,
});

export const designerRegisterSchema = registerSchema.extend({
  specification: specificationSchema,
});

export const businessRegisterSchema = registerSchema.extend({
  companyName: companyNameSchema,
  taxId: taxIdSchema,
});

export const horecaRegisterSchema = registerSchema.extend({
  horecaType: horecaType,
});
