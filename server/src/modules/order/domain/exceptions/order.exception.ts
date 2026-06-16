import { NotFoundException } from '@nestjs/common';

export class OrderNotFoundException extends NotFoundException {
  constructor(id: string) {
    super(`Order ${id} not found`);
  }
}

export class SubOrderNotFoundException extends NotFoundException {
  constructor(id: string) {
    super(`SubOrder ${id} not found`);
  }
}
