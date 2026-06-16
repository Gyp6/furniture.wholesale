import { BA_UserResponse } from '@/common/dto/responses';
import { IsEmbedded, IsHash } from '@/common/validators';

export class RegisterResponse {
  @IsHash({ title: 'Token' })
  token!: string;

  @IsEmbedded({ to: BA_UserResponse })
  user!: BA_UserResponse;
}
