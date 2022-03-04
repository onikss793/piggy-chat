import { Module } from '@nestjs/common';
import { ServiceModule } from '../service';
import { AuthController } from './auth/auth.controller';
import { RootController } from './root/root.controller';
import { ScrapController } from './scrap/scrap.controller';
import { UserController } from './user/user.controller';

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
