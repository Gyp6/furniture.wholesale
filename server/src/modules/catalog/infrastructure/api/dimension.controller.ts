import { DimensionResponse } from '@catalog/application/dto/responses';
import { DimensionService } from '@catalog/application/services';
import { Controller, Get } from '@nestjs/common';
import { ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger';
import { SkipThrottle } from '@nestjs/throttler';
import { AllowAnonymous } from '@thallesp/nestjs-better-auth';

@ApiTags('Dimension')
@Controller('dimension')
export class DimensionController {
  constructor(private readonly dimensionService: DimensionService) {}

  @ApiOperation({ summary: 'Get all product dimensions' })
  @ApiOkResponse({ type: [DimensionResponse] })
  @Get()
  @SkipThrottle()
  @AllowAnonymous()
  async findAll(): Promise<DimensionResponse[]> {
    return this.dimensionService.findAll();
  }
}
