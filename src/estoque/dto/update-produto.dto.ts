import { ApiProperty } from '@nestjs/swagger';
import {
  IsString,
  IsNumber,
  IsEnum,
  IsDateString,
  IsOptional,
  IsBoolean,
  Min,
} from 'class-validator';
import type { ProdutoStatus } from '../../entities/produto.entity';

export class UpdateProdutoDto {
  // Identificação
  @ApiProperty({ example: 'TOM-001', required: false })
  @IsString()
  @IsOptional()
  codigoInterno?: string;

  @ApiProperty({ example: 'Tomate', required: false })
  @IsString()
  @IsOptional()
  nome?: string;

  @ApiProperty({ example: 'Hortifruti', required: false })
  @IsString()
  @IsOptional()
  categoria?: string;

  @ApiProperty({ example: 'kg', required: false })
  @IsString()
  @IsOptional()
  unidade?: string;

  // Quantidades
  @ApiProperty({ example: 25, required: false })
  @IsNumber()
  @IsOptional()
  @Min(0)
  quantidade?: number;

  @ApiProperty({ example: 5, required: false })
  @IsNumber()
  @IsOptional()
  @Min(0)
  quantidadeMinima?: number;

  @ApiProperty({ example: 100, required: false })
  @IsNumber()
  @IsOptional()
  @Min(0)
  quantidadeMaxima?: number;

  // Custo e fornecedor
  @ApiProperty({ example: 3.5, required: false })
  @IsNumber()
  @IsOptional()
  @Min(0)
  custoUnitario?: number;

  @ApiProperty({ example: 4.5, required: false })
  @IsNumber()
  @IsOptional()
  @Min(0)
  preco?: number;

  @ApiProperty({ example: 'Sabor Verde', required: false })
  @IsString()
  @IsOptional()
  fornecedor?: string;

  @ApiProperty({ example: 'COD-12345', required: false })
  @IsString()
  @IsOptional()
  codigoFornecedor?: string;

  // Validade e armazenamento
  @ApiProperty({ example: '2024-12-31', required: false })
  @IsDateString()
  @IsOptional()
  dataValidade?: string;

  @ApiProperty({ example: 'Geladeira A', required: false })
  @IsString()
  @IsOptional()
  localArmazenamento?: string;

  @ApiProperty({ example: '4°C', required: false })
  @IsString()
  @IsOptional()
  temperaturaIdeal?: string;

  // Rastreabilidade
  @ApiProperty({ example: '2024-03-25', required: false })
  @IsDateString()
  @IsOptional()
  dataEntrada?: string;

  @ApiProperty({ example: '2024-03-25', required: false })
  @IsDateString()
  @IsOptional()
  dataUltimaEntrada?: string;

  @ApiProperty({ example: 'NF-12345', required: false })
  @IsString()
  @IsOptional()
  numeroLoteNota?: string;

  @ApiProperty({ example: 1, required: false })
  @IsNumber()
  @IsOptional()
  usuarioRegistroId?: number;

  // Status
  @ApiProperty({ example: true, required: false })
  @IsBoolean()
  @IsOptional()
  ativo?: boolean;

  @ApiProperty({
    example: 'normal',
    enum: ['normal', 'baixo', 'critico'],
    required: false,
  })
  @IsEnum(['normal', 'baixo', 'critico'])
  @IsOptional()
  status?: ProdutoStatus;
}
