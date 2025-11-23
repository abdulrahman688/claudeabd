import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
} from 'typeorm';
import { Milestone } from './milestone.entity';

export enum ProjectCategory {
  AGRICULTURE = 'agriculture',
  BAKERY = 'bakery',
  WORKSHOP = 'workshop',
  TECH = 'tech',
  RETAIL = 'retail',
  SERVICE = 'service',
  MANUFACTURING = 'manufacturing',
}

export enum ProjectStatus {
  PENDING = 'pending',
  ACTIVE = 'active',
  FUNDED = 'funded',
  IN_PROGRESS = 'in_progress',
  COMPLETED = 'completed',
  FAILED = 'failed',
  CANCELLED = 'cancelled',
}

export enum RiskLevel {
  LOW = 'low',
  MEDIUM = 'medium',
  HIGH = 'high',
}

@Entity('projects')
export class Project {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  title: string;

  @Column('text')
  description: string;

  @Column({ type: 'enum', enum: ProjectCategory })
  category: ProjectCategory;

  @Column()
  location: string;

  @Column({ type: 'decimal', precision: 18, scale: 2 })
  fundingGoal: number;

  @Column({ type: 'decimal', precision: 18, scale: 2, default: 0 })
  currentFunding: number;

  @Column({ type: 'int', default: 100 })
  totalShares: number;

  @Column({ type: 'int', default: 100 })
  availableShares: number;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  sharePrice: number;

  @Column({ type: 'decimal', precision: 5, scale: 2, nullable: true })
  expectedROI: number;

  @Column({ type: 'enum', enum: ProjectStatus, default: ProjectStatus.PENDING })
  status: ProjectStatus;

  @Column({ type: 'enum', enum: RiskLevel })
  riskLevel: RiskLevel;

  @Column({ type: 'date' })
  startDate: Date;

  @Column({ type: 'date' })
  endDate: Date;

  @Column({ nullable: true })
  smartContractAddress: string;

  @Column()
  ownerId: string;

  @Column({ type: 'simple-array', nullable: true })
  images: string[];

  @Column({ type: 'simple-array', nullable: true })
  documents: string[];

  @Column({ type: 'simple-array', nullable: true })
  mentorIds: string[];

  @Column({ type: 'int', default: 0 })
  investorsCount: number;

  @OneToMany(() => Milestone, (milestone) => milestone.project, { cascade: true })
  milestones: Milestone[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
