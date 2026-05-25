import { subject } from '@casl/ability';
import {
  CreateProductRequest,
  UpdateProductRequest,
} from '@catalog/application/dto/requests';
import { ProductResponse } from '@catalog/application/dto/responses';
import { ProductMapper } from '@catalog/application/mappers';
import {
  type IProductRepository,
  PRODUCT_REPOSITORY,
} from '@catalog/domain/contracts';
import {
  ForbiddenException,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

import { ECalsAction } from '@/common/enums';
import { IReqUser, TProductStatusValues } from '@/common/types';
import { AppAbility } from '@/infrastructure/casl/casl.ability-factory';
import { ProfileService } from '@/modules/identity/application/services';

import { CategoryService } from './category.service';

@Injectable()
export class ProductService {
  constructor(
    @Inject(PRODUCT_REPOSITORY)
    private readonly productRepository: IProductRepository,
    private readonly profileService: ProfileService,
    private readonly categoryService: CategoryService,
    private readonly configService: ConfigService,
  ) {}

  private get s3Url(): string {
    return this.configService.get<string>('S3_URL') || '';
  }

  async findAll(user: IReqUser | null) {
    const entities = await this.productRepository.findAll();
    if (!user)
      return entities.map(p =>
        ProductMapper.toResponseUnauthorized(p, this.s3Url),
      );
    return entities.map(p => ProductMapper.toResponse(p, this.s3Url));
  }

  async findById(id: string): Promise<ProductResponse> {
    const entity = await this.productRepository.findOne(id);
    if (!entity) throw new NotFoundException(`Product ${id} not found`);
    return ProductMapper.toResponse(entity, this.s3Url);
  }

  async create(
    user: IReqUser,
    dto: CreateProductRequest,
  ): Promise<ProductResponse> {
    const profile = await this.profileService.getEntityByUserId(user.id);
    if (!profile?.companyId) {
      throw new ForbiddenException('Supplier has no associated company');
    }

    const category = await this.categoryService.findById(dto.categoryId);
    if (!category)
      throw new NotFoundException(`Category ${dto.categoryId} not found`);

    const skuDto = {
      name: profile.company?.name || '',
      price: Number(dto.price),
      manufacturerCode: profile.company?.abbreviation || '',
    };

    const entity = await this.productRepository.create(
      user.id,
      profile.companyId,
      skuDto,
      dto,
    );
    return ProductMapper.toResponse(entity, this.s3Url);
  }

  async update(
    id: string,
    dto: UpdateProductRequest,
    ability: AppAbility,
  ): Promise<ProductResponse> {
    const raw = await this.productRepository.findRaw(id);
    if (!raw) throw new NotFoundException(`Product ${id} not found`);

    if (ability.cannot(ECalsAction.Update, subject('Product', raw))) {
      throw new ForbiddenException('You can only update your own products');
    }

    const entity = await this.productRepository.update(id, dto);
    return ProductMapper.toResponse(entity, this.s3Url);
  }

  async updateStatus(
    id: string,
    status: TProductStatusValues,
    ability: AppAbility,
  ): Promise<ProductResponse> {
    const raw = await this.productRepository.findRaw(id);
    if (!raw) throw new NotFoundException(`Product ${id} not found`);

    if (ability.cannot(ECalsAction.Update, subject('Product', raw))) {
      throw new ForbiddenException('You can only update your own products');
    }

    const entity = await this.productRepository.updateStatus(id, status);
    return ProductMapper.toResponse(entity, this.s3Url);
  }

  async delete(id: string, ability: AppAbility): Promise<void> {
    const raw = await this.productRepository.findRaw(id);
    if (!raw) throw new NotFoundException(`Product ${id} not found`);

    if (ability.cannot(ECalsAction.Delete, subject('Product', raw))) {
      throw new ForbiddenException('You can only delete your own products');
    }

    await this.productRepository.delete(id);
  }
}
