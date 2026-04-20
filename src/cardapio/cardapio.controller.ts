import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Body,
  Param,
  HttpCode,
  HttpStatus,
  UseGuards,
  ParseIntPipe,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
} from '@nestjs/swagger';
import { CardapioService } from './cardapio.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CreateCardapioDto } from './dto/create-cardapio.dto';
import { UpdateCardapioDto } from './dto/update-cardapio.dto';
import { CardapioResponseDto } from './dto/cardapio-response.dto';
import { Cardapio } from '../entities/cardapio.entity';

@ApiTags('cardapio')
@Controller('cardapio')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class CardapioController {
  constructor(private readonly cardapioService: CardapioService) {}

  @Get()
  @ApiOperation({ summary: 'Listar todos os itens do cardápio' })
  @ApiResponse({
    status: 200,
    description: 'Lista de itens retornada com sucesso',
    type: [CardapioResponseDto],
  })
  async findAll(): Promise<Cardapio[]> {
    return this.cardapioService.findAll();
  }

  @Get('disponiveis')
  @ApiOperation({ summary: 'Listar itens disponíveis' })
  @ApiResponse({
    status: 200,
    description: 'Lista de itens disponíveis retornada com sucesso',
    type: [CardapioResponseDto],
  })
  async findAllDisponiveis(): Promise<Cardapio[]> {
    return this.cardapioService.findAllDisponiveis();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Buscar item por ID' })
  @ApiResponse({
    status: 200,
    description: 'Item encontrado',
    type: CardapioResponseDto,
  })
  @ApiResponse({ status: 404, description: 'Item não encontrado' })
  async findOne(@Param('id', ParseIntPipe) id: number): Promise<Cardapio> {
    return this.cardapioService.findOne(id);
  }

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Criar novo item no cardápio' })
  @ApiResponse({
    status: 201,
    description: 'Item criado com sucesso',
    type: CardapioResponseDto,
  })
  async create(@Body() createCardapioDto: CreateCardapioDto): Promise<Cardapio> {
    return this.cardapioService.create(createCardapioDto);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Atualizar item do cardápio' })
  @ApiResponse({
    status: 200,
    description: 'Item atualizado com sucesso',
    type: CardapioResponseDto,
  })
  @ApiResponse({ status: 404, description: 'Item não encontrado' })
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateCardapioDto: UpdateCardapioDto,
  ): Promise<Cardapio> {
    return this.cardapioService.update(id, updateCardapioDto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Remover item do cardápio' })
  @ApiResponse({ status: 204, description: 'Item removido com sucesso' })
  @ApiResponse({ status: 404, description: 'Item não encontrado' })
  async remove(@Param('id', ParseIntPipe) id: number): Promise<void> {
    return this.cardapioService.remove(id);
  }

  @Patch(':id/toggle')
  @ApiOperation({ summary: 'Alternar disponibilidade do item' })
  @ApiResponse({
    status: 200,
    description: 'Status de disponibilidade alterado',
    type: CardapioResponseDto,
  })
  @ApiResponse({ status: 404, description: 'Item não encontrado' })
  async toggleDisponivel(
    @Param('id', ParseIntPipe) id: number,
  ): Promise<Cardapio> {
    return this.cardapioService.toggleDisponivel(id);
  }
}
