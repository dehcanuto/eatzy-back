import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, LessThan } from 'typeorm';
import { ContaPagar, ContaPagarStatus } from '../entities/conta-pagar.entity';
import { FluxoCaixa } from '../entities/fluxo-caixa.entity';
import { CreateContaPagarDto } from './dto/create-conta-pagar.dto';
import { UpdateContaPagarDto } from './dto/update-conta-pagar.dto';
import { CreateFluxoCaixaDto } from './dto/create-fluxo-caixa.dto';
import { UpdateFluxoCaixaDto } from './dto/update-fluxo-caixa.dto';

export interface EstatisticasContas {
  total: number;
  pagas: number;
  pendentes: number;
  atrasadas: number;
  valorTotal: number;
  valorPago: number;
  valorPendente: number;
  valorAtrasado: number;
}

export interface EstatisticasFluxo {
  entradas: number;
  saidas: number;
  saldo: number;
}

@Injectable()
export class FinanceiroService {
  constructor(
    @InjectRepository(ContaPagar)
    private contasPagarRepository: Repository<ContaPagar>,
    @InjectRepository(FluxoCaixa)
    private fluxoCaixaRepository: Repository<FluxoCaixa>,
  ) {}

  // Contas a Pagar
  async findAllContas(restauranteId: number): Promise<ContaPagar[]> {
    return this.contasPagarRepository.find({
      where: { restauranteId },
      order: { dataVencimento: 'ASC' },
    });
  }

  async findOneConta(id: number, restauranteId: number): Promise<ContaPagar> {
    const conta = await this.contasPagarRepository.findOne({
      where: { id, restauranteId },
    });
    if (!conta) {
      throw new NotFoundException('Conta não encontrada');
    }
    return conta;
  }

  async createConta(
    createContaDto: CreateContaPagarDto,
    restauranteId: number,
  ): Promise<ContaPagar> {
    const newConta = this.contasPagarRepository.create({
      ...createContaDto,
      restauranteId,
      dataVencimento: new Date(createContaDto.dataVencimento),
      dataPagamento: createContaDto.dataPagamento
        ? new Date(createContaDto.dataPagamento)
        : undefined,
    });
    return this.contasPagarRepository.save(newConta);
  }

  async updateConta(
    id: number,
    updateContaDto: UpdateContaPagarDto,
    restauranteId: number,
  ): Promise<ContaPagar> {
    await this.findOneConta(id, restauranteId);

    const updateData: Partial<ContaPagar> = {
      descricao: updateContaDto.descricao,
      categoria: updateContaDto.categoria,
      valor: updateContaDto.valor,
      status: updateContaDto.status,
      fornecedor: updateContaDto.fornecedor,
      formaPagamento: updateContaDto.formaPagamento,
      observacao: updateContaDto.observacao,
    };

    if (updateContaDto.dataVencimento) {
      updateData.dataVencimento = new Date(updateContaDto.dataVencimento);
    }

    if (updateContaDto.dataPagamento !== undefined) {
      updateData.dataPagamento = updateContaDto.dataPagamento
        ? new Date(updateContaDto.dataPagamento)
        : undefined;
    }

    await this.contasPagarRepository.update({ id, restauranteId }, updateData);
    return this.findOneConta(id, restauranteId);
  }

  async removeConta(id: number, restauranteId: number): Promise<void> {
    const contaToRemove = await this.findOneConta(id, restauranteId);
    await this.contasPagarRepository.remove(contaToRemove);
  }

  // Fluxo de Caixa
  async findAllFluxo(restauranteId: number): Promise<FluxoCaixa[]> {
    return this.fluxoCaixaRepository.find({
      where: { restauranteId },
      order: { data: 'DESC' },
    });
  }

  async findOneFluxo(id: number, restauranteId: number): Promise<FluxoCaixa> {
    const fluxo = await this.fluxoCaixaRepository.findOne({
      where: { id, restauranteId },
    });
    if (!fluxo) {
      throw new NotFoundException('Registro de fluxo não encontrado');
    }
    return fluxo;
  }

