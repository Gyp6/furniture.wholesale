import { Injectable, Logger } from '@nestjs/common';
import {
  AfterHook,
  type AuthHookContext,
  BeforeHook,
  Hook,
} from '@thallesp/nestjs-better-auth';
import { plainToInstance } from 'class-transformer';
import { validate } from 'class-validator';

import { PrismaService } from '@/infrastructure/prisma/prisma.service';
import { CompanyRepository } from '@/modules/company/company.repository';
import { OtpService } from '@/modules/otp/otp.service';
import { UserRepository } from '@/modules/user/user.repository';

import { RegisterRetailerRequest } from './dto/requests';

@Injectable()
@Hook()
export class AuthHook {
  private readonly logger = new Logger(AuthHook.name);

  constructor(
    private readonly prisma: PrismaService,
    private readonly userRepository: UserRepository,
    private readonly companyRepository: CompanyRepository,
    private readonly otp: OtpService,
  ) {}

  @BeforeHook('/sign-up/email')
  async beforeSignUp(context: AuthHookContext) {
    const { body } = context;

    const registrationDto = plainToInstance(RegisterRetailerRequest, body);
    const errors = await validate(registrationDto, {
      whitelist: true,
      forbidNonWhitelisted: false,
    });

    if (errors.length > 0) {
      const messages = errors
        .map(err => Object.values(err.constraints || {}))
        .flat();
      this.logger.warn(
        `Validation failed for ${body.email}: ${messages.join(', ')}`,
      );
      throw context.error(400, {
        error: 'Bad Request',
        message: messages.join(', '),
        statusCode: 400,
      });
    }

    this.logger.debug(`BeforeHook passed for ${body.email}`);
  }

  @AfterHook('/sign-up/email')
  afterSignUp(context: AuthHookContext) {
    const { body } = context;

    const email = body.email as string;

    if (!email || !body.companyName || !body.taxId) return;

    this.handlePostRegistration(email, body).catch(err =>
      this.logger.error(`Background task failed: ${err.message}`),
    );

    this.logger.log(`Registration handoff successful for ${email}`);
  }

  private async handlePostRegistration(email: string, body: any) {
    const user = await this.userRepository.findByEmail(email);
    if (!user) return;

    await this.prisma.$transaction(async tx => {
      const company = await this.companyRepository.create(
        {
          name: body.companyName,
          taxId: body.taxId,
        },
        tx,
      );

      await this.userRepository.updateById(
        user.id,
        {
          company: { connect: { id: company.id } },
          role: body.type || 'RETAILER',
        },
        tx,
      );

      await this.otp.sendCode(user.email);
    });
  }
}
