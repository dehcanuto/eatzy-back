import { ApiProperty } from '@nestjs/swagger';
import type { ProdutoStatus } from '../../entities/produto.entity';

export class ProdutoResponseDto {
  @ApiProperty({ example: 1 })
  id: number;

  @ApiProperty({ example: 'Tomate' })
  nome: string;

  @ApiProperty({ example: 'Hortifruti' })
  categoria: string;

  @ApiProperty({ example: 25 })
  quantidade: number;

  @ApiProperty({ example: 30 })
  quantidadeMinima: number;

  @ApiProperty({ example: 'kg' })
  unidade: string;

  @ApiProperty({ example: 4.5 })
  preco: number;

  @ApiProperty({ example: 'Sabor Verde' })
  fornecedor: string;

  @ApiProperty({ example: '2024-03-25' })
  dataUltimaEntrada: string;

  @ApiProperty({ example: 'normal', enum: ['normal', 'baixo', 'critico'] })
  status: ProdutoStatus;

  @ApiProperty({ example: '2024-01-01T00:00:00.000Z' })
  createdAt: Date;

  @ApiProperty({ example: '2024-01-01T00:00:00.000Z' })
  updatedAt: Date;
}
