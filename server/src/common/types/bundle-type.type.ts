import { BundleType } from '@prisma/client';

export type TBundleType = typeof BundleType;
export type TBundleTypeKeys = keyof TBundleType;
export type TBundleTypeValues = TBundleType[TBundleTypeKeys];
