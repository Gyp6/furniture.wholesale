import {
  COMPANY_REPOSITORY,
  type ICompanyRepository,
} from '@identity/domain/contracts';
import { Inject, Injectable, NotFoundException } from '@nestjs/common';

import { CompanyResponse } from '../dto/responses';
import { CompanyMapper } from '../mappers';

@Injectable()
export class CompanyService {
  constructor(
    @Inject(COMPANY_REPOSITORY)
    private readonly companyRepository: ICompanyRepository,
  ) {}

  async findByTaxCode(taxCode: string): Promise<CompanyResponse | null> {
    const entity = await this.companyRepository.findByTaxCode(taxCode);
    if (!entity) throw new NotFoundException('Company not found');

    return CompanyMapper.toResponse(entity);
  }
}
