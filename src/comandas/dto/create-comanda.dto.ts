import { ApiProperty } from '@nestjs/swagger';
import {
  IsNumber,
  IsString,
  IsOptional,
  IsArray,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';

class ItemComandaDto {
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

export class CreateComandaDto {
  @ApiProperty()
  @IsNumber()
  mesaId: number;

  @ApiProperty({ type: [ItemComandaDto], required: false })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => ItemComandaDto)
  @IsOptional()
  itens?: ItemComandaDto[];
}
