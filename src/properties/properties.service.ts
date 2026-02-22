import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, DeepPartial } from 'typeorm'; // Importado DeepPartial para segurança de tipos
import { Property, Category } from './property.entity';
import { MOPALE_TERMS } from './constants/terms';

@Injectable()
export class PropertiesService {
  constructor(
    @InjectRepository(Property)
    private readonly repo: Repository<Property>,
  ) {}

  async create(data: Partial<Property>): Promise<Property> {
    // Criamos um objeto de dados que segue a estrutura exata da Entity
    const propertyData: DeepPartial<Property> = {
      ...data,
      termsAccepted: true, // Registra o aceite juridicamente
      termsContent: MOPALE_TERMS, // ✅ Agora usa oficialmente o texto do seu arquivo terms.ts
    };

    const property = this.repo.create(propertyData);
    
    console.log('--- [DEBUG] PROPRIEDADE CRIADA COM SUCESSO E TERMOS VINCULADOS ---');
    return await this.repo.save(property);
  }

  async findAll(): Promise<Property[]> {
    return await this.repo.find();
  }

  async findByCategory(category: Category): Promise<Property[]> {
    return await this.repo.find({ where: { category } });
  }

  async findByCity(city: string): Promise<Property[]> {
    return await this.repo.find({ where: { city } });
  }

  async update(id: number, data: Partial<Property>): Promise<Property | null> {
    await this.repo.update(id, data);
    return await this.repo.findOne({ where: { id } });
  }

  async delete(id: number): Promise<void> {
    await this.repo.delete(id);
  }
}