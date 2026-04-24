import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { Comanda } from './comanda.entity';
import { Cardapio } from './cardapio.entity';

export type ItemComandaStatus =
  | 'pendente'
  | 'preparando'
  | 'pronto'
  | 'entregue';

@Entity('itens_comanda')
export class ItemComanda {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'comanda_id' })
  comandaId: number;

  @ManyToOne(() => Comanda, (comanda) => comanda.itens)
  @JoinColumn({ name: 'comanda_id' })
  comanda: Comanda;

  @Column({ name: 'cardapio_id' })
  cardapioId: number;

  @ManyToOne(() => Cardapio)
  @JoinColumn({ name: 'cardapio_id' })
  itemCardapio: Cardapio;

  @Column()
  quantidade: number;

  @Column({ type: 'decimal', precision: 10, scale: 2, name: 'preco_unitario' })
  precoUnitario: number;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  subtotal: number;

  @Column({ nullable: true })
  observacao?: string;

  @Column({
    type: 'enum',
    enum: ['pendente', 'preparando', 'pronto', 'entregue'],
    default: 'pendente',
    name: 'status_pedido',
  })
  statusPedido: ItemComandaStatus;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
