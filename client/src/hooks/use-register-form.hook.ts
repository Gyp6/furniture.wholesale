'use client';

import { useForm } from '@tanstack/react-form-nextjs';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { toast } from 'sonner';

import { ROUTES } from '@/constants';
import { authClient } from '@/lib';
import { registerFormOpts } from '@/shared/form-options';
import { IUser, TRole } from '@/shared/types';
import { useAuthFormStore, useUserStore } from '@/store';

type SignUpOptions = Parameters<typeof authClient.signUp.email>[0];

export function useRegisterForm() {
  const router = useRouter();

  const { user, setUser } = useUserStore();
  const {
    role,
    setRole,
    step,
    goNext: storeGoNext,
    goBack,
    setValidatedGoNext,
    reset,
  } = useAuthFormStore();

  const [registeredEmail, setRegisteredEmail] = useState('');

  const [showOtpModal, setShowOtpModal] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const togglePassword = () => setShowPassword(prev => !prev);
  const toggleConfirm = () => setShowConfirm(prev => !prev);

  const form = useForm({
    ...registerFormOpts,
    onSubmit: async ({ value }) => {
      console.log('hui');
      const { passwordConfirm, ...cleanValue } = value;

      const registerPromise = authClient.signUp
        .email({
          type: role,
          ...cleanValue,
        } as SignUpOptions & {
          type: TRole;
          specialisations: string[];
          companyName: string;
          taxId: string;
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
          setRegisteredEmail(value.email);
          setShowOtpModal(true);
          reset();

          return `Welcome, ${user.name}! Please verify your email.`;
        },
        error: err => err.message,
        position: 'top-center',
      });
    },
  });

  useEffect(() => {
    console.log('DEBUG: role', role);
  }, [role, form]);

  useEffect(() => {
    console.log('DEBUG: user', user);
  }, [user]);

  const STEP1_FIELDS = [
    'name',
    'email',
    'password',
    'passwordConfirm',
  ] as const;

  const goNext = async () => {
    STEP1_FIELDS.forEach(f =>
      form.setFieldMeta(f, meta => ({
        ...meta,
        isTouched: true,
      })),
    );
    await form.validate('submit');

    const hasErrors = STEP1_FIELDS.some(
      f => (form.state.fieldMeta[f]?.errors?.length ?? 0) > 0,
    );

    console.log('hasErrors:', hasErrors, form.state.fieldMeta);

    if (!hasErrors) storeGoNext();
  };

  useEffect(() => {
    setValidatedGoNext(goNext);
  }, []); // eslint-disable-line

  const onOtpSuccess = () => {
    setShowOtpModal(false);
    router.push(ROUTES.PROFILE(user?.id || ''));
  };

  // const fieldMeta = useStore(form.store, s => s.fieldMeta);
  // console.log(
  //   'Invalid fields:',
  //   Object.keys(fieldMeta).filter(k => fieldMeta[k].errors.length > 0),
  // );

  return {
    form,
    step,
    goNext,
    goBack,
    role,
    setRole,
    handleRoleChange: (r: TRole) => setRole(r),
    showPassword,
    showConfirm,
    togglePassword,
    toggleConfirm,
    router,
    showOtpModal,
    registeredEmail,
    onOtpSuccess,
  };
}
