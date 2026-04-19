import { InjectQueue } from '@nestjs/bullmq';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { Queue } from 'bullmq';

@Injectable()
export class RecoveryService {
  constructor(
    private readonly jwtService: JwtService,
    @InjectQueue('mail_queue') private readonly mailQueue: Queue,
    private readonly configService: ConfigService,
  ) {}

  async sendLink(email: string, userId: string) {
    const token = this.jwtService.sign(
      { sub: userId, type: 'recovery' },
      { expiresIn: '15m' },
    );
    const url = `${this.configService.get('FRONTEND_URL')}/reset-password?token=${token}`;

    await this.mailQueue.add('send_mail', {
      to: email,
      subject: 'Recovery Password Link',
      html: `<p>Click <a href="${url}">here</a> to reset your password.</p>`,
    });
  }
}
