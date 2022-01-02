import { ArgumentsHost, Catch, ExceptionFilter, HttpException } from '@nestjs/common';
import { Response } from 'express';
import { log } from './log';

@Catch()
export class FailExceptionFilter implements ExceptionFilter {
	public catch(exception: HttpException, host: ArgumentsHost): void {
		const ctx = host.switchToHttp();
		const res = ctx.getResponse<Response>();

		log({
			...exception.getResponse() as Record<string, unknown>,
			stack: exception.stack.split('\n').map(e => e.trim())
		});

		res.status(exception.getStatus()).json(exception.getResponse());
	}
}
