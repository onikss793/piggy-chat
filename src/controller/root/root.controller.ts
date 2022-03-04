import { Controller, Get, HttpStatus } from '@nestjs/common';

@Controller('/')
export class RootController {
	@Get()
	root(): HttpStatus {
		return HttpStatus.OK;
	}
}
