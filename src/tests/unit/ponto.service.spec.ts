import { Test, TestingModule } from '@nestjs/testing';

import { PontoService } from '../../services/ponto.service';
import { PrismaService } from '../../services/prisma.service';

import { plainToInstance } from 'class-transformer';
import { BatidaDto } from '../../dto/ponto.dto';

describe('Ponto', () => {
  let pontoService: PontoService;
  let prisma: PrismaService;

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      providers: [PontoService, PrismaService],
    }).compile();

    pontoService = app.get<PontoService>(PontoService);
    prisma = app.get<PrismaService>(PrismaService);
  });

  describe('Bater ponto', () => {
    it('Deve bater o ponto corretamente e retornar as informações', async () => {
      prisma.batidaPonto.findMany = jest.fn().mockReturnValueOnce([]);
      prisma.batidaPonto.create = jest.fn().mockReturnValueOnce({
        id: 1,
        dia: new Date('2021-02-11T08:00:00'),
        horario: '08:00:00',
      });

      const expected = {
        dia: '2021-02-11',
        horarios: ['08:00:00'],
      };

      expect(
        await pontoService.baterPonto(
          plainToInstance(BatidaDto, { dataHora: '2023-02-08T08:00:00' }),
        ),
      ).toEqual(expected);
    });

    it('Deve tentar bater o ponto em um sábado e retornar erro', async () => {
      prisma.batidaPonto.findMany = jest.fn().mockReturnValueOnce([]);

      const expected =
        'Sábado e domingo não são permitidos como dia de trabalho';

      await expect(
        pontoService.baterPonto(
          plainToInstance(BatidaDto, { dataHora: '2023-02-11T08:00:00' }),
        ),
      ).rejects.toThrow(expected);
    });

    it('Deve tentar bater o ponto em um domingo e retornar erro', async () => {
      prisma.batidaPonto.findMany = jest.fn().mockReturnValueOnce([]);

      const expected =
        'Sábado e domingo não são permitidos como dia de trabalho';

      await expect(
        pontoService.baterPonto(
          plainToInstance(BatidaDto, { dataHora: '2023-02-12T08:00:00' }),
        ),
      ).rejects.toThrow(expected);
    });

    it('Deve tentar bater o ponto quando já houver 4 batidas e retornar erro', async () => {
      prisma.batidaPonto.findMany = jest.fn().mockReturnValueOnce([
        {
          id: 1,
          dia: new Date('2021-02-08'),
          horario: '08:00:00',
        },
        {
          id: 2,
          dia: new Date('2021-02-08'),
          horario: '12:00:00',
        },
        {
          id: 3,
          dia: new Date('2021-02-08'),
          horario: '13:00:00',
        },
        {
          id: 4,
          dia: new Date('2021-02-08'),
          horario: '18:00:00',
        },
      ]);

      const expected = 'Apenas 4 horários podem ser registrados por dia';

      await expect(
        pontoService.baterPonto(
          plainToInstance(BatidaDto, { dataHora: '2023-02-08T019:00:00' }),
        ),
      ).rejects.toThrow(expected);
    });

    it('Deve tentar bater o ponto quando já ouver um no mesmo horário e retornar erro', async () => {
      prisma.batidaPonto.findMany = jest.fn().mockReturnValueOnce([
        {
          id: 1,
          dia: new Date('2021-02-08T08:00:00'),
          horario: '08:00:00',
        },
      ]);

      const expected = 'Horário já registrado';

      await expect(
        pontoService.baterPonto(
          plainToInstance(BatidaDto, { dataHora: '2023-02-08T08:00:00' }),
        ),
      ).rejects.toThrow(expected);
    });
  });
});
