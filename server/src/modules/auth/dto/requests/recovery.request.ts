import { IsEmail, IsHash, IsLink, IsPassword } from '@/common/validators';

export class ForgetPasswordRequest {
  @IsEmail()
  email!: string;

  @IsLink()
  redirectTo!: string;
}

export class ResetPasswordRequest {
  @IsPassword()
  newPassword!: string;

  @IsHash({ title: 'Token' })
  token!: string;
}
