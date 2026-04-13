// interceptors/logging.interceptor.ts
import {
  CallHandler,
  ExecutionContext,
  Injectable,
  Logger,
  NestInterceptor,
} from '@nestjs/common';
import { tap } from 'rxjs/operators';

@Injectable()
export class LoggingInterceptor implements NestInterceptor {
  private logger = new Logger('HTTP');

  intercept(context: ExecutionContext, next: CallHandler) {
    const req = context.switchToHttp().getRequest();
    const { method, url } = req;
    const now = Date.now();

    return next.handle().pipe(
      tap({
        // Спрацює, якщо запит успішний (2xx)
        next: () => {
          this.logger.log(`${method} ${url} ${Date.now() - now}ms`);
        },
        // Спрацює, якщо сталася помилка (4xx, 5xx)
        error: (err) => {
          this.logger.error(
            `${method} ${url} ${Date.now() - now}ms [Error: ${err.message}]`,
          );
        },
      }),
    );
  }
}
