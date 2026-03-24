import { describe, it, expect, vi, beforeEach } from 'vitest';
import { UserService } from './user.service';
import { UserRepository } from './user.repository';
import { prismaMock } from '../../../test/setup/prisma-mock';

describe('UserService', () => {
  let userService: UserService;
  let userRepo: UserRepository;

  beforeEach(() => {
    userRepo = new UserRepository(prismaMock as any);
    userService = new UserService(userRepo);
  });

  it('should return all users', async () => {
    const mockUsers = [{ id: '1', email: 'a@a.com', passwordHash: 'pw', role: 'ADMIN' as any, createdAt: new Date() }];
    vi.spyOn(userRepo, 'findAll').mockResolvedValue(mockUsers);
    
    const users = await userService.getUsers();
    
    expect(users).toEqual(mockUsers);
    expect(userRepo.findAll).toHaveBeenCalled();
  });
});
