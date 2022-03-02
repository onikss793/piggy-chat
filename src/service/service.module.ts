import { Module } from '@nestjs/common';
import { ExternalModule } from '../external/external.module';
import { AuthService } from './auth';
import { ScrapService } from './scrap';
import { UserService } from './user';

@Module({
  imports: [ExternalModule],
  providers: [AuthService, UserService, ScrapService],
  exports: [AuthService, UserService, ScrapService],
})
export class ServiceModule {}
