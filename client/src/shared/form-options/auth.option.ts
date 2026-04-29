import { formOptions } from '@tanstack/react-form-nextjs';



import { loginSchema, registerSchema } from '@/shared/schemas';
import { THoReCa, TRole } from '@/shared/types';










export const loginFormOpts = formOptions({
  defaultValues: {
    email: '',
    password: '',
  },
  validators: {
    onSubmit: loginSchema,
  },
});

export const getRegisterFormOpts = (role: TRole) =>
  formOptions({
    defaultValues: {
      name: '',
      email: '',
      password: '',
      passwordConfirm: '',
      specialisation: '',
      horecaType: '' as THoReCa,
      companyName: '',
      taxId: '',
    },
    validators: {
      onChange: ({ value }) => {
        const result = registerSchema.safeParse({ ...value, role });

        if (!result.success) {
          return {
            form: undefined,
            fields: Object.fromEntries(
              Object.entries(
                result.error.issues
                  .filter(issue => issue.path[0])
                  .reduce<Record<string, { message: string }[]>>(
                    (acc, issue) => {
                      const key = issue.path[0] as string;
                      if (!acc[key]) acc[key] = [];
                      acc[key].push({ message: issue.message });
                      return acc;
                    },
                    {},
                  ),
              ),
            ),
          };
        }

        return undefined;
      },
    },
  });
