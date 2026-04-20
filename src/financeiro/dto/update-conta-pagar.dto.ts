import { ApiProperty } from '@nestjs/swagger';
import {
  IsString,
  IsNumber,
  IsEnum,
  IsOptional,
  IsDateString,
  Min,
} from 'class-validator';
import type { ContaPagarStatus } from '../../entities/conta-pagar.entity';

export class UpdateContaPagarDto {
  @ApiProperty({ example: 'Aluguel do Salão', required: false })
  @IsString()
  @IsOptional()
  descricao?: string;

  @ApiProperty({ example: 'Aluguel', required: false })
  @IsString()
  @IsOptional()
  categoria?: string;

  @ApiProperty({ example: 5000.0, required: false })
  @IsNumber()
  @Min(0)
  @IsOptional()
  valor?: number;

  @ApiProperty({ example: '2024-04-05', required: false })
  @IsDateString()
  @IsOptional()
  dataVencimento?: string;

  @ApiProperty({
    example: 'pago',
    enum: ['pendente', 'pago', 'atrasado'],
    required: false,
  })
  @IsEnum(['pendente', 'pago', 'atrasado'])
  @IsOptional()
  status?: ContaPagarStatus;

  @ApiProperty({ example: 'Imobiliária Centro', required: false })
  @IsString()
  @IsOptional()
  fornecedor?: string;

  @ApiProperty({ example: '2024-03-27', required: false })
  @IsDateString()
  @IsOptional()
  dataPagamento?: string;

  @ApiProperty({ example: 'Transferência', required: false })
  @IsString()
  @IsOptional()
  formaPagamento?: string;

  @ApiProperty({ required: false })
  @IsString()
  @IsOptional()
  observacao?: string;
}
