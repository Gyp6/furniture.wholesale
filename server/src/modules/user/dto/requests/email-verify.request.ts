import { IsOtpCode } from '@/shared/validators';

export class EmailVerifyRequest {
  @IsOtpCode()
  code!: string;
}
