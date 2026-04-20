import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, LessThan } from 'typeorm';
import { Mesa } from '../entities/mesa.entity';
import { Produto } from '../entities/produto.entity';
import { ContaPagar } from '../entities/conta-pagar.entity';
import { FluxoCaixa } from '../entities/fluxo-caixa.entity';

export interface EstatisticaMesas {
  total: number;
  disponiveis: number;
  ocupadas: number;
  reservadas: number;
  limpeza: number;
  taxaOcupacao: number;
}

export interface EstatisticaEstoque {
  total: number;
  normal: number;
  baixo: number;
  critico: number;
  valorTotal: number;
  produtosBaixos: string[];
}

export interface EstatisticaFinanceiro {
  totalContas: number;
  contasPagas: number;
  contasPendentes: number;
  contasAtrasadas: number;
  valorTotalContas: number;
  entradas: number;
  saidas: number;
  saldo: number;
}

export interface VendaRecente {
  id: number;
  mesa: string;
  cliente: string;
  valor: number;
  data: Date;
  status: 'concluido' | 'em_andamento';
  itens: number;
}

export interface ProdutoCritico {
  id: number;
  nome: string;
  quantidade: number;
  quantidadeMinima: number;
  unidade: string;
  status: 'critico';
}

export interface ContaAtrasada {
  id: number;
  descricao: string;
  fornecedor: string;
  valor: number;
  dataVencimento: Date;
  diasAtraso: number;
}

@Injectable()
export class DashboardService {
  constructor(
    @InjectRepository(Mesa)
    private mesasRepository: Repository<Mesa>,
    @InjectRepository(Produto)
    private produtosRepository: Repository<Produto>,
    @InjectRepository(ContaPagar)
    private contasPagarRepository: Repository<ContaPagar>,
    @InjectRepository(FluxoCaixa)
    private fluxoCaixaRepository: Repository<FluxoCaixa>,
  ) {}

  async getEstatisticasMesas(): Promise<EstatisticaMesas> {
    const mesas = await this.mesasRepository.find();

    const total = mesas.length;
    const disponiveis = mesas.filter((m) => m.status === 'disponivel').length;
    const ocupadas = mesas.filter((m) => m.status === 'ocupada').length;
    const reservadas = mesas.filter((m) => m.status === 'reservada').length;
    const limpeza = mesas.filter((m) => m.status === 'limpeza').length;

    const mesasOcupadasOuReservadas = ocupadas + reservadas;
    const taxaOcupacao =
      total > 0 ? (mesasOcupadasOuReservadas / total) * 100 : 0;

    return {
      total,
      disponiveis,
      ocupadas,
      reservadas,
      limpeza,
      taxaOcupacao: Math.round(taxaOcupacao * 10) / 10,
    };
  }

  async getEstatisticasEstoque(): Promise<EstatisticaEstoque> {
    const produtos = await this.produtosRepository.find();

    const total = produtos.length;
    const normal = produtos.filter((p) => p.status === 'normal').length;
    const baixo = produtos.filter((p) => p.status === 'baixo').length;
    const critico = produtos.filter((p) => p.status === 'critico').length;
    const valorTotal = produtos.reduce(
      (sum, p) => sum + Number(p.quantidade) * Number(p.preco),
      0,
    );

    const produtosBaixos = produtos
      .filter((p) => p.status === 'baixo' || p.status === 'critico')
      .map((p) => p.nome);

    return {
      total,
      normal,
      baixo,
      critico,
      valorTotal,
      produtosBaixos,
    };
  }

  async getEstatisticasFinanceiro(): Promise<EstatisticaFinanceiro> {
    const contas = await this.contasPagarRepository.find();
    const fluxos = await this.fluxoCaixaRepository.find();

    const totalContas = contas.length;
    const contasPagas = contas.filter((c) => c.status === 'pago').length;
    const contasPendentes = contas.filter(
      (c) => c.status === 'pendente',
    ).length;
    const contasAtrasadas = contas.filter(
      (c) => c.status === 'atrasado',
    ).length;

    const valorTotalContas = contas.reduce(
      (sum, c) => sum + Number(c.valor),
      0,
    );

    const entradas = fluxos
      .filter((f) => f.tipo === 'entrada')
      .reduce((sum, f) => sum + Number(f.valor), 0);
    const saidas = fluxos
      .filter((f) => f.tipo === 'saida')
      .reduce((sum, f) => sum + Number(f.valor), 0);

    return {
      totalContas,
      contasPagas,
      contasPendentes,
      contasAtrasadas,
      valorTotalContas,
      entradas,
      saidas,
      saldo: entradas - saidas,
    };
  }

  async getProdutosCriticos(): Promise<ProdutoCritico[]> {
    const produtos = await this.produtosRepository.find({
      where: { status: 'critico' },
      order: { quantidade: 'ASC' },
    });

    return produtos.map((p) => ({
      id: p.id,
      nome: p.nome,
      quantidade: Number(p.quantidade),
      quantidadeMinima: Number(p.quantidadeMinima),
      unidade: p.unidade,
      status: 'critico' as const,
    }));
  }

  async getContasAtrasadas(): Promise<ContaAtrasada[]> {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const contas = await this.contasPagarRepository.find({
      where: {
        status: 'atrasado',
        dataVencimento: LessThan(today),
      },
      order: { dataVencimento: 'ASC' },
    });

    return contas.map((c) => {
      const dataVencimento = new Date(c.dataVencimento);
      const diffTime = today.getTime() - dataVencimento.getTime();
      const diasAtraso = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

      return {
        id: c.id,
        descricao: c.descricao,
        fornecedor: c.fornecedor,
        valor: Number(c.valor),
        dataVencimento: c.dataVencimento,
        diasAtraso,
      };
    });
  }

  // Mock de vendas recentes (será implementado com módulo de vendas futuramente)
  // eslint-disable-next-line @typescript-eslint/require-await
  async getVendasRecentes(): Promise<VendaRecente[]> {
    return [
      {
        id: 1,
        mesa: 'M02',
        cliente: 'João Silva',
        valor: 156.5,
        data: new Date('2024-03-27T20:30:00'),
        status: 'concluido',
        itens: 4,
      },
      {
        id: 2,
        mesa: 'M05',
        cliente: 'Pedro Costa',
        valor: 89.9,
        data: new Date('2024-03-27T19:45:00'),
        status: 'concluido',
        itens: 2,
      },
      {
        id: 3,
        mesa: 'M12',
        cliente: 'Lucia Ferreira',
        valor: 78.3,
        data: new Date('2024-03-27T21:15:00'),
        status: 'em_andamento',
        itens: 3,
      },
      {
        id: 4,
        mesa: 'M09',
        cliente: 'Carlos Mendes',
        valor: 45.0,
        data: new Date('2024-03-27T18:20:00'),
        status: 'concluido',
        itens: 2,
      },
      {
        id: 5,
        mesa: 'M01',
        cliente: 'Ana Santos',
        valor: 234.8,
        data: new Date('2024-03-27T20:00:00'),
        status: 'concluido',
        itens: 6,
      },
    ];
  }
}
