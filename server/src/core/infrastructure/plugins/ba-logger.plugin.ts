import { Logger } from '@nestjs/common';

export const betterAuthLoggingPlugin = () => {
  const logger = new Logger('BetterAuth');
  console.log('hui');
  // Зберігаємо час старту запиту
  const requestTimers = new Map<
    string,
    { start: number; method: string; url: string }
  >();

  return {
    id: 'better-auth-logger',
    // Спрацьовує на самому початку
    onRequest: async (request: Request) => {
      const logId = crypto.randomUUID();
      request.headers.set('x-ba-log-id', logId);

      requestTimers.set(logId, {
        start: Date.now(),
        method: request.method,
        url: new URL(request.url).pathname, // Витягуємо тільки шлях (напр. /api/v1/auth/sign-up)
      });

      return undefined;
    },
    // Спрацьовує перед самою відправкою відповіді
    onResponse: async (response: Response, context: any) => {
      const logId = context.request?.headers.get('x-ba-log-id');

      if (logId && requestTimers.has(logId)) {
        const { start, method, url } = requestTimers.get(logId)!;
        const time = Date.now() - start;

        if (response.status >= 400) {
          logger.error(
            `${method} ${url} ${time}ms [Status: ${response.status}]`,
          );
        } else {
          logger.log(`${method} ${url} ${time}ms`);
        }

        // Очищаємо пам'ять
        requestTimers.delete(logId);
      }

      return undefined;
    },
  };
};
