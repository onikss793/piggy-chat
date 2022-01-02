import { Module } from '@nestjs/common';
import { APP_FILTER, APP_INTERCEPTOR } from '@nestjs/core';
import { ControllerModule } from './controller';
import { FailExceptionFilter, ResponseInterceptor } from './util';

@Module({
  imports: [ControllerModule],
  providers: [
    { provide: APP_FILTER, useClass: FailExceptionFilter },
    { provide: APP_INTERCEPTOR, useClass: ResponseInterceptor },
  ],
})
export class AppModule {}
