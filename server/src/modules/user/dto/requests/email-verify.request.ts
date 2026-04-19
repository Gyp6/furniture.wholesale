import { IsEmail, IsNotEmpty, IsString } from 'class-validator';

export class EmailVerifyRequest {
  @IsEmail({}, { message: 'Email must be a valid email address' })
  @IsNotEmpty()
  email!: string;

  @IsString({ message: 'Code must be a string' })
  @IsNotEmpty()
  code!: string;
}
