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

export type ContaPagarStatus = 'pendente' | 'pago' | 'atrasado';

@Entity('contas_pagar')
export class ContaPagar {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  descricao: string;

  @Column()
  categoria: string;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  valor: number;

  @Column({ type: 'date', name: 'data_vencimento' })
  dataVencimento: Date;

  @Column({ type: 'date', name: 'data_pagamento', nullable: true })
  dataPagamento?: Date;

  @Column({
    type: 'enum',
    enum: ['pendente', 'pago', 'atrasado'],
    default: 'pendente',
  })
  status: ContaPagarStatus;

  @Column()
  fornecedor: string;

  @Column({ nullable: true, name: 'forma_pagamento' })
  formaPagamento?: string;

  @Column({ type: 'text', nullable: true })
  observacao?: string;

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
