import { Controller, Get, Post, Param, Body, UseFilters } from '@nestjs/common';

import { AlocarDto } from './dto/alocar.dto';
import { BatidaDto } from './dto/ponto.dto';

import { AlocacaoService } from './services/alocacao.service';
import { PontoService } from './services/ponto.service';
import { RelatorioService } from './services/relatorio.service';

import { PontoFilter } from './filters/ponto.filter';

import { IAlocacao, IBatida, IRelatorioMensal } from './interfaces';
import { AlocacaoFilter } from './filters/alocacao.filter';
import { RelatorioFilter } from './filters/relatorio.filter';

@Controller('v1')
export class AppController {
  constructor(
    private readonly pontoService: PontoService,
    private readonly alocacaoSerice: AlocacaoService,
    private readonly relatorioService: RelatorioService,
  ) {}

  @Post('batidas')
  @UseFilters(PontoFilter)
  batida(@Body() batidaDto: BatidaDto): Promise<IBatida> {
    return this.pontoService.baterPonto(batidaDto);
  }

  @Post('alocacoes')
  @UseFilters(AlocacaoFilter)
  alocar(@Body() alocarDto: AlocarDto): Promise<IAlocacao> {
    return this.alocacaoSerice.alocar(alocarDto);
  }

  @Get('folhas-de-ponto/:mes')
  @UseFilters(RelatorioFilter)
  relatorioMensal(@Param('mes') mes: string): Promise<IRelatorioMensal> {
    return this.relatorioService.relatorioMensal(mes);
  }
}
