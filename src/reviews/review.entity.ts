import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';
import { Property } from '../properties/property.entity';
import { User } from '../users/user.entity';

@Entity()
export class Review {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column()
  rating!: number;

  @Column()
  comment!: string;

  @ManyToOne(() => Property, (property) => property.id)
  property!: Property;

  @ManyToOne(() => User, (user) => user.id)
  user!: User;
}
