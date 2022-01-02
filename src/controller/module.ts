import { Module } from '@nestjs/common';
import { ServiceModule } from '../service';
import { AuthController } from './auth.controller';

@Module({
  imports: [ServiceModule],
  controllers: [AuthController],
  exports: []
})
export class ControllerModule {}
