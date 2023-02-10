import { Injectable } from '@nestjs/common';

import dayjs from 'dayjs';
import duration from 'dayjs/plugin/duration';

dayjs.extend(duration);

import { PrismaService } from './prisma.service';

import { IBatida, IRelatorioMensal } from '../interfaces';
import { BatidaPonto } from '@prisma/client';

@Injectable()
export class RelatorioService {
  constructor(private prisma: PrismaService) {}

  async relatorioMensal(mes: string): Promise<IRelatorioMensal> {
    this.validarMes(mes);

    const [alocacoesMes, batidasMes] = await Promise.all([
      this.prisma.alocacao.findMany({
        where: {
          dia: {
            gte: new Date(`${mes}-01`),
            lte: new Date(`${mes}-31`),
          },
        },
      }),
      this.prisma.batidaPonto.findMany({
        where: {
          dia: {
            gte: new Date(`${mes}-01`),
            lte: new Date(`${mes}-31`),
          },
        },
      }),
    ]);

    if (!alocacoesMes.length && !batidasMes.length)
      throw new Error('Relatório não encontrado');

    const totalAlocado = alocacoesMes.reduce(
      (total, alocacao) => total + alocacao.tempo,
      0,
    );

    const pontoAgrupado = this.agruparBatidas(batidasMes);
    const totalTrabalhado = this.calcularTempoTrabalhado(pontoAgrupado);

    return {
      mes,
      horasTrabalhadas: dayjs.duration(totalTrabalhado).toISOString(),
      horasExcendentes: dayjs
        .duration(
          totalTrabalhado - totalAlocado < 0
            ? 0
            : totalTrabalhado - totalAlocado,
        )
        .toISOString(),
      horasDevidas: dayjs
        .duration(
          totalAlocado - totalTrabalhado < 0
            ? 0
            : totalAlocado - totalTrabalhado,
        )
        .toISOString(),
      registros: pontoAgrupado,
      alocacoes: alocacoesMes.map((alocacao) => ({
        tempo: dayjs.duration(alocacao.tempo).toISOString(),
        nomeProjeto: alocacao.nomeProjeto,
      })),
    };
  }

  validarMes(mes: string): void {
    if (!mes) throw new Error('Mês não informado');
    const mesFormatado = dayjs(mes, 'YYYY-MM');
    if (!mesFormatado.isValid()) throw new Error('Mês inválido');
  }

  agruparBatidas(batidas: BatidaPonto[]): IBatida[] {
    return batidas.reduce((acc, batida) => {
      const dia = dayjs(batida.dia).format('YYYY-MM-DD');
      acc.find((batida) => batida.dia === dia)
        ? acc.find((batida) => batida.dia === dia).horarios.push(batida.horario)
        : acc.push({
            dia,
            horarios: [batida.horario],
          });
      return acc;
    }, [] as IBatida[]);
  }

  calcularTempoTrabalhado(batidas: IBatida[]): number {
    const diasCompletos = batidas.filter(
      (batida) => batida.horarios.length === 4,
    );

    return diasCompletos.reduce((total, batida) => {
      const dia = dayjs(batida.dia).format('YYYY-MM-DD');
      const horarios = batida.horarios.sort((a, b) => a.localeCompare(b));

      const horarioEntrada = dayjs(`${dia}T${horarios[0]}`);
      const horarioSaidaAlmoco = dayjs(`${dia}T${horarios[1]}`);
      const horarioEntradaAlmoco = dayjs(`${dia}T${horarios[2]}`);
      const horarioSaida = dayjs(`${dia}T${horarios[3]}`);

      const tempoTrabalhado = dayjs
        .duration(horarioSaida.diff(horarioEntrada))
        .subtract(horarioSaidaAlmoco.diff(horarioEntradaAlmoco))
        .asMilliseconds();

      return total + tempoTrabalhado;
    }, 0);
  }
}
