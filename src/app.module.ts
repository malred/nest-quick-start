import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { EventsModule } from './events/events.module';
import { ConfigModule } from '@nestjs/config';
import ormConfig from './config/orm.config';
import { TypeOrmModule } from '@nestjs/typeorm';
import ormConfigProd from './config/orm.config.prod';

@Module({
  imports: [
    // 配置这个,可以读取根目录的.env文件
    ConfigModule.forRoot({
      envFilePath: '.env',
      isGlobal: true,
      expandVariables: true,
      load: [ormConfig]
    }),
    TypeOrmModule.forRootAsync({
      useFactory: process.env.NODE_ENV !==
        'production' ? ormConfig : ormConfigProd
    }),
    EventsModule, AuthModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule { }
