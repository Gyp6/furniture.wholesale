import { Module } from '@nestjs/common';

import { IdentityModule } from '@/modules/identity/identity.module';

import {
  CategoryService,
  DimensionService,
  ProductService,
  SpaceService,
  TagService,
} from './application/services';
import {
  CATEGORY_REPOSITORY,
  DIMENSION_REPOSITORY,
  PRODUCT_REPOSITORY,
  SPACE_REPOSITORY,
  TAG_REPOSITORY,
} from './domain/contracts';
import {
  CategoryController,
  DimensionController,
  ProductController,
  SpaceController,
  TagController,
} from './infrastructure/api';
import {
  CategoryRepository,
  DimensionRepository,
  ProductRepository,
  SpaceRepository,
  TagRepository,
} from './infrastructure/repositories';

const controllers = [
  CategoryController,
  DimensionController,
  ProductController,
  SpaceController,
  TagController,
];
const services = [
  CategoryService,
  DimensionService,
  ProductService,
  SpaceService,
  TagService,
];
const repositories = [
  { provide: CATEGORY_REPOSITORY, useClass: CategoryRepository },
  { provide: DIMENSION_REPOSITORY, useClass: DimensionRepository },
  { provide: PRODUCT_REPOSITORY, useClass: ProductRepository },
  { provide: SPACE_REPOSITORY, useClass: SpaceRepository },
  { provide: TAG_REPOSITORY, useClass: TagRepository },
];

@Module({
  imports: [IdentityModule],
  controllers: [...controllers],
  providers: [...repositories, ...services],
  exports: [...repositories, ...services],
})
export class CatalogModule {}
