import { ApiProperty } from '@nestjs/swagger';
import {
  IsString,
  IsNumber,
  IsBoolean,
  IsOptional,
  Min,
  IsNotEmpty,
} from 'class-validator';

export class CreateCardapioDto {
  @ApiProperty({ description: 'Nome do item do cardápio' })
  @IsString()
  @IsNotEmpty()
  nome: string;

  @ApiProperty({ description: 'Descrição do item', required: false })
  @IsString()
  @IsOptional()
  descricao?: string;

  @ApiProperty({ description: 'Preço do item' })
  @IsNumber()
  @Min(0)
  preco: number;

  @ApiProperty({ description: 'Categoria do item', required: false })
  @IsString()
  @IsOptional()
  categoria?: string;

  @ApiProperty({
    description: 'Se o item está disponível para pedidos',
    default: true,
  })
  @IsBoolean()
  @IsOptional()
  disponivel?: boolean;

  @ApiProperty({ description: 'URL da imagem', required: false })
  @IsString()
  @IsOptional()
  imagemUrl?: string;

  @ApiProperty({ description: 'Tempo estimado de preparo em minutos', required: false })
  @IsNumber()
  @IsOptional()
  tempoPreparo?: number;
}
