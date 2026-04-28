import { Controller, Get } from '@nestjs/common';
import { ApiOkResponse, ApiOperation } from '@nestjs/swagger';
import { AllowAnonymous } from '@thallesp/nestjs-better-auth';

import { AppService } from './app.service';
import { HealthResponse, HelloResponse } from './dto/responses';

@Controller()
@AllowAnonymous()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @ApiOperation({
    summary: 'Welcome endpoint',
    description: 'Returns a simple API welcome message.',
  })
  @ApiOkResponse({
    type: HelloResponse,
  })
  @Get()
  getHello() {
    return this.appService.getHello();
  }

  @ApiOperation({
    summary: 'Health check',
    description: 'Checks if the Backend is running.',
  })
  @ApiOkResponse({
    type: HealthResponse,
  })
  @Get('health')
  health() {
    return this.appService.health();
  }
}
