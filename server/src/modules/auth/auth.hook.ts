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
  async afterSignUp(context: AuthHookContext) {
    const { body } = context;

    this.logger.debug('=== AFTER HOOK DEBUG ===');
    this.logger.debug('Body:', body);

    if (!body.email) {
      this.logger.warn('AfterHook: No email in body');
      return;
    }
    this.logger.debug('CompanyName:', body.companyName);
    this.logger.debug('TaxId:', body.taxId);
    this.logger.debug('User Type:', body.type);

    this.logger.debug('AfterHook body:', body);

    const user = await this.userRepository.findByEmail(body.email as string);

    if (!user) {
      this.logger.warn('AfterHook: Missing user');
      return;
    }
    if (!body.companyName) {
      this.logger.warn('AfterHook: Missing company name');
      return;
    }
    if (!body.taxId) {
      this.logger.warn('AfterHook: Missing tax ID');
      return;
    }

    try {
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

      this.logger.log(
        `[Success] User ${user.email} registered and linked to company ${body.taxId}`,
      );
    } catch (err) {
      const message = err instanceof Error ? err.message : String(err);
      this.logger.error(`[AfterHook Error] ${message}`);
    }
  }
}
