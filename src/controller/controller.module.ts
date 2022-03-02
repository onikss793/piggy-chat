import { Module } from '@nestjs/common';
import { ServiceModule } from '../service';
import { AuthController } from './auth.controller';
import { RootController } from './root.controller';
import { ScrapController } from './scrap.controller';
import { UserController } from './user.controller';

@Module({
  imports: [ServiceModule],
  controllers: [
    RootController,
    AuthController,
    UserController,
    ScrapController,
  ],
  exports: []
})
export class ControllerModule {}
