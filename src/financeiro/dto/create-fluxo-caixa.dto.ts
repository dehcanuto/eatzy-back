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

export class CreateFluxoCaixaDto {
  @ApiProperty({ example: 'Vendas do Dia' })
  @IsString()
  descricao: string;

  @ApiProperty({ example: 'entrada', enum: ['entrada', 'saida'] })
  @IsEnum(['entrada', 'saida'])
  tipo: FluxoCaixaTipo;

  @ApiProperty({ example: 3450.8 })
  @IsNumber()
  @Min(0)
  valor: number;

  @ApiProperty({ example: '2024-03-27' })
  @IsDateString()
  data: string;

  @ApiProperty({ example: 'Vendas' })
  @IsString()
  categoria: string;

  @ApiProperty({ example: 'Transferência', required: false })
  @IsString()
  @IsOptional()
  formaPagamento?: string;

  @ApiProperty({ example: 'Caixa', required: false })
  @IsString()
  @IsOptional()
  origem?: string;
}
