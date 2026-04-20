import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNumber, IsEnum, IsOptional, Min } from 'class-validator';
import type { MesaStatus } from '../../entities/mesa.entity';

export class CreateMesaDto {
  @ApiProperty({ example: 'M01' })
  @IsString()
  numero: string;

  @ApiProperty({ example: 4 })
  @IsNumber()
  @Min(1)
  capacidade: number;

  @ApiProperty({
    example: 'disponivel',
    enum: ['disponivel', 'ocupada', 'reservada', 'limpeza'],
  })
  @IsEnum(['disponivel', 'ocupada', 'reservada', 'limpeza'])
  status: MesaStatus;

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
