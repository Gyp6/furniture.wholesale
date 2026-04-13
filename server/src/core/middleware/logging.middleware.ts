import { Injectable, NestMiddleware, Logger } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';

@Injectable()
export class LoggingMiddleware implements NestMiddleware {
  private logger = new Logger('HTTP');

  use(req: Request, res: Response, next: NextFunction) {
    const { method, originalUrl } = req;
    const now = Date.now();

    // Ми підписуємося на подію 'finish', яка спрацює, коли відповідь буде повністю відправлена клієнту
    res.on('finish', () => {
      const { statusCode } = res;
      const delay = Date.now() - now;
      const message = `${method} ${originalUrl} ${statusCode} ${delay}ms`;

      if (statusCode >= 400) {
        this.logger.error(message);
      } else {
        this.logger.log(message);
      }
    });

    next();
  }
}