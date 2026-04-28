import z from 'zod';

import { EHoReCaType, ERole } from '../enums';

export const nameSchema = z
  .string()
  .min(2, { message: 'Name must be at least 2 characters long' })
  .max(50, { message: 'Name must be less than 50 characters long' });
export const emailSchema = z.email({ message: 'Invalid email address' });
export const passwordSchema = z
  .string()
  .min(8, { message: 'Password must be at least 8 characters long' })
  .max(100, { message: 'Password must be less than 100 characters long' });
export const specialisationSchema = z
  .string()
  .min(2, { message: 'Specialisation must be at least 2 characters long' })
  .max(100, {
    message: 'Specialisation must be less than 100 characters long',
  });
export const companyNameSchema = z
  .string()
  .min(2, { message: 'Company name must be at least 2 characters long' })
  .max(100, { message: 'Company name must be less than 100 characters long' });
export const taxIdSchema = z
  .string()
  .min(8, { message: 'Tax ID must be at least 8 characters long' })
  .max(10, { message: 'Tax ID must be less than 10 characters long' });
export const horecaTypeSchema = z
  .string()
  .refine(val => Object.values(EHoReCaType).includes(val as EHoReCaType), {
    message: 'Invalid establishment type',
  });
export const roleSchema = z.enum(ERole, {
  message: 'Invalid role',
});
