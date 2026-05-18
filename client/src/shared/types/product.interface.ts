export interface ITag {
  title: string;
  slug: string;
}

export interface IProduct {
  id: string;
  title: string;
  images: string[];
  vendor: string;
  price: number;
  minSellQuantity: number;
  categoryId: string;
  tags: ITag[];
  spaceType: string;
}
