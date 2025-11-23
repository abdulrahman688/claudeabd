import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from '@/entities/user.entity';
import { Profile } from '@/entities/profile.entity';
import { Wallet } from '@/entities/wallet.entity';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { JwtStrategy } from './strategies/jwt.strategy';
import { EmailModule } from '../email/email.module';
import { SmsModule } from '../sms/sms.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([User, Profile, Wallet]),
    PassportModule.register({ defaultStrategy: 'jwt' }),
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        secret: configService.get('JWT_SECRET', 'sham_secret_key_change_in_production'),
        signOptions: {
          expiresIn: configService.get('JWT_EXPIRES_IN', '7d'),
        },
      }),
    }),
    EmailModule,
    SmsModule,
  ],
  controllers: [AuthController],
  providers: [AuthService, JwtStrategy],
  exports: [AuthService, JwtStrategy, PassportModule],
})
export class AuthModule {}
