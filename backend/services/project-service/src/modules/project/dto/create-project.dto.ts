import { ApiProperty } from '@nestjs/swagger';
import {
  IsString,
  IsEnum,
  IsNumber,
  IsDateString,
  IsOptional,
  Min,
  Max,
} from 'class-validator';
import { ProjectCategory, RiskLevel } from '../../../entities/project.entity';

export class CreateProjectDto {
  @ApiProperty()
  @IsString()
  title: string;

  @ApiProperty()
  @IsString()
  description: string;

  @ApiProperty({ enum: ProjectCategory })
  @IsEnum(ProjectCategory)
  category: ProjectCategory;

  @ApiProperty()
  @IsString()
  location: string;

  @ApiProperty()
  @IsNumber()
  @Min(1000)
  fundingGoal: number;

  @ApiProperty()
  @IsNumber()
  @Min(1)
  totalShares: number;

  @ApiProperty()
  @IsNumber()
  @Min(0.01)
  sharePrice: number;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsNumber()
  @Min(0)
  @Max(100)
  expectedROI?: number;

  @ApiProperty({ enum: RiskLevel })
  @IsEnum(RiskLevel)
  riskLevel: RiskLevel;

  @ApiProperty()
  @IsDateString()
  startDate: string;

  @ApiProperty()
  @IsDateString()
  endDate: string;

  @ApiProperty({ required: false, type: [String] })
  @IsOptional()
  images?: string[];

  @ApiProperty({ required: false, type: [String] })
  @IsOptional()
  documents?: string[];
}
