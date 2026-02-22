import {
  Injectable,
  UnauthorizedException,
  ForbiddenException,
} from '@nestjs/common';
import { UsersService } from '../users/users.service';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
    private configService: ConfigService,
  ) {}

  // 🔎 Validar usuário por email ou telefone
  async validateUser(login: string, password: string) {
    const user =
      (await this.usersService.findByEmail(login)) ||
      (await this.usersService.findByPhone(login));

    // Verifica se o usuário existe e se tem senha (segurança para logins sociais/OAuth)
    if (!user || !user.password) {
      throw new UnauthorizedException('Credenciais inválidas');
    }

    const passwordValid = await bcrypt.compare(password, user.password);
    if (!passwordValid) {
      throw new UnauthorizedException('Senha inválida');
    }

    return user;
  }

  // 🔐 LOGIN (Gera tokens e atualiza o hash do Refresh no banco)
  async login(login: string, password: string) {
    const user = await this.validateUser(login, password);
    const tokens = await this.generateTokens(user.id);

    await this.updateRefreshToken(user.id, tokens.refreshToken);

    return {
      ...tokens,
      user: { id: user.id, name: user.name, email: user.email }, // Retorno amigável
    };
  }

  // 🎟 Gerar tokens (Access + Refresh)
  async generateTokens(userId: number) {
    const payload = { sub: userId };

    // Buscando segredos do .env de forma centralizada
    const accessSecret = this.configService.get<string>('JWT_ACCESS_SECRET') || 'ACCESS_SECRET';
    const refreshSecret = this.configService.get<string>('JWT_REFRESH_SECRET') || 'REFRESH_SECRET';

    const accessToken = this.jwtService.sign(payload, {
      secret: accessSecret,
      expiresIn: '1h', // Tempo maior para facilitar seus testes no Insomnia
    });

    const refreshToken = this.jwtService.sign(payload, {
      secret: refreshSecret,
      expiresIn: '7d',
    });

    return { accessToken, refreshToken };
  }

  // 🔄 Atualizar Refresh Token no banco (armazenando apenas o hash)
  async updateRefreshToken(userId: number, refreshToken: string | null) {
    let hashed = null;
    if (refreshToken) {
      hashed = await bcrypt.hash(refreshToken, 10);
    }
    await this.usersService.updateRefreshToken(userId, hashed);
  }

  // ♻️ Renovar Access Token usando o Refresh Token
  async refreshTokens(userId: number, refreshToken: string) {
    const user = await this.usersService.findById(userId);

    if (!user || !user.refreshToken) {
      throw new ForbiddenException('Acesso negado ou usuário não logado');
    }

    const isMatch = await bcrypt.compare(refreshToken, user.refreshToken);
    if (!isMatch) {
      throw new ForbiddenException('Refresh Token inválido ou expirado');
    }

    const tokens = await this.generateTokens(user.id);
    await this.updateRefreshToken(user.id, tokens.refreshToken);

    return tokens;
  }

  // 🚪 Logout
  async logout(userId: number) {
    await this.usersService.updateRefreshToken(userId, null);
  }
}