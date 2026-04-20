import { PartialType } from '@nestjs/swagger';
import { CreateCardapioDto } from './create-cardapio.dto';

export class UpdateCardapioDto extends PartialType(CreateCardapioDto) {}
