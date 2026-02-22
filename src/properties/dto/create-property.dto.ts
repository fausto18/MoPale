import { IsString, IsNotEmpty, IsNumber, IsEnum, IsOptional } from 'class-validator';
import { Category } from '../property.entity';
import { Type, Transform } from 'class-transformer';

export class CreatePropertyDto {
  @IsString()
  @IsNotEmpty()
  title!: string;

  @IsString()
  @IsNotEmpty()
  description!: string;

  // 1º Transformamos (Limpamos a "sujeira" do Kz, pontos e espaços)
  @Transform(({ value }) => {
    if (typeof value === 'string') {
      const cleanValue = value
        .replace(/[^0-9,]/g, '') // Remove tudo que não for número ou vírgula
        .replace(',', '.');      // Converte a vírgula decimal para ponto
      return parseFloat(cleanValue);
    }
    return value;
  })
  // 2º Validamos (Agora o valor já é um número puro como 25000.00)
  @IsNumber({}, { message: 'O preço deve ser um número válido' })
  @IsNotEmpty()
  price!: number;

  @IsEnum(Category, {
    message: `A categoria deve ser uma das seguintes: ${Object.values(Category).join(', ')}`,
  })
  category!: Category;

  @IsString()
  @IsNotEmpty()
  city!: string;

  @IsString()
  @IsNotEmpty()
  address!: string;

  @IsNumber()
  @IsOptional()
  @Type(() => Number)
  rooms?: number;

  @IsNumber()
  @IsOptional()
  @Type(() => Number)
  bathrooms?: number;

  @IsNumber()
  @IsOptional()
  @Type(() => Number)
  area?: number;

  @IsString()
  @IsOptional()
  imageUrl?: string;
}