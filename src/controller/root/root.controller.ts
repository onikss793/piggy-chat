import { Controller, Get, HttpStatus } from '@nestjs/common';

@Controller('/root')
export class RootController {
	@Get()
	root(): HttpStatus {
		return HttpStatus.OK;
	}
}
