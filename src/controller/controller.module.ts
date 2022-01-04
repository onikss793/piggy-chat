import { Module } from '@nestjs/common';
import { UserController } from '.';
import { ServiceModule } from '../service';
import { AuthController } from './auth.controller';
import { RootController } from './root.controller';

@Module({
  imports: [ServiceModule],
  controllers: [RootController, AuthController, UserController],
  exports: []
})
export class ControllerModule {}
