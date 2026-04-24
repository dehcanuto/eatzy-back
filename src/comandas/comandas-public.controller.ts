import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  HttpCode,
  HttpStatus,
  NotFoundException,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { ComandasService } from './comandas.service';
import { CardapioService } from '../cardapio/cardapio.service';
import { AddItemDto } from './dto/add-item.dto';
import { ComandaResponseDto } from './dto/comanda-response.dto';
import { Comanda } from '../entities/comanda.entity';
import { Cardapio } from '../entities/cardapio.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Mesa } from '../entities/mesa.entity';

@ApiTags('comandas-public')
@Controller('public/comandas')
export class ComandasPublicController {
  constructor(
    private readonly comandasService: ComandasService,
    private readonly cardapioService: CardapioService,
    @InjectRepository(Mesa)
    private mesasRepository: Repository<Mesa>,
  ) {}

  @Get('mesa/:uuid')
  @ApiOperation({ summary: 'Buscar comanda aberta por UUID da mesa (público)' })
  @ApiResponse({
    status: 200,
    description: 'Comanda encontrada',
    type: ComandaResponseDto,
  })
  @ApiResponse({ status: 404, description: 'Mesa ou comanda não encontrada' })
  async findByMesaUuid(
    @Param('uuid') uuid: string,
  ): Promise<{ comanda: Comanda | null; mesa: Mesa }> {
    const mesa = await this.mesasRepository.findOne({
      where: { uuid },
    });
    if (!mesa) {
      throw new NotFoundException('Mesa não encontrada');
    }

    const comanda = await this.comandasService.findAbertaByMesaUuid(uuid);
    return { comanda, mesa };
  }

  @Get('mesa/:uuid/cardapio')
  @ApiOperation({ summary: 'Listar cardápio disponível para a mesa (público)' })
  @ApiResponse({
    status: 200,
    description: 'Cardápio retornado com sucesso',
  })
  async getCardapioByMesaUuid(
    @Param('uuid') uuid: string,
  ): Promise<{ cardapio: Cardapio[]; mesa: Mesa }> {
    const mesa = await this.mesasRepository.findOne({
      where: { uuid },
    });
    if (!mesa) {
      throw new NotFoundException('Mesa não encontrada');
    }

    const cardapio = await this.cardapioService.findAllDisponiveis(
      mesa.restauranteId,
    );
    return { cardapio, mesa };
  }

  @Post('mesa/:uuid/chamar-garcom')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Chamar garçom para a mesa (público)' })
  @ApiResponse({
    status: 200,
    description: 'Garçom chamado com sucesso',
    type: ComandaResponseDto,
  })
  async chamarGarcom(@Param('uuid') uuid: string): Promise<Comanda> {
    const comanda = await this.comandasService.chamarGarcom(uuid);
    if (!comanda) {
      throw new NotFoundException('Erro ao chamar garçom');
    }
    return comanda;
  }

  @Post('mesa/:uuid/solicitar-conta')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Solicitar finalização da conta (público)' })
  @ApiResponse({
    status: 200,
    description: 'Conta solicitada com sucesso',
    type: ComandaResponseDto,
  })
  async solicitarConta(@Param('uuid') uuid: string): Promise<Comanda> {
    const comanda = await this.comandasService.solicitarConta(uuid);
    if (!comanda) {
      throw new NotFoundException('Não há comanda aberta para esta mesa');
    }
    return comanda;
  }

  @Post('mesa/:uuid/itens')
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Adicionar item à comanda da mesa (público)' })
  @ApiResponse({
    status: 201,
    description: 'Item adicionado com sucesso',
  })
  async addItemByMesaUuid(
    @Param('uuid') uuid: string,
    @Body() addItemDto: AddItemDto,
  ) {
    // Busca ou cria comanda para a mesa
    let comanda = await this.comandasService.findAbertaByMesaUuid(uuid);

    if (!comanda) {
      const mesa = await this.mesasRepository.findOne({
        where: { uuid },
      });
      if (!mesa) {
        throw new NotFoundException('Mesa não encontrada');
      }

      // Cria nova comanda
      comanda = await this.comandasService.create(
        { mesaId: mesa.id },
        mesa.restauranteId,
      );
    }

    const mesa = await this.mesasRepository.findOne({
      where: { uuid },
    });
    if (!mesa) {
      throw new NotFoundException('Mesa não encontrada');
    }

    return this.comandasService.addItem(
      comanda.id,
      addItemDto,
      mesa.restauranteId,
    );
  }
}
