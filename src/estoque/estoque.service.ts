import {
  Injectable,
  NotFoundException,
  ConflictException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Like, type FindOptionsWhere } from 'typeorm';
import { Produto, ProdutoStatus } from '../entities/produto.entity';
import { CreateProdutoDto } from './dto/create-produto.dto';
import { UpdateProdutoDto } from './dto/update-produto.dto';

export interface EstatisticasEstoque {
  total: number;
  normal: number;
  baixo: number;
  critico: number;
  valorTotal: number;
}

export interface FiltrosEstoque {
  categoria?: string;
  status?: string;
  search?: string;
}

@Injectable()
export class EstoqueService {
  constructor(
    @InjectRepository(Produto)
    private produtosRepository: Repository<Produto>,
  ) {}

  private calcularStatus(
    quantidade: number,
    quantidadeMinima: number,
  ): ProdutoStatus {
    if (quantidade <= quantidadeMinima * 0.3) {
      return 'critico';
    } else if (quantidade <= quantidadeMinima) {
      return 'baixo';
    }
    return 'normal';
  }

  async findAll(filtros?: FiltrosEstoque): Promise<Produto[]> {
    const where: FindOptionsWhere<Produto> = {};

    if (filtros?.categoria && filtros.categoria !== 'todos') {
      where.categoria = filtros.categoria;
    }

    if (filtros?.status && filtros.status !== 'todos') {
      where.status = filtros.status as ProdutoStatus;
    }

    if (filtros?.search) {
      return this.produtosRepository.find({
        where: [
          { ...where, nome: Like(`%${filtros.search}%`) },
          { ...where, fornecedor: Like(`%${filtros.search}%`) },
        ],
        order: { nome: 'ASC' },
      });
    }

    return this.produtosRepository.find({
      where,
      order: { nome: 'ASC' },
    });
  }

  async findOne(id: number): Promise<Produto> {
    const produto = await this.produtosRepository.findOne({ where: { id } });
    if (!produto) {
      throw new NotFoundException('Produto não encontrado');
    }
    return produto;
  }

  async create(createProdutoDto: CreateProdutoDto): Promise<Produto> {
    const existing = await this.produtosRepository.findOne({
      where: { nome: createProdutoDto.nome },
    });
    if (existing) {
      throw new ConflictException('Produto com este nome já existe');
    }

    const status = this.calcularStatus(
      createProdutoDto.quantidade,
      createProdutoDto.quantidadeMinima,
    );

    const produto = this.produtosRepository.create({
      ...createProdutoDto,
      dataUltimaEntrada: new Date(createProdutoDto.dataUltimaEntrada),
      status,
    });

    return this.produtosRepository.save(produto);
  }

  async update(
    id: number,
    updateProdutoDto: UpdateProdutoDto,
  ): Promise<Produto> {
    const produto = await this.findOne(id);

    if (updateProdutoDto.nome && updateProdutoDto.nome !== produto.nome) {
      const existing = await this.produtosRepository.findOne({
        where: { nome: updateProdutoDto.nome },
      });
      if (existing) {
        throw new ConflictException('Produto com este nome já existe');
      }
    }

    const quantidade = updateProdutoDto.quantidade ?? produto.quantidade;
    const quantidadeMinima =
      updateProdutoDto.quantidadeMinima ?? produto.quantidadeMinima;

    const status = this.calcularStatus(quantidade, quantidadeMinima);

    const updateData: Partial<Produto> = {
      nome: updateProdutoDto.nome,
      categoria: updateProdutoDto.categoria,
      quantidade: updateProdutoDto.quantidade,
      quantidadeMinima: updateProdutoDto.quantidadeMinima,
      unidade: updateProdutoDto.unidade,
      preco: updateProdutoDto.preco,
      fornecedor: updateProdutoDto.fornecedor,
      status,
    };

    if (updateProdutoDto.dataUltimaEntrada) {
      updateData.dataUltimaEntrada = new Date(
        updateProdutoDto.dataUltimaEntrada,
      );
    }

    await this.produtosRepository.update(id, updateData);
    return this.findOne(id);
  }

  async remove(id: number): Promise<void> {
    const produto = await this.findOne(id);
    await this.produtosRepository.remove(produto);
  }

  async getEstatisticas(): Promise<EstatisticasEstoque> {
    const produtos = await this.produtosRepository.find();

    const total = produtos.length;
    const normal = produtos.filter((p) => p.status === 'normal').length;
    const baixo = produtos.filter((p) => p.status === 'baixo').length;
    const critico = produtos.filter((p) => p.status === 'critico').length;
    const valorTotal = produtos.reduce(
      (sum, p) => sum + p.quantidade * p.preco,
      0,
    );

    return { total, normal, baixo, critico, valorTotal };
  }

  async getCategorias(): Promise<string[]> {
    const categorias = await this.produtosRepository
      .createQueryBuilder('produto')
      .select('DISTINCT produto.categoria', 'categoria')
      .orderBy('categoria', 'ASC')
      .getRawMany();

    return categorias.map((c: { categoria: string }) => c.categoria);
  }
}
