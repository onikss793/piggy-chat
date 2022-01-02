import { Module } from '@nestjs/common';
import { ServiceModule } from '../service';
import { AuthController } from './auth.controller';
import { RootController } from './root.controller';

@Module({
  imports: [ServiceModule],
  controllers: [AuthController, RootController],
  exports: []
})
export class ControllerModule {}
