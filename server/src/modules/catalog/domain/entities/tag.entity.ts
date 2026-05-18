import { IProductTag } from './product.entity';

export class Tag implements IProductTag {
  constructor(
    public readonly id: string,
    public readonly title: string,
    public readonly slug: string,
  ) {}
}
