import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  Unique,
} from 'typeorm';
import type { UserRole } from './user.entity';

@Entity('user_restaurante')
@Unique(['userId', 'restauranteId'])
export class UserRestaurante {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'user_id' })
  userId: number;

  @Column({ name: 'restaurante_id' })
  restauranteId: number;

  @Column({
    type: 'enum',
    enum: ['admin', 'gerente', 'garcom', 'cozinha', 'financeiro'],
    default: 'garcom',
  })
  role: UserRole;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;
}
