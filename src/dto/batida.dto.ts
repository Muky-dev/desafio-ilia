import { IsDateString, IsNotEmpty, Length } from 'class-validator';

export class BatidaDto {
  @IsDateString(
    { strict: true, strictSeparator: true },
    { message: 'Data e hora em formato inválido' },
  )
  @Length(19, 19, { message: 'Data e hora em formato inválido' })
  @IsNotEmpty({ message: 'Campo obrigatório não informado' })
  readonly dataHora: string;
}
