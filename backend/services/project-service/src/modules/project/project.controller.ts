import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  Query,
  UseGuards,
  Req,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { ProjectService } from './project.service';
import { CreateProjectDto } from './dto/create-project.dto';
import { ProjectStatus } from '../../entities/project.entity';

@ApiTags('Projects')
@Controller('api/v1/projects')
export class ProjectController {
  constructor(private projectService: ProjectService) {}

  @Post()
  @ApiOperation({ summary: 'إنشاء مشروع جديد' })
  async create(@Body() createProjectDto: CreateProjectDto, @Req() req) {
    // In production, get userId from JWT token
    const userId = req.user?.id || 'temp-user-id';
    return this.projectService.create(createProjectDto, userId);
  }

  @Get()
  @ApiOperation({ summary: 'الحصول على جميع المشاريع' })
  async findAll(
    @Query('category') category?: string,
    @Query('location') location?: string,
    @Query('status') status?: ProjectStatus,
    @Query('riskLevel') riskLevel?: string,
    @Query('search') search?: string,
  ) {
    return this.projectService.findAll({
      category,
      location,
      status,
      riskLevel,
      search,
    });
  }

  @Get(':id')
  @ApiOperation({ summary: 'الحصول على تفاصيل مشروع' })
  async findOne(@Param('id') id: string) {
    return this.projectService.findOne(id);
  }

  @Put(':id')
  @ApiOperation({ summary: 'تحديث مشروع' })
  async update(@Param('id') id: string, @Body() updateData: Partial<CreateProjectDto>) {
    return this.projectService.update(id, updateData);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'حذف مشروع' })
  async delete(@Param('id') id: string) {
    await this.projectService.delete(id);
    return { message: 'تم حذف المشروع بنجاح' };
  }

  @Put(':id/status')
  @ApiOperation({ summary: 'تحديث حالة المشروع' })
  async updateStatus(@Param('id') id: string, @Body('status') status: ProjectStatus) {
    return this.projectService.updateStatus(id, status);
  }

  @Post(':id/deploy-contract')
  @ApiOperation({ summary: 'نشر عقد ذكي للمشروع' })
  async deployContract(
    @Param('id') id: string,
    @Body('contractAddress') contractAddress: string,
  ) {
    return this.projectService.deploySmartContract(id, contractAddress);
  }
}
