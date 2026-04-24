import {
  Injectable,
  NotFoundException,
  ConflictException,
  BadRequestException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Comanda } from '../entities/comanda.entity';
import { ItemComanda } from '../entities/item-comanda.entity';
import { Mesa } from '../entities/mesa.entity';
import { Cardapio } from '../entities/cardapio.entity';
import { CreateComandaDto } from './dto/create-comanda.dto';
import { AddItemDto } from './dto/add-item.dto';

@Injectable()
export class ComandasService {
  constructor(
    @InjectRepository(Comanda)
    private comandasRepository: Repository<Comanda>,
    @InjectRepository(ItemComanda)
    private itensRepository: Repository<ItemComanda>,
    @InjectRepository(Mesa)
    private mesasRepository: Repository<Mesa>,
    @InjectRepository(Cardapio)
    private cardapioRepository: Repository<Cardapio>,
  ) {}

  private gerarCodigoComanda(): string {
    const timestamp = Date.now().toString(36).toUpperCase();
    const random = Math.random().toString(36).substring(2, 5).toUpperCase();
    return `CMD${timestamp}${random}`;
  }

  async findAll(restauranteId: number): Promise<Comanda[]> {
    return this.comandasRepository.find({
      where: { mesa: { restauranteId } },
      relations: ['mesa', 'itens', 'itens.itemCardapio'],
      order: { createdAt: 'DESC' },
    });
  }

  async findByMesa(mesaId: number, restauranteId: number): Promise<Comanda[]> {
    const mesa = await this.mesasRepository.findOne({
      where: { id: mesaId, restauranteId },
    });
    if (!mesa) {
      throw new NotFoundException('Mesa não encontrada');
    }

    return this.comandasRepository.find({
      where: { mesaId },
      relations: ['itens', 'itens.itemCardapio'],
      order: { createdAt: 'DESC' },
    });
  }

  async findAbertaByMesaUuid(mesaUuid: string): Promise<Comanda | null> {
    const mesa = await this.mesasRepository.findOne({
      where: { uuid: mesaUuid },
    });
    if (!mesa) {
      throw new NotFoundException('Mesa não encontrada');
    }

    return this.comandasRepository.findOne({
      where: { mesaId: mesa.id, status: 'aberta' },
      relations: ['mesa', 'itens', 'itens.itemCardapio'],
    });
  }

  async findOne(id: number, restauranteId: number): Promise<Comanda> {
    const comanda = await this.comandasRepository.findOne({
      where: { id, mesa: { restauranteId } },
      relations: ['mesa', 'itens', 'itens.itemCardapio'],
    });
    if (!comanda) {
      throw new NotFoundException('Comanda não encontrada');
    }
    return comanda;
  }

  async findByUuid(uuid: string): Promise<Comanda> {
    const comanda = await this.comandasRepository.findOne({
      where: { codigo: uuid },
      relations: ['mesa', 'itens', 'itens.itemCardapio'],
    });
    if (!comanda) {
      throw new NotFoundException('Comanda não encontrada');
    }
    return comanda;
  }

  async create(
    createComandaDto: CreateComandaDto,
    restauranteId: number,
  ): Promise<Comanda> {
    const mesa = await this.mesasRepository.findOne({
      where: { id: createComandaDto.mesaId, restauranteId },
    });
    if (!mesa) {
      throw new NotFoundException('Mesa não encontrada');
    }

    // Verifica se já existe comanda aberta para esta mesa
    const comandaAberta = await this.comandasRepository.findOne({
      where: { mesaId: createComandaDto.mesaId, status: 'aberta' },
    });
    if (comandaAberta) {
      throw new ConflictException(
        'Já existe uma comanda aberta para esta mesa',
      );
    }

    const comanda = this.comandasRepository.create({
      codigo: this.gerarCodigoComanda(),
      mesaId: createComandaDto.mesaId,
      total: 0,
      status: 'aberta',
    });

    const savedComanda = await this.comandasRepository.save(comanda);

    // Adiciona itens iniciais se fornecidos
    if (createComandaDto.itens && createComandaDto.itens.length > 0) {
      for (const itemDto of createComandaDto.itens) {
        await this.addItem(savedComanda.id, itemDto, restauranteId);
      }
      // Recarrega a comanda com os itens
      return this.findOne(savedComanda.id, restauranteId);
    }

    return savedComanda;
  }

