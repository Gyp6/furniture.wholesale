import { Module } from '@nestjs/common';

import { IdentityModule } from '@/modules/identity/identity.module';

import {
  CategoryService,
  ProductService,
  TagService,
} from './application/services';
import {
  CATEGORY_REPOSITORY,
  PRODUCT_REPOSITORY,
  TAG_REPOSITORY,
} from './domain/contracts';
import {
  CategoryController,
  ProductController,
  TagController,
} from './infrastructure/api';
import {
  CategoryRepository,
  ProductRepository,
  TagRepository,
} from './infrastructure/repositories';

const controllers = [ProductController, CategoryController, TagController];
const services = [ProductService, CategoryService, TagService];
const repositories = [
  { provide: PRODUCT_REPOSITORY, useClass: ProductRepository },
  { provide: CATEGORY_REPOSITORY, useClass: CategoryRepository },
  { provide: TAG_REPOSITORY, useClass: TagRepository },
];

@Module({
  imports: [IdentityModule],
  controllers: [...controllers],
  providers: [...repositories, ...services],
  exports: [...repositories, ...services],
})
export class CatalogModule {}
