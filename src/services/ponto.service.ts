import { Injectable } from '@nestjs/common';
import {
  ConflictException,
  ForbiddenException,
} from '@nestjs/common/exceptions';

import dayjs from 'dayjs';
import duration from 'dayjs/plugin/duration';

dayjs.extend(duration);

import { PrismaService } from './prisma.service';

import { BatidaDto } from '../dto/ponto.dto';

import { IBatida } from '../interfaces';
import { BatidaPonto } from '@prisma/client';

@Injectable()
export class PontoService {
  constructor(private prisma: PrismaService) {}

  async baterPonto(batidaDto: BatidaDto): Promise<IBatida> {
    const dataHora: dayjs.Dayjs = dayjs(batidaDto.dataHora);
    const formatoHora = 'HH:mm:ss';
    const data: string = dataHora.format('YYYY-MM-DD');
    const horario: string = dataHora.format(formatoHora);
    const diaDaSemana: number = dataHora.day();

    if (diaDaSemana === 0 || diaDaSemana === 6)
      throw new Error(
        'Sábado e domingo não são permitidos como dia de trabalho',
      );

    const batidasDoDia: BatidaPonto[] = await this.prisma.batidaPonto.findMany({
      where: {
        dia: dayjs(data).toDate(),
      },
      orderBy: {
        dia: 'asc',
      },
    });

    if (batidasDoDia.length >= 4)
      throw new Error('Apenas 4 horários podem ser registrados por dia');

    const horarios = batidasDoDia.map((batida) => batida.horario);

    if (horarios.includes(horario)) {
      throw new ConflictException('Horário já registrado');
    }

    if (
      batidasDoDia.length === 2 &&
      dayjs(dataHora).diff(
        dayjs(`${batidasDoDia[1].dia}T${batidasDoDia[1].horario}`),
        'hour',
      ) < 1
    )
      throw new ForbiddenException('Deve haver no mínimo 1 hora de almoço');

    const batidaCriada = await this.prisma.batidaPonto.create({
      data: {
        dia: dayjs(data).toDate(),
        horario: horario,
      },
    });

    const horariosOrdenados = [...horarios, batidaCriada.horario].sort((a, b) =>
      a.localeCompare(b),
    );

    return {
      dia: dayjs(batidaCriada.dia).format('YYYY-MM-DD'),
      horarios: horariosOrdenados,
    };
  }
}
