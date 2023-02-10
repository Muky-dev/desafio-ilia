import { Test, TestingModule } from '@nestjs/testing';
import dayjs from 'dayjs';

import { PrismaService } from '../../services/prisma.service';
import { RelatorioService } from '../../services/relatorio.service';

describe('Relatorio', () => {
  let relatorioService: RelatorioService;
  let prisma: PrismaService;

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      providers: [RelatorioService, PrismaService],
    }).compile();

    relatorioService = app.get<RelatorioService>(RelatorioService);
    prisma = app.get<PrismaService>(PrismaService);
  });

  describe('Mensal', () => {
    it('Deve retornar o relatório mensal', async () => {
      const date = dayjs('2023-02-08', 'YYYY-MM-DD').toDate();
      const expected = {
        mes: '2023-02',
        horasTrabalhadas: 'PT11H',
        horasExcedentes: 'PT3H',
        horasDevidas: 'P0D',
        registros: [
          {
            dia: '2023-02-08',
            horarios: ['08:00:00', '12:00:00', '13:00:00', '18:00:00'],
          },
        ],
        alocacoes: [
          {
            nomeProjeto: 'ACME Corporation',
            tempo: 'PT4H',
          },
          {
            nomeProjeto: 'ACME Corporation 2',
            tempo: 'PT4H',
          },
        ],
      };

      prisma.alocacao.findMany = jest.fn().mockReturnValueOnce([
        {
          id: 1,
          dia: date,
          tempo: 14400000,
          nomeProjeto: 'ACME Corporation',
        },
        {
          id: 2,
          dia: date,
          tempo: 14400000,
          nomeProjeto: 'ACME Corporation 2',
        },
      ]);

      prisma.batidaPonto.findMany = jest.fn().mockReturnValueOnce([
        {
          id: 1,
          dia: date,
          horario: '08:00:00',
        },
        {
          id: 2,
          dia: date,
          horario: '12:00:00',
        },
        {
          id: 3,
          dia: date,
          horario: '13:00:00',
        },
        {
          id: 4,
          dia: date,
          horario: '18:00:00',
        },
      ]);

      const result = await relatorioService.relatorioMensal('2023-02');
      expect(result).toEqual(expected);
    });

    it('Deve retornar erro quando não encontrar o relatório', async () => {
      prisma.alocacao.findMany = jest.fn().mockReturnValueOnce([]);
      prisma.batidaPonto.findMany = jest.fn().mockReturnValueOnce([]);

      await expect(
        relatorioService.relatorioMensal('2023-02'),
      ).rejects.toThrowError('Relatório não encontrado');
    });
  });
});
