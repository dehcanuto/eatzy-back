import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';

import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { EstoqueModule } from './estoque/estoque.module';
import { MesasModule } from './mesas/mesas.module';
import { FinanceiroModule } from './financeiro/financeiro.module';
import { DashboardModule } from './dashboard/dashboard.module';
import { CardapioModule } from './cardapio/cardapio.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath:
        process.env.NODE_ENV === 'development' ? '.env.develop' : '.env',
      isGlobal: true,
    }),
    TypeOrmModule.forRoot({
      type: 'mariadb',
      host: process.env.DB_HOST,
      port: parseInt(process.env.DB_PORT || '3306'),
      database: process.env.DB_DATABASE,
      username: process.env.DB_USERNAME,
      password: process.env.DB_PASSWORD,
      entities: [__dirname + '/**/*.entity{.ts,.js}'],
      synchronize: true,
    }),
    AuthModule,
    UsersModule,
    EstoqueModule,
    MesasModule,
    FinanceiroModule,
    DashboardModule,
    CardapioModule,
  ],
})
export class AppModule {}
