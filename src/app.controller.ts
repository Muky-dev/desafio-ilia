import { Controller, Get, Post, Param, Body } from '@nestjs/common';

import { AlocarDto } from './dto/alocar.dto';
import { BatidaDto } from './dto/ponto.dto';
import { IAlocacao, IBatida, IRelatorioMensal } from './interfaces';
import { AlocacaoService } from './services/alocacao.service';
import { PontoService } from './services/ponto.service';
import { RelatorioService } from './services/relatorio.service';

@Controller('v1')
export class AppController {
  constructor(
    private readonly pontoService: PontoService,
    private readonly alocacaoSerice: AlocacaoService,
    private readonly relatorioService: RelatorioService,
  ) {}

  @Post('batidas')
  batida(@Body() batidaDto: BatidaDto): Promise<IBatida> {
    return this.pontoService.baterPonto(batidaDto);
  }

  @Post('alocacoes')
  alocar(@Body() alocarDto: AlocarDto): Promise<IAlocacao> {
    return this.alocacaoSerice.alocar(alocarDto);
  }

  @Get('folhas-de-ponto/:mes')
  relatorioMensal(@Param('mes') mes: string): Promise<IRelatorioMensal> {
    return this.relatorioService.relatorioMensal(mes);
  }
}
