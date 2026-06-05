// src/core/infrastructure/plugins/logging.plugin.ts
import { Logger } from '@nestjs/common';
import { FastifyInstance, FastifyReply, FastifyRequest } from 'fastify';

export const LoggingPlugin = async (fastify: FastifyInstance) => {
  const logger = new Logger(LoggingPlugin.name);

  // 1. Коли запит тільки прилітає — засікаємо час початку (на самому старті)
  fastify.addHook('onRequest', async (request: FastifyRequest) => {
    // Ховаємо час старту в raw-об'єкт запиту, щоб Fastify його не затер
    (request.raw as any).startTime = Date.now();
  });

  // 2. Коли запит повністю завершено і відправлено клієнту — рахуємо час і логуємо
  fastify.addHook(
    'onResponse',
    async (request: FastifyRequest, reply: FastifyReply) => {
      const { method, url } = request;

      // Дістаємо наш час старту
      const startTime = (request.raw as any).startTime;

      // Якщо раптом запит пройшов повз onRequest (фантастика, але про всяк випадок) — робимо fallback
      const responseTime = startTime ? Date.now() - startTime : 0;

      if (reply.statusCode >= 400) {
        logger.error(
          `${method} ${url} ${responseTime}ms [Status: ${reply.statusCode}]`,
        );
      } else {
        logger.log(`${method} ${url} ${responseTime}ms`);
      }
    },
  );
};
