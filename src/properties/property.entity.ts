import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

 export enum Category {
  APARTAMENTO = 'Apartamento',
  CASA = 'Casa',
  LAND = 'Land',
  SALON = 'Salão',
  HOTEL = 'Hotel',
  VIVENDA = 'Vivenda',
  RESTAURANTE = 'Restaurante',
  HOSPEDARIA = 'Hospedaria'
}

@Entity()
export class Property {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column()
  title!: string;

  @Column()
  description!: string;

  @Column({ type: 'decimal', precision: 12, scale: 2, default: 0 })
price!: number;

  @Column({ type: 'enum', enum: Category })
  category!: Category;

  @Column()
  city!: string;

  @Column()
  address!: string;

  @Column()
  rooms!: number;

  @Column()
  bathrooms!: number;

  @Column()
  area!: number;

  @Column()
  imageUrl!: string;

  // ✅ Campos de Termos e Condições integrados
  @Column({ type: 'boolean', default: false })
  termsAccepted!: boolean; // Adicionado o '!' para consistência com seus outros campos

  @Column({ type: 'text', nullable: true })
  termsContent!: string;
}