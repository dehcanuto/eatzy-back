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

  async findAll(restauranteId: number): Promise<Mesa[]> {
    return this.mesasRepository.find({
      where: { restauranteId },
      order: { numero: 'ASC' },
    });
  }

  async findOne(id: number, restauranteId: number): Promise<Mesa> {
    const mesa = await this.mesasRepository.findOne({
      where: { id, restauranteId },
    });
    if (!mesa) {
      throw new NotFoundException('Mesa não encontrada');
    }
    return mesa;
  }

  async create(
    createMesaDto: CreateMesaDto,
    restauranteId: number,
  ): Promise<Mesa> {
    const existing = await this.mesasRepository.findOne({
      where: { numero: createMesaDto.numero, restauranteId },
    });
    if (existing) {
      throw new ConflictException('Mesa com este número já existe');
    }

    const mesa = this.mesasRepository.create({
      ...createMesaDto,
      restauranteId,
    });
    return this.mesasRepository.save(mesa);
  }

  async update(
    id: number,
    updateMesaDto: UpdateMesaDto,
    restauranteId: number,
  ): Promise<Mesa> {
    const mesa = await this.findOne(id, restauranteId);

    if (updateMesaDto.numero && updateMesaDto.numero !== mesa.numero) {
      const existing = await this.mesasRepository.findOne({
        where: { numero: updateMesaDto.numero, restauranteId },
      });
      if (existing) {
        throw new ConflictException('Mesa com este número já existe');
      }
    }

    await this.mesasRepository.update({ id, restauranteId }, updateMesaDto);
    return this.findOne(id, restauranteId);
  }

  async remove(id: number, restauranteId: number): Promise<void> {
    const mesa = await this.findOne(id, restauranteId);
    await this.mesasRepository.remove(mesa);
  }

  async getEstatisticas(restauranteId: number): Promise<EstatisticasMesas> {
    const mesas = await this.mesasRepository.find({ where: { restauranteId } });

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
