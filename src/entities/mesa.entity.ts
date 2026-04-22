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

export type MesaStatus = 'disponivel' | 'ocupada' | 'reservada' | 'limpeza';

@Entity('mesas')
export class Mesa {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  numero: string;

  @Column({ type: 'int' })
  capacidade: number;

  @Column({
    type: 'enum',
    enum: ['disponivel', 'ocupada', 'reservada', 'limpeza'],
    default: 'disponivel',
  })
  status: MesaStatus;

  @Column({ nullable: true })
  cliente?: string;

  @Column({ nullable: true, name: 'horario_reserva' })
  horarioReserva?: string;

  @Column({ type: 'decimal', precision: 10, scale: 2, nullable: true })
  valor?: number;

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
