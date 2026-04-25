import { Controller, Get, UseGuards } from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
} from '@nestjs/swagger';
import {
  DashboardService,
  EstatisticaMesas,
  EstatisticaEstoque,
  EstatisticaFinanceiro,
  VendaRecente,
  ProdutoCritico,
  ContaAtrasada,
  VendaDia,
} from './dashboard.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CurrentUser } from '../auth/decorators/current-user.decorator';

@ApiTags('dashboard')
@Controller('dashboard')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class DashboardController {
  constructor(private readonly dashboardService: DashboardService) {}

  @Get('mesas')
  @ApiOperation({ summary: 'Obter estatísticas das mesas' })
  @ApiResponse({
    status: 200,
    description: 'Estatísticas das mesas retornadas com sucesso',
  })
  async getEstatisticasMesas(
    @CurrentUser('restauranteId') restauranteId: number,
  ): Promise<EstatisticaMesas> {
    return this.dashboardService.getEstatisticasMesas(restauranteId);
  }

  @Get('estoque')
  @ApiOperation({ summary: 'Obter estatísticas do estoque' })
  @ApiResponse({
    status: 200,
    description: 'Estatísticas do estoque retornadas com sucesso',
  })
  async getEstatisticasEstoque(
    @CurrentUser('restauranteId') restauranteId: number,
  ): Promise<EstatisticaEstoque> {
    return this.dashboardService.getEstatisticasEstoque(restauranteId);
  }

  @Get('financeiro')
  @ApiOperation({ summary: 'Obter estatísticas financeiras' })
  @ApiResponse({
    status: 200,
    description: 'Estatísticas financeiras retornadas com sucesso',
  })
  async getEstatisticasFinanceiro(
    @CurrentUser('restauranteId') restauranteId: number,
  ): Promise<EstatisticaFinanceiro> {
    return this.dashboardService.getEstatisticasFinanceiro(restauranteId);
  }

  @Get('vendas-recentes')
  @ApiOperation({ summary: 'Obter vendas recentes' })
  @ApiResponse({
    status: 200,
    description: 'Vendas recentes retornadas com sucesso',
  })
  async getVendasRecentes(): Promise<VendaRecente[]> {
    return this.dashboardService.getVendasRecentes();
  }

  @Get('produtos-criticos')
  @ApiOperation({ summary: 'Obter produtos em estado crítico' })
  @ApiResponse({
    status: 200,
    description: 'Produtos críticos retornados com sucesso',
  })
  async getProdutosCriticos(
    @CurrentUser('restauranteId') restauranteId: number,
  ): Promise<ProdutoCritico[]> {
    return this.dashboardService.getProdutosCriticos(restauranteId);
  }

  @Get('contas-atrasadas')
  @ApiOperation({ summary: 'Obter contas atrasadas' })
  @ApiResponse({
    status: 200,
    description: 'Contas atrasadas retornadas com sucesso',
  })
  async getContasAtrasadas(
    @CurrentUser('restauranteId') restauranteId: number,
  ): Promise<ContaAtrasada[]> {
    return this.dashboardService.getContasAtrasadas(restauranteId);
  }

  @Get('vendas-ultimos-7-dias')
  @ApiOperation({ summary: 'Obter vendas dos últimos 7 dias' })
  @ApiResponse({
    status: 200,
    description: 'Vendas dos últimos 7 dias retornadas com sucesso',
  })
  async getVendasUltimos7Dias(): Promise<VendaDia[]> {
    return this.dashboardService.getVendasUltimos7Dias();
  }
}
