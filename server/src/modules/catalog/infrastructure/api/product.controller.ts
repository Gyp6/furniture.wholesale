import {
  CreateProductRequest,
  UpdateProductRequest,
  UpdateProductStatusRequest,
  UploadUrlRequest,
} from '@catalog/application/dto/requests';
import {
  ProductResponse,
  UploadUrlResponse,
} from '@catalog/application/dto/responses';
import { ProductService } from '@catalog/application/services';
import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Patch,
  Post,
  Req,
} from '@nestjs/common';
import {
  ApiCreatedResponse,
  ApiNoContentResponse,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';
import { AllowAnonymous, Roles } from '@thallesp/nestjs-better-auth';

import { ROLES } from '@/common/constants';
import { IReqUser } from '@/common/types';
import { CurrentAbility } from '@/core/decorators';
import type { AppAbility } from '@/infrastructure/casl/casl.ability-factory';
import { S3Service } from '@/infrastructure/s3/s3.service';

@ApiTags('Products')
@Controller('products')
export class ProductController {
  constructor(
    private readonly s3Service: S3Service,
    private readonly productService: ProductService,
  ) {}

  @ApiOperation({ summary: 'Get all active products' })
  @ApiOkResponse({ type: [ProductResponse] })
  @Get()
  @AllowAnonymous()
  async findAll() {
    return this.productService.findAll();
  }

  @ApiOperation({ summary: 'Get product by id' })
  @ApiOkResponse({ type: ProductResponse })
  @Get(':id')
  @AllowAnonymous()
  async findOne(@Param('id') id: string): Promise<ProductResponse> {
    return this.productService.findById(id);
  }

  @ApiOperation({ summary: 'Create product (supplier only)' })
  @ApiCreatedResponse({ type: ProductResponse })
  @Roles([ROLES.SUPPLIER, ROLES.ADMIN])
  @Post()
  async create(
    @Req() { user }: { user: IReqUser },
    @Body() dto: CreateProductRequest,
  ): Promise<ProductResponse> {
    return this.productService.create(user, dto);
  }

  @ApiOperation({ summary: 'Update product (owner only)' })
  @ApiOkResponse({ type: ProductResponse })
  @Patch(':id')
  async update(
    @Param('id') id: string,
    @Body() dto: UpdateProductRequest,
    @CurrentAbility() ability: AppAbility,
  ): Promise<ProductResponse> {
    return this.productService.update(id, dto, ability);
  }

  @ApiOperation({ summary: 'Update product status (owner only)' })
  @ApiOkResponse({ type: ProductResponse })
  @Patch(':id/status')
  async updateStatus(
    @Param('id') id: string,
    @Body() { status }: UpdateProductStatusRequest,
    @CurrentAbility() ability: AppAbility,
  ): Promise<ProductResponse> {
    return this.productService.updateStatus(id, status, ability);
  }

  @ApiOperation({ summary: 'Delete product (owner only)' })
  @ApiNoContentResponse()
  @HttpCode(HttpStatus.NO_CONTENT)
  @Delete(':id')
  async delete(
    @Param('id') id: string,
    @CurrentAbility() ability: AppAbility,
  ): Promise<void> {
    return this.productService.delete(id, ability);
  }

  @ApiOperation({ summary: 'Get presigned URL for product image upload' })
  @ApiCreatedResponse({ type: UploadUrlResponse })
  @Post('upload-url')
  async getUploadUrl(
    @Body() { mimeType }: UploadUrlRequest,
  ): Promise<UploadUrlResponse> {
    return await this.s3Service.getPresignedUploadUrl('products', mimeType);
  }
}
