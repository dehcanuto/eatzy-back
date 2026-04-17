import { NestFactory } from '@nestjs/core';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const config = new DocumentBuilder()
    .setTitle('Eatzy API')
    .setDescription('API documentation for Eatzy backend')
    .setVersion('1.0')
    .addTag('eatzy')
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);

  await app.listen(process.env.PORT ?? 3000);
  console.log(
    `🚀 Swagger rodando em http://localhost:${process.env.PORT ?? 3000}/api`,
  );
}
bootstrap();
