import { ApiProperty } from '@nestjs/swagger';
import {
  IsString,
  IsNumber,
  IsEnum,
  IsOptional,
  IsDateString,
  Min,
} from 'class-validator';
import type { FluxoCaixaTipo } from '../../entities/fluxo-caixa.entity';

export class UpdateFluxoCaixaDto {
  @ApiProperty({ example: 'Vendas do Dia', required: false })
  @IsString()
  @IsOptional()
  descricao?: string;

  @ApiProperty({
    example: 'entrada',
    enum: ['entrada', 'saida'],
    required: false,
  })
  @IsEnum(['entrada', 'saida'])
  @IsOptional()
  tipo?: FluxoCaixaTipo;

  @ApiProperty({ example: 3450.8, required: false })
  @IsNumber()
  @Min(0)
  @IsOptional()
  valor?: number;

  @ApiProperty({ example: '2024-03-27', required: false })
  @IsDateString()
  @IsOptional()
  data?: string;

  @ApiProperty({ example: 'Vendas', required: false })
  @IsString()
  @IsOptional()
  categoria?: string;

  @ApiProperty({ example: 'Transferência', required: false })
  @IsString()
  @IsOptional()
  formaPagamento?: string;

  @ApiProperty({ example: 'Caixa', required: false })
  @IsString()
  @IsOptional()
  origem?: string;
}
