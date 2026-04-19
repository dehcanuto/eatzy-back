import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNumber, IsEnum, IsDateString, Min } from 'class-validator';
import type { ProdutoStatus } from '../../entities/produto.entity';

export class CreateProdutoDto {
  @ApiProperty({ example: 'Tomate' })
  @IsString()
  nome: string;

  @ApiProperty({ example: 'Hortifruti' })
  @IsString()
  categoria: string;

  @ApiProperty({ example: 25 })
  @IsNumber()
  @Min(0)
  quantidade: number;

  @ApiProperty({ example: 30 })
  @IsNumber()
  @Min(0)
  quantidadeMinima: number;

  @ApiProperty({ example: 'kg' })
  @IsString()
  unidade: string;

  @ApiProperty({ example: 4.5 })
  @IsNumber()
  @Min(0)
  preco: number;

  @ApiProperty({ example: 'Sabor Verde' })
  @IsString()
  fornecedor: string;

  @ApiProperty({ example: '2024-03-25' })
  @IsDateString()
  dataUltimaEntrada: string;

  @ApiProperty({ example: 'normal', enum: ['normal', 'baixo', 'critico'] })
  @IsEnum(['normal', 'baixo', 'critico'])
  status: ProdutoStatus;
}
