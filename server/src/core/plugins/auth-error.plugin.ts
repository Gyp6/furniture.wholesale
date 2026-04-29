// auth-error.plugin.ts
import { FastifyPluginAsync } from 'fastify';
import fp from 'fastify-plugin';

import { authErrorConfig } from '../config/auth-error.config';

const authErrorPlugin: FastifyPluginAsync = async fastify => {
  fastify.addHook('onRequest', async (request, reply) => {
    if (!request.url.startsWith('/api/auth')) return;

    const raw = reply.raw;
    let chunks: Buffer[] = [];
    const originalWrite = raw.write.bind(raw);
    const originalEnd = raw.end.bind(raw);

    // Перехоплюємо write
    (raw as any).write = (chunk: any, ...args: any[]) => {
      chunks.push(Buffer.isBuffer(chunk) ? chunk : Buffer.from(chunk));
      return true;
    };

    // Перехоплюємо end — тут маємо повний payload
    (raw as any).end = (chunk?: any, ...args: any[]) => {
      if (chunk) {
        chunks.push(Buffer.isBuffer(chunk) ? chunk : Buffer.from(chunk));
      }

      const fullPayload = Buffer.concat(chunks).toString('utf-8');

      try {
        const body = JSON.parse(fullPayload);
        const mapped = body?.code
          ? authErrorConfig[body.code as keyof typeof authErrorConfig]
          : null;

        if (mapped) {
          const newBody = JSON.stringify({
            statusCode: mapped.statusCode,
            message: mapped.message,
            code: body.code,
          });

          raw.writeHead(mapped.statusCode, {
            'Content-Type': 'application/json',
            'Content-Length': Buffer.byteLength(newBody),
          });
          return originalEnd(newBody);
        }
      } catch {
        // не JSON
      }

      // Без змін — відправляємо оригінал
      return originalEnd(fullPayload);
    };
  });
};

export const AuthErrorPlugin = fp(authErrorPlugin);
