import { IsOtpCode } from '@/common/validators';

export class EmailVerifyRequest {
  @IsOtpCode()
  code!: string;
}
