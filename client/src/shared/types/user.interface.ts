import { TRole } from './role.type'

export interface IUser {
	id: string;
	name: string;
	email: string;
	emailVerified: boolean;
	image: null | string;
	role: TRole;
	companyId: null | string;
	banExpires: null | string;
	banReason: null | string;
	banned: boolean;
	createdAt: string
	updatedAt: string;
}