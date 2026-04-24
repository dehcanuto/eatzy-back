import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ComandasService } from './comandas.service';
import { ComandasController } from './comandas.controller';
import { ComandasPublicController } from './comandas-public.controller';
import { Comanda } from '../entities/comanda.entity';
import { ItemComanda } from '../entities/item-comanda.entity';
import { Mesa } from '../entities/mesa.entity';
import { Cardapio } from '../entities/cardapio.entity';
import { CardapioService } from '../cardapio/cardapio.service';

@Module({
  imports: [TypeOrmModule.forFeature([Comanda, ItemComanda, Mesa, Cardapio])],
  controllers: [ComandasController, ComandasPublicController],
  providers: [ComandasService, CardapioService],
  exports: [ComandasService],
})
export class ComandasModule {}
