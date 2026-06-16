import { Module } from '@nestjs/common';

import { BundleModule } from '@/modules/bundle/bundle.module';
import { CatalogModule } from '@/modules/catalog/catalog.module';

import { OrderService } from './application/services/order.service';
import { ORDER_REPOSITORY } from './domain/contracts/order.contract';
import { OrderController } from './infrastructure/api/order.controller';
import { OrderRepository } from './infrastructure/repositories/order.repository';

const controllers = [OrderController];
const services = [OrderService];
const repositories = [{ provide: ORDER_REPOSITORY, useClass: OrderRepository }];

@Module({
  imports: [CatalogModule, BundleModule],
  controllers: [...controllers],
  providers: [...repositories, ...services],
  exports: [...repositories, ...services],
})
export class OrderModule {}
