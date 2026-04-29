import z from 'zod';

import {
  companyNameSchema,
  emailSchema,
  horecaTypeSchema,
  nameSchema,
  passwordSchema,
  roleSchema,
  specialisationSchema,
  taxIdSchema,
} from './common.schema';
import { ROLES } from '@/constants'

export const loginSchema = z.object({
  email: emailSchema,
  password: passwordSchema,
});

export const baseSchema = loginSchema.extend({
  name: nameSchema,
  role: roleSchema,
  passwordConfirm: z.string(),
});

export const registerSchema = z
  .discriminatedUnion('role', [
    baseSchema.extend({
      role: z.literal(ROLES.DESIGNER),
      specialisation: specialisationSchema,
    }),
    baseSchema.extend({
      role: z.literal(ROLES.HORECA),
      horecaType: horecaTypeSchema,
    }),
    baseSchema.extend({
      role: z.literal(ROLES.RETAILER),
      companyName: companyNameSchema,
      taxId: taxIdSchema,
    }),
    baseSchema.extend({
      role: z.literal(ROLES.SUPPLIER),
      companyName: companyNameSchema,
      taxId: taxIdSchema,
    }),
  ])
  .superRefine(({ passwordConfirm, password }, ctx) => {
    if (passwordConfirm !== password) {
      ctx.addIssue({
        code: 'custom',
        message: "Passwords don't match",
        path: ['passwordConfirm'],
      });
    }
  });
