import { PRODUCT_STATUSES } from '../constants';

export type TProductStatus = typeof PRODUCT_STATUSES;
export type TProductStatusKeys = keyof TProductStatus;
export type TProductStatusValues = TProductStatus[TProductStatusKeys];
