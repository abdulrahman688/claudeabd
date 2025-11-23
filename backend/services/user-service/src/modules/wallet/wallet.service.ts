import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Wallet } from '@/entities/wallet.entity';

@Injectable()
export class WalletService {
  constructor(
    @InjectRepository(Wallet)
    private walletRepository: Repository<Wallet>,
  ) {}

  async getBalance(userId: string) {
    const wallet = await this.walletRepository.findOne({
      where: { user: { id: userId } },
    });
    return wallet;
  }

  async updateBalance(walletId: string, amount: number) {
    await this.walletRepository.update(walletId, {
      balance: amount,
    });
    return this.walletRepository.findOne({ where: { id: walletId } });
  }
}
