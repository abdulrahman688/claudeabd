import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as twilio from 'twilio';

@Injectable()
export class SmsService {
  private client;

  constructor(private configService: ConfigService) {
    this.client = twilio(
      this.configService.get('TWILIO_ACCOUNT_SID'),
      this.configService.get('TWILIO_AUTH_TOKEN'),
    );
  }

  async sendVerificationCode(phone: string, code: string) {
    try {
      await this.client.messages.create({
        body: `رمز التحقق الخاص بك في منصة شام: ${code}`,
        from: this.configService.get('TWILIO_PHONE_NUMBER'),
        to: phone,
      });
    } catch (error) {
      console.error('SMS Error:', error);
      throw error;
    }
  }
}
