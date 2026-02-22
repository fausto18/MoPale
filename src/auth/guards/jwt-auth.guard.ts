import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { Request } from 'express';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(
    private jwtService: JwtService,
    private configService: ConfigService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const token = this.extractTokenFromHeader(request);

    if (!token) {
      console.log('--- [DEBUG] NENHUM TOKEN RECEBIDO NO HEADER ---');
      throw new UnauthorizedException('Token não encontrado');
    }

    try {
      const secret = this.configService.get<string>('JWT_ACCESS_SECRET') || 'MOPALE_SECRET';
      
      console.log('--- [DEBUG] TENTANDO VALIDAR TOKEN ---');
      console.log('Chave (Secret) usada:', secret);

      const payload = await this.jwtService.verifyAsync(token, {
        secret: secret,
      });
      
      // Se chegou aqui, o token é válido
      request['user'] = payload;
      console.log('--- [DEBUG] TOKEN VALIDADO COM SUCESSO! ---');
      console.log('Usuário (Payload):', payload);
      
    } catch (error: any) {
      // O ': any' resolve o erro TS18046 que travava sua compilação
      console.error('--- [DEBUG] ERRO NA VALIDAÇÃO ---');
      console.error('Mensagem do Erro:', error.message);
      
      throw new UnauthorizedException('Token inválido ou expirado');
    }
    
    return true;
  }

  private extractTokenFromHeader(request: Request): string | undefined {
    const [type, token] = request.headers.authorization?.split(' ') ?? [];
    return type === 'Bearer' ? token : undefined;
  }
}