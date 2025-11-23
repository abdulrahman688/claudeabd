import { ApiProperty } from '@nestjs/swagger';
import {
  IsEmail,
  IsString,
  IsEnum,
  IsOptional,
  MinLength,
  MaxLength,
  Matches,
} from 'class-validator';
import { UserRole, UserType } from '@/entities/user.entity';

export class RegisterDto {
  @ApiProperty({ example: 'user@example.com' })
  @IsEmail({}, { message: 'البريد الإلكتروني غير صالح' })
  email: string;

  @ApiProperty({ example: 'StrongPassword123!' })
  @IsString()
  @MinLength(8, { message: 'كلمة المرور يجب أن تكون 8 أحرف على الأقل' })
  @MaxLength(50)
  @Matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/, {
    message: 'كلمة المرور يجب أن تحتوي على حرف كبير وحرف صغير ورقم',
  })
  password: string;

  @ApiProperty({ example: 'أحمد' })
  @IsString()
  @MinLength(2)
  @MaxLength(50)
  firstName: string;

  @ApiProperty({ example: 'محمد' })
  @IsString()
  @MinLength(2)
  @MaxLength(50)
  lastName: string;

  @ApiProperty({ example: '+963991234567', required: false })
  @IsOptional()
  @IsString()
  phone?: string;

  @ApiProperty({ enum: UserRole, example: UserRole.INVESTOR })
  @IsEnum(UserRole)
  role: UserRole;

  @ApiProperty({ enum: UserType, example: UserType.DIASPORA })
  @IsEnum(UserType)
  type: UserType;

  @ApiProperty({ example: 'Germany', required: false })
  @IsOptional()
  @IsString()
  country?: string;
}
