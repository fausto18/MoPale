import { 
  Controller, Post, Body, Get, Patch, Delete, 
  Param, ParseIntPipe, HttpCode, HttpStatus, 
  UseGuards 
} from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { AuthGuard } from '../auth/guards/jwt-auth.guard';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  /**
   *  PÚBLICO: Registro de novos usuários
   * Qualquer pessoa pode criar uma conta para usar o sistema.
   */
  @Post('register')
  async register(@Body() dto: CreateUserDto) {
    return this.usersService.create(dto);
  }

  /**
   *  PÚBLICO: Consultar usuário por ID
   * Útil para exibir perfis ou informações de contato publicamente.
   */
  @Get(':id')
  async findOne(@Param('id', ParseIntPipe) id: number) {
    return this.usersService.findById(id);
  }

  /**
   *  PROTEGIDO: Listar todos os usuários
   * Requer Token. Evita que estranhos baixem sua base de dados completa.
   */
  @UseGuards(AuthGuard) 
  @Get()
  async findAll() {
    return this.usersService.findAll();
  }

  /**
   *  PROTEGIDO: Atualizar dados
   * Requer Token. Garante que apenas o dono da conta ou admin altere os dados.
   */
  @UseGuards(AuthGuard)
  @Patch(':id')
  async update(@Param('id', ParseIntPipe) id: number, @Body() dto: UpdateUserDto) {
    return this.usersService.update(id, dto);
  }

  /**
   *  PROTEGIDO: Deletar conta
   * Requer Token. Proteção contra exclusões não autorizadas.
   */
  @UseGuards(AuthGuard)
  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async remove(@Param('id', ParseIntPipe) id: number) {
    await this.usersService.remove(id);
  }
}