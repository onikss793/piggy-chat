import { Module } from '@nestjs/common';
import { ExternalModule } from '../external/external.module';
import { AuthService } from './auth';
import { UserService } from './user';

@Module({
  imports: [ExternalModule],
  providers: [AuthService, UserService],
  exports: [AuthService, UserService],
})
export class ServiceModule {
}
