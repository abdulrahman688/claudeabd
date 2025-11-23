import {
  Controller,
  Get,
  UseGuards,
  Req,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiBearerAuth,
} from '@nestjs/swagger';
import { WalletService } from './wallet.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@ApiTags('Wallet')
@Controller('api/v1/wallet')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class WalletController {
  constructor(private walletService: WalletService) {}

  @Get('balance')
  @ApiOperation({ summary: 'الحصول على رصيد المحفظة' })
  async getBalance(@Req() req) {
    return this.walletService.getBalance(req.user.id);
  }
}
