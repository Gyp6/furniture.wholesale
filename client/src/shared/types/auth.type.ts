import z from 'zod';

import {
  // businessRegisterSchema,
  // designerRegisterSchema,
  // horecaRegisterSchema,
  loginSchema,
  registerSchema,
} from '../schemas';

export type LoginFormValues = z.infer<typeof loginSchema>;
export type LoginFieldName = keyof LoginFormValues;

export type RegisterFormValues = z.infer<typeof registerSchema>;
export type RegisterFieldName = keyof RegisterFormValues;

// export type DesignerRegisterFormValues = z.infer<typeof designerRegisterSchema>;
// export type DesignerRegisterFieldName = keyof DesignerRegisterFormValues;

// export type BusinessRegisterFormValues = z.infer<typeof businessRegisterSchema>;
// export type BusinessRegisterFieldName = keyof BusinessRegisterFormValues;

// export type HoReCaRegisterFormValues = z.infer<typeof horecaRegisterSchema>;
// export type HoReCaRegisterFieldName = keyof HoReCaRegisterFormValues;
