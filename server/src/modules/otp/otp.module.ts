import { BullModule } from '@nestjs/bullmq';
import { Module } from '@nestjs/common';

import { RedisModule } from '@/infrastructure/redis/redis.module';

import { OtpService } from './otp.service';

@Module({
  imports: [
    RedisModule,
    BullModule.registerQueue({
      name: 'mail_queue',
    }),
  ],
  providers: [OtpService],
  exports: [OtpService],
})
export class OtpModule {}
