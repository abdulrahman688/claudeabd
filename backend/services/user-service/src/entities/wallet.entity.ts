import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  OneToOne,
  JoinColumn,
} from 'typeorm';
import { User } from './user.entity';

@Entity('wallets')
export class Wallet {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ unique: true })
  address: string;

  @Column({ type: 'decimal', precision: 18, scale: 8, default: 0 })
  balance: number;

  @Column({ type: 'decimal', precision: 18, scale: 2, default: 0 })
  totalInvested: number;

  @Column({ type: 'decimal', precision: 18, scale: 2, default: 0 })
  totalReturns: number;

  @Column({ type: 'decimal', precision: 5, scale: 2, default: 0 })
  roi: number;

  @Column({ nullable: true })
  chainId: number;

  @Column({ nullable: true })
  network: string;

  @OneToOne(() => User, (user) => user.wallet)
  @JoinColumn()
  user: User;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
