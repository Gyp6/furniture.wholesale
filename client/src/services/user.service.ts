import { ROUTES } from '@/constants'
import { api } from '@/lib'
import { IUser } from '@/shared/types'

export const userService = {
	async getMe(): Promise<IUser> { 
		const { data } = await api.get(ROUTES.API.USER.ME);
		return data;
	}
}