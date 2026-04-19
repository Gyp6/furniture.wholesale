import { InjectQueue } from '@nestjs/bullmq';
import { BadRequestException, Injectable } from '@nestjs/common';
import { Queue } from 'bullmq';
import { createHash } from 'node:crypto';
import { generateCode } from 'patcode';

import { RedisService } from '@/infrastructure/redis/redis.service';

@Injectable()
export class OtpService {
  constructor(
    private readonly redisService: RedisService,
    @InjectQueue('mail_queue') private mailQueue: Queue,
  ) {}

  async sendCode(email: string) {
    const { code, hash } = this.generateCode();

    await this.redisService.set(`otp:${email}`, hash, 'EX', 300);

    await this.mailQueue.add('send_mail', {
      to: email,
      subject: 'Verification Code',
      html: `<h1>Your code: ${code}</h1>`,
    });
  }

  async verify(email: string, code: string) {
    const storedHash = await this.redisService.get(`otp:${email}`);

    if (!storedHash) throw new BadRequestException('Invalid or expired code');

    const incomingHash = createHash('sha256').update(code).digest('hex');

    if (storedHash !== incomingHash)
      throw new BadRequestException('Invalid or expired code');

    await this.redisService.del(`otp:${email}`);

    // return true;
  }

  private generateCode() {
    const code = generateCode();
    const hash = createHash('sha256').update(code).digest('hex');

    return { code, hash };
  }
}
