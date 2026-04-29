import { IsEmail, IsPassword } from '@/shared/validators';

export class LoginRequest {
  @IsEmail()
  email!: string;

  @IsPassword()
  password!: string;
}
