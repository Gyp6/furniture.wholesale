import { ROUTES } from '@/constants'
import { api } from '@/lib';
import { IUser } from '@/shared/types'

export const authService = {
  async verifyEmail(code: string): Promise<{ message: string, user: IUser }> {
    const { data } = await api.post(ROUTES.API.USER.VERIFY_EMAIL, { code });
    return data;
  },

  async resendOtp(): Promise<{ message: string }> {
    const { data } = await api.get(ROUTES.API.USER.RESEND_OTP);
    return data;
  },
};
