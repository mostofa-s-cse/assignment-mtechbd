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
      // adds validation to all routes
      whitelist: true, // strips away any properties that are not present in the DTO
    }),
  );
  app.setGlobalPrefix('api/v1');
  app.enableCors();
  await app.listen(PORT).then(() => {
    console.log(`
          ####################################
          🔥  Server listening on port: ${PORT} 🔥
          ####################################
    `);
  });
}
bootstrap();
