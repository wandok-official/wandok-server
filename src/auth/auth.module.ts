import { Module } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';
import { JwtModule, JwtModuleOptions } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { AuthController } from './auth.controller.js';
import { JwtStrategy } from './strategies/jwt.strategy.js';
import { UsersModule } from '../users/users.module.js';

@Module({
  imports: [
    PassportModule,
    JwtModule.registerAsync({
      inject: [ConfigService],
      useFactory: (configService: ConfigService): JwtModuleOptions => {
        const secret = configService.get<string>('JWT_SECRET');
        const expiresIn = configService.get<string>('JWT_EXPIRATION');

        if (!secret) {
          throw new Error(
            'JWT_SECRET is not defined in environment variables. ' +
              'Please set JWT_SECRET in your .env file.'
          );
        }

        if (!expiresIn) {
          throw new Error(
            'JWT_EXPIRATION is not defined in environment variables. ' +
              'Please set JWT_EXPIRATION in your .env file (e.g., "7d", "24h").'
          );
        }

        return {
          secret,
          signOptions: { expiresIn },
        } as JwtModuleOptions;
      },
    }),
    UsersModule,
  ],
  controllers: [AuthController],
  providers: [JwtStrategy],
  exports: [JwtModule],
})
export class AuthModule {}
