import { CompanyResponse } from '@identity/application/dto/responses';
import { CompanyService } from '@identity/application/services/company.service';
import { Controller, Get, Param, Body, Patch, Post, Req, ForbiddenException } from '@nestjs/common';
import { ApiOkResponse, ApiCreatedResponse, ApiOperation, ApiTags } from '@nestjs/swagger';
import { SkipThrottle } from '@nestjs/throttler';
import { AllowAnonymous } from '@thallesp/nestjs-better-auth';
import { UpdateCompanyRequest } from '@identity/application/dto/requests/update-company.request';
import { ProfileService } from '@identity/application/services/profile.service';
import { S3Service } from '@/infrastructure/s3/s3.service';
import { IReqUser } from '@/common/types';

@ApiTags('Company')
@Controller('company')
export class CompanyController {
  constructor(
    private readonly companyService: CompanyService,
    private readonly profileService: ProfileService,
    private readonly s3Service: S3Service,
  ) {}

  @ApiOperation({ summary: 'Find company by tax id' })
  @ApiOkResponse({ type: CompanyResponse })
  @Get('tax/:taxId')
  @SkipThrottle()
  @AllowAnonymous()
  async findByTaxId(
    @Param('taxId') taxId: string,
  ): Promise<CompanyResponse | null> {
    return await this.companyService.findByTaxCode(taxId);
  }

  @ApiOperation({ summary: 'Update company profile of the logged-in supplier' })
  @ApiOkResponse({ type: CompanyResponse })
  @Patch('my')
  @SkipThrottle()
  async updateMy(
    @Req() { user }: { user: IReqUser },
    @Body() dto: UpdateCompanyRequest,
  ): Promise<CompanyResponse> {
    const profile = await this.profileService.getEntityByUserId(user.id);
    if (!profile.companyId) {
      throw new ForbiddenException('User is not associated with any company');
    }
    return await this.companyService.update(profile.companyId, dto);
  }

  @ApiOperation({ summary: 'Get presigned URL for company logo upload (PNG only)' })
  @ApiCreatedResponse()
  @Post('my/upload-url/logo')
  @SkipThrottle()
  async getLogoUploadUrl(
    @Req() { user }: { user: IReqUser },
  ) {
    const profile = await this.profileService.getEntityByUserId(user.id);
    if (!profile.companyId) {
      throw new ForbiddenException('User is not associated with any company');
    }
    const company = await this.companyService.findById(profile.companyId);
    const key = `identity/company/${company.taxCode}/logo.png`;
    return this.s3Service.getPresignedUploadUrlWithKey(key, 'image/png');
  }

  @ApiOperation({ summary: 'Get presigned URL for company banner upload (PNG only)' })
  @ApiCreatedResponse()
  @Post('my/upload-url/banner')
  @SkipThrottle()
  async getBannerUploadUrl(
    @Req() { user }: { user: IReqUser },
  ) {
    const profile = await this.profileService.getEntityByUserId(user.id);
    if (!profile.companyId) {
      throw new ForbiddenException('User is not associated with any company');
    }
    const company = await this.companyService.findById(profile.companyId);
    const key = `identity/company/${company.taxCode}/banner.png`;
    return this.s3Service.getPresignedUploadUrlWithKey(key, 'image/png');
  }

  @ApiOperation({ summary: 'Get presigned URL for company terms upload (PDF only)' })
  @ApiCreatedResponse()
  @Post('my/upload-url/terms')
  @SkipThrottle()
  async getTermsUploadUrl(
    @Req() { user }: { user: IReqUser },
  ) {
    const profile = await this.profileService.getEntityByUserId(user.id);
    if (!profile.companyId) {
      throw new ForbiddenException('User is not associated with any company');
    }
    const company = await this.companyService.findById(profile.companyId);
    const key = `identity/company/${company.taxCode}/terms-of-use.pdf`;
    return this.s3Service.getPresignedUploadUrlWithKey(key, 'application/pdf');
  }

  @ApiOperation({ summary: 'Find company by id' })
  @ApiOkResponse({ type: CompanyResponse })
  @Get(':id')
  @SkipThrottle()
  @AllowAnonymous()
  async findOne(@Param('id') id: string): Promise<CompanyResponse> {
    return await this.companyService.findById(id);
  }
}
