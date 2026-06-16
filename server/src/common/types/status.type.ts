import { STATUS } from '../constants';

export type TStatus = typeof STATUS;
export type TStatusKeys = keyof TStatus;
export type TStatusValues = (typeof STATUS)[TStatusKeys];
