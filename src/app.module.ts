import { Module } from '@nestjs/common';
import { AppController } from './app.controller';

import { PontoService } from './services/ponto.service';
import { AlocacaoService } from './services/alocacao.service';
import { RelatorioService } from './services/relatorio.service';
import { PrismaService } from './services/prisma.service';

@Module({
  imports: [],
  controllers: [AppController],
  providers: [PontoService, AlocacaoService, RelatorioService, PrismaService],
})
export class AppModule {}
