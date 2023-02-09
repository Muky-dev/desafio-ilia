import { IsDate, IsDateString, IsNotEmpty } from 'class-validator';

export class AlocarDto {
  @IsNotEmpty({ message: 'Campo obrigatório não informado: dia' })
  dia: string;

  @IsNotEmpty({ message: 'Campo obrigatório não informado: tempo' })
  tempo: string;

  @IsNotEmpty({ message: 'Campo obrigatório não informado: nomeProjeto' })
  nomeProjeto: string;
}
