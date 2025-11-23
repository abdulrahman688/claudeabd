import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';

export enum InvestmentStatus {
  PENDING = 'pending',
  CONFIRMED = 'confirmed',
  ACTIVE = 'active',
  COMPLETED = 'completed',
  CANCELLED = 'cancelled',
}

export enum PaymentMethod {
  CREDIT_CARD = 'credit_card',
  CRYPTO = 'crypto',
  BANK_TRANSFER = 'bank_transfer',
}

@Entity('investments')
export class Investment {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  investorId: string;

  @Column()
  projectId: string;

  @Column({ type: 'int' })
  sharesCount: number;

  @Column({ type: 'decimal', precision: 18, scale: 2 })
  amount: number;

  @Column({ type: 'decimal', precision: 18, scale: 8, nullable: true })
  cryptoAmount: number;

  @Column({ nullable: true })
  nftTokenId: string;

  @Column({ nullable: true })
  transactionHash: string;

  @Column({ type: 'enum', enum: InvestmentStatus, default: InvestmentStatus.PENDING })
  status: InvestmentStatus;

  @Column({ type: 'enum', enum: PaymentMethod })
  paymentMethod: PaymentMethod;

  @Column({ type: 'decimal', precision: 18, scale: 2, default: 0 })
  currentValue: number;

  @Column({ type: 'decimal', precision: 18, scale: 2, default: 0 })
  totalReturns: number;

  @Column({ type: 'decimal', precision: 5, scale: 2, default: 0 })
  roi: number;

  @Column({ default: false })
  isMentoring: boolean;

  @Column({ type: 'int', default: 0 })
  mentoringHours: number;

  @Column({ type: 'decimal', precision: 5, scale: 2, default: 0 })
  mentoringBonus: number;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
