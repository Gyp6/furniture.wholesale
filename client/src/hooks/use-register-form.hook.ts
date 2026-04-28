'use client';

import { useForm, useStore } from '@tanstack/react-form-nextjs';
import { useRouter } from 'next/navigation';
import { useEffect, useMemo, useState } from 'react';
import { toast } from 'sonner';

import { ROUTES } from '@/constants';
import { authClient } from '@/lib';
import { getRegisterFormOpts } from '@/shared/form-options';
import { IUser, THoReCa, TRole } from '@/shared/types';
import { useAuthFormStore, useUserStore } from '@/store';

type SignUpOptions = Parameters<typeof authClient.signUp.email>[0];

export function useRegisterForm() {
  const router = useRouter();

  const { setUser } = useUserStore();
  const { role, setRole } = useAuthFormStore();

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const togglePassword = () => setShowPassword(prev => !prev);
  const toggleConfirm = () => setShowConfirm(prev => !prev);

  const options = useMemo(() => getRegisterFormOpts(role!), [role]);

  const form = useForm({
    ...options,
    onSubmit: async ({ value }) => {
      const { passwordConfirm, ...cleanValue } = value;

      let requestValue;
      if (role === 'DESIGNER') {
        const { horecaType, companyName, taxId, ...data } = cleanValue;
        requestValue = data;
      }
      if (role === 'HORECA') {
        const { specialisation, companyName, taxId, ...data } = cleanValue;
        requestValue = data;
      }
      if (role === 'RETAILER' || role === 'SUPPLIER') {
        const { specialisation, horecaType, ...data } = cleanValue;
        requestValue = data;
      }

      const registerPromise = authClient.signUp
        .email({
          type: role,
          ...requestValue,
        } as SignUpOptions & {
          type: TRole;
          specialisation?: string;
          horecaType?: THoReCa;
          companyName?: string;
          taxId?: string;
        })
        .then(result => {
          if (result.error) {
            throw new Error(result.error.message || 'Something went wrong');
          }
          return result.data;
        });

      toast.promise(registerPromise, {
        loading: 'Registering...',
        success: data => {
          const user = data.user as unknown as IUser;

          setUser(user);

          // setTimeout(() => {
          //   router.push(ROUTES.PROFILE(user.id));
          //   router.refresh();
          // }, 1000);

          return `Welcome, ${user.name}!`;
        },
        error: err => err.message,
        position: 'top-center',
      });
    },
  });

  useEffect(() => {
    console.log('DEBUG: role', role);
  }, [role, form]);

  const handleRoleChange = (newRole: TRole) => {
    setRole(newRole);
  };

  // const fieldMeta = useStore(form.store, s => s.fieldMeta);
  // console.log(
  //   'Invalid fields:',
  //   Object.keys(fieldMeta).filter(k => fieldMeta[k].errors.length > 0),
  // );

  return {
    form,
    role,
    setRole,
    handleRoleChange,
    showPassword,
    showConfirm,
    togglePassword,
    toggleConfirm,
    router,
  };
}
