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
import { S3Service } from '@/infrastructure/s3/s3.service';
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
    private readonly s3Service: S3Service,
  ) {}

  private get s3Url(): string {
    return this.configService.get<string>('S3_URL') || '';
  }

  private async processProductImages(
    sku: string,
    images: string[],
  ): Promise<void> {
    const tempPrefix = `catalog/product/${sku}/temp`;
    const finalPrefix = `catalog/product/${sku}`;

    // Phase 1: Copy all source files to temporary files temp_i.png
    const sourceKeys: string[] = [];
    for (let i = 0; i < images.length; i++) {
      const img = images[i];
      let sourceKey = '';

      if (img.startsWith('http://') || img.startsWith('https://')) {
        // Parse key from URL. Example: http://localhost:4566/furniture-wholesale-bucket/catalog/product/GYP6-xxx/0.png
        const match = img.match(/catalog\/product\/[^/]+\/\d+\.png/);
        if (match) {
          sourceKey = match[0];
        }
      } else if (img.startsWith('products/')) {
        sourceKey = img;
      }

      if (sourceKey) {
        sourceKeys.push(sourceKey);
        const tempKey = `${tempPrefix}_${i}.png`;
        try {
          await this.s3Service.copyObject(sourceKey, tempKey);
        } catch (error) {
          console.error(
            `Failed to copy to temp: ${sourceKey} -> ${tempKey}`,
            error,
          );
        }
      } else {
        sourceKeys.push('');
      }
    }

    // Phase 2: Delete existing files at catalog/product/sku/i.png (from 0 to 15)
    for (let i = 0; i < 16; i++) {
      const keyToDelete = `${finalPrefix}/${i}.png`;
      try {
        await this.s3Service.deleteObject(keyToDelete);
      } catch (error) {
        console.log(error || `Failed to delete ${keyToDelete}`);
      }
    }

    // Phase 3: Move temp files to their final destination finalPrefix/i.png and cleanup
    for (let i = 0; i < images.length; i++) {
      const tempKey = `${tempPrefix}_${i}.png`;
      const finalKey = `${finalPrefix}/${i}.png`;
      const sourceKey = sourceKeys[i];

      if (sourceKey) {
        try {
          // Copy temp file to final destination
          await this.s3Service.copyObject(tempKey, finalKey);
          // Delete temp file
          await this.s3Service.deleteObject(tempKey);

          // If the original source was a temporary upload (products/...), delete it as well
          if (sourceKey.startsWith('products/')) {
            await this.s3Service.deleteObject(sourceKey);
          }
        } catch (error) {
          console.error(`Failed to finalize image ${i}:`, error);
        }
      }
    }
  }

  async findAll(user: IReqUser | null) {
    const entities = await this.productRepository.findAll();
    if (!user)
      return entities.map(p =>
        ProductMapper.toResponseUnauthorized(p, this.s3Url),
      );
    return entities.map(p => ProductMapper.toResponse(p, this.s3Url));
  }

  async findMyProducts(userId: string): Promise<ProductResponse[]> {
    const entities = await this.productRepository.findBySupplier(userId);
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

    if (!profile.company) {
      throw new ForbiddenException('Supplier company details not found');
    }

    const category = await this.categoryService.findById(dto.categoryId);
    if (!category)
      throw new NotFoundException(`Category ${dto.categoryId} not found`);

    const skuDto = {
      name: profile.company.name || '',
      price: Number(dto.price),
      manufacturerCode: profile.company.abbreviation || '',
    };

    const entity = await this.productRepository.create(
      user.id,
      profile.companyId,
      skuDto,
      dto,
    );
    if (dto.images && dto.images.length > 0) {
      await this.processProductImages(entity.sku, dto.images);
    }
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
    if (dto.images) {
      await this.processProductImages(entity.sku, dto.images);
    }
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
