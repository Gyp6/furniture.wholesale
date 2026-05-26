import {
  BUNDLE_REPOSITORY,
  type IBundleRepository,
} from '@bundle/domain/contracts';
import { Bundle, BundleItem } from '@bundle/domain/entities';
import {
  BundleNotFoundException,
  BundleNotSharedError,
} from '@bundle/domain/exceptions';
import { subject } from '@casl/ability';
import {
  ForbiddenException,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { BundleType, ProductStatus } from '@prisma/client';
import { nanoid } from 'nanoid';

import { ECalsAction } from '@/common/enums';
import { IReqUser } from '@/common/types';
import { AppAbility } from '@/infrastructure/casl/casl.ability-factory';

import {
  AddBundleItemRequest,
  CreateBundleRequest,
  UpdateBundleRequest,
} from '../dto/requests';
import { BundleResponse } from '../dto/responses';
import { BundleMapper } from '../mappers';

@Injectable()
export class BundleService {
  constructor(
    @Inject(BUNDLE_REPOSITORY)
    private readonly bundleRepository: IBundleRepository,
    private readonly configService: ConfigService,
  ) {}

  private get baseUrl(): string {
    return this.configService.get<string>('BASE_URL') ?? '';
  }

  async findAllByUser(userId: string): Promise<BundleResponse[]> {
    const entities = await this.bundleRepository.findAllByUserId(userId);
    return entities.map(e => BundleMapper.toResponse(e, this.baseUrl));
  }

  async findById(id: string): Promise<BundleResponse> {
    const entity = await this.bundleRepository.findById(id);
    if (!entity) throw new BundleNotFoundException(id);
    return BundleMapper.toResponse(entity, this.baseUrl);
  }

  async findByShareToken(token: string): Promise<BundleResponse> {
    const entity = await this.bundleRepository.findByShareToken(token);
    if (!entity) throw new BundleNotSharedError();
    return BundleMapper.toResponse(entity, this.baseUrl);
  }

  async create(
    user: IReqUser,
    dto: CreateBundleRequest,
  ): Promise<BundleResponse> {
    const isSupplierRole = user.role === 'SUPPLIER';
    const bundleType = dto.bundleType;

    if (bundleType === BundleType.SUPPLIER && !isSupplierRole) {
      throw new ForbiddenException(
        'Only SUPPLIER role can create SUPPLIER bundles.',
      );
    }

    const now = new Date();
    const entity = new Bundle(
      nanoid(),
      dto.bundleType,
      dto.bundleType === BundleType.SUPPLIER ? 0 : 1,
      user.id,
      dto.spaceTypeId,
      null,
      [],
      now,
      now,
      dto.name,
      dto.description ?? null,
      ProductStatus.DRAFT,
      false,
      null,
    );

    const saved = await this.bundleRepository.create(entity);
    return BundleMapper.toResponse(saved, this.baseUrl);
  }

  async update(
    id: string,
    dto: UpdateBundleRequest,
    ability: AppAbility,
  ): Promise<BundleResponse> {
    const raw = await this.bundleRepository.findRaw(id);
    if (!raw) throw new BundleNotFoundException(id);

    if (ability.cannot(ECalsAction.Update, subject('Bundle', raw))) {
      throw new ForbiddenException('You can only update your own bundles.');
    }

    const entity = await this.bundleRepository.update(id, dto);
    return BundleMapper.toResponse(entity, this.baseUrl);
  }

  async share(id: string, user: IReqUser): Promise<BundleResponse> {
    const entity = await this.bundleRepository.findById(id);
    if (!entity) throw new BundleNotFoundException(id);
    if (entity.userId !== user.id)
      throw new ForbiddenException('You can only share your own bundles.');

    const token = entity.enableSharing();
    const updated = await this.bundleRepository.update(id, {
      isShared: true,
      shareToken: token,
    });
    return BundleMapper.toResponse(updated, this.baseUrl);
  }

  async unshare(id: string, user: IReqUser): Promise<BundleResponse> {
    const entity = await this.bundleRepository.findById(id);
    if (!entity) throw new BundleNotFoundException(id);
    if (entity.userId !== user.id)
      throw new ForbiddenException('You can only unshare your own bundles.');

    entity.disableSharing();
    const updated = await this.bundleRepository.update(id, {
      isShared: false,
      shareToken: null,
    });
    return BundleMapper.toResponse(updated, this.baseUrl);
  }

  async fork(id: string, user: IReqUser): Promise<BundleResponse> {
    const entity = await this.bundleRepository.findById(id);
    if (!entity) throw new BundleNotFoundException(id);

    const forkedDomainEntity = entity.fork(user.id);
    const savedFork = await this.bundleRepository.create(forkedDomainEntity);
    return BundleMapper.toResponse(savedFork, this.baseUrl);
  }

  async addItem(
    bundleId: string,
    dto: AddBundleItemRequest,
    user: IReqUser,
  ): Promise<BundleResponse> {
    const entity = await this.bundleRepository.findById(bundleId);
    if (!entity) throw new BundleNotFoundException(bundleId);
    if (entity.userId !== user.id)
      throw new ForbiddenException('You can only modify your own bundles.');

    if (dto.nestedBundleId) {
      const nested = await this.bundleRepository.findById(dto.nestedBundleId);
      if (!nested)
        throw new NotFoundException(`Bundle ${dto.nestedBundleId} not found`);
      entity.validateCanNest(nested);
    }

    const newItem = new BundleItem(
      nanoid(),
      bundleId,
      dto.productId ?? null,
      dto.nestedBundleId ?? null,
      dto.quantity,
      dto.priceSnapshot,
      new Date(),
    );

    const updated = await this.bundleRepository.addItem(bundleId, newItem);
    return BundleMapper.toResponse(updated, this.baseUrl);
  }

  async removeItem(
    bundleId: string,
    itemId: string,
    user: IReqUser,
  ): Promise<void> {
    const entity = await this.bundleRepository.findById(bundleId);
    if (!entity) throw new BundleNotFoundException(bundleId);
    if (entity.userId !== user.id)
      throw new ForbiddenException('You can only modify your own bundles.');
    await this.bundleRepository.removeItem(itemId);
  }

  async delete(id: string, ability: AppAbility): Promise<void> {
    const raw = await this.bundleRepository.findRaw(id);
    if (!raw) throw new BundleNotFoundException(id);

    if (ability.cannot(ECalsAction.Delete, subject('Bundle', raw))) {
      throw new ForbiddenException('You can only delete your own bundles.');
    }

    await this.bundleRepository.delete(id);
  }
}
