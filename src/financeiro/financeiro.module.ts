import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { FinanceiroService } from './financeiro.service';
import { FinanceiroController } from './financeiro.controller';
import { ContaPagar } from '../entities/conta-pagar.entity';
import { FluxoCaixa } from '../entities/fluxo-caixa.entity';

@Module({
  imports: [TypeOrmModule.forFeature([ContaPagar, FluxoCaixa])],
  controllers: [FinanceiroController],
  providers: [FinanceiroService],
  exports: [FinanceiroService],
})
export class FinanceiroModule {}
