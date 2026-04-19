import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';

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

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
