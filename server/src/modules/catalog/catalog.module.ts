import { Module } from '@nestjs/common';

import { IdentityModule } from '@/modules/identity/identity.module';

import {
  CategoryService,
  DimensionService,
  ProductService,
  TagService,
} from './application/services';
import {
  CATEGORY_REPOSITORY,
  DIMENSION_REPOSITORY,
  PRODUCT_REPOSITORY,
  TAG_REPOSITORY,
} from './domain/contracts';
import {
  CategoryController,
  ProductController,
  TagController,
} from './infrastructure/api';
import { DimensionController } from './infrastructure/api/dimension.controller';
import {
  CategoryRepository,
  DimensionRepository,
  ProductRepository,
  TagRepository,
} from './infrastructure/repositories';

const controllers = [
  CategoryController,
  DimensionController,
  ProductController,
  TagController,
];
const services = [
  CategoryService,
  DimensionService,
  ProductService,
  TagService,
];
const repositories = [
  { provide: CATEGORY_REPOSITORY, useClass: CategoryRepository },
  { provide: DIMENSION_REPOSITORY, useClass: DimensionRepository },
  { provide: PRODUCT_REPOSITORY, useClass: ProductRepository },
  { provide: TAG_REPOSITORY, useClass: TagRepository },
];

@Module({
  imports: [IdentityModule],
  controllers: [...controllers],
  providers: [...repositories, ...services],
  exports: [...repositories, ...services],
})
export class CatalogModule {}
