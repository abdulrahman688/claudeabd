import {
  Controller,
  Get,
  Post,
  Put,
  Param,
  Body,
} from '@nestjs/common';
import { ApiTags, ApiOperation } from '@nestjs/swagger';
import { MilestoneService } from './milestone.service';
import { Milestone } from '../../entities/milestone.entity';

@ApiTags('Milestones')
@Controller('api/v1/milestones')
export class MilestoneController {
  constructor(private milestoneService: MilestoneService) {}

  @Post()
  @ApiOperation({ summary: 'إنشاء مرحلة جديدة' })
  async create(@Body() milestoneData: Partial<Milestone>) {
    return this.milestoneService.create(milestoneData);
  }

  @Get('project/:projectId')
  @ApiOperation({ summary: 'الحصول على مراحل مشروع' })
  async findByProject(@Param('projectId') projectId: string) {
    return this.milestoneService.findByProject(projectId);
  }

  @Get(':id')
  @ApiOperation({ summary: 'الحصول على تفاصيل مرحلة' })
  async findOne(@Param('id') id: string) {
    return this.milestoneService.findOne(id);
  }

  @Put(':id')
  @ApiOperation({ summary: 'تحديث مرحلة' })
  async update(@Param('id') id: string, @Body() updateData: Partial<Milestone>) {
    return this.milestoneService.update(id, updateData);
  }

  @Post(':id/complete')
  @ApiOperation({ summary: 'إكمال مرحلة' })
  async complete(
    @Param('id') id: string,
    @Body('proofImages') proofImages: string[],
    @Body('proofDescription') proofDescription: string,
  ) {
    return this.milestoneService.complete(id, proofImages, proofDescription);
  }

  @Post(':id/verify')
  @ApiOperation({ summary: 'التحقق من مرحلة' })
  async verify(@Param('id') id: string, @Body('verifiedBy') verifiedBy: string) {
    return this.milestoneService.verify(id, verifiedBy);
  }
}
