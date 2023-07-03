import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { User } from './user.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { JwtModule } from "@nestjs/jwt";
import { JwtStrategy } from './auth.strategy';
import { LocalStrategy } from './local.strategy';
import { UsersController } from './user.controller';

@Module({
  imports: [
    TypeOrmModule.forFeature([User]),
    JwtModule.registerAsync({ // 异步创建,防止环境变量在module创建时还无法读取
      useFactory: () => ({
        secret: process.env.AUTH_SECRET, // JWT密码(放到.env)
        signOptions: {
          expiresIn: '60m' // 60min后过期
        }
      })
    })
  ],
  providers: [LocalStrategy, JwtStrategy, AuthService],
  controllers: [AuthController, UsersController]
})
export class AuthModule { }
