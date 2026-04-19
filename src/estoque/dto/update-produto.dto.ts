import { ApiProperty } from '@nestjs/swagger';
import {
  IsString,
  IsNumber,
  IsEnum,
  IsDateString,
  IsOptional,
  Min,
} from 'class-validator';
import type { ProdutoStatus } from '../../entities/produto.entity';

export class UpdateProdutoDto {
  @ApiProperty({ example: 'Tomate', required: false })
  @IsString()
  @IsOptional()
  nome?: string;

  @ApiProperty({ example: 'Hortifruti', required: false })
  @IsString()
  @IsOptional()
  categoria?: string;

  @ApiProperty({ example: 25, required: false })
  @IsNumber()
  @IsOptional()
  @Min(0)
  quantidade?: number;

  @ApiProperty({ example: 30, required: false })
  @IsNumber()
  @IsOptional()
  @Min(0)
  quantidadeMinima?: number;

  @ApiProperty({ example: 'kg', required: false })
  @IsString()
  @IsOptional()
  unidade?: string;

  @ApiProperty({ example: 4.5, required: false })
  @IsNumber()
  @IsOptional()
  @Min(0)
  preco?: number;

  @ApiProperty({ example: 'Sabor Verde', required: false })
  @IsString()
  @IsOptional()
  fornecedor?: string;

  @ApiProperty({ example: '2024-03-25', required: false })
  @IsDateString()
  @IsOptional()
  dataUltimaEntrada?: string;

  @ApiProperty({
    example: 'normal',
    enum: ['normal', 'baixo', 'critico'],
    required: false,
  })
  @IsEnum(['normal', 'baixo', 'critico'])
  @IsOptional()
  status?: ProdutoStatus;
}
