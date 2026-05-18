import {
  type IUserRepository,
  USER_REPOSITORY,
} from '@identity/domain/contracts';
import { Inject, Injectable, Logger } from '@nestjs/common';
import { AuthHookContext } from '@thallesp/nestjs-better-auth';
import { plainToInstance } from 'class-transformer';
import { validate } from 'class-validator';

import { LoginRequest } from '../dto/requests';

@Injectable()
export class LoginService {
  private readonly logger = new Logger(LoginService.name);

  constructor(
    @Inject(USER_REPOSITORY)
    private readonly userRepository: IUserRepository,
  ) {}

  async beforeSignIn(context: AuthHookContext) {
    const body = (context.body ?? {}) as LoginRequest;

    const registrationDto = plainToInstance(LoginRequest, body as object);
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

    const user = await this.userRepository.findByEmail(body.email);

    if (!user) {
      this.logger.warn(`User not found for ${body.email}`);
      throw context.error(400, {
        error: 'Bad Request',
        message: 'Invalid email or password',
        statusCode: 400,
      });
    }

    this.logger.debug(`BeforeHook passed for ${body.email}`);
  }
}
