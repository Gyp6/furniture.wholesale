import type { FastifyCorsOptions } from '@fastify/cors';
import type { CorsOptions } from '@nestjs/common/interfaces/external/cors-options.interface';
import { ConfigService } from '@nestjs/config';

/**
 * Generates CORS configuration for applications using the Express engine.
 * * @description
 * This configuration is compatible with the standard NestJS Express adapter.
 * It uses the underlying `cors` package. The `origin` property is parsed
 * from a comma-separated string provided by the environment variables.
 *
 * @param {ConfigService} configService - NestJS configuration service to retrieve 'HTTP_CORS' environment variable.
 * @returns {CorsOptions} A configuration object compliant with Express CORS middleware.
 * * @example
 * // In main.ts:
 * app.enableCors(getExpressCorsConfig(configService));
 */
export function getExpressCorsConfig(
  configService: ConfigService,
): CorsOptions {
  return {
    origin: configService.getOrThrow<string>('HTTP_CORS').split(','),
    credentials: true,
  };
}

/**
 * Generates CORS configuration for applications using the Fastify engine.
 * * @description
 * This configuration is specifically typed for the `@fastify/cors` plugin used
 * by the `FastifyAdapter`. It addresses strict type differences in the `origin`
 * property (AsyncOriginFunction) where Fastify expects a specific signature
 * compared to Express.
 *
 * @param {ConfigService} configService - NestJS configuration service to retrieve 'HTTP_CORS' environment variable.
 * @returns {FastifyCorsOptions} A configuration object specifically for the Fastify adapter.
 * * @example
 * // In main.ts:
 * app.enableCors(getFastifyCorsConfig(configService));
 */
export function getFastifyCorsConfig(
  configService: ConfigService,
): FastifyCorsOptions {
  return {
    origin: configService.getOrThrow<string>('HTTP_CORS').split(','),
    credentials: true,
    methods: ['GET', 'HEAD', 'PUT', 'PATCH', 'POST', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    exposedHeaders: ['Set-Cookie'],
  };
}
