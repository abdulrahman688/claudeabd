import {
  Controller,
  Get,
  Put,
  Body,
  UseGuards,
  Req,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiBearerAuth,
} from '@nestjs/swagger';
import { UserService } from './user.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@ApiTags('Users')
@Controller('api/v1/users')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class UserController {
  constructor(private userService: UserService) {}

  @Get('me')
  @ApiOperation({ summary: 'الحصول على بيانات المستخدم الحالي' })
  async getMe(@Req() req) {
    return this.userService.findById(req.user.id);
  }

  @Put('me')
  @ApiOperation({ summary: 'تحديث بيانات المستخدم' })
  async updateMe(@Req() req, @Body() updateData: any) {
    return this.userService.updateProfile(req.user.id, updateData);
  }

  @Get('me/investments')
  @ApiOperation({ summary: 'الحصول على استثمارات المستخدم' })
  async getMyInvestments(@Req() req) {
    return this.userService.getMyInvestments(req.user.id);
  }

  @Put('me/toggle-mentor')
  @ApiOperation({ summary: 'تفعيل/إلغاء توفر الإرشاد' })
  async toggleMentor(@Req() req) {
    return this.userService.toggleMentorAvailability(req.user.id);
  }
}
