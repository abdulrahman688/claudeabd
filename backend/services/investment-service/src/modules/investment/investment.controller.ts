import { Controller, Get, Post, Body, Param, Query } from '@nestjs/common';
import { ApiTags, ApiOperation } from '@nestjs/swagger';
import { InvestmentService } from './investment.service';
import { Investment } from '../../entities/investment.entity';

@ApiTags('Investments')
@Controller('api/v1/investments')
export class InvestmentController {
  constructor(private service: InvestmentService) {}

  @Post()
  @ApiOperation({ summary: 'إنشاء استثمار' })
  create(@Body() data: Partial<Investment>) {
    return this.service.create(data);
  }

  @Get()
  @ApiOperation({ summary: 'جلب جميع الاستثمارات' })
  findAll(@Query('investorId') investorId?: string, @Query('projectId') projectId?: string) {
    return this.service.findAll({ investorId, projectId });
  }

  @Get('portfolio/:investorId')
  @ApiOperation({ summary: 'محفظة المستثمر' })
  getPortfolio(@Param('investorId') investorId: string) {
    return this.service.getPortfolio(investorId);
  }

  @Get(':id')
  @ApiOperation({ summary: 'تفاصيل استثمار' })
  findOne(@Param('id') id: string) {
    return this.service.findOne(id);
  }
}
