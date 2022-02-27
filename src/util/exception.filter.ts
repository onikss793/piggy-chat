import { ArgumentsHost, Catch, ExceptionFilter, HttpException } from '@nestjs/common';
import { Response } from 'express';
import { log } from './log';

@Catch()
export class FailExceptionFilter implements ExceptionFilter {
	public catch(exception: HttpException, host: ArgumentsHost): void {
		const ctx = host.switchToHttp();
		const res = ctx.getResponse<Response>();

		const status = exception.getStatus ? exception.getStatus() : 500;
		const response = exception.getResponse ? exception.getResponse() : { error: 'Internal Server Error', message: exception.message, statusCode: 500 };

		log({
			...response as Record<string, unknown>,
			stack: exception.stack.split('\n').map(e => e.trim())
		});

		res.status(status).json(response);
	}
}
