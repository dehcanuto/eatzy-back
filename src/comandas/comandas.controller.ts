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
  Query,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
} from '@nestjs/swagger';
import { ComandasService } from './comandas.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { TenantGuard } from '../auth/guards/tenant.guard';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { CreateComandaDto } from './dto/create-comanda.dto';
import { AddItemDto } from './dto/add-item.dto';
import { ComandaResponseDto } from './dto/comanda-response.dto';
import { Comanda } from '../entities/comanda.entity';

@ApiTags('comandas')
@Controller('comandas')
@UseGuards(JwtAuthGuard, TenantGuard)
@ApiBearerAuth()
export class ComandasController {
  constructor(private readonly comandasService: ComandasService) {}

  @Get()
  @ApiOperation({ summary: 'Listar todas as comandas' })
  @ApiResponse({
    status: 200,
    description: 'Lista de comandas retornada com sucesso',
    type: [ComandaResponseDto],
  })
  async findAll(
    @CurrentUser('restauranteId') restauranteId: number,
  ): Promise<Comanda[]> {
    return this.comandasService.findAll(restauranteId);
  }

  @Get('pendentes')
  @ApiOperation({ summary: 'Listar comandas pendentes (abertas)' })
  @ApiResponse({
    status: 200,
    description: 'Lista de comandas pendentes retornada com sucesso',
    type: [ComandaResponseDto],
  })
  async getPendentes(
    @CurrentUser('restauranteId') restauranteId: number,
  ): Promise<Comanda[]> {
    return this.comandasService.getComandasPendentes(restauranteId);
  }

  @Get('mesa/:mesaId')
  @ApiOperation({ summary: 'Buscar comandas por mesa' })
  @ApiResponse({
    status: 200,
    description: 'Comandas encontradas',
    type: [ComandaResponseDto],
  })
  async findByMesa(
    @Param('mesaId', ParseIntPipe) mesaId: number,
    @CurrentUser('restauranteId') restauranteId: number,
  ): Promise<Comanda[]> {
    return this.comandasService.findByMesa(mesaId, restauranteId);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Buscar comanda por ID' })
  @ApiResponse({
    status: 200,
    description: 'Comanda encontrada',
    type: ComandaResponseDto,
  })
  @ApiResponse({ status: 404, description: 'Comanda não encontrada' })
  async findOne(
    @Param('id', ParseIntPipe) id: number,
    @CurrentUser('restauranteId') restauranteId: number,
  ): Promise<Comanda> {
    return this.comandasService.findOne(id, restauranteId);
  }

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Criar nova comanda' })
  @ApiResponse({
    status: 201,
    description: 'Comanda criada com sucesso',
    type: ComandaResponseDto,
  })
  @ApiResponse({
    status: 409,
    description: 'Já existe comanda aberta para esta mesa',
  })
  async create(
    @Body() createComandaDto: CreateComandaDto,
    @CurrentUser('restauranteId') restauranteId: number,
  ): Promise<Comanda> {
    return this.comandasService.create(createComandaDto, restauranteId);
  }

  @Post(':id/itens')
  @ApiOperation({ summary: 'Adicionar item à comanda' })
  @ApiResponse({
    status: 201,
    description: 'Item adicionado com sucesso',
  })
  async addItem(
    @Param('id', ParseIntPipe) id: number,
    @Body() addItemDto: AddItemDto,
    @CurrentUser('restauranteId') restauranteId: number,
  ) {
    return this.comandasService.addItem(id, addItemDto, restauranteId);
  }

  @Delete(':id/itens/:itemId')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Remover item da comanda' })
  @ApiResponse({ status: 204, description: 'Item removido com sucesso' })
  async removeItem(
    @Param('id', ParseIntPipe) id: number,
    @Param('itemId', ParseIntPipe) itemId: number,
    @CurrentUser('restauranteId') restauranteId: number,
  ): Promise<void> {
    return this.comandasService.removerItem(id, itemId, restauranteId);
  }

  @Patch(':id/fechar')
  @ApiOperation({ summary: 'Fechar comanda' })
  @ApiResponse({
    status: 200,
    description: 'Comanda fechada com sucesso',
    type: ComandaResponseDto,
  })
  async fecharConta(
    @Param('id', ParseIntPipe) id: number,
    @Query('gorjeta') incluirGorjeta: boolean,
    @CurrentUser('restauranteId') restauranteId: number,
  ): Promise<Comanda> {
    return this.comandasService.fecharConta(id, incluirGorjeta, restauranteId);
  }

  @Patch(':id/cancelar')
  @ApiOperation({ summary: 'Cancelar comanda' })
  @ApiResponse({
    status: 200,
    description: 'Comanda cancelada com sucesso',
    type: ComandaResponseDto,
  })
  async cancelar(
    @Param('id', ParseIntPipe) id: number,
    @CurrentUser('restauranteId') restauranteId: number,
  ): Promise<Comanda> {
    return this.comandasService.cancelar(id, restauranteId);
  }
}
