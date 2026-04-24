import { ApiProperty } from '@nestjs/swagger';

class ItemComandaResponseDto {
  @ApiProperty()
  id: number;

  @ApiProperty()
  cardapioId: number;

  @ApiProperty()
  nome: string;

  @ApiProperty()
  quantidade: number;

  @ApiProperty()
  precoUnitario: number;

  @ApiProperty()
  subtotal: number;

  @ApiProperty({ nullable: true })
  observacao?: string;

  @ApiProperty({ enum: ['pendente', 'preparando', 'pronto', 'entregue'] })
  statusPedido: string;
}

export class ComandaResponseDto {
  @ApiProperty()
  id: number;

  @ApiProperty()
  codigo: string;

  @ApiProperty()
  mesaId: number;

  @ApiProperty()
  numeroMesa: string;

  @ApiProperty()
  total: number;

  @ApiProperty({ enum: ['aberta', 'fechada', 'cancelada'] })
  status: string;

  @ApiProperty({ nullable: true })
  gorjeta?: number;

  @ApiProperty({ nullable: true })
  chamadoGarcomAt?: Date;

  @ApiProperty({ nullable: true })
  solicitacaoContaAt?: Date;

  @ApiProperty({ type: [ItemComandaResponseDto] })
  itens: ItemComandaResponseDto[];

  @ApiProperty()
  createdAt: Date;

  @ApiProperty()
  updatedAt: Date;
}
