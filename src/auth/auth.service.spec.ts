import { Injectable, UnauthorizedException } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
  ) {}

  async validateUser(login: string, password: string) {
    const user =
      (await this.usersService.findByEmail(login)) ||
      (await this.usersService.findByPhone(login));

    if (!user) throw new UnauthorizedException('Usuário não encontrado');

    const valid = await bcrypt.compare(password, user.password);

    if (!valid) throw new UnauthorizedException('Senha inválida');

    return user;
  }

  async login(login: string, password: string) {
    const user = await this.validateUser(login, password);

    const payload = { sub: user.id };

    return {
      access_token: this.jwtService.sign(payload),
    };
  }
}
