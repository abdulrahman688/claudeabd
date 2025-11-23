import {
  Injectable,
  UnauthorizedException,
  ConflictException,
  BadRequestException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as speakeasy from 'speakeasy';
import * as QRCode from 'qrcode';
import * as crypto from 'crypto';
import { User } from '@/entities/user.entity';
import { Profile } from '@/entities/profile.entity';
import { Wallet } from '@/entities/wallet.entity';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { EmailService } from '../email/email.service';
import { SmsService } from '../sms/sms.service';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
    @InjectRepository(Profile)
    private profileRepository: Repository<Profile>,
    @InjectRepository(Wallet)
    private walletRepository: Repository<Wallet>,
    private jwtService: JwtService,
    private emailService: EmailService,
    private smsService: SmsService,
  ) {}

  async register(registerDto: RegisterDto) {
    const { email, password, firstName, lastName, phone, role, type, country } = registerDto;

    // Check if user exists
    const existingUser = await this.userRepository.findOne({ where: { email } });
    if (existingUser) {
      throw new ConflictException('المستخدم موجود بالفعل');
    }

    // Create user
    const user = this.userRepository.create({
      email,
      password,
      phone,
      role,
      type,
      country,
      emailVerificationToken: crypto.randomBytes(32).toString('hex'),
    });

    // Create profile
    const profile = this.profileRepository.create({
      firstName,
      lastName,
      user,
    });

    // Create wallet (generate address - simplified version)
    const walletAddress = this.generateWalletAddress();
    const wallet = this.walletRepository.create({
      address: walletAddress,
      user,
      network: 'Polygon',
      chainId: 137,
    });

    user.profile = profile;
    user.wallet = wallet;

    await this.userRepository.save(user);

    // Send verification email
    await this.emailService.sendVerificationEmail(
      email,
      user.emailVerificationToken,
    );

    const token = this.generateToken(user);

    return {
      user: this.sanitizeUser(user),
      token,
      message: 'تم التسجيل بنجاح. يرجى تفعيل بريدك الإلكتروني',
    };
  }

  async login(loginDto: LoginDto) {
    const { email, password } = loginDto;

    const user = await this.userRepository.findOne({
      where: { email },
      relations: ['profile', 'wallet'],
      select: ['id', 'email', 'password', 'role', 'type', 'isVerified', 'twoFactorEnabled'],
    });

    if (!user || !(await user.validatePassword(password))) {
      throw new UnauthorizedException('البريد الإلكتروني أو كلمة المرور غير صحيحة');
    }

    // Update last login
    user.lastLogin = new Date();
    await this.userRepository.save(user);

    const token = this.generateToken(user);

    return {
      user: this.sanitizeUser(user),
      token,
      requiresTwoFactor: user.twoFactorEnabled,
    };
  }

  async verifyEmail(token: string) {
    const user = await this.userRepository.findOne({
      where: { emailVerificationToken: token },
    });

    if (!user) {
      throw new BadRequestException('رمز التحقق غير صالح');
    }

    user.isEmailVerified = true;
    user.isVerified = true;
    user.emailVerificationToken = null;

    await this.userRepository.save(user);

    return { message: 'تم تفعيل البريد الإلكتروني بنجاح' };
  }

  async sendPhoneVerification(userId: string) {
    const user = await this.userRepository.findOne({ where: { id: userId } });

    if (!user || !user.phone) {
      throw new BadRequestException('رقم الهاتف غير موجود');
    }

    const code = Math.floor(100000 + Math.random() * 900000).toString();
    user.phoneVerificationCode = code;

    await this.userRepository.save(user);
    await this.smsService.sendVerificationCode(user.phone, code);

    return { message: 'تم إرسال رمز التحقق' };
  }

  async verifyPhone(userId: string, code: string) {
    const user = await this.userRepository.findOne({ where: { id: userId } });

    if (!user || user.phoneVerificationCode !== code) {
      throw new BadRequestException('رمز التحقق غير صحيح');
    }

    user.isPhoneVerified = true;
    user.phoneVerificationCode = null;

    await this.userRepository.save(user);

    return { message: 'تم تفعيل رقم الهاتف بنجاح' };
  }

  async enable2FA(userId: string) {
    const user = await this.userRepository.findOne({ where: { id: userId } });

    if (!user) {
      throw new BadRequestException('المستخدم غير موجود');
    }

    const secret = speakeasy.generateSecret({
      name: `SHAM (${user.email})`,
      length: 32,
    });

    user.twoFactorSecret = secret.base32;
    await this.userRepository.save(user);

    const qrCode = await QRCode.toDataURL(secret.otpauth_url);

    return {
      secret: secret.base32,
      qrCode,
    };
  }

  async verify2FA(userId: string, token: string) {
    const user = await this.userRepository.findOne({
      where: { id: userId },
      select: ['id', 'twoFactorSecret'],
    });

    if (!user || !user.twoFactorSecret) {
      throw new BadRequestException('2FA غير مفعل');
    }

    const verified = speakeasy.totp.verify({
      secret: user.twoFactorSecret,
      encoding: 'base32',
      token,
      window: 2,
    });

    if (!verified) {
      throw new UnauthorizedException('رمز التحقق غير صحيح');
    }

    user.twoFactorEnabled = true;
    await this.userRepository.save(user);

    return { message: 'تم تفعيل المصادقة الثنائية بنجاح' };
  }

  async forgotPassword(email: string) {
    const user = await this.userRepository.findOne({ where: { email } });

    if (!user) {
      // Don't reveal if user exists
      return { message: 'إذا كان البريد الإلكتروني موجوداً، سيتم إرسال رابط إعادة تعيين كلمة المرور' };
    }

    const resetToken = crypto.randomBytes(32).toString('hex');
    user.resetPasswordToken = resetToken;
    user.resetPasswordExpires = new Date(Date.now() + 3600000); // 1 hour

    await this.userRepository.save(user);
    await this.emailService.sendPasswordResetEmail(email, resetToken);

    return { message: 'تم إرسال رابط إعادة تعيين كلمة المرور' };
  }

  async resetPassword(token: string, newPassword: string) {
    const user = await this.userRepository.findOne({
      where: { resetPasswordToken: token },
    });

    if (!user || user.resetPasswordExpires < new Date()) {
      throw new BadRequestException('رمز إعادة التعيين غير صالح أو منتهي الصلاحية');
    }

    user.password = newPassword;
    user.resetPasswordToken = null;
    user.resetPasswordExpires = null;

    await this.userRepository.save(user);

    return { message: 'تم تغيير كلمة المرور بنجاح' };
  }

  private generateToken(user: User): string {
    const payload = {
      sub: user.id,
      email: user.email,
      role: user.role,
      type: user.type,
    };

    return this.jwtService.sign(payload);
  }

  private sanitizeUser(user: User) {
    const { password, twoFactorSecret, ...sanitized } = user as any;
    return sanitized;
  }

  private generateWalletAddress(): string {
    // Simplified wallet generation - in production use proper Web3 libraries
    return '0x' + crypto.randomBytes(20).toString('hex');
  }
}
