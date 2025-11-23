import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as nodemailer from 'nodemailer';

@Injectable()
export class EmailService {
  private transporter;

  constructor(private configService: ConfigService) {
    this.transporter = nodemailer.createTransport({
      host: this.configService.get('SMTP_HOST'),
      port: this.configService.get('SMTP_PORT'),
      secure: true,
      auth: {
        user: this.configService.get('SMTP_USER'),
        pass: this.configService.get('SMTP_PASS'),
      },
    });
  }

  async sendVerificationEmail(email: string, token: string) {
    const verificationUrl = `${this.configService.get('FRONTEND_URL')}/verify-email?token=${token}`;

    await this.transporter.sendMail({
      from: '"منصة شام" <noreply@sham.sy>',
      to: email,
      subject: 'تفعيل حسابك في منصة شام',
      html: `
        <div dir="rtl">
          <h2>مرحباً بك في منصة شام</h2>
          <p>يرجى تفعيل حسابك بالنقر على الرابط التالي:</p>
          <a href="${verificationUrl}">${verificationUrl}</a>
          <p>هذا الرابط صالح لمدة 24 ساعة</p>
        </div>
      `,
    });
  }

  async sendPasswordResetEmail(email: string, token: string) {
    const resetUrl = `${this.configService.get('FRONTEND_URL')}/reset-password?token=${token}`;

    await this.transporter.sendMail({
      from: '"منصة شام" <noreply@sham.sy>',
      to: email,
      subject: 'إعادة تعيين كلمة المرور',
      html: `
        <div dir="rtl">
          <h2>إعادة تعيين كلمة المرور</h2>
          <p>لإعادة تعيين كلمة المرور، يرجى النقر على الرابط التالي:</p>
          <a href="${resetUrl}">${resetUrl}</a>
          <p>هذا الرابط صالح لمدة ساعة واحدة</p>
        </div>
      `,
    });
  }
}
