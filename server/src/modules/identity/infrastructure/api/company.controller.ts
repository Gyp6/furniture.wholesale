import { CompanyResponse } from '@identity/application/dto/responses';
import { CompanyService } from '@identity/application/services/company.service';
import { Controller, Get, Param } from '@nestjs/common';
import { ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger';

@ApiTags('Company')
@Controller('company')
export class CompanyController {
  constructor(private readonly companyService: CompanyService) {}

  @ApiOperation({ summary: 'Find company by tax id' })
  @ApiOkResponse({ type: CompanyResponse })
  @Get(':taxId')
  async findByTaxId(
    @Param('taxId') taxId: string,
  ): Promise<CompanyResponse | null> {
    return await this.companyService.findByTaxCode(taxId);
  }
}
