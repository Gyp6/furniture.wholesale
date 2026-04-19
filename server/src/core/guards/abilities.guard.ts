import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { User } from '@prisma/client';

import { CaslAbilityFactory } from '@/infrastructure/casl/casl.ability-factory';

@Injectable()
export class AbilitiesGuard implements CanActivate {
  constructor(private caslAbilityFactory: CaslAbilityFactory) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = await context.switchToHttp().getRequest();

    // Тут юзер приходить з Better Auth (наприклад, через твій AuthGuard)
    const user: User = await request.user;

    if (user) {
      request.ability = this.caslAbilityFactory.createForUser(user);
    }

    return true;
  }
}
