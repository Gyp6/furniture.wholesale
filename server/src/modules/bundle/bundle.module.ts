import { Module } from '@nestjs/common';

import { BundleService } from './application/services';
import { BUNDLE_REPOSITORY } from './domain/contracts';
import { BundleController } from './infrastructure/api';
import { BundleRepository } from './infrastructure/repositories';

const controllers = [BundleController];
const services = [BundleService];
const repositories = [
  { provide: BUNDLE_REPOSITORY, useClass: BundleRepository },
];

@Module({
  imports: [],
  controllers: [...controllers],
  providers: [...repositories, ...services],
  exports: [...repositories, ...services],
})
export class BundleModule {}
