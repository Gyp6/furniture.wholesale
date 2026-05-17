import { IsEmbedded, IsHash, IsSpecialisations } from '@/common/validators';

import { CompanyResponse } from './company.response';

export class ProfileResponse {
  @IsHash({ title: 'Id' })
  id!: string;

  @IsHash({ title: 'Company id' })
  companyId!: string | null;

  @IsEmbedded({ to: CompanyResponse })
  company!: CompanyResponse | null;

  @IsSpecialisations()
  specializations!: string[];
}
