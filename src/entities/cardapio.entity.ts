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

@Entity('cardapio')
export class Cardapio {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  nome: string;

  @Column({ nullable: true })
  descricao: string;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  preco: number;

  @Column({ nullable: true })
  categoria: string;

  @Column({ default: true })
  disponivel: boolean;

  @Column({ nullable: true, name: 'imagem_url' })
  imagemUrl: string;

  @Column({ nullable: true, name: 'tempo_preparo' })
  tempoPreparo: number;

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
