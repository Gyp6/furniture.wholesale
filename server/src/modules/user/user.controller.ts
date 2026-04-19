import { Controller, Get, Req } from '@nestjs/common';

import { CurrentAbility } from '@/core/decorators';
import { type AppAbility } from '@/infrastructure/casl/casl.ability-factory';

import { UserService } from './user.service';

@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get('me')
  async getMe(@Req() req, @CurrentAbility() ability: AppAbility) {
    const userId: string = await req.user.id;

    return await this.userService.getProfile(userId, ability);
  }
}
