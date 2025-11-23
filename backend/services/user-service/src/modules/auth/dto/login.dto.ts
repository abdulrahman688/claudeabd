import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsString, MinLength } from 'class-validator';

export class LoginDto {
  @ApiProperty({ example: 'user@example.com' })
  @IsEmail({}, { message: 'البريد الإلكتروني غير صالح' })
  email: string;

  @ApiProperty({ example: 'StrongPassword123!' })
  @IsString()
  @MinLength(8, { message: 'كلمة المرور يجب أن تكون 8 أحرف على الأقل' })
  password: string;
}
