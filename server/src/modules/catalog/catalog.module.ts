import { Module } from '@nestjs/common';

import { IdentityModule } from '@/modules/identity/identity.module';

import { CategoryService, ProductService } from './application/services';
import { CATEGORY_REPOSITORY, PRODUCT_REPOSITORY } from './domain/contracts';
import { CategoryController, ProductController } from './infrastructure/api';
import {
  CategoryRepository,
  ProductRepository,
} from './infrastructure/repositories';

const controllers = [ProductController, CategoryController];
const services = [ProductService, CategoryService];
const repositories = [
  { provide: PRODUCT_REPOSITORY, useClass: ProductRepository },
  { provide: CATEGORY_REPOSITORY, useClass: CategoryRepository },
];

@Module({
  imports: [IdentityModule],
  controllers: [...controllers],
  providers: [...repositories, ...services],
  exports: [...repositories, ...services],
})
export class CatalogModule {}
