import { CreateCategoryRequest } from '@catalog/application/dto/requests';
import { CategoryResponse } from '@catalog/application/dto/responses';
import { CategoryService } from '@catalog/application/services';
import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import {
  ApiCreatedResponse,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';
import { Roles } from '@thallesp/nestjs-better-auth';

import { ROLES } from '@/common/constants';

@ApiTags('Categories')
@Controller('categories')
export class CategoryController {
  constructor(private readonly categoryService: CategoryService) {}

  @ApiOperation({ summary: 'Get all root categories with children' })
  @ApiOkResponse({ type: [CategoryResponse] })
  @Get()
  async findAll(): Promise<CategoryResponse[]> {
    return this.categoryService.findAll();
  }

  @ApiOperation({ summary: 'Get category by id' })
  @ApiOkResponse({ type: CategoryResponse })
  @Get(':id')
  async findOne(@Param('id') id: string): Promise<CategoryResponse> {
    return this.categoryService.findById(id);
  }

  @ApiOperation({ summary: 'Create category (admin only)' })
  @ApiCreatedResponse({ type: CategoryResponse })
  @Roles([ROLES.ADMIN])
  @Post()
  async create(
    @Body() { name }: CreateCategoryRequest,
  ): Promise<CategoryResponse> {
    return this.categoryService.create(name);
  }
}
