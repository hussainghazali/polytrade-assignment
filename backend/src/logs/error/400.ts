import { Catch, ArgumentsHost } from '@nestjs/common';
import { BaseExceptionFilter } from '@nestjs/core';
import { LogsService } from '../logs.service';

@Catch()
export class BadRequestFilter extends BaseExceptionFilter {
  constructor(private readonly logger: LogsService) {
    super();
  }

  catch(exception: any, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse();
    const request = ctx.getRequest();

    const status = exception?.response?.statusCode || 400;
    const message = exception?.message || 'Bad Request';

    // Log the error message
    this.logger.error(`Error ${status}: ${message}`, undefined, 'BadRequestFilter');

    response.status(status).json({
      statusCode: status,
      timestamp: new Date().toISOString(),
      path: request.url,
      message,
    });
  }
}
