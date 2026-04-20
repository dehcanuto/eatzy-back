import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNumber, IsEnum, IsOptional, Min } from 'class-validator';
import type { MesaStatus } from '../../entities/mesa.entity';

export class UpdateMesaDto {
  @ApiProperty({ example: 'M01', required: false })
  @IsString()
  @IsOptional()
  numero?: string;

  @ApiProperty({ example: 4, required: false })
  @IsNumber()
  @Min(1)
  @IsOptional()
  capacidade?: number;

  @ApiProperty({
    example: 'ocupada',
    enum: ['disponivel', 'ocupada', 'reservada', 'limpeza'],
    required: false,
  })
  @IsEnum(['disponivel', 'ocupada', 'reservada', 'limpeza'])
  @IsOptional()
  status?: MesaStatus;

  @ApiProperty({ example: 'João Silva', required: false })
  @IsString()
  @IsOptional()
  cliente?: string;

  @ApiProperty({ example: '19:30', required: false })
  @IsString()
  @IsOptional()
  horarioReserva?: string;

  @ApiProperty({ example: 156.5, required: false })
  @IsNumber()
  @IsOptional()
  valor?: number;
}
