import { BadRequestException, NotFoundException } from '@nestjs/common';

export class BundleNotFoundException extends NotFoundException {
  constructor(id: string) {
    super(`Bundle ${id} not found`);
  }
}

export class BundleItemNotFoundException extends NotFoundException {
  constructor(id: string) {
    super(`BundleItem ${id} not found`);
  }
}

export class BundleNestingDepthError extends BadRequestException {
  constructor() {
    super(
      'Only SUPPLIER bundles (depth=0) can be nested inside USER bundles. USER-in-USER nesting is not allowed.',
    );
  }
}

export class SupplierBundleCannotNestError extends BadRequestException {
  constructor() {
    super('SUPPLIER bundles cannot contain nested bundles, only products.');
  }
}

export class BundleItemTargetConflictError extends BadRequestException {
  constructor() {
    super(
      'A BundleItem must have exactly one target: either productId or nestedBundleId.',
    );
  }
}

export class CannotForkSupplierBundleError extends BadRequestException {
  constructor() {
    super('Only USER bundles can be forked.');
  }
}

export class BundleNotSharedError extends BadRequestException {
  constructor() {
    super('Bundle is not shared or share token is missing.');
  }
}
