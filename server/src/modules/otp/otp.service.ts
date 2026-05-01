import { BadRequestException, Injectable } from '@nestjs/common';
import { createHash } from 'node:crypto';
import { generateCode } from 'patcode';

import { MailService } from '@/infrastructure/mail/mail.service';
import { RedisService } from '@/infrastructure/redis/redis.service';

@Injectable()
export class OtpService {
  constructor(
    private readonly redisService: RedisService,
    private readonly mailService: MailService,
  ) {}

  async sendCode(email: string) {
    const { code, hash } = this.generateCode();

    await this.redisService.set(`otp:${email}`, hash, 'EX', 300);
    await this.mailService.sendVerifyEmail(email, code);
  }

  async verify(email: string, code: string) {
    const storedHash = await this.redisService.get(`otp:${email}`);

    if (!storedHash) throw new BadRequestException('Invalid or expired code');

    const incomingHash = createHash('sha256').update(code).digest('hex');

    if (storedHash !== incomingHash)
      throw new BadRequestException('Invalid or expired code');

    await this.redisService.del(`otp:${email}`);
  }

  private generateCode() {
    const code = generateCode();
    const hash = createHash('sha256').update(code).digest('hex');

    return { code, hash };
  }
}
