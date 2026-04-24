import {
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Cardapio } from '../entities/cardapio.entity';
import { CreateCardapioDto } from './dto/create-cardapio.dto';
import { UpdateCardapioDto } from './dto/update-cardapio.dto';

@Injectable()
export class CardapioService {
  constructor(
    @InjectRepository(Cardapio)
    private cardapioRepository: Repository<Cardapio>,
  ) {}

  async findAll(restauranteId: number): Promise<Cardapio[]> {
    return this.cardapioRepository.find({
      where: { restauranteId },
      order: { nome: 'ASC' },
    });
  }

  async findAllDisponiveis(restauranteId: number): Promise<Cardapio[]> {
    return this.cardapioRepository.find({
      where: { disponivel: true, restauranteId },
      order: { nome: 'ASC' },
    });
  }

  async findOne(id: number, restauranteId: number): Promise<Cardapio> {
    const item = await this.cardapioRepository.findOne({
      where: { id, restauranteId },
    });
    if (!item) {
      throw new NotFoundException('Item do cardápio não encontrado');
    }
    return item;
  }

  async create(
    createCardapioDto: CreateCardapioDto,
    restauranteId: number,
  ): Promise<Cardapio> {
    const item = this.cardapioRepository.create({
      ...createCardapioDto,
      restauranteId,
    });
    return this.cardapioRepository.save(item);
  }

  async update(
    id: number,
    updateCardapioDto: UpdateCardapioDto,
    restauranteId: number,
  ): Promise<Cardapio> {
    const item = await this.findOne(id, restauranteId);
    await this.cardapioRepository.update({ id, restauranteId }, updateCardapioDto);
    return this.findOne(id, restauranteId);
  }

  async remove(id: number, restauranteId: number): Promise<void> {
    const item = await this.findOne(id, restauranteId);
    await this.cardapioRepository.remove(item);
  }

  async toggleDisponivel(id: number, restauranteId: number): Promise<Cardapio> {
    const item = await this.findOne(id, restauranteId);
    item.disponivel = !item.disponivel;
    return this.cardapioRepository.save(item);
  }

  async findAllCategorias(restauranteId: number): Promise<string[]> {
    const result = await this.cardapioRepository
      .createQueryBuilder('cardapio')
      .select('DISTINCT cardapio.categoria', 'categoria')
      .where('cardapio.restaurante_id = :restauranteId', { restauranteId })
      .andWhere('cardapio.categoria IS NOT NULL')
      .andWhere('cardapio.categoria != :empty', { empty: '' })
      .orderBy('cardapio.categoria', 'ASC')
      .getRawMany();

    return result.map((r: { categoria: string }) => r.categoria);
  }
}
