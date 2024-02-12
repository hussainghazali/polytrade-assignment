import { Injectable } from '@nestjs/common';
import { Logs } from './config/winston.config';

@Injectable()
export class LogsService {
  log(message: string, context?: string) {
    Logs.info(message, { context });
  }

  error(message: string, trace: string, context?: string) {
    Logs.error(message, { context, trace });
  }

  warn(message: string, context?: string) {
    Logs.warn(message, { context });
  }

  debug(message: string, context?: string) {
    Logs.debug(message, { context });
  }
}