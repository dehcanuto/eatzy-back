import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';

export type RestauranteStatus = 'ativo' | 'inativo' | 'suspenso';

@Entity('restaurantes')
export class Restaurante {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  nome: string;

  @Column({ unique: true, nullable: true })
  cnpj?: string;

  @Column({ nullable: true })
  telefone?: string;

  @Column({ nullable: true })
  endereco?: string;

  @Column({ nullable: true })
  logoUrl?: string;

  @Column({
    type: 'enum',
    enum: ['ativo', 'inativo', 'suspenso'],
    default: 'ativo',
  })
  status: RestauranteStatus;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
