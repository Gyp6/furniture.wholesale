import { Company } from './company.entity';

export class Profile {
  constructor(
    public readonly id: string,
    public readonly userId: string,
    public readonly companyId: string | null,
    public readonly company: Company | null,
  ) {}
}
