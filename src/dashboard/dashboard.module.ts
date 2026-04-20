import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DashboardService } from './dashboard.service';
import { DashboardController } from './dashboard.controller';
import { Mesa } from '../entities/mesa.entity';
import { Produto } from '../entities/produto.entity';
import { ContaPagar } from '../entities/conta-pagar.entity';
import { FluxoCaixa } from '../entities/fluxo-caixa.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Mesa, Produto, ContaPagar, FluxoCaixa])],
  controllers: [DashboardController],
  providers: [DashboardService],
  exports: [DashboardService],
})
export class DashboardModule {}
