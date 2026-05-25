import { TVerificationStatusValues } from '@/common/types';

export class Company {
  constructor(
    public readonly id: string,
    public readonly name: string,
    public readonly abbreviation: string,
    public readonly taxCode: string,
    public readonly description: string | null,
    public readonly businessEmail: string | null,
    public readonly showroomAddress: string | null,
    public readonly specializations: string[],
    public readonly leadTime: string | null,
    public readonly verificationStatus: TVerificationStatusValues,
    public readonly terms: string | null,
    public readonly ratingAvg: number,
    public readonly ratingCount: number,
    public readonly createdAt: Date,
  ) {}
}
