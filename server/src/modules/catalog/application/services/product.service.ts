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

import { STATUS } from '@/common/constants';
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
  ) {}

  async findAll() {
    const entities = await this.productRepository.findAll();
    const data = entities.map(p => ProductMapper.toResponse(p));

    return {
      status: STATUS.OK,
      quantity: data.length,
      data,
    };
  }

  async findById(id: string): Promise<ProductResponse> {
    const entity = await this.productRepository.findOne(id);
    if (!entity) throw new NotFoundException(`Product ${id} not found`);
    return ProductMapper.toResponse(entity);
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

    const entity = await this.productRepository.create(
      user.id,
      profile.companyId,
      dto,
    );
    return ProductMapper.toResponse(entity);
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
    return ProductMapper.toResponse(entity);
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
    return ProductMapper.toResponse(entity);
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
