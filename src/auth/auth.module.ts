import { Module, forwardRef } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { UsersModule } from '../users/users.module';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';

@Module({
  imports: [
    // Mantemos o forwardRef para evitar dependência circular com Users
    forwardRef(() => UsersModule), 
    
    // Configuração do JWT
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        // Ele tenta pegar do .env, se não achar usa 'MOPALE_SECRET'
        secret: config.get<string>('JWT_ACCESS_SECRET') || 'MOPALE_SECRET',
        signOptions: { expiresIn: '1h' },
      }),
      global: true, // 👈 IMPORTANTE: Torna o JwtService visível para o seu AuthGuard manual
    }),
  ],
  providers: [AuthService], 
  controllers: [AuthController],
  // 🚀 Exportamos o JwtModule para que outros módulos usem o Guard
  exports: [AuthService, JwtModule], 
})
export class AuthModule {}