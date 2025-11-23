import {
  Controller,
  Post,
  Body,
  Get,
  Query,
  UseGuards,
  Req,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
} from '@nestjs/swagger';
import { AuthService } from './auth.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { JwtAuthGuard } from './guards/jwt-auth.guard';

@ApiTags('Authentication')
@Controller('api/v1/auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('register')
  @ApiOperation({ summary: 'تسجيل مستخدم جديد' })
  @ApiResponse({ status: 201, description: 'تم التسجيل بنجاح' })
  @ApiResponse({ status: 409, description: 'المستخدم موجود بالفعل' })
  async register(@Body() registerDto: RegisterDto) {
    return this.authService.register(registerDto);
  }

  @Post('login')
  @ApiOperation({ summary: 'تسجيل الدخول' })
  @ApiResponse({ status: 200, description: 'تم تسجيل الدخول بنجاح' })
  @ApiResponse({ status: 401, description: 'بيانات الاعتماد غير صحيحة' })
  async login(@Body() loginDto: LoginDto) {
    return this.authService.login(loginDto);
  }

  @Get('verify-email')
  @ApiOperation({ summary: 'تفعيل البريد الإلكتروني' })
  @ApiResponse({ status: 200, description: 'تم التفعيل بنجاح' })
  async verifyEmail(@Query('token') token: string) {
    return this.authService.verifyEmail(token);
  }

  @Post('send-phone-verification')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'إرسال رمز تفعيل الهاتف' })
  async sendPhoneVerification(@Req() req) {
    return this.authService.sendPhoneVerification(req.user.id);
  }

  @Post('verify-phone')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'تفعيل رقم الهاتف' })
  async verifyPhone(@Req() req, @Body('code') code: string) {
    return this.authService.verifyPhone(req.user.id, code);
  }

  @Post('2fa/enable')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'تفعيل المصادقة الثنائية' })
  async enable2FA(@Req() req) {
    return this.authService.enable2FA(req.user.id);
  }

  @Post('2fa/verify')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'التحقق من رمز المصادقة الثنائية' })
  async verify2FA(@Req() req, @Body('token') token: string) {
    return this.authService.verify2FA(req.user.id, token);
  }

  @Post('forgot-password')
  @ApiOperation({ summary: 'نسيت كلمة المرور' })
  async forgotPassword(@Body('email') email: string) {
    return this.authService.forgotPassword(email);
  }

  @Post('reset-password')
  @ApiOperation({ summary: 'إعادة تعيين كلمة المرور' })
  async resetPassword(
    @Body('token') token: string,
    @Body('password') password: string,
  ) {
    return this.authService.resetPassword(token, password);
  }
}
