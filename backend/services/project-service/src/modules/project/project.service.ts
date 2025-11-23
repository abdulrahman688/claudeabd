import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Project, ProjectStatus } from '../../entities/project.entity';
import { CreateProjectDto } from './dto/create-project.dto';

@Injectable()
export class ProjectService {
  constructor(
    @InjectRepository(Project)
    private projectRepository: Repository<Project>,
  ) {}

  async create(createProjectDto: CreateProjectDto, ownerId: string): Promise<Project> {
    const project = this.projectRepository.create({
      ...createProjectDto,
      ownerId,
      availableShares: createProjectDto.totalShares,
      currentFunding: 0,
      status: ProjectStatus.PENDING,
    });

    return this.projectRepository.save(project);
  }

  async findAll(filters?: {
    category?: string;
    location?: string;
    status?: ProjectStatus;
    riskLevel?: string;
    search?: string;
  }): Promise<Project[]> {
    const query = this.projectRepository.createQueryBuilder('project');

    if (filters?.category) {
      query.andWhere('project.category = :category', { category: filters.category });
    }

    if (filters?.location) {
      query.andWhere('project.location = :location', { location: filters.location });
    }

    if (filters?.status) {
      query.andWhere('project.status = :status', { status: filters.status });
    }

    if (filters?.riskLevel) {
      query.andWhere('project.riskLevel = :riskLevel', { riskLevel: filters.riskLevel });
    }

    if (filters?.search) {
      query.andWhere(
        '(project.title ILIKE :search OR project.description ILIKE :search)',
        { search: `%${filters.search}%` },
      );
    }

    query.orderBy('project.createdAt', 'DESC');

    return query.getMany();
  }

  async findOne(id: string): Promise<Project> {
    const project = await this.projectRepository.findOne({
      where: { id },
      relations: ['milestones'],
    });

    if (!project) {
      throw new NotFoundException('المشروع غير موجود');
    }

    return project;
  }

  async update(id: string, updateData: Partial<CreateProjectDto>): Promise<Project> {
    const project = await this.findOne(id);
    Object.assign(project, updateData);
    return this.projectRepository.save(project);
  }

  async delete(id: string): Promise<void> {
    const result = await this.projectRepository.delete(id);
    if (result.affected === 0) {
      throw new NotFoundException('المشروع غير موجود');
    }
  }

  async updateStatus(id: string, status: ProjectStatus): Promise<Project> {
    const project = await this.findOne(id);
    project.status = status;
    return this.projectRepository.save(project);
  }

  async addInvestment(id: string, amount: number, shares: number): Promise<Project> {
    const project = await this.findOne(id);

    if (shares > project.availableShares) {
      throw new BadRequestException('عدد الأسهم المتاحة غير كافٍ');
    }

    project.currentFunding += amount;
    project.availableShares -= shares;
    project.investorsCount += 1;

    if (project.currentFunding >= project.fundingGoal) {
      project.status = ProjectStatus.FUNDED;
    }

    return this.projectRepository.save(project);
  }

  async deploySmartContract(id: string, contractAddress: string): Promise<Project> {
    const project = await this.findOne(id);
    project.smartContractAddress = contractAddress;
    return this.projectRepository.save(project);
  }
}
