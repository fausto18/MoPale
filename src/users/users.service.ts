import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './user.entity';
import * as bcrypt from 'bcrypt';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly usersRepository: Repository<User>,
  ) {}

  // 1. Criar
  async create(dto: CreateUserDto): Promise<User> {
    const hashedPassword = await bcrypt.hash(dto.password, 10);

    const user = this.usersRepository.create({
      ...dto,
      password: hashedPassword,
    });

    return await this.usersRepository.save(user);
  }

  // 2. LISTAR TODOS
  async findAll(): Promise<User[]> {
    return await this.usersRepository.find();
  }

  // 3. BUSCAR POR ID
  async findById(id: number): Promise<User> {
    const user = await this.usersRepository.findOne({ where: { id } });
    if (!user) {
      throw new NotFoundException(`Usuário com ID ${id} não encontrado`);
    }
    return user;
  }

  // ✅ BUSCAR POR TELEFONE (Ajustado para o Auth)
  async findByPhone(phone: string): Promise<User | null> {
    return this.usersRepository
      .createQueryBuilder('user')
      .addSelect('user.password') // 👈 Força a busca da senha para comparação
      .where('user.phone = :phone', { phone })
      .getOne();
  }

  // ✅ BUSCAR POR EMAIL (Ajustado para o Auth)
  async findByEmail(email: string): Promise<User | null> {
    return this.usersRepository
      .createQueryBuilder('user')
      .addSelect('user.password') // 👈 Força a busca da senha para comparação
      .where('user.email = :email', { email })
      .getOne();
  }

  // 4. ATUALIZAR
  async update(id: number, dto: UpdateUserDto): Promise<User> {
    const user = await this.findById(id); 

    if (dto.password) {
      dto.password = await bcrypt.hash(dto.password, 10);
    }

    Object.assign(user, dto);
    return await this.usersRepository.save(user);
  }

  // 5. REMOVER
  async remove(id: number): Promise<void> {
    const user = await this.findById(id);
    await this.usersRepository.remove(user);
  }

  async updateRefreshToken(userId: number, refreshToken: string | null): Promise<void> {
    await this.usersRepository.update(userId, { 
      refreshToken: refreshToken ?? null 
    });
  }
}