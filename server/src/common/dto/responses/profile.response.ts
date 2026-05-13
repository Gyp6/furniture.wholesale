import { IsEmbedded, IsHash, IsSpecialisations } from '@/common/validators';

import { CompanyResponse } from './company.response';

export class ProfileResponse {
  @IsHash({ title: 'Id' })
  id!: string;

  @IsHash({ title: 'User id' })
  userId!: string;

  @IsHash({ title: 'Company id' })
  companyId!: string;

  @IsSpecialisations()
  specializations!: string[];

  @IsEmbedded({ to: CompanyResponse })
  company!: CompanyResponse;
}
