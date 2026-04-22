import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsOptional, IsNotEmpty, IsEnum } from 'class-validator';
import type { RestauranteStatus } from '../../entities/restaurante.entity';

export class CreateRestauranteDto {
  @ApiProperty({ description: 'Nome do restaurante' })
  @IsString()
  @IsNotEmpty()
  nome: string;

  @ApiProperty({ description: 'CNPJ do restaurante', required: false })
  @IsString()
  @IsOptional()
  cnpj?: string;

  @ApiProperty({ description: 'Telefone do restaurante', required: false })
  @IsString()
  @IsOptional()
  telefone?: string;

  @ApiProperty({ description: 'Endereço do restaurante', required: false })
  @IsString()
  @IsOptional()
  endereco?: string;

  @ApiProperty({ description: 'URL do logo', required: false })
  @IsString()
  @IsOptional()
  logoUrl?: string;

  @ApiProperty({
    description: 'Status do restaurante',
    enum: ['ativo', 'inativo', 'suspenso'],
    default: 'ativo',
  })
  @IsEnum(['ativo', 'inativo', 'suspenso'])
  @IsOptional()
  status?: RestauranteStatus;
}
