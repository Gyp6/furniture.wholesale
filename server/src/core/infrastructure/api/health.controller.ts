import {
  AuthHealthResponse,
  HealthDbResponse,
  HealthResponse,
  HelloResponse,
} from '@core/application/dto/responses';
import { HealthService } from '@core/application/services';
import { Controller, Get } from '@nestjs/common';
import { ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger';
import { SkipThrottle } from '@nestjs/throttler';
import { AllowAnonymous } from '@thallesp/nestjs-better-auth';

@ApiTags('Health')
@Controller()
@SkipThrottle()
@AllowAnonymous()
export class HealthController {
  constructor(private readonly healthService: HealthService) {}

  @ApiOperation({
    summary: 'Welcome endpoint',
    description: 'Returns a simple API welcome message.',
  })
  @ApiOkResponse({
    type: HelloResponse,
  })
  @Get()
  getHello(): HelloResponse {
    return this.healthService.getHello();
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
    return this.healthService.getHealth();
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
    return await this.healthService.getHealthDb();
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
