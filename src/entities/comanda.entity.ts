import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
  OneToMany,
} from 'typeorm';
import { Mesa } from './mesa.entity';
import { ItemComanda } from './item-comanda.entity';

export type ComandaStatus = 'aberta' | 'fechada' | 'cancelada';

@Entity('comandas')
export class Comanda {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  codigo: string;

  @Column({ name: 'mesa_id' })
  mesaId: number;

  @ManyToOne(() => Mesa)
  @JoinColumn({ name: 'mesa_id' })
  mesa: Mesa;

  @Column({ type: 'decimal', precision: 10, scale: 2, default: 0 })
  total: number;

  @Column({
    type: 'enum',
    enum: ['aberta', 'fechada', 'cancelada'],
    default: 'aberta',
  })
  status: ComandaStatus;

  @Column({ type: 'decimal', precision: 10, scale: 2, nullable: true })
  gorjeta?: number;

  @Column({ nullable: true, name: 'chamado_garcom_at' })
  chamadoGarcomAt?: Date;

  @Column({ nullable: true, name: 'solicitacao_conta_at' })
  solicitacaoContaAt?: Date;

  @OneToMany(() => ItemComanda, (item) => item.comanda, { cascade: true })
  itens: ItemComanda[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
