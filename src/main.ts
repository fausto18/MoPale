import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { AppModule } from './app.module';
import { setupSwagger } from './config/swagger.config';
import { join } from 'path';
import * as express from 'express';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // ✅ Habilita CORS para seu frontend
  app.enableCors({
    //origin: 'http://', // porta do seu frontend
    credentials: true,
  });

  // ✅ Validação global
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
      transformOptions: {
      enableImplicitConversion: true,
  },
    }),
  );

  // ✅ Configura Swagger
  setupSwagger(app);

  // ✅ Servir arquivos da pasta uploads
  app.use('/uploads', express.static(join(__dirname, '..', 'uploads')));

  await app.listen(3000);
  console.log(`Aplicação rodando em: http://127.0.0.1:3000`);
}
bootstrap();
