import { BaseRepository } from '../../common/base.repository';
import { User, Prisma, PrismaClient } from '@prisma/client';

export class UserRepository extends BaseRepository<User, Prisma.UserCreateInput, Prisma.UserUpdateInput, Prisma.UserWhereInput> {
  constructor(prisma: PrismaClient) {
    super(prisma);
  }

  async create(data: Prisma.UserCreateInput): Promise<User> {
    return this.prisma.user.create({ data });
  }

  async findById(id: string): Promise<User | null> {
    return this.prisma.user.findUnique({ where: { id } });
  }

  async findOne(query: Prisma.UserWhereInput): Promise<User | null> {
    return this.prisma.user.findFirst({ where: query });
  }

  async findAll(query?: Prisma.UserWhereInput): Promise<User[]> {
    return this.prisma.user.findMany({ where: query });
  }

  async update(id: string, data: Prisma.UserUpdateInput): Promise<User> {
    return this.prisma.user.update({ where: { id }, data });
  }

  async delete(id: string): Promise<User> {
    return this.prisma.user.delete({ where: { id } });
  }

  async findByEmail(email: string): Promise<User | null> {
    return this.prisma.user.findUnique({ where: { email } });
  }
}
