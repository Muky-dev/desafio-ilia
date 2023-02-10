import { Injectable } from '@nestjs/common';

import dayjs from 'dayjs';
import duration from 'dayjs/plugin/duration';

dayjs.extend(duration);

import { PrismaService } from './prisma.service';

import { AlocarDto } from '../dto/alocar.dto';

import { IAlocacao } from '../interfaces';
import { Alocacao } from '@prisma/client';

@Injectable()
export class AlocacaoService {
  constructor(private prisma: PrismaService) {}

  async alocar(alocarDto: AlocarDto): Promise<IAlocacao> {
    this.validarAlocacao(alocarDto);
    const alocacaoDia = dayjs(alocarDto.dia, 'YYYY-MM-DD');
    const alocacaoTempo = dayjs.duration(alocarDto.tempo);
    const alocacaoMilisegundos = alocacaoTempo.asMilliseconds();
    const batidasDoDia = await this.prisma.batidaPonto.findMany({
      where: {
        dia: alocacaoDia.toDate(),
      },
      orderBy: {
        dia: 'asc',
      },
    });

    if (!batidasDoDia.length)
      throw new Error('Dia sem horas trabalhadas, não é possível alocar');

    const alocacaoCriada: Alocacao = await this.prisma.alocacao.create({
      data: {
        dia: alocacaoDia.toDate(),
        tempo: alocacaoMilisegundos,
        nomeProjeto: alocarDto.nomeProjeto,
      },
    });

    return this.transformarAlocacao(alocacaoCriada);
  }

  validarAlocacao(alocarDto: AlocarDto) {
    const alocacaoDia = dayjs(alocarDto.dia, 'YYYY-MM-DD');
    if (!alocacaoDia.isValid()) throw new Error('Data inválida');

    const alocacaoTempo = dayjs.duration(alocarDto.tempo);
    const alocacaoMilisegundos = alocacaoTempo.asMilliseconds();

    if (Number.isNaN(alocacaoMilisegundos) || alocacaoMilisegundos < 1)
      throw new Error('Tempo inválido');
  }

  transformarAlocacao(alocacao: Alocacao): IAlocacao {
    return {
      dia: dayjs(alocacao.dia).format('YYYY-MM-DD'),
      tempo: dayjs.duration(alocacao.tempo).toISOString(),
      nomeProjeto: alocacao.nomeProjeto,
    };
  }
}
