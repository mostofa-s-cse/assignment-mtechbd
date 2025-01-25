import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ConfigService } from '@nestjs/config';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const configService = app.get(ConfigService);
  const PORT = configService.get('PORT');

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true, 
    }),
  );

  app.setGlobalPrefix('api/v1');

  // Customize CORS settings
  app.enableCors({
    origin: 'http://localhost:3000', // Allow requests from your frontend
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE', // Allowed methods
    credentials: true, // Allow credentials (cookies, authorization headers, etc.)
  });

  await app.listen(PORT).then(() => {
    console.log(`
          ####################################
          🔥  Server listening on port: ${PORT} 🔥
          ####################################
    `);
  });
}
bootstrap();