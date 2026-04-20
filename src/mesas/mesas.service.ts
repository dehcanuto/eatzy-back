import {
  Injectable,
  NotFoundException,
  ConflictException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Mesa } from '../entities/mesa.entity';
import { CreateMesaDto } from './dto/create-mesa.dto';
import { UpdateMesaDto } from './dto/update-mesa.dto';

export interface EstatisticasMesas {
  total: number;
  disponiveis: number;
  ocupadas: number;
  reservadas: number;
  limpeza: number;
  taxaOcupacao: number;
}

@Injectable()
export class MesasService {
  constructor(
    @InjectRepository(Mesa)
    private mesasRepository: Repository<Mesa>,
  ) {}

  async findAll(): Promise<Mesa[]> {
    return this.mesasRepository.find({
      order: { numero: 'ASC' },
    });
  }

  async findOne(id: number): Promise<Mesa> {
    const mesa = await this.mesasRepository.findOne({ where: { id } });
    if (!mesa) {
      throw new NotFoundException('Mesa não encontrada');
    }
    return mesa;
  }

  async create(createMesaDto: CreateMesaDto): Promise<Mesa> {
    const existing = await this.mesasRepository.findOne({
      where: { numero: createMesaDto.numero },
    });
    if (existing) {
      throw new ConflictException('Mesa com este número já existe');
    }

    const mesa = this.mesasRepository.create(createMesaDto);
    return this.mesasRepository.save(mesa);
  }

  async update(id: number, updateMesaDto: UpdateMesaDto): Promise<Mesa> {
    const mesa = await this.findOne(id);

    if (updateMesaDto.numero && updateMesaDto.numero !== mesa.numero) {
      const existing = await this.mesasRepository.findOne({
        where: { numero: updateMesaDto.numero },
      });
      if (existing) {
        throw new ConflictException('Mesa com este número já existe');
      }
    }

    await this.mesasRepository.update(id, updateMesaDto);
    return this.findOne(id);
  }

  async remove(id: number): Promise<void> {
    const mesa = await this.findOne(id);
    await this.mesasRepository.remove(mesa);
  }

  async getEstatisticas(): Promise<EstatisticasMesas> {
    const mesas = await this.mesasRepository.find();

    const total = mesas.length;
    const disponiveis = mesas.filter((m) => m.status === 'disponivel').length;
    const ocupadas = mesas.filter((m) => m.status === 'ocupada').length;
    const reservadas = mesas.filter((m) => m.status === 'reservada').length;
    const limpeza = mesas.filter((m) => m.status === 'limpeza').length;

    const mesasOcupadasOuReservadas = ocupadas + reservadas;
    const taxaOcupacao =
      total > 0 ? (mesasOcupadasOuReservadas / total) * 100 : 0;

    return {
      total,
      disponiveis,
      ocupadas,
      reservadas,
      limpeza,
      taxaOcupacao: Math.round(taxaOcupacao * 10) / 10,
    };
  }
}
