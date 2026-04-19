import { UserTypeEnum } from '../enums/user-type.enum';

export type UserType = UserTypeEnum;

export type UserTypeInterface = {
  [key in UserType]: string;
};
