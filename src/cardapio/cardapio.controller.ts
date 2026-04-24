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
import { TenantGuard } from '../auth/guards/tenant.guard';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { CreateCardapioDto } from './dto/create-cardapio.dto';
import { UpdateCardapioDto } from './dto/update-cardapio.dto';
import { CardapioResponseDto } from './dto/cardapio-response.dto';
import { Cardapio } from '../entities/cardapio.entity';

@ApiTags('cardapio')
@Controller('cardapio')
@UseGuards(JwtAuthGuard, TenantGuard)
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
  async findAll(
    @CurrentUser('restauranteId') restauranteId: number,
  ): Promise<Cardapio[]> {
    return this.cardapioService.findAll(restauranteId);
  }

  @Get('disponiveis')
  @ApiOperation({ summary: 'Listar itens disponíveis' })
  @ApiResponse({
    status: 200,
    description: 'Lista de itens disponíveis retornada com sucesso',
    type: [CardapioResponseDto],
  })
  async findAllDisponiveis(
    @CurrentUser('restauranteId') restauranteId: number,
  ): Promise<Cardapio[]> {
    return this.cardapioService.findAllDisponiveis(restauranteId);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Buscar item por ID' })
  @ApiResponse({
    status: 200,
    description: 'Item encontrado',
    type: CardapioResponseDto,
  })
  @ApiResponse({ status: 404, description: 'Item não encontrado' })
  async findOne(
    @Param('id', ParseIntPipe) id: number,
    @CurrentUser('restauranteId') restauranteId: number,
  ): Promise<Cardapio> {
    return this.cardapioService.findOne(id, restauranteId);
  }

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Criar novo item no cardápio' })
  @ApiResponse({
    status: 201,
    description: 'Item criado com sucesso',
    type: CardapioResponseDto,
  })
  async create(
    @Body() createCardapioDto: CreateCardapioDto,
    @CurrentUser('restauranteId') restauranteId: number,
  ): Promise<Cardapio> {
    return this.cardapioService.create(createCardapioDto, restauranteId);
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
    @CurrentUser('restauranteId') restauranteId: number,
  ): Promise<Cardapio> {
    return this.cardapioService.update(id, updateCardapioDto, restauranteId);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Remover item do cardápio' })
  @ApiResponse({ status: 204, description: 'Item removido com sucesso' })
  @ApiResponse({ status: 404, description: 'Item não encontrado' })
  async remove(
    @Param('id', ParseIntPipe) id: number,
    @CurrentUser('restauranteId') restauranteId: number,
  ): Promise<void> {
    return this.cardapioService.remove(id, restauranteId);
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
    @CurrentUser('restauranteId') restauranteId: number,
  ): Promise<Cardapio> {
    return this.cardapioService.toggleDisponivel(id, restauranteId);
  }

  @Get('categorias')
  @ApiOperation({ summary: 'Listar todas as categorias únicas' })
  @ApiResponse({
    status: 200,
    description: 'Lista de categorias retornada com sucesso',
    type: [String],
  })
  async findAllCategorias(
    @CurrentUser('restauranteId') restauranteId: number,
  ): Promise<string[]> {
    return this.cardapioService.findAllCategorias(restauranteId);
  }
}
