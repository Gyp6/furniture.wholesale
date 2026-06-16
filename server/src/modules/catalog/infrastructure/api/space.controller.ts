import { SpaceResponse } from '@catalog/application/dto/responses';
import { SpaceService } from '@catalog/application/services';
import { Controller, Get, Param } from '@nestjs/common';
import { ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger';
import { SkipThrottle } from '@nestjs/throttler';
import { AllowAnonymous } from '@thallesp/nestjs-better-auth';

@ApiTags('Space')
@Controller('spaces')
export class SpaceController {
  constructor(private readonly spaceService: SpaceService) {}

  @ApiOperation({ summary: 'Get all space types' })
  @ApiOkResponse({ type: [SpaceResponse] })
  @Get()
  @SkipThrottle()
  @AllowAnonymous()
  async findAll(): Promise<SpaceResponse[]> {
    return this.spaceService.findAll();
  }

  @ApiOperation({ summary: 'Get space by slug' })
  @ApiOkResponse({ type: SpaceResponse })
  @Get(':slug')
  @SkipThrottle()
  @AllowAnonymous()
  async findOne(@Param('slug') slug: string): Promise<SpaceResponse> {
    return this.spaceService.findBySlug(slug);
  }
}
