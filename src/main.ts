import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(
    AppModule,
    // {
    //   // 选择显示哪些日志级别
    //   logger: ['error', 'warn', 'debug']
    // }
  );
  // 全局开启参数校验
  app.useGlobalPipes(new ValidationPipe()) 
  await app.listen(4000);
}
bootstrap();