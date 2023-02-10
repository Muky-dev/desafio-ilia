import { ExceptionFilter, Catch, ArgumentsHost } from '@nestjs/common';
import { Response } from 'express';

@Catch()
export class RelatorioFilter implements ExceptionFilter {
  catch(exception: any, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const ctxStatus = exception.getStatus ? exception.getStatus() : 500;

    let mensagem = exception.getResponse
      ? exception.getResponse().message[0]
      : exception.message;
    let status;

    switch (mensagem) {
      case 'Relatório não encontrado':
        status = 400;
        break;

      case 'Mês não informado':
        status = 400;
        break;

      case 'Mês inválido':
        status = 400;
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
