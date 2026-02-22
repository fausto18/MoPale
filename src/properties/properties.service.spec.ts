import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Property, Category } from './property.entity';
import { CreatePropertyDto } from './dto/create-property.dto';

@Injectable()
export class PropertiesService {
  constructor(
    @InjectRepository(Property)
    private readonly propertyRepository: Repository<Property>,
  ) {}

  // Criar propriedade
  async create(createPropertyDto: CreatePropertyDto): Promise<Property> {
    // Validar categoria
    if (!Object.values(Category).includes(createPropertyDto.category)) {
      throw new Error(`Categoria inválida. Valores válidos: ${Object.values(Category).join(', ')}`);
    }

    const property = this.propertyRepository.create(createPropertyDto);
    return await this.propertyRepository.save(property);
  }

  // Buscar todas
  async findAll(): Promise<Property[]> {
    return await this.propertyRepository.find();
  }

  // Buscar por categoria
  async findByCategory(category: Category): Promise<Property[]> {
    if (!Object.values(Category).includes(category)) {
      throw new Error(`Categoria inválida. Valores válidos: ${Object.values(Category).join(', ')}`);
    }
    return await this.propertyRepository.find({ where: { category } });
  }

  // Buscar por cidade
  async findByCity(city: string): Promise<Property[]> {
    return await this.propertyRepository.find({ where: { city } });
  }

  // Atualizar propriedade
  async update(
    id: number,
    updatePropertyDto: Partial<CreatePropertyDto>,
  ): Promise<Property | null> {
    const property = await this.propertyRepository.findOne({ where: { id } });
    if (!property) {
      throw new NotFoundException(`Propriedade com ID ${id} não encontrada`);
    }

    if (updatePropertyDto.category && !Object.values(Category).includes(updatePropertyDto.category)) {
      throw new Error(`Categoria inválida. Valores válidos: ${Object.values(Category).join(', ')}`);
    }

    Object.assign(property, updatePropertyDto);
    return await this.propertyRepository.save(property);
  }

  // Deletar propriedade
  async delete(id: number): Promise<void> {
    const result = await this.propertyRepository.delete(id);
    if (result.affected === 0) {
      throw new NotFoundException(`Propriedade com ID ${id} não encontrada`);
    }
  }
}
