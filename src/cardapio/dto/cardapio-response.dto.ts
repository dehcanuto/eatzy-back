import { ApiProperty } from '@nestjs/swagger';

export class CardapioResponseDto {
  @ApiProperty()
  id: number;

  @ApiProperty()
  nome: string;

  @ApiProperty({ required: false })
  descricao?: string;

  @ApiProperty()
  preco: number;

  @ApiProperty({ required: false })
  categoria?: string;

  @ApiProperty()
  disponivel: boolean;

  @ApiProperty({ required: false })
  imagemUrl?: string;

  @ApiProperty({ required: false })
  tempoPreparo?: number;

  @ApiProperty()
  createdAt: Date;

  @ApiProperty()
  updatedAt: Date;
}
