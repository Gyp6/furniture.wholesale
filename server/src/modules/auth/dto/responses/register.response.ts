import { BA_UserResponse } from '@/shared/dto/responses/user.response';
import { IsEmbedded, IsHash } from '@/shared/validators';

export class RegisterResponse {
  @IsHash({ title: 'Token' })
  token!: string;

  @IsEmbedded({ to: BA_UserResponse })
  user!: BA_UserResponse;
}
