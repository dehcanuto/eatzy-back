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
import { CreateContaPagarDto } from './dto/create-conta-pagar.dto';
import { UpdateContaPagarDto } from './dto/update-conta-pagar.dto';
import { CreateFluxoCaixaDto } from './dto/create-fluxo-caixa.dto';
import { UpdateFluxoCaixaDto } from './dto/update-fluxo-caixa.dto';
import { ContaPagar } from '../entities/conta-pagar.entity';
import { FluxoCaixa } from '../entities/fluxo-caixa.entity';

@ApiTags('financeiro')
@Controller('financeiro')
@UseGuards(JwtAuthGuard)
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
  async findAllContas(): Promise<ContaPagar[]> {
    return this.financeiroService.findAllContas();
  }

  @Get('contas/estatisticas')
  @ApiOperation({ summary: 'Obter estatísticas das contas a pagar' })
  @ApiResponse({
    status: 200,
    description: 'Estatísticas retornadas com sucesso',
  })
  async getEstatisticasContas(): Promise<EstatisticasContas> {
    return this.financeiroService.getEstatisticasContas();
  }

  @Get('contas/atrasadas')
  @ApiOperation({ summary: 'Listar contas atrasadas' })
  @ApiResponse({
    status: 200,
    description: 'Lista de contas atrasadas retornada',
  })
  async getContasAtrasadas(): Promise<ContaPagar[]> {
    return this.financeiroService.getContasAtrasadas();
  }

  @Get('contas/:id')
  @ApiOperation({ summary: 'Buscar conta por ID' })
  @ApiResponse({ status: 200, description: 'Conta encontrada' })
  @ApiResponse({ status: 404, description: 'Conta não encontrada' })
  async findOneConta(
    @Param('id', ParseIntPipe) id: number,
  ): Promise<ContaPagar> {
    return this.financeiroService.findOneConta(id);
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
  ): Promise<ContaPagar> {
    return this.financeiroService.createConta(createContaDto);
  }

  @Patch('contas/:id')
  @ApiOperation({ summary: 'Atualizar conta a pagar' })
  @ApiResponse({ status: 200, description: 'Conta atualizada com sucesso' })
  @ApiResponse({ status: 404, description: 'Conta não encontrada' })
  async updateConta(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateContaDto: UpdateContaPagarDto,
  ): Promise<ContaPagar> {
    return this.financeiroService.updateConta(id, updateContaDto);
  }

  @Delete('contas/:id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Remover conta a pagar' })
  @ApiResponse({ status: 204, description: 'Conta removida com sucesso' })
  @ApiResponse({ status: 404, description: 'Conta não encontrada' })
  async removeConta(@Param('id', ParseIntPipe) id: number): Promise<void> {
    return this.financeiroService.removeConta(id);
  }

  // Fluxo de Caixa
  @Get('fluxo')
  @ApiOperation({ summary: 'Listar todos os registros de fluxo de caixa' })
  @ApiResponse({
    status: 200,
    description: 'Lista de fluxo retornada com sucesso',
  })
  async findAllFluxo(): Promise<FluxoCaixa[]> {
    return this.financeiroService.findAllFluxo();
  }

  @Get('fluxo/estatisticas')
  @ApiOperation({ summary: 'Obter estatísticas do fluxo de caixa' })
  @ApiResponse({
    status: 200,
    description: 'Estatísticas retornadas com sucesso',
  })
  async getEstatisticasFluxo(): Promise<EstatisticasFluxo> {
    return this.financeiroService.getEstatisticasFluxo();
  }

  @Get('fluxo/:id')
  @ApiOperation({ summary: 'Buscar registro de fluxo por ID' })
  @ApiResponse({ status: 200, description: 'Registro encontrado' })
  @ApiResponse({ status: 404, description: 'Registro não encontrado' })
  async findOneFluxo(
    @Param('id', ParseIntPipe) id: number,
  ): Promise<FluxoCaixa> {
    return this.financeiroService.findOneFluxo(id);
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
  ): Promise<FluxoCaixa> {
    return this.financeiroService.createFluxo(createFluxoDto);
  }

  @Patch('fluxo/:id')
  @ApiOperation({ summary: 'Atualizar registro de fluxo de caixa' })
  @ApiResponse({ status: 200, description: 'Registro atualizado com sucesso' })
  @ApiResponse({ status: 404, description: 'Registro não encontrado' })
  async updateFluxo(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateFluxoDto: UpdateFluxoCaixaDto,
  ): Promise<FluxoCaixa> {
    return this.financeiroService.updateFluxo(id, updateFluxoDto);
  }

  @Delete('fluxo/:id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Remover registro de fluxo de caixa' })
  @ApiResponse({ status: 204, description: 'Registro removido com sucesso' })
  @ApiResponse({ status: 404, description: 'Registro não encontrado' })
  async removeFluxo(@Param('id', ParseIntPipe) id: number): Promise<void> {
    return this.financeiroService.removeFluxo(id);
  }
}
