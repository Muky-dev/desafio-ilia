import { Controller, Get, Post, Param, Body } from '@nestjs/common';
import { AppService } from './app.service';

import { AlocarDto } from './dto/alocar.dto';
import { BatidaDto } from './dto/batida.dto';
import { IAlocacao, IBatida } from './interfaces';

@Controller('v1')
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Post('batidas')
  batida(@Body() batidaDto: BatidaDto): Promise<IBatida> {
    return this.appService.baterPonto(batidaDto);
  }

  @Post('alocacoes')
  alocar(@Body() alocarDto: AlocarDto): Promise<IAlocacao> {
    return this.appService.alocar(alocarDto);
  }

  @Get('folhas-de-ponto/:mes')
  relatorioMensal(@Param('mes') mes: string): Promise<string> {
    return this.appService.relatorioMensal(mes);
  }
}
