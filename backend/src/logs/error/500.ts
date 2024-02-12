import { Catch, ArgumentsHost } from '@nestjs/common';
import { BaseExceptionFilter } from '@nestjs/core';
import { LogsService } from '../logs.service';

@Catch(Error)
export class ServerErrorFilter extends BaseExceptionFilter {
  constructor(private readonly logger: LogsService) {
    super();
  }

  catch(exception: Error, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse();
    const request = ctx.getRequest();

    const message = `500 Error: ${exception.message}`;

    // Log the server error message
    this.logger.error(message, exception.stack, 'ServerErrorFilter');

    response.status(500).json({
      statusCode: 500,
      timestamp: new Date().toISOString(),
      path: request.url,
      message: 'Internal server error',
    });
  }
}
