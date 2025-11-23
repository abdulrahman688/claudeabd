import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Investment, InvestmentStatus } from '../../entities/investment.entity';

@Injectable()
export class InvestmentService {
  constructor(
    @InjectRepository(Investment)
    private investmentRepo: Repository<Investment>,
  ) {}

  async create(data: Partial<Investment>): Promise<Investment> {
    return this.investmentRepo.save(this.investmentRepo.create(data));
  }

  async findAll(filters?: { investorId?: string; projectId?: string }): Promise<Investment[]> {
    const query = this.investmentRepo.createQueryBuilder('inv');
    if (filters?.investorId) query.andWhere('inv.investorId = :investorId', filters);
    if (filters?.projectId) query.andWhere('inv.projectId = :projectId', filters);
    return query.getMany();
  }

  async findOne(id: string): Promise<Investment> {
    return this.investmentRepo.findOne({ where: { id } });
  }

  async updateStatus(id: string, status: InvestmentStatus): Promise<Investment> {
    await this.investmentRepo.update(id, { status });
    return this.findOne(id);
  }

  async getPortfolio(investorId: string) {
    const investments = await this.findAll({ investorId });
    const totalInvested = investments.reduce((sum, inv) => sum + Number(inv.amount), 0);
    const totalReturns = investments.reduce((sum, inv) => sum + Number(inv.totalReturns), 0);
    const roi = totalInvested > 0 ? (totalReturns / totalInvested) * 100 : 0;

    return {
      totalInvested,
      currentValue: totalInvested + totalReturns,
      totalReturns,
      roi,
      investments,
    };
  }
}
