import { Test, TestingModule } from '@nestjs/testing';
import { UsersService } from './users.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { User } from './user.entity';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';

describe('UsersService', () => {
  let service: UsersService;
  let repo: Repository<User>;

  const mockRepository = {
    findOne: jest.fn(),
    create: jest.fn(),
    save: jest.fn(),
    update: jest.fn(),
    remove: jest.fn(),
    find: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UsersService,
        {
          provide: getRepositoryToken(User),
          useValue: mockRepository,
        },
      ],
    }).compile();

    service = module.get<UsersService>(UsersService);
    repo = module.get<Repository<User>>(getRepositoryToken(User));

    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create()', () => {
    it('should create a new user', async () => {
      const userData = {
        name: 'Fausto Sacufundala',
        email: 'faustosacufundala97@mail.com',
        phone: '948769270',
        password: '123456',
      };

      mockRepository.findOne.mockResolvedValue(null);
      mockRepository.create.mockReturnValue(userData);
      mockRepository.save.mockResolvedValue({
        id: 1,
        ...userData,
        password: await bcrypt.hash(userData.password, 10),
      });

      const result = await service.create(userData);

      expect(mockRepository.save).toHaveBeenCalled();
      expect(result).toHaveProperty('id');
      expect(result).not.toHaveProperty('password');
    });
  });

  describe('findByEmail()', () => {
    it('should return a user if found', async () => {
      const user = { id: 1, email: 'faustosacufundala97@mail.com' };

      mockRepository.findOne.mockResolvedValue(user);

      const result = await service.findByEmail('fausto.sacufundala97@mail.com');

      expect(result).toEqual(user);
    });
  });
});
