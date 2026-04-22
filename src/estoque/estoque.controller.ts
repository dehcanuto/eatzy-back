import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Body,
  Param,
  Query,
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
  ApiQuery,
} from '@nestjs/swagger';
import { EstoqueService } from './estoque.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { TenantGuard } from '../auth/guards/tenant.guard';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { CreateProdutoDto } from './dto/create-produto.dto';
import { UpdateProdutoDto } from './dto/update-produto.dto';
import { ProdutoResponseDto } from './dto/produto-response.dto';
import { Produto } from '../entities/produto.entity';
import { EstatisticasEstoque } from './estoque.service';

@ApiTags('estoque')
@Controller('estoque')
@UseGuards(JwtAuthGuard, TenantGuard)
@ApiBearerAuth()
export class EstoqueController {
  constructor(private readonly estoqueService: EstoqueService) {}

  @Get()
  @ApiOperation({ summary: 'Listar todos os produtos' })
  @ApiQuery({
    name: 'categoria',
    required: false,
    description: 'Filtrar por categoria',
  })
  @ApiQuery({
    name: 'status',
    required: false,
    description: 'Filtrar por status (normal, baixo, critico)',
  })
  @ApiQuery({
    name: 'search',
    required: false,
    description: 'Buscar por nome ou fornecedor',
  })
  @ApiResponse({
    status: 200,
    description: 'Lista de produtos retornada com sucesso',
    type: [ProdutoResponseDto],
  })
  async findAll(
    @CurrentUser('restauranteId') restauranteId: number,
    @Query('categoria') categoria?: string,
    @Query('status') status?: string,
    @Query('search') search?: string,
  ): Promise<Produto[]> {
    return this.estoqueService.findAll(restauranteId, { categoria, status, search });
  }

  @Get('estatisticas')
  @ApiOperation({ summary: 'Obter estatísticas do estoque' })
  @ApiResponse({
    status: 200,
    description: 'Estatísticas retornadas com sucesso',
  })
  async getEstatisticas(
    @CurrentUser('restauranteId') restauranteId: number,
  ): Promise<EstatisticasEstoque> {
    return this.estoqueService.getEstatisticas(restauranteId);
  }

  @Get('categorias')
  @ApiOperation({ summary: 'Listar todas as categorias' })
  @ApiResponse({
    status: 200,
    description: 'Lista de categorias retornada com sucesso',
  })
  async getCategorias(
    @CurrentUser('restauranteId') restauranteId: number,
  ): Promise<string[]> {
    return this.estoqueService.getCategorias(restauranteId);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Buscar produto por ID' })
  @ApiResponse({
    status: 200,
    description: 'Produto encontrado',
    type: ProdutoResponseDto,
  })
  @ApiResponse({ status: 404, description: 'Produto não encontrado' })
  async findOne(
    @Param('id', ParseIntPipe) id: number,
    @CurrentUser('restauranteId') restauranteId: number,
  ): Promise<Produto> {
    return this.estoqueService.findOne(id, restauranteId);
  }

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Criar novo produto' })
  @ApiResponse({
    status: 201,
    description: 'Produto criado com sucesso',
    type: ProdutoResponseDto,
  })
  @ApiResponse({ status: 409, description: 'Produto já existe' })
  async create(
    @Body() createProdutoDto: CreateProdutoDto,
    @CurrentUser('restauranteId') restauranteId: number,
  ): Promise<Produto> {
    return this.estoqueService.create(createProdutoDto, restauranteId);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Atualizar produto' })
  @ApiResponse({
    status: 200,
    description: 'Produto atualizado com sucesso',
    type: ProdutoResponseDto,
  })
  @ApiResponse({ status: 404, description: 'Produto não encontrado' })
  @ApiResponse({ status: 409, description: 'Produto com este nome já existe' })
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateProdutoDto: UpdateProdutoDto,
    @CurrentUser('restauranteId') restauranteId: number,
  ): Promise<Produto> {
    return this.estoqueService.update(id, updateProdutoDto, restauranteId);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Remover produto' })
  @ApiResponse({ status: 204, description: 'Produto removido com sucesso' })
  @ApiResponse({ status: 404, description: 'Produto não encontrado' })
  async remove(
    @Param('id', ParseIntPipe) id: number,
    @CurrentUser('restauranteId') restauranteId: number,
  ): Promise<void> {
    return this.estoqueService.remove(id, restauranteId);
  }
}
