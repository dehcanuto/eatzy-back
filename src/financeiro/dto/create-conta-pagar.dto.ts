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

export class CreateContaPagarDto {
  @ApiProperty({ example: 'Aluguel do Salão' })
  @IsString()
  descricao: string;

  @ApiProperty({ example: 'Aluguel' })
  @IsString()
  categoria: string;

  @ApiProperty({ example: 5000.0 })
  @IsNumber()
  @Min(0)
  valor: number;

  @ApiProperty({ example: '2024-04-05' })
  @IsDateString()
  dataVencimento: string;

  @ApiProperty({
    example: 'pendente',
    enum: ['pendente', 'pago', 'atrasado'],
  })
  @IsEnum(['pendente', 'pago', 'atrasado'])
  status: ContaPagarStatus;

  @ApiProperty({ example: 'Imobiliária Centro' })
  @IsString()
  fornecedor: string;

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
