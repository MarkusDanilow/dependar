import { UserRepository } from './user.repository';
import { User, Prisma } from '@prisma/client';
import { AuthUtils } from '../../common/auth/auth.utils';

export class UserService {
  constructor(private readonly userRepo: UserRepository) {}

  async getUsers(): Promise<Omit<User, 'passwordHash'>[]> {
    const users = await this.userRepo.findAll();
    return users.map(({ passwordHash, ...rest }) => rest);
  }

  async getUserById(id: string): Promise<Omit<User, 'passwordHash'> | null> {
    const user = await this.userRepo.findById(id);
    if (!user) return null;
    const { passwordHash, ...rest } = user;
    return rest;
  }

  async createUser(data: { email: string; password: string; role?: 'ADMIN' | 'VIEWER'; firstName?: string; lastName?: string }): Promise<Omit<User, 'passwordHash'>> {
    const passwordHash = await AuthUtils.hashPassword(data.password);
    const user = await this.userRepo.create({
      email: data.email,
      passwordHash,
      role: data.role || 'VIEWER',
      firstName: data.firstName || null,
      lastName: data.lastName || null,
    } as Prisma.UserCreateInput);
    const { passwordHash: _, ...rest } = user;
    return rest;
  }

  async updateUser(id: string, data: { email?: string; password?: string; role?: 'ADMIN' | 'VIEWER'; firstName?: string; lastName?: string }): Promise<Omit<User, 'passwordHash'>> {
    const update: Prisma.UserUpdateInput = {};
    if (data.email) update.email = data.email;
    if (data.role) update.role = data.role;
    if (data.firstName !== undefined) update.firstName = data.firstName || null;
    if (data.lastName !== undefined) update.lastName = data.lastName || null;
    if (data.password) update.passwordHash = await AuthUtils.hashPassword(data.password);
    const user = await this.userRepo.update(id, update);
    const { passwordHash, ...rest } = user;
    return rest;
  }

  async deleteUser(id: string): Promise<Omit<User, 'passwordHash'>> {
    const user = await this.userRepo.delete(id);
    const { passwordHash, ...rest } = user;
    return rest;
  }
}
