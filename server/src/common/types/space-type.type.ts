import { SpaceType } from '@prisma/client';

export type TSpaceType = typeof SpaceType;
export type TSpaceTypeKeys = keyof TSpaceType;
export type TSpaceTypeValues = TSpaceType[TSpaceTypeKeys];
