import { Test, TestingModule } from '@nestjs/testing';
import dayjs from 'dayjs';

import { PrismaService } from '../../services/prisma.service';

import { plainToInstance } from 'class-transformer';
import { AlocarDto } from '../../dto/alocar.dto';
import { AlocacaoService } from '../../services/alocacao.service';

describe('Alocação', () => {
  let alocacaoService: AlocacaoService;
  let prisma: PrismaService;

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      providers: [AlocacaoService, PrismaService],
    }).compile();

    alocacaoService = app.get<AlocacaoService>(AlocacaoService);
    prisma = app.get<PrismaService>(PrismaService);
  });

  describe('Alocar', () => {
    it('Deve alocar e retornar as informações de alocação', async () => {
      const expected = {
        dia: '2023-02-08',
        tempo: 'PT2H30M',
        nomeProjeto: 'ACME Corporation',
      };

      prisma.batidaPonto.findMany = jest.fn().mockReturnValueOnce([
        {
          id: 1,
          dia: new Date('2023-02-08'),
          horario: '08:00:00',
        },
      ]);

      prisma.alocacao.create = jest.fn().mockReturnValueOnce({
        id: 1,
        dia: dayjs('2023-02-08', 'YYYY-MM-DD').toDate(),
        tempo: 9000000,
        nomeProjeto: 'ACME Corporation',
      });

      const result = await alocacaoService.alocar(
        plainToInstance(AlocarDto, {
          dia: '2023-02-08',
          tempo: 'PT2H30M0S',
          nomeProjeto: 'ACME Corporation',
        }),
      );
      expect(result).toEqual(expected);
    });

    it('Deve tentar alocar em um dia que não foi trabalhado e retornar erro', async () => {
      prisma.batidaPonto.findMany = jest.fn().mockReturnValueOnce([]);

      const expected = 'Dia sem horas trabalhadas, não é possível alocar';

      await expect(
        alocacaoService.alocar(
          plainToInstance(AlocarDto, {
            dia: '2023-02-08',
            tempo: 'PT2H30M0S',
            nomeProjeto: 'ACME Corporation',
          }),
        ),
      ).rejects.toThrow(expected);
    });
  });
});
