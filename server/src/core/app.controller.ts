import { Controller, Get } from '@nestjs/common';
import { ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger';
import { AllowAnonymous } from '@thallesp/nestjs-better-auth';

import { AppService } from './app.service';
import {
  AuthHealthResponse,
  HealthDbResponse,
  HealthResponse,
  HelloResponse,
} from './dto/responses';

@ApiTags('Core(Health)')
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
  getHello(): HelloResponse {
    return this.appService.getHello();
  }

  @ApiOperation({
    summary: 'Health check endpoint',
    description: 'Checks if the Backend is running.',
  })
  @ApiOkResponse({
    type: HealthResponse,
  })
  @Get('health')
  health(): HealthResponse {
    return this.appService.getHealth();
  }

  @ApiOperation({
    summary: 'Database health check endpoint',
    description: 'Checks if the Database is running.',
  })
  @ApiOkResponse({
    type: HealthResponse,
  })
  @Get('db-health')
  async getHealthDb(): Promise<HealthDbResponse> {
    return await this.appService.getHealthDb();
  }

  @ApiOperation({
    summary: 'Auth health check endpoint',
    description: 'Checks if the Auth is running.',
  })
  @ApiOkResponse({
    type: AuthHealthResponse,
  })
  @Get('auth/ok')
  healthAuth(): void {}
}
