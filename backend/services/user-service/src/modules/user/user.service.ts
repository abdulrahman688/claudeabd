import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '@/entities/user.entity';
import { Profile } from '@/entities/profile.entity';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
    @InjectRepository(Profile)
    private profileRepository: Repository<Profile>,
  ) {}

  async findById(id: string): Promise<User> {
    const user = await this.userRepository.findOne({
      where: { id },
      relations: ['profile', 'wallet'],
    });

    if (!user) {
      throw new NotFoundException('المستخدم غير موجود');
    }

    return user;
  }

  async updateProfile(userId: string, updateData: Partial<Profile>) {
    const user = await this.findById(userId);

    await this.profileRepository.update(
      { id: user.profile.id },
      updateData,
    );

    return this.findById(userId);
  }

  async getMyInvestments(userId: string) {
    // This would connect to Investment Service
    return [];
  }

  async toggleMentorAvailability(userId: string) {
    const user = await this.findById(userId);
    user.isMentorAvailable = !user.isMentorAvailable;
    await this.userRepository.save(user);
    return user;
  }
}
