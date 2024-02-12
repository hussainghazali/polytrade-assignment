// src/Logs/Logs.controller.ts

import { Controller, Get } from '@nestjs/common';
import { LogsService } from './logs.service';

@Controller('logs')
export class LogsController {
  constructor(private readonly logsService: LogsService) {}

  @Get('info')
  getInfoLog() {
    this.logsService.log('This is an INFO log message from the LogsController.', 'LogsController');
    return 'Logged an INFO message.';
  }

  @Get('error')
  getErrorLog() {
    this.logsService.error('This is an ERROR log message from the LogsController.', null, 'LogsController');
    return 'Logged an ERROR message.';
  }
}