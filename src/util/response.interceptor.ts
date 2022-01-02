import { CallHandler, ExecutionContext, Injectable, NestInterceptor } from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { log } from './log';

@Injectable()
export class ResponseInterceptor<T> implements NestInterceptor<T, unknown> {
	intercept(_context: ExecutionContext, next: CallHandler): Observable<unknown> {
		return next.handle().pipe(map((data: unknown) => {
			log(data);
			return data;
		}));
	}
}
