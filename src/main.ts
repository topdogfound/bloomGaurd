import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import 'reflect-metadata';
import { ValidationPipe, VersioningType } from '@nestjs/common';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import * as dotenv from 'dotenv';
import { Request, Response } from 'express';

dotenv.config();

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors();
  app.getHttpAdapter().get('/', (req: Request, res: Response) => {
    res.send('App is running');
  });
  app.useGlobalPipes(new ValidationPipe());
  app.setGlobalPrefix('api');
  app.enableVersioning({
    type: VersioningType.URI, // URI versioning: /v1/users
    defaultVersion: '1',
  });

  const config = new DocumentBuilder()
    .setTitle('Bloom Guard API')
    .setDescription('The Bloom Guard API description')
    .setVersion('1.0')
    // .addTag('Bloom Guard')
    .build();
  const documentFactory = () => SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, documentFactory);

  const port = process.env.PORT ?? 3000;
  const host = process.env.HOST ?? '0.0.0.0';

  await app.listen(port, host);

  // Determine domain dynamically
  const isRailway = process.env.RAILWAY_STATIC_URL !== undefined;
  const domain = isRailway
    ? `https://${process.env.RAILWAY_STATIC_URL}`
    : `http://localhost:${port}`;

  console.log(`🚀 App running on ${domain}`);
}
void bootstrap();
