import {
  AddBundleItemRequest,
  UpdateBundleRequest,
} from '@bundle/application/dto/requests';
import { CreateBundleRequest } from '@bundle/application/dto/requests/create-bundle.request';
import { BundleResponse } from '@bundle/application/dto/responses';
import { BundleService } from '@bundle/application/services';
import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Req,
} from '@nestjs/common';
import { ApiOkResponse, ApiOperation } from '@nestjs/swagger';
import { AllowAnonymous } from '@thallesp/nestjs-better-auth';

import { IReqUser } from '@/common/types';
import { CurrentAbility } from '@/core/decorators';
import type { AppAbility } from '@/infrastructure/casl/casl.ability-factory';

@Controller('bundles')
export class BundleController {
  constructor(private readonly bundleService: BundleService) {}

  // ── GET /bundles/my ───────────────────────────────────────────
  @ApiOperation({
    summary: 'Get bundles owned by the current authenticated user',
  })
  @ApiOkResponse({ type: [BundleResponse] })
  @Get('my')
  findMy(@Req() { user: { id } }: { user: IReqUser }) {
    return this.bundleService.findAllByUser(id);
  }

  // ── GET /bundles/share/:token — публічно, без авторизації ─────
  @ApiOperation({
    summary: 'Get shared bundle by public token (No Auth Required)',
  })
  @ApiOkResponse({ type: BundleResponse })
  @Get('share/:token')
  @AllowAnonymous()
  findByShareToken(@Param('token') token: string) {
    return this.bundleService.findByShareToken(token);
  }

  // ── GET /bundles/:id ──────────────────────────────────────────
  @ApiOperation({ summary: 'Get bundle by ID' })
  @ApiOkResponse({ type: BundleResponse })
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.bundleService.findById(id);
  }

  // ── POST /bundles ─────────────────────────────────────────────
  @ApiOperation({ summary: 'Create a new empty bundle' })
  @ApiOkResponse({ type: BundleResponse })
  @Post()
  create(
    @Req() { user }: { user: IReqUser },
    @Body() dto: CreateBundleRequest,
  ) {
    return this.bundleService.create(user, dto);
  }

  // ── PATCH /bundles/:id ────────────────────────────────────────
  @ApiOperation({ summary: 'Update bundle details (meta / status)' })
  @ApiOkResponse({ type: BundleResponse })
  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() dto: UpdateBundleRequest,
    @CurrentAbility() ability: AppAbility,
  ) {
    return this.bundleService.update(id, dto, ability);
  }

  // ── POST /bundles/:id/share ───────────────────────────────────
  @ApiOperation({
    summary: 'Enable public sharing for bundle and generate token',
  })
  @ApiOkResponse({ type: BundleResponse })
  @Post(':id/share')
  share(@Param('id') id: string, @Req() { user }: { user: IReqUser }) {
    return this.bundleService.share(id, user);
  }

  // ── DELETE /bundles/:id/share ─────────────────────────────────
  @ApiOperation({ summary: 'Disable public sharing for bundle' })
  @ApiOkResponse({ type: BundleResponse })
  @Delete(':id/share')
  unshare(@Param('id') id: string, @Req() { user }: { user: IReqUser }) {
    return this.bundleService.unshare(id, user);
  }

  // ── POST /bundles/:id/fork ────────────────────────────────────
  @ApiOperation({ summary: 'Fork a public bundle into a new design concept' })
  @ApiOkResponse({ type: BundleResponse })
  @Post(':id/fork')
  fork(@Param('id') id: string, @Req() { user }: { user: IReqUser }) {
    return this.bundleService.fork(id, user);
  }

  // ── POST /bundles/:id/items ───────────────────────────────────
  @ApiOperation({ summary: 'Add product or SUPPLIER bundle to item list' })
  @ApiOkResponse({ type: BundleResponse })
  @Post(':id/items')
  addItem(
    @Param('id') bundleId: string,
    @Body() dto: AddBundleItemRequest,
    @Req() { user }: { user: IReqUser },
  ) {
    return this.bundleService.addItem(bundleId, dto, user);
  }

  // ── DELETE /bundles/:id/items/:itemId ─────────────────────────
  @ApiOperation({ summary: 'Remove item row from bundle' })
  @Delete(':id/items/:itemId')
  removeItem(
    @Param('id') bundleId: string,
    @Param('itemId') itemId: string,
    @Req() { user }: { user: IReqUser },
  ) {
    return this.bundleService.removeItem(bundleId, itemId, user);
  }

  // ── DELETE /bundles/:id ───────────────────────────────────────
  @ApiOperation({ summary: 'Delete bundle cascade' })
  @Delete(':id')
  delete(@Param('id') id: string, @CurrentAbility() ability: AppAbility) {
    return this.bundleService.delete(id, ability);
  }
}
