import { ExecutionContext, Injectable } from '@nestjs/common';
import { ThrottlerGuard } from '@nestjs/throttler';

@Injectable()
export class AppThrottlerGuard extends ThrottlerGuard {
  protected async shouldSkip(context: ExecutionContext): Promise<boolean> {
    const handler = context.getHandler();
    const classRef = context.getClass();

    // In @nestjs/throttler v6, SkipThrottle() sets THROTTLER_SKIP + name metadata.
    // The default name is 'default'. Since developer decorated the handler/class with @SkipThrottle(),
    // they expect it to skip all throttling by default.
    const skipDefault = this.reflector.getAllAndOverride<boolean>(
      'THROTTLER:SKIPdefault',
      [handler, classRef],
    );

    if (skipDefault) {
      return true;
    }

    return false;
  }
}