  async createFluxo(
    createFluxoDto: CreateFluxoCaixaDto,
    restauranteId: number,
  ): Promise<FluxoCaixa> {
    const fluxo = this.fluxoCaixaRepository.create({
      ...createFluxoDto,
      restauranteId,
      data: new Date(createFluxoDto.data),
    });
    return this.fluxoCaixaRepository.save(fluxo);
  }

  async updateFluxo(
    id: number,
    updateFluxoDto: UpdateFluxoCaixaDto,
    restauranteId: number,
  ): Promise<FluxoCaixa> {
    await this.findOneFluxo(id, restauranteId);

    const updateData: Partial<FluxoCaixa> = {
      descricao: updateFluxoDto.descricao,
      tipo: updateFluxoDto.tipo,
      valor: updateFluxoDto.valor,
      categoria: updateFluxoDto.categoria,
      formaPagamento: updateFluxoDto.formaPagamento,
      origem: updateFluxoDto.origem,
    };

    if (updateFluxoDto.data) {
      updateData.data = new Date(updateFluxoDto.data);
    }

    await this.fluxoCaixaRepository.update({ id, restauranteId }, updateData);
    return this.findOneFluxo(id, restauranteId);
  }

  async removeFluxo(id: number, restauranteId: number): Promise<void> {
    const fluxo = await this.findOneFluxo(id, restauranteId);
    await this.fluxoCaixaRepository.remove(fluxo);
  }

  // Estatísticas
  async getEstatisticasContas(restauranteId: number): Promise<EstatisticasContas> {
    const contas = await this.contasPagarRepository.find({
      where: { restauranteId },
    });

    const total = contas.length;
    const pagas = contas.filter((c) => c.status === 'pago').length;
    const pendentes = contas.filter((c) => c.status === 'pendente').length;
    const atrasadas = contas.filter((c) => c.status === 'atrasado').length;

    const valorTotal = contas.reduce((sum, c) => sum + Number(c.valor), 0);
    const valorPago = contas
      .filter((c) => c.status === 'pago')
      .reduce((sum, c) => sum + Number(c.valor), 0);
    const valorPendente = contas
      .filter((c) => c.status === 'pendente')
      .reduce((sum, c) => sum + Number(c.valor), 0);
    const valorAtrasado = contas
      .filter((c) => c.status === 'atrasado')
      .reduce((sum, c) => sum + Number(c.valor), 0);

    return {
      total,
      pagas,
      pendentes,
      atrasadas,
      valorTotal,
      valorPago,
      valorPendente,
      valorAtrasado,
    };
  }

  async getEstatisticasFluxo(restauranteId: number): Promise<EstatisticasFluxo> {
    const fluxos = await this.fluxoCaixaRepository.find({
      where: { restauranteId },
    });

    const entradas = fluxos
      .filter((f) => f.tipo === 'entrada')
      .reduce((sum, f) => sum + Number(f.valor), 0);
    const saidas = fluxos
      .filter((f) => f.tipo === 'saida')
      .reduce((sum, f) => sum + Number(f.valor), 0);

    return {
      entradas,
      saidas,
      saldo: entradas - saidas,
    };
  }

  async getContasAtrasadas(restauranteId: number): Promise<ContaPagar[]> {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    return this.contasPagarRepository.find({
      where: {
        restauranteId,
        status: 'atrasado',
        dataVencimento: LessThan(today),
      },
      order: { dataVencimento: 'ASC' },
    });
  }

  // Atualiza status de contas vencidas para atrasado
  async atualizarStatusContasAtrasadas(restauranteId: number): Promise<void> {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    await this.contasPagarRepository
      .createQueryBuilder()
      .update(ContaPagar)
      .set({ status: 'atrasado' as ContaPagarStatus })
      .where('restaurante_id = :restauranteId', { restauranteId })
      .andWhere('data_vencimento < :today', { today })
      .andWhere('status = :pendente', { pendente: 'pendente' })
      .execute();
  }
}
