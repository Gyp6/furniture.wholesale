import { ROUTES } from '@/constants';
import { api } from '@/lib';
import { IFilter, IProduct } from '@/shared/types';

export interface IProductParams {
  search?: string;
  categories?: string[];
  spaces?: string[];
  tags?: string[];
  minPrice?: number;
  maxPrice?: number;
  sort?: string;
  page?: number;
  limit?: number;
}

export interface IProductResponse {
  items: IProduct[];
  total: number;
  page: number;
  totalPages: number;
}

export const categoryService = {
  async getAll(): Promise<IFilter[]> {
    const { data } = await api.get(ROUTES.API.CATALOG.CATEGORY.GET_ALL);
    return data;
  },
};

export const productTagService = {
  async getAll(): Promise<IFilter[]> {
    const { data } = await api.get(ROUTES.API.CATALOG.TAGS.GET_ALL);
    return data;
  },
};

type TProductPredicate = (product: IProduct) => boolean;

const hasAny = (values?: string[]): values is string[] =>
  Array.isArray(values) && values.length > 0;

const matchesSearch =
  (search: string): TProductPredicate =>
  product => {
    const query = search.toLowerCase();
    const manufacturer = product.manufacturer?.name?.toLowerCase?.() ?? '';
    return (
      product.title.toLowerCase().includes(query) ||
      manufacturer.includes(query)
    );
  };

const inSlugs = (slugs: string[], slug?: string) =>
  Boolean(slug) && slugs.includes(slug as string);

/** Builds the list of active filters from the query params (Strategy pattern). */
function buildProductFilters(params: IProductParams): TProductPredicate[] {
  const { search, categories, spaces, tags, minPrice, maxPrice } = params;
  const filters: TProductPredicate[] = [];

  if (search) filters.push(matchesSearch(search));
  if (hasAny(categories)) {
    filters.push(p => inSlugs(categories, p.category?.slug));
  }
  if (hasAny(spaces)) {
    filters.push(p => p.spaces?.some(s => inSlugs(spaces, s.slug)) ?? false);
  }
  if (hasAny(tags)) {
    filters.push(p => p.tags?.some(t => inSlugs(tags, t.slug)) ?? false);
  }
  if (minPrice !== undefined) {
    filters.push(p => p.price === undefined || Number(p.price) >= minPrice);
  }
  if (maxPrice !== undefined) {
    filters.push(p => p.price === undefined || Number(p.price) <= maxPrice);
  }
  return filters;
}

const SORTERS: Record<string, (items: IProduct[]) => IProduct[]> = {
  'Price: Low to High': items =>
    [...items].sort((a, b) => Number(a.price) - Number(b.price)),
  'Price: High to Low': items =>
    [...items].sort((a, b) => Number(b.price) - Number(a.price)),
  'Newest Arrivals': items => [...items].reverse(),
};

function sortProducts(products: IProduct[], sort?: string): IProduct[] {
  const sorter = sort ? SORTERS[sort] : undefined;
  return sorter ? sorter(products) : products;
}

function paginate(
  products: IProduct[],
  page = 1,
  limit = 20,
): IProductResponse {
  const total = products.length;
  const startIndex = (page - 1) * limit;
  return {
    items: products.slice(startIndex, startIndex + limit),
    total,
    page,
    totalPages: Math.ceil(total / limit),
  };
}

/** API structure might be { data: { items: [], total } }, { items: [] } or a bare array. */
function extractProducts(data: unknown): IProduct[] {
  if (Array.isArray(data)) return data as IProduct[];
  const body = data as { items?: IProduct[]; data?: IProduct[] };
  return body.items || body.data || (data as IProduct[]);
}

export const productService = {
  async getAll(params: IProductParams = {}): Promise<IProductResponse> {
    const { data } = await api.get(ROUTES.API.CATALOG.PRODUCT.GET_ALL);

    const filters = buildProductFilters(params);
    const filtered = extractProducts(data).filter(product =>
      filters.every(matches => matches(product)),
    );

    return paginate(
      sortProducts(filtered, params.sort),
      params.page || 1,
      params.limit || 20,
    );
  },

  async getOne(id: string): Promise<IProduct> {
    const { data } = await api.get(ROUTES.API.CATALOG.PRODUCT.GET_ONE(id));
    return data;
  },

  async getMyProducts(): Promise<IProduct[]> {
    const { data } = await api.get('/products/my');
    return data;
  },

  async create(dto: any): Promise<IProduct> {
    const { data } = await api.post('/products', dto);
    return data;
  },

  async update(id: string, dto: any): Promise<IProduct> {
    const { data } = await api.patch(`/products/${id}`, dto);
    return data;
  },

  async updateStatus(id: string, status: string): Promise<IProduct> {
    const { data } = await api.patch(`/products/${id}/status`, { status });
    return data;
  },

  async getUploadUrl(mimeType: string): Promise<{ url: string; key: string }> {
    const { data } = await api.post('/products/upload-url', { mimeType });
    return { url: data.uploadUrl, key: data.key };
  },

  async uploadToS3(url: string, file: File): Promise<void> {
    await fetch(url, {
      method: 'PUT',
      body: file,
      headers: {
        'Content-Type': file.type,
      },
    });
  },
};

export interface ISpace {
  id: string;
  title: string;
  slug: string;
}

export const spaceService = {
  async getAll(): Promise<ISpace[]> {
    const { data } = await api.get('/spaces');
    return Array.isArray(data) ? data : data.items || [];
  },
};
