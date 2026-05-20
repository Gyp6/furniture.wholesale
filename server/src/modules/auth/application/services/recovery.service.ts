import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { AuthHookContext } from '@thallesp/nestjs-better-auth';
import { plainToInstance } from 'class-transformer';
import { validate } from 'class-validator';

import { MailService } from '@/infrastructure/mail/mail.service';
import { PrismaService } from '@/infrastructure/prisma/prisma.service';

import { ResetPasswordRequest } from '../dto/requests';

@Injectable()
export class RecoveryService {
  private readonly logger = new Logger(RecoveryService.name);

  constructor(
    private readonly prismaService: PrismaService,
    private readonly mailService: MailService,
    private readonly configService: ConfigService,
  ) {}

  async beforeResetPassword(context: AuthHookContext) {
    const body = (context.body ?? {}) as ResetPasswordRequest;

    const registrationDto = plainToInstance(
      ResetPasswordRequest,
      body as object,
    );
    const errors = await validate(registrationDto, {
      whitelist: true,
      forbidNonWhitelisted: false,
    });

    if (errors.length > 0) {
      const messages = errors
        .map(err => Object.values(err.constraints || {}))
        .flat();
      this.logger.warn(`Validation failed ${messages.join(', ')}`);
      throw context.error(400, {
        error: 'Bad Request',
        message: messages.join(', '),
        statusCode: 400,
      });
    }
  }

  async sendLink(context: AuthHookContext) {
    const body = context.body;
    const email = body.email;

    const verificationData = await this.prismaService.verification.findFirst({
      where: {
        identifier: email,
      },
      orderBy: { createdAt: 'desc' },
    });

    if (!verificationData) return;

    const url = `${this.configService.getOrThrow('FRONTEND_URL')}/auth/reset-password?token=${verificationData.value}`;

    await this.mailService.sendResetPassword(email as string, url);

    this.logger.log(`Password reset link sent to ${email}`);
  }
}
