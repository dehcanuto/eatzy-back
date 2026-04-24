import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, IsString, IsOptional } from 'class-validator';

export class AddItemDto {
  @ApiProperty()
  @IsNumber()
  cardapioId: number;

  @ApiProperty()
  @IsNumber()
  quantidade: number;

  @ApiProperty({ required: false })
  @IsString()
  @IsOptional()
  observacao?: string;
}
