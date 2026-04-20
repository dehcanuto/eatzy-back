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

  async findAll(): Promise<Cardapio[]> {
    return this.cardapioRepository.find({
      order: { nome: 'ASC' },
    });
  }

  async findAllDisponiveis(): Promise<Cardapio[]> {
    return this.cardapioRepository.find({
      where: { disponivel: true },
      order: { nome: 'ASC' },
    });
  }

  async findOne(id: number): Promise<Cardapio> {
    const item = await this.cardapioRepository.findOne({ where: { id } });
    if (!item) {
      throw new NotFoundException('Item do cardápio não encontrado');
    }
    return item;
  }

  async create(createCardapioDto: CreateCardapioDto): Promise<Cardapio> {
    const item = this.cardapioRepository.create(createCardapioDto);
    return this.cardapioRepository.save(item);
  }

  async update(id: number, updateCardapioDto: UpdateCardapioDto): Promise<Cardapio> {
    const item = await this.findOne(id);
    await this.cardapioRepository.update(id, updateCardapioDto);
    return this.findOne(id);
  }

  async remove(id: number): Promise<void> {
    const item = await this.findOne(id);
    await this.cardapioRepository.remove(item);
  }

  async toggleDisponivel(id: number): Promise<Cardapio> {
    const item = await this.findOne(id);
    item.disponivel = !item.disponivel;
    return this.cardapioRepository.save(item);
  }
}
