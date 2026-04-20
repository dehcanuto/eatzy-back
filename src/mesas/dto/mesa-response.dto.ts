import { ApiProperty } from '@nestjs/swagger';

export class MesaResponseDto {
  @ApiProperty()
  id: number;

  @ApiProperty()
  numero: string;

  @ApiProperty()
  capacidade: number;

  @ApiProperty({ enum: ['disponivel', 'ocupada', 'reservada', 'limpeza'] })
  status: string;

  @ApiProperty({ nullable: true })
  cliente?: string;

  @ApiProperty({ nullable: true })
  horarioReserva?: string;

  @ApiProperty({ nullable: true })
  valor?: number;

  @ApiProperty()
  createdAt: Date;

  @ApiProperty()
  updatedAt: Date;
}
