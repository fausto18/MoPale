import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Param,
  Body,
  ParseIntPipe,
  UseInterceptors,
  UploadedFile,
  UseGuards,
  Req,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { PropertiesService } from './properties.service';
import { Property, Category } from './property.entity';
import { CreatePropertyDto } from './dto/create-property.dto';
import { extname } from 'path';
import { AuthGuard } from '../auth/guards/jwt-auth.guard'; // Importe seu Guard manual
import { Request } from 'express';

@Controller('properties')
export class PropertiesController {
  constructor(private readonly propertiesService: PropertiesService) {}

  // 🚀 Criar propriedade protegida por Token e com Termos
  @UseGuards(AuthGuard) // Apenas usuários logados podem cadastrar
  @Post()
  @UseInterceptors(
    FileInterceptor('image', {
      storage: diskStorage({
        destination: './uploads',
        filename: (req, file, cb) => {
          const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
          const ext = extname(file.originalname);
          cb(null, `${file.fieldname}-${uniqueSuffix}${ext}`);
        },
      }),
      fileFilter: (req, file, cb) => {
        if (!file.mimetype.match(/\/(jpg|jpeg|png|gif)$/)) {
          return cb(new Error('Apenas imagens são permitidas!'), false);
        }
        cb(null, true);
      },
    }),
  )
  async create(
    @Body() body: CreatePropertyDto,
    @UploadedFile() file: Express.Multer.File,
    @Req() req: Request, // Para acessar o payload do token se precisar
  ): Promise<Property> {
    if (file) {
      body.imageUrl = `/uploads/${file.filename}`;
    }

    // O Service já está configurado para injetar os termos automaticamente
    console.log('--- [DEBUG] REQUISIÇÃO DE CADASTRO RECEBIDA ---');
    return await this.propertiesService.create(body);
  }

  @Get()
  async findAll(): Promise<Property[]> {
    return await this.propertiesService.findAll();
  }

  // Rota para o Frontend buscar os termos antes do usuário aceitar
  @Get('terms/current')
  async getTerms() {
    return {
      terms: `TERMOS E CONDIÇÕES MOPALE (v1.0)
      1. O anunciante declara que a propriedade está disponível e as fotos são reais.
      2. A Mopale reserva-se o direito de remover anúncios fraudulentos.
      3. Ao publicar, você concorda com a taxa de intermediação vigente.`
    };
  }

  @Get('category/:category')
  async findByCategory(@Param('category') category: Category): Promise<Property[]> {
    return await this.propertiesService.findByCategory(category);
  }

  @Get('city/:city')
  async findByCity(@Param('city') city: string): Promise<Property[]> {
    return await this.propertiesService.findByCity(city);
  }

  @UseGuards(AuthGuard) // Protege também a atualização
  @Put(':id')
  @UseInterceptors(
    FileInterceptor('image', {
      storage: diskStorage({
        destination: './uploads',
        filename: (req, file, cb) => {
          const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
          const ext = extname(file.originalname);
          cb(null, `${file.fieldname}-${uniqueSuffix}${ext}`);
        },
      }),
      fileFilter: (req, file, cb) => {
        if (!file.mimetype.match(/\/(jpg|jpeg|png|gif)$/)) {
          return cb(new Error('Apenas imagens são permitidas!'), false);
        }
        cb(null, true);
      },
    }),
  )
  async updateProperty(
    @Param('id', ParseIntPipe) id: number,
    @Body() body: Partial<CreatePropertyDto>,
    @UploadedFile() file?: Express.Multer.File,
  ): Promise<Property | null> {
    if (file) {
      body.imageUrl = `/uploads/${file.filename}`;
    }
    return this.propertiesService.update(id, body);
  }

  @UseGuards(AuthGuard)
  @Delete(':id')
  async delete(@Param('id', ParseIntPipe) id: number): Promise<void> {
    return await this.propertiesService.delete(id);
  }
}