import { IsEmail, IsPassword } from '@/common/validators';

export class LoginRequest {
  @IsEmail()
  email!: string;

  @IsPassword()
  password!: string;
}
