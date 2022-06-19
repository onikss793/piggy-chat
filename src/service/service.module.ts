import { Module } from '@nestjs/common';
import { ExternalModule } from '../external/external.module';
import { AlertService } from './alert';
import { AuthService } from './auth';
import { ScrapService } from './scrap';
import { UserService } from './user';

@Module({
  imports: [ExternalModule],
  providers: [AuthService, UserService, ScrapService, AlertService],
  exports: [AuthService, UserService, ScrapService, AlertService],
})
export class ServiceModule {}
