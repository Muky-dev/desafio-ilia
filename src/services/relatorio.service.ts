import { Injectable } from '@nestjs/common';
import { BadRequestException } from '@nestjs/common/exceptions';

import dayjs from 'dayjs';
import duration from 'dayjs/plugin/duration';

dayjs.extend(duration);

import { PrismaService } from './prisma.service';

import { AlocarDto } from '../dto/alocar.dto';

import { IAlocacao, IRelatorioMensal } from '../interfaces';
import { Alocacao } from '@prisma/client';

@Injectable()
export class RelatorioService {
  constructor(private prisma: PrismaService) {}

  async relatorioMensal(mes: string): Promise<IRelatorioMensal> {
    return;
  }
}
