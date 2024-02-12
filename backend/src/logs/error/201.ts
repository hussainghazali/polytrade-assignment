import { Injectable, NestInterceptor, ExecutionContext, CallHandler } from '@nestjs/common';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { LogsService } from '../logs.service';

@Injectable()
export class CreatedInterceptor implements NestInterceptor {
  constructor(private readonly logger: LogsService) {}

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const ctx = context.switchToHttp();
    const response = ctx.getResponse();
    const request = ctx.getRequest();

    return next.handle().pipe(
      tap(() => {
        const message = `201 Created: ${request.method} ${request.url}`;
        this.logger.log(message, 'CreatedInterceptor');
      }),
    );
  }
}
