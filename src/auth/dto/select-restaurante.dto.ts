import { ApiProperty } from '@nestjs/swagger';
import { IsNumber } from 'class-validator';

export class SelectRestauranteDto {
  @ApiProperty({ description: 'ID do restaurante para acessar' })
  @IsNumber()
  restauranteId: number;
}