  async addItem(
    comandaId: number,
    addItemDto: AddItemDto,
    restauranteId: number,
  ): Promise<ItemComanda> {
    const comanda = await this.findOne(comandaId, restauranteId);

    if (comanda.status !== 'aberta') {
      throw new BadRequestException(
        'Não é possível adicionar itens a uma comanda fechada',
      );
    }

    const itemCardapio = await this.cardapioRepository.findOne({
      where: { id: addItemDto.cardapioId, restauranteId },
    });
    if (!itemCardapio) {
      throw new NotFoundException('Item do cardápio não encontrado');
    }

    if (!itemCardapio.disponivel) {
      throw new BadRequestException('Item do cardápio não está disponível');
    }

    const subtotal = Number(itemCardapio.preco) * addItemDto.quantidade;

    const item = this.itensRepository.create({
      comandaId,
      cardapioId: addItemDto.cardapioId,
      quantidade: addItemDto.quantidade,
      precoUnitario: Number(itemCardapio.preco),
      subtotal,
      observacao: addItemDto.observacao,
    });

    const savedItem = await this.itensRepository.save(item);

    // Atualiza o total da comanda
    comanda.total = Number(comanda.total) + subtotal;
    await this.comandasRepository.save(comanda);

    return savedItem;
  }

  async removerItem(
    comandaId: number,
    itemId: number,
    restauranteId: number,
  ): Promise<void> {
    const comanda = await this.findOne(comandaId, restauranteId);

    if (comanda.status !== 'aberta') {
      throw new BadRequestException(
        'Não é possível remover itens de uma comanda fechada',
      );
    }

    const item = await this.itensRepository.findOne({
      where: { id: itemId, comandaId },
    });
    if (!item) {
      throw new NotFoundException('Item não encontrado na comanda');
    }

    await this.itensRepository.remove(item);

    // Atualiza o total da comanda
    comanda.total = Number(comanda.total) - Number(item.subtotal);
    await this.comandasRepository.save(comanda);
  }

  async chamarGarcom(mesaUuid: string): Promise<Comanda | null> {
    const mesa = await this.mesasRepository.findOne({
      where: { uuid: mesaUuid },
    });
    if (!mesa) {
      throw new NotFoundException('Mesa não encontrada');
    }

    let comanda = await this.comandasRepository.findOne({
      where: { mesaId: mesa.id, status: 'aberta' },
      relations: ['mesa', 'itens', 'itens.itemCardapio'],
    });

    if (!comanda) {
      // Cria comanda automaticamente se não existir
      comanda = await this.comandasRepository.save({
        codigo: this.gerarCodigoComanda(),
        mesaId: mesa.id,
        total: 0,
        status: 'aberta',
        chamadoGarcomAt: new Date(),
      });
    } else {
      comanda.chamadoGarcomAt = new Date();
      await this.comandasRepository.save(comanda);
    }

    return comanda;
  }

  async solicitarConta(mesaUuid: string): Promise<Comanda | null> {
    const mesa = await this.mesasRepository.findOne({
      where: { uuid: mesaUuid },
    });
    if (!mesa) {
      throw new NotFoundException('Mesa não encontrada');
    }

    const comanda = await this.comandasRepository.findOne({
      where: { mesaId: mesa.id, status: 'aberta' },
      relations: ['mesa', 'itens', 'itens.itemCardapio'],
    });

    if (!comanda) {
      throw new BadRequestException('Não há comanda aberta para esta mesa');
    }

    comanda.solicitacaoContaAt = new Date();
    return this.comandasRepository.save(comanda);
  }

  async fecharConta(
    comandaId: number,
    incluirGorjeta: boolean,
    restauranteId: number,
  ): Promise<Comanda> {
    const comanda = await this.findOne(comandaId, restauranteId);

    if (comanda.status !== 'aberta') {
      throw new BadRequestException('Comanda já está fechada');
    }

    comanda.status = 'fechada';

    if (incluirGorjeta) {
      comanda.gorjeta = Number(comanda.total) * 0.1;
    }

    // Atualiza a mesa para status limpeza
    await this.mesasRepository.update(comanda.mesaId, { status: 'limpeza' });

    return this.comandasRepository.save(comanda);
  }

  async cancelar(comandaId: number, restauranteId: number): Promise<Comanda> {
    const comanda = await this.findOne(comandaId, restauranteId);

    if (comanda.status !== 'aberta') {
      throw new BadRequestException(
        'Não é possível cancelar uma comanda fechada',
      );
    }

    comanda.status = 'cancelada';
    return this.comandasRepository.save(comanda);
  }

  async getComandasPendentes(restauranteId: number): Promise<Comanda[]> {
    return this.comandasRepository.find({
      where: {
        mesa: { restauranteId },
        status: 'aberta',
      },
      relations: ['mesa', 'itens', 'itens.itemCardapio'],
      order: { chamadoGarcomAt: 'DESC', solicitacaoContaAt: 'DESC' },
    });
  }
}
