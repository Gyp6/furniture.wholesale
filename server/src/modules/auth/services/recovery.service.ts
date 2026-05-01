import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { AuthHookContext } from '@thallesp/nestjs-better-auth';

import { MailService } from '@/infrastructure/mail/mail.service';
import { PrismaService } from '@/infrastructure/prisma/prisma.service';

@Injectable()
export class RecoveryService {
  private readonly logger = new Logger(RecoveryService.name);

  constructor(
    private readonly prismaService: PrismaService,
    private readonly mailService: MailService,
    private readonly configService: ConfigService,
  ) {}

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

    // this.mailQueue
    //   .add('send_mail', {
    //     to: email,
    //     subject: 'Reset Your Password',
    //     html: `
    //   <h1>Password Reset</h1>
    //   <p>Click the link below to reset your password:</p>
    //   <a href="${this.configService.getOrThrow('FRONTEND_URL')}/auth/reset-password?token=${verificationData.value}">
    //     Reset Password
    //   </a>
    // `,
    //   })
    //   .catch(err =>
    //     this.logger.error(`Failed to queue reset email: ${err.message}`),
    //   );

    await this.mailService.sendResetPassword(email as string, url);

    this.logger.log(`Password reset link sent to ${email}`);
  }
}
