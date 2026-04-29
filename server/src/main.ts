import { Logger, ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import {
  FastifyAdapter,
  NestFastifyApplication,
} from '@nestjs/platform-fastify';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { useContainer } from 'class-validator';

import { AppModule } from './core/app.module';
import { getFastifyCorsConfig, getValidationPipeConfig } from './core/config';
import { getExcludedRoutesConfig } from './core/config/excluded-routing.config';
import { LoggingInterceptor } from './core/interceptors';

async function bootstrap() {
  const adapter = new FastifyAdapter({
    logger: true,
  });

  const app = await NestFactory.create<NestFastifyApplication>(
    AppModule,
    adapter,
    { bodyParser: false },
  );

  const config = app.get(ConfigService);
  const logger = new Logger();

  useContainer(app.select(AppModule), { fallbackOnErrors: true });

  app.setGlobalPrefix('api');
  app.useGlobalPipes(new ValidationPipe(getValidationPipeConfig()));
  app.useGlobalInterceptors(new LoggingInterceptor());
  app.enableCors(getFastifyCorsConfig(config));

  getExcludedRoutesConfig(app);

  const swaggerConfig = new DocumentBuilder()
    .setTitle('@Gyp6.sale - Furniture.Wholesale API')
    .setDescription('API Backend for Furniture.Wholesale')
    .setVersion('1.0.0')
    .addBearerAuth()
    .build();

  const swaggerDocument = SwaggerModule.createDocument(app, swaggerConfig);
  SwaggerModule.setup('docs', app, swaggerDocument, {
    jsonDocumentUrl: 'swagger.json',
    yamlDocumentUrl: '/openapi.yaml',
  });

  const port = config.getOrThrow<number>('HTTP_PORT');
  const host = config.getOrThrow<string>('HTTP_HOST');

  await app.listen(port);

  logger.log(`Backend started: ${host}/api`);
  logger.log(`Swagger: ${host}/docs`);
}

bootstrap().catch(err => {
  new Logger('Bootstrap').error(err);
  process.exit(1);
});
