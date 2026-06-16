// components/sections/auth/otp-modal.tsx
'use client';

import { useState } from 'react';
import { toast } from 'sonner';

import { Button } from '@/components/ui/shadcn/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/shadcn/dialog';
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from '@/components/ui/shadcn/input-otp';
import { useResendOtp, useVerifyEmail } from '@/hooks/queries';

interface OtpModalProps {
  email: string;
  isOpen: boolean;
  onSuccess: () => void;
}

export function OtpModal({ email, isOpen, onSuccess }: OtpModalProps) {
  const [otp, setOtp] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const { mutateAsync: verifyEmail } = useVerifyEmail();
  const { mutate: resendOtp } = useResendOtp();

  const handleVerify = async (code: string) => {
    setIsLoading(true);
    toast.promise(verifyEmail(code), {
      loading: 'Verifying your account...',
      success: () => {
        onSuccess();
        setIsLoading(false);
        return 'Email verified successfully!';
      },
      error: (err: Error) => {
        setOtp('');
        setIsLoading(false);
        return err.message || 'Invalid activation code';
      },
    });
  };

  const handleResend = () => {
    resendOtp(undefined, {
      onSuccess: () => toast.success('New code sent to your email!'),
      onError: (err: Error) =>
        toast.error(err.message || 'Failed to resend code'),
    });
  };

  return (
    <Dialog open={isOpen}>
      <DialogContent
        className={'sm:max-w-115 flex flex-col items-center py-10'}
        onPointerDownOutside={e => e.preventDefault()}
        onEscapeKeyDown={e => e.preventDefault()}
        showCloseButton={false}
      >
        <DialogHeader className={'items-center text-center'}>
          <DialogTitle className={'text-2xl font-semibold'}>
            Verify your email
          </DialogTitle>
          <DialogDescription>
            We sent a 6-digit code to{' '}
            <span className={'font-medium text-primary'}>{email}</span>
          </DialogDescription>
        </DialogHeader>

        <div className={'py-6'}>
          <InputOTP
            maxLength={6}
            value={otp}
            onChange={setOtp}
            onComplete={handleVerify}
            disabled={isLoading}
            pattern={'^[0-9]*$'}
            inputMode={'numeric'}
          >
            <InputOTPGroup>
              <InputOTPSlot index={0} />
              <InputOTPSlot index={1} />
              <InputOTPSlot index={2} />
              <InputOTPSlot index={3} />
              <InputOTPSlot index={4} />
              <InputOTPSlot index={5} />
            </InputOTPGroup>
          </InputOTP>
        </div>

        <p className={'text-sm text-muted-foreground'}>
          Didn&apos;t receive a code?{' '}
          <Button
            variant={'link'}
            onClick={handleResend}
          >
            Resend
          </Button>
        </p>
      </DialogContent>
    </Dialog>
  );
}
