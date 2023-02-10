import { ExceptionFilter, Catch, ArgumentsHost } from '@nestjs/common';
import { Response } from 'express';

@Catch()
export class PontoFilter implements ExceptionFilter {
  catch(exception: any, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const ctxStatus = exception.getStatus ? exception.getStatus() : 500;

    let mensagem = exception.getResponse
      ? exception.getResponse().message[0]
      : exception.message;
    let status;

    switch (mensagem) {
      case 'Sábado e domingo não são permitidos como dia de trabalho':
        status = 403;
        break;

      case 'Apenas 4 horários podem ser registrados por dia':
        status = 403;
        break;

      case 'Deve haver no mínimo 1 hora de almoço':
        status = 403;
        break;

      case 'Horário já registrado':
        status = 409;
        break;

      default:
        status = ctxStatus;
        break;
    }

    if (status === 500) mensagem = 'Internal server error';

    response.status(status).json({
      mensagem,
    });
  }
}
