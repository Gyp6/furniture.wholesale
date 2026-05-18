import { Inject, Injectable, Logger } from '@nestjs/common';
import { type AuthHookContext } from '@thallesp/nestjs-better-auth';
import { plainToInstance } from 'class-transformer';
import { validate } from 'class-validator';

import { PrismaService } from '@/infrastructure/prisma/prisma.service';
import {
  COMPANY_REPOSITORY,
  type ICompanyRepository,
  type IProfileRepository,
  PROFILE_REPOSITORY,
} from '@/modules/identity/domain/contracts';
import { OtpService } from '@/modules/otp/otp.service';

import { RegisterRequest } from '../dto/requests';

@Injectable()
export class RegisterService {
  private readonly logger = new Logger(RegisterService.name);

  constructor(
    private readonly prismaService: PrismaService,
    private readonly otpService: OtpService,
    @Inject(COMPANY_REPOSITORY)
    private readonly companyRepository: ICompanyRepository,
    @Inject(PROFILE_REPOSITORY)
    private readonly profileRepository: IProfileRepository,
  ) {}

  async beforeSignUp(context: AuthHookContext) {
    const body = (context.body ?? {}) as RegisterRequest;

    const registrationDto = plainToInstance(RegisterRequest, body as object);
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

  afterSignUp(context: AuthHookContext) {
    const body = context.body as RegisterRequest;
    const user = (context.context as any)?.newSession?.user;

    if (!user) {
      this.logger.warn('afterSignUp: user not found in context');
      return;
    }

    this.handleBackgroundRegisterTask(user, body).catch(err =>
      this.logger.error(`Background task failed: ${err.message}`),
    );

    this.logger.log(`Registration handoff successful for ${user.email}`);
  }

  private async handleBackgroundRegisterTask(
    user: { id: string; email: string },
    body: RegisterRequest,
  ) {
    await this.prismaService.$transaction(async tx => {
      let company = await this.companyRepository.findByTaxId(body.taxId, tx);

      if (!company) {
        company = await this.companyRepository.create(
          { name: body.companyName, taxId: body.taxId },
          tx,
        );
      }

      await this.profileRepository.create(
        {
          user: { connect: { id: user.id } },
          company: { connect: { id: company.id } },
          specializations: body.specialisations,
        },
        tx,
      );
    });

    await this.otpService.sendCode(user.email);
  }
}
