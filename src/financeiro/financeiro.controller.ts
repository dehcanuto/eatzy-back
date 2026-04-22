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
import {
  FinanceiroService,
  EstatisticasContas,
  EstatisticasFluxo,
} from './financeiro.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { TenantGuard } from '../auth/guards/tenant.guard';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { CreateContaPagarDto } from './dto/create-conta-pagar.dto';
import { UpdateContaPagarDto } from './dto/update-conta-pagar.dto';
import { CreateFluxoCaixaDto } from './dto/create-fluxo-caixa.dto';
import { UpdateFluxoCaixaDto } from './dto/update-fluxo-caixa.dto';
import { ContaPagar } from '../entities/conta-pagar.entity';
import { FluxoCaixa } from '../entities/fluxo-caixa.entity';

@ApiTags('financeiro')
@Controller('financeiro')
@UseGuards(JwtAuthGuard, TenantGuard)
@ApiBearerAuth()
export class FinanceiroController {
  constructor(private readonly financeiroService: FinanceiroService) {}

  // Contas a Pagar
  @Get('contas')
  @ApiOperation({ summary: 'Listar todas as contas a pagar' })
  @ApiResponse({
    status: 200,
    description: 'Lista de contas retornada com sucesso',
  })
  async findAllContas(
    @CurrentUser('restauranteId') restauranteId: number,
  ): Promise<ContaPagar[]> {
    return this.financeiroService.findAllContas(restauranteId);
  }

  @Get('contas/estatisticas')
  @ApiOperation({ summary: 'Obter estatísticas das contas a pagar' })
  @ApiResponse({
    status: 200,
    description: 'Estatísticas retornadas com sucesso',
  })
  async getEstatisticasContas(
    @CurrentUser('restauranteId') restauranteId: number,
  ): Promise<EstatisticasContas> {
    return this.financeiroService.getEstatisticasContas(restauranteId);
  }

  @Get('contas/atrasadas')
  @ApiOperation({ summary: 'Listar contas atrasadas' })
  @ApiResponse({
    status: 200,
    description: 'Lista de contas atrasadas retornada',
  })
  async getContasAtrasadas(
    @CurrentUser('restauranteId') restauranteId: number,
  ): Promise<ContaPagar[]> {
    return this.financeiroService.getContasAtrasadas(restauranteId);
  }

  @Get('contas/:id')
  @ApiOperation({ summary: 'Buscar conta por ID' })
  @ApiResponse({ status: 200, description: 'Conta encontrada' })
  @ApiResponse({ status: 404, description: 'Conta não encontrada' })
  async findOneConta(
    @Param('id', ParseIntPipe) id: number,
    @CurrentUser('restauranteId') restauranteId: number,
  ): Promise<ContaPagar> {
    return this.financeiroService.findOneConta(id, restauranteId);
  }

  @Post('contas')
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Criar nova conta a pagar' })
  @ApiResponse({
    status: 201,
    description: 'Conta criada com sucesso',
  })
  async createConta(
    @Body() createContaDto: CreateContaPagarDto,
    @CurrentUser('restauranteId') restauranteId: number,
  ): Promise<ContaPagar> {
    return this.financeiroService.createConta(createContaDto, restauranteId);
  }

  @Patch('contas/:id')
  @ApiOperation({ summary: 'Atualizar conta a pagar' })
  @ApiResponse({ status: 200, description: 'Conta atualizada com sucesso' })
  @ApiResponse({ status: 404, description: 'Conta não encontrada' })
  async updateConta(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateContaDto: UpdateContaPagarDto,
    @CurrentUser('restauranteId') restauranteId: number,
  ): Promise<ContaPagar> {
    return this.financeiroService.updateConta(id, updateContaDto, restauranteId);
  }

  @Delete('contas/:id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Remover conta a pagar' })
  @ApiResponse({ status: 204, description: 'Conta removida com sucesso' })
  @ApiResponse({ status: 404, description: 'Conta não encontrada' })
  async removeConta(
    @Param('id', ParseIntPipe) id: number,
    @CurrentUser('restauranteId') restauranteId: number,
  ): Promise<void> {
    return this.financeiroService.removeConta(id, restauranteId);
  }

  // Fluxo de Caixa
  @Get('fluxo')
  @ApiOperation({ summary: 'Listar todos os registros de fluxo de caixa' })
  @ApiResponse({
    status: 200,
    description: 'Lista de fluxo retornada com sucesso',
  })
  async findAllFluxo(
    @CurrentUser('restauranteId') restauranteId: number,
  ): Promise<FluxoCaixa[]> {
    return this.financeiroService.findAllFluxo(restauranteId);
  }

  @Get('fluxo/estatisticas')
  @ApiOperation({ summary: 'Obter estatísticas do fluxo de caixa' })
  @ApiResponse({
    status: 200,
    description: 'Estatísticas retornadas com sucesso',
  })
  async getEstatisticasFluxo(
    @CurrentUser('restauranteId') restauranteId: number,
  ): Promise<EstatisticasFluxo> {
    return this.financeiroService.getEstatisticasFluxo(restauranteId);
  }

  @Get('fluxo/:id')
  @ApiOperation({ summary: 'Buscar registro de fluxo por ID' })
  @ApiResponse({ status: 200, description: 'Registro encontrado' })
  @ApiResponse({ status: 404, description: 'Registro não encontrado' })
  async findOneFluxo(
    @Param('id', ParseIntPipe) id: number,
    @CurrentUser('restauranteId') restauranteId: number,
  ): Promise<FluxoCaixa> {
    return this.financeiroService.findOneFluxo(id, restauranteId);
  }

  @Post('fluxo')
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Criar novo registro de fluxo de caixa' })
  @ApiResponse({
    status: 201,
    description: 'Registro criado com sucesso',
  })
  async createFluxo(
    @Body() createFluxoDto: CreateFluxoCaixaDto,
    @CurrentUser('restauranteId') restauranteId: number,
  ): Promise<FluxoCaixa> {
    return this.financeiroService.createFluxo(createFluxoDto, restauranteId);
  }

  @Patch('fluxo/:id')
  @ApiOperation({ summary: 'Atualizar registro de fluxo de caixa' })
  @ApiResponse({ status: 200, description: 'Registro atualizado com sucesso' })
  @ApiResponse({ status: 404, description: 'Registro não encontrado' })
  async updateFluxo(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateFluxoDto: UpdateFluxoCaixaDto,
    @CurrentUser('restauranteId') restauranteId: number,
  ): Promise<FluxoCaixa> {
    return this.financeiroService.updateFluxo(id, updateFluxoDto, restauranteId);
  }

  @Delete('fluxo/:id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Remover registro de fluxo de caixa' })
  @ApiResponse({ status: 204, description: 'Registro removido com sucesso' })
  @ApiResponse({ status: 404, description: 'Registro não encontrado' })
  async removeFluxo(
    @Param('id', ParseIntPipe) id: number,
    @CurrentUser('restauranteId') restauranteId: number,
  ): Promise<void> {
    return this.financeiroService.removeFluxo(id, restauranteId);
  }
}
