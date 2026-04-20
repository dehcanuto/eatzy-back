import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CardapioService } from './cardapio.service';
import { CardapioController } from './cardapio.controller';
import { Cardapio } from '../entities/cardapio.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Cardapio])],
  controllers: [CardapioController],
  providers: [CardapioService],
  exports: [CardapioService],
})
export class CardapioModule {}
