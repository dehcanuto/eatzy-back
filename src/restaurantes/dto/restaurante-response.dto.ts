import { ApiProperty } from '@nestjs/swagger';
import type { RestauranteStatus } from '../../entities/restaurante.entity';

export class RestauranteResponseDto {
  @ApiProperty()
  id: number;

  @ApiProperty()
  nome: string;

  @ApiProperty({ required: false })
  cnpj?: string;

  @ApiProperty({ required: false })
  telefone?: string;

  @ApiProperty({ required: false })
  endereco?: string;

  @ApiProperty({ required: false })
  logoUrl?: string;

  @ApiProperty({ enum: ['ativo', 'inativo', 'suspenso'] })
  status: RestauranteStatus;

  @ApiProperty()
  createdAt: Date;

  @ApiProperty()
  updatedAt: Date;
}
