import { UserRepository } from './user.repository';
import { User } from '@prisma/client';

export class UserService {
  constructor(private readonly userRepo: UserRepository) {}

  async getUsers(): Promise<User[]> {
    return this.userRepo.findAll();
  }
}
