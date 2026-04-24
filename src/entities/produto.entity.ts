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

  // Identificação
  @Column({ nullable: true, name: 'codigo_interno' })
  codigoInterno: string;

  @Column()
  nome: string;

  @Column()
  categoria: string;

  @Column()
  unidade: string;

  // Quantidades
  @Column({ type: 'decimal', precision: 10, scale: 2 })
  quantidade: number;

  @Column({
    type: 'decimal',
    precision: 10,
    scale: 2,
    name: 'quantidade_minima',
  })
  quantidadeMinima: number;

  @Column({
    type: 'decimal',
    precision: 10,
    scale: 2,
    name: 'quantidade_maxima',
    nullable: true,
  })
  quantidadeMaxima: number;

  // Custo e fornecedor
  @Column({
    type: 'decimal',
    precision: 10,
    scale: 2,
    name: 'custo_unitario',
    nullable: true,
  })
  custoUnitario: number;

  @Column({ type: 'decimal', precision: 10, scale: 2, nullable: true })
  preco: number;

  @Column()
  fornecedor: string;

  @Column({ nullable: true, name: 'codigo_fornecedor' })
  codigoFornecedor: string;

  // Validade e armazenamento
  @Column({ type: 'date', name: 'data_validade', nullable: true })
  dataValidade: Date;

  @Column({ nullable: true, name: 'local_armazenamento' })
  localArmazenamento: string;

  @Column({ nullable: true, name: 'temperatura_ideal' })
  temperaturaIdeal: string;

  // Rastreabilidade
  @Column({ type: 'date', name: 'data_entrada', nullable: true })
  dataEntrada: Date;

  @Column({ type: 'date', name: 'data_ultima_entrada', nullable: true })
  dataUltimaEntrada: Date;

  @Column({ nullable: true, name: 'numero_lote_nota' })
  numeroLoteNota: string;

  @Column({ name: 'usuario_registro_id', nullable: true })
  usuarioRegistroId: number;

  // Status
  @Column({ default: true })
  ativo: boolean;

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
