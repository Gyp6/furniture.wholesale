import { TagResponse } from '@catalog/application/dto/responses';
import { TagService } from '@catalog/application/services';
import { Controller, Get } from '@nestjs/common';
import { ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger';
import { AllowAnonymous } from '@thallesp/nestjs-better-auth';

@ApiTags('Tags')
@Controller('tags')
export class TagController {
  constructor(private readonly tagService: TagService) {}

  @ApiOperation({ summary: 'Get all product tags' })
  @ApiOkResponse({ type: [TagResponse] })
  @Get()
  @AllowAnonymous()
  async findAll(): Promise<TagResponse[]> {
    return this.tagService.findAll();
  }
}
