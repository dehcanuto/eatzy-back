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
} from './dashboard.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

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
  async getEstatisticasMesas(): Promise<EstatisticaMesas> {
    return this.dashboardService.getEstatisticasMesas();
  }

  @Get('estoque')
  @ApiOperation({ summary: 'Obter estatísticas do estoque' })
  @ApiResponse({
    status: 200,
    description: 'Estatísticas do estoque retornadas com sucesso',
  })
  async getEstatisticasEstoque(): Promise<EstatisticaEstoque> {
    return this.dashboardService.getEstatisticasEstoque();
  }

  @Get('financeiro')
  @ApiOperation({ summary: 'Obter estatísticas financeiras' })
  @ApiResponse({
    status: 200,
    description: 'Estatísticas financeiras retornadas com sucesso',
  })
  async getEstatisticasFinanceiro(): Promise<EstatisticaFinanceiro> {
    return this.dashboardService.getEstatisticasFinanceiro();
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
  async getProdutosCriticos(): Promise<ProdutoCritico[]> {
    return this.dashboardService.getProdutosCriticos();
  }

  @Get('contas-atrasadas')
  @ApiOperation({ summary: 'Obter contas atrasadas' })
  @ApiResponse({
    status: 200,
    description: 'Contas atrasadas retornadas com sucesso',
  })
  async getContasAtrasadas(): Promise<ContaAtrasada[]> {
    return this.dashboardService.getContasAtrasadas();
  }
}
