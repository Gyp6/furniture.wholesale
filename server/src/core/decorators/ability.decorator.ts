import { createParamDecorator, ExecutionContext } from '@nestjs/common';

export const CurrentAbility = createParamDecorator(
  (data: unknown, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest();
    return request.ability;
  },
);
