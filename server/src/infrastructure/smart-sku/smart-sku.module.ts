import { Global, Module } from '@nestjs/common';

import { SmartSkuService } from './smart-sku.service';

@Global()
@Module({
  providers: [SmartSkuService],
  exports: [SmartSkuService],
})
export class SmartSkuModule {}
