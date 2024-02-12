import { NestFactory } from '@nestjs/core';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import * as express from 'express';
import * as path from 'path';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    cors: true,
  });
  // Serve static files from the 'uploads' directory
  app.use('/uploads', express.static(path.join(__dirname, '..', 'uploads')));
  const config = new DocumentBuilder()
    .setTitle('FinSight API')
    .setDescription('The backend api to connect with the FinSight app')
    .setVersion('1.0')
    .addTag('finSight')
    .addBearerAuth()
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);
  app.useGlobalPipes(new ValidationPipe());
  await app.listen(3001);
}
bootstrap();
