import { VerificationStatus } from '@prisma/client';

export type TVerificationStatus = typeof VerificationStatus;
export type TVerificationStatusKeys = keyof TVerificationStatus;
export type TVerificationStatusValues =
  TVerificationStatus[TVerificationStatusKeys];
