import { ApiProperty } from '@nestjs/swagger';
import type { ProdutoStatus } from '../../entities/produto.entity';

export class ProdutoResponseDto {
  @ApiProperty({ example: 1 })
  id: number;

  // Identificação
  @ApiProperty({ example: 'TOM-001', required: false })
  codigoInterno?: string;

  @ApiProperty({ example: 'Tomate' })
  nome: string;

  @ApiProperty({ example: 'Hortifruti' })
  categoria: string;

  @ApiProperty({ example: 'kg' })
  unidade: string;

  // Quantidades
  @ApiProperty({ example: 25 })
  quantidade: number;

  @ApiProperty({ example: 5 })
  quantidadeMinima: number;

  @ApiProperty({ example: 100, required: false })
  quantidadeMaxima?: number;

  // Custo e fornecedor
  @ApiProperty({ example: 3.5, required: false })
  custoUnitario?: number;

  @ApiProperty({ example: 'Sabor Verde' })
  fornecedor: string;

  @ApiProperty({ example: 'COD-12345', required: false })
  codigoFornecedor?: string;

  // Validade e armazenamento
  @ApiProperty({ example: '2024-12-31', required: false })
  dataValidade?: string;

  @ApiProperty({ example: 'Geladeira A', required: false })
  localArmazenamento?: string;

  @ApiProperty({ example: '4°C', required: false })
  temperaturaIdeal?: string;

  // Rastreabilidade
  @ApiProperty({ example: '2024-03-25', required: false })
  dataEntrada?: string;

  @ApiProperty({ example: '2024-03-25', required: false })
  dataUltimaEntrada?: string;

  @ApiProperty({ example: 'NF-12345', required: false })
  numeroLoteNota?: string;

  @ApiProperty({ example: 1, required: false })
  usuarioRegistroId?: number;

  // Status
  @ApiProperty({ example: true })
  ativo: boolean;

  @ApiProperty({ example: 'normal', enum: ['normal', 'baixo', 'critico'] })
  status: ProdutoStatus;

  @ApiProperty({ example: 4.5 })
  preco: number;

  @ApiProperty({ example: '2024-01-01T00:00:00.000Z' })
  createdAt: Date;

  @ApiProperty({ example: '2024-01-01T00:00:00.000Z' })
  updatedAt: Date;
}
