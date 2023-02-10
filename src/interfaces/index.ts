export interface IBatida {
  dia: string;
  horarios: string[];
}

export interface IAlocacao {
  dia: string;
  tempo: string;
  nomeProjeto: string;
}

export interface IRelatorioMensal {
  mes: string;
  horasTrabalhadas: string;
  horasExcedentes: string;
  horasDevidas: string;
  registros: IBatida[];
  alocacoes: Partial<IAlocacao>[];
}
