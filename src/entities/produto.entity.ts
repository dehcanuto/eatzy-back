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

export type ProdutoStatus = 'normal' | 'baixo' | 'critico';

@Entity('produtos')
export class Produto {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  nome: string;

  @Column()
  categoria: string;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  quantidade: number;

  @Column({
    type: 'decimal',
    precision: 10,
    scale: 2,
    name: 'quantidade_minima',
  })
  quantidadeMinima: number;

  @Column()
  unidade: string;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  preco: number;

  @Column()
  fornecedor: string;

  @Column({ type: 'date', name: 'data_ultima_entrada' })
  dataUltimaEntrada: Date;

  @Column({
    type: 'enum',
    enum: ['normal', 'baixo', 'critico'],
    default: 'normal',
  })
  status: ProdutoStatus;

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
