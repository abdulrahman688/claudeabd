import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Milestone, MilestoneStatus } from '../../entities/milestone.entity';

@Injectable()
export class MilestoneService {
  constructor(
    @InjectRepository(Milestone)
    private milestoneRepository: Repository<Milestone>,
  ) {}

  async create(milestoneData: Partial<Milestone>): Promise<Milestone> {
    const milestone = this.milestoneRepository.create(milestoneData);
    return this.milestoneRepository.save(milestone);
  }

  async findByProject(projectId: string): Promise<Milestone[]> {
    return this.milestoneRepository.find({
      where: { project: { id: projectId } },
      order: { targetDate: 'ASC' },
    });
  }

  async findOne(id: string): Promise<Milestone> {
    const milestone = await this.milestoneRepository.findOne({ where: { id } });
    if (!milestone) {
      throw new NotFoundException('المرحلة غير موجودة');
    }
    return milestone;
  }

  async update(id: string, updateData: Partial<Milestone>): Promise<Milestone> {
    const milestone = await this.findOne(id);
    Object.assign(milestone, updateData);
    return this.milestoneRepository.save(milestone);
  }

  async complete(
    id: string,
    proofImages: string[],
    proofDescription: string,
  ): Promise<Milestone> {
    const milestone = await this.findOne(id);
    milestone.status = MilestoneStatus.COMPLETED;
    milestone.proofImages = proofImages;
    milestone.proofDescription = proofDescription;
    milestone.verifiedAt = new Date();
    return this.milestoneRepository.save(milestone);
  }

  async verify(id: string, verifiedBy: string): Promise<Milestone> {
    const milestone = await this.findOne(id);
    milestone.verifiedBy = verifiedBy;
    milestone.verifiedAt = new Date();
    return this.milestoneRepository.save(milestone);
  }
}
