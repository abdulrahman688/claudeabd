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

@Entity('profiles')
export class Profile {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ nullable: true })
  firstName: string;

  @Column({ nullable: true })
  lastName: string;

  @Column({ nullable: true })
  avatarUrl: string;

  @Column({ type: 'text', nullable: true })
  bio: string;

  @Column({ type: 'simple-array', nullable: true })
  skills: string[];

  @Column({ type: 'simple-array', nullable: true })
  languages: string[];

  @Column({ nullable: true })
  linkedinUrl: string;

  @Column({ nullable: true })
  githubUrl: string;

  @Column({ nullable: true })
  websiteUrl: string;

  @Column({ type: 'date', nullable: true })
  dateOfBirth: Date;

  @Column({ nullable: true })
  city: string;

  @Column({ nullable: true })
  address: string;

  @OneToOne(() => User, (user) => user.profile)
  @JoinColumn()
  user: User;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  get fullName(): string {
    return `${this.firstName || ''} ${this.lastName || ''}`.trim();
  }
}
