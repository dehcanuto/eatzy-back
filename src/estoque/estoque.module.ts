import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { EstoqueService } from './estoque.service';
import { EstoqueController } from './estoque.controller';
import { Produto } from '../entities/produto.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Produto])],
  controllers: [EstoqueController],
  providers: [EstoqueService],
  exports: [EstoqueService],
})
export class EstoqueModule {}
