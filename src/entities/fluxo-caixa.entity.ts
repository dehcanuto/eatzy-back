import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { Restaurante } from './restaurante.entity';

export type FluxoCaixaTipo = 'entrada' | 'saida';

@Entity('fluxo_caixa')
export class FluxoCaixa {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  descricao: string;

  @Column({
    type: 'enum',
    enum: ['entrada', 'saida'],
  })
  tipo: FluxoCaixaTipo;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  valor: number;

  @Column({ type: 'date' })
  data: Date;

  @Column()
  categoria: string;

  @Column({ nullable: true, name: 'forma_pagamento' })
  formaPagamento?: string;

  @Column({ nullable: true })
  origem?: string;

  @Column({ name: 'restaurante_id' })
  restauranteId: number;

  @ManyToOne(() => Restaurante)
  @JoinColumn({ name: 'restaurante_id' })
  restaurante: Restaurante;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
