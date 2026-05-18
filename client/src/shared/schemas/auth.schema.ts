import z from 'zod';

import { ROLES } from '@/constants';

import {
  companyNameSchema,
  emailSchema,
  horecaTypeSchema,
  nameSchema,
  passwordSchema,
  specialisationsSchema,
  taxIdSchema,
} from './common.schema';

export const loginSchema = z.object({
  email: emailSchema,
  password: passwordSchema,
});

export const baseSchema = loginSchema.extend({
  name: nameSchema,
  passwordConfirm: z.string(),
});

export const registerSchema = baseSchema.extend({
  specialisations: specialisationsSchema,
  companyName: companyNameSchema,
  taxId: taxIdSchema,
});

export const dynamicRegisterSchema = z
  .discriminatedUnion('role', [
    baseSchema.extend({
      role: z.literal(ROLES.DESIGNER),
      specialisation: specialisationsSchema,
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
