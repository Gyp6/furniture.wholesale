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

export const productService = {
  async getAll(params: IProductParams = {}): Promise<IProductResponse> {
    const { data } = await api.get(ROUTES.API.CATALOG.PRODUCT.GET_ALL);

    // API structure might be { data: { items: [], total: ... } } or just { items: [] }
    let products: IProduct[] = (
      Array.isArray(data) ? data : data.items || data.data || data
    ) as IProduct[];

    if (params.search) {
      const search = params.search.toLowerCase();
      products = products.filter(
        p =>
          p.title.toLowerCase().includes(search) ||
          (p.manufacturer?.name?.toLowerCase?.() || '').includes(search),
      );
    }

    // Category filter
    if (params.categories && params.categories.length > 0) {
      products = products.filter(p =>
        p.category?.slug ? params.categories?.includes(p.category.slug) : false,
      );
    }

    // Space filter
    if (params.spaces && params.spaces.length > 0) {
      products = products.filter(p =>
        p.spaces?.some(s => s.slug && params.spaces?.includes(s.slug)),
      );
    }

    // Tag (Style) filter
    if (params.tags && params.tags.length > 0) {
      products = products.filter(p =>
        p.tags?.some(t => t.slug && params.tags?.includes(t.slug)),
      );
    }

    // Price filter
    if (params.minPrice !== undefined) {
      products = products.filter(p => p.price === undefined || Number(p.price) >= params.minPrice!);
    }
    if (params.maxPrice !== undefined) {
      products = products.filter(p => p.price === undefined || Number(p.price) <= params.maxPrice!);
    }

    // Sort
    if (params.sort) {
      switch (params.sort) {
        case 'Price: Low to High':
          products.sort((a, b) => Number(a.price) - Number(b.price));
          break;
        case 'Price: High to Low':
          products.sort((a, b) => Number(b.price) - Number(a.price));
          break;
        case 'Newest Arrivals':
          products.reverse();
          break;
      }
    }

    // Pagination
    const page = params.page || 1;
    const limit = params.limit || 20;
    const total = products.length;
    const totalPages = Math.ceil(total / limit);
    const startIndex = (page - 1) * limit;
    const items = products.slice(startIndex, startIndex + limit);

    return {
      items,
      total,
      page,
      totalPages,
    };
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

  async getUploadUrl(mimeType: string): Promise<{ url: string; key: string }> {
    const { data } = await api.post('/products/upload-url', { mimeType });
    return data;
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
