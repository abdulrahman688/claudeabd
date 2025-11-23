import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  OneToOne,
  OneToMany,
  BeforeInsert,
  BeforeUpdate,
} from 'typeorm';
import * as bcrypt from 'bcrypt';
import { Exclude } from 'class-transformer';
import { Profile } from './profile.entity';
import { Wallet } from './wallet.entity';

export enum UserRole {
  INVESTOR = 'investor',
  ENTREPRENEUR = 'entrepreneur',
  ADMIN = 'admin',
}

export enum UserType {
  DIASPORA = 'diaspora',
  LOCAL = 'local',
}

@Entity('users')
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ unique: true })
  email: string;

  @Column({ unique: true, nullable: true })
  phone: string;

  @Column({ select: false })
  @Exclude()
  password: string;

  @Column({
    type: 'enum',
    enum: UserRole,
    default: UserRole.INVESTOR,
  })
  role: UserRole;

  @Column({
    type: 'enum',
    enum: UserType,
  })
  type: UserType;

  @Column({ nullable: true })
  country: string;

  @Column({ default: false })
  isVerified: boolean;

  @Column({ default: false })
  isEmailVerified: boolean;

  @Column({ default: false })
  isPhoneVerified: boolean;

  @Column({ default: false })
  isMentorAvailable: boolean;

  @Column({ default: false })
  twoFactorEnabled: boolean;

  @Column({ nullable: true, select: false })
  @Exclude()
  twoFactorSecret: string;

  @Column({ nullable: true })
  emailVerificationToken: string;

  @Column({ nullable: true })
  phoneVerificationCode: string;

  @Column({ nullable: true })
  resetPasswordToken: string;

  @Column({ type: 'timestamp', nullable: true })
  resetPasswordExpires: Date;

  @Column({ type: 'timestamp', nullable: true })
  lastLogin: Date;

  @OneToOne(() => Profile, (profile) => profile.user, { cascade: true })
  profile: Profile;

  @OneToOne(() => Wallet, (wallet) => wallet.user, { cascade: true })
  wallet: Wallet;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @BeforeInsert()
  @BeforeUpdate()
  async hashPassword() {
    if (this.password && !this.password.startsWith('$2b$')) {
      const salt = await bcrypt.genSalt(10);
      this.password = await bcrypt.hash(this.password, salt);
    }
  }

  async validatePassword(password: string): Promise<boolean> {
    return bcrypt.compare(password, this.password);
  }
}
