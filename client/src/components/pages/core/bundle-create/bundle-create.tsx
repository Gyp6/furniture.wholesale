'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { ArrowLeft, Plus, X, Search, Package, Upload } from 'lucide-react';

import { Button } from '@/components/ui/shadcn/button';
import { Input } from '@/components/ui/shadcn/input';
import { Label } from '@/components/ui/shadcn/label';
import { Textarea } from '@/components/ui/shadcn/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/shadcn/select';
import { Card } from '@/components/ui/shadcn/card';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/shadcn/dialog';
import { Skeleton } from '@/components/ui/shadcn/skeleton';
import Image from 'next/image';

import { useGetSpaces, useGetMyProducts, useGetCategories, useGetTags, useCreateProduct } from '@/hooks/queries/catalog.query';
import { useCreateBundle } from '@/hooks/queries/bundle.query';
import { bundleService, productService } from '@/services';
import { ROUTES } from '@/constants';
import { IProduct } from '@/shared/types';

interface BundleFormData {
  name: string;
  description: string;
  spaceTypeId: string;
}

interface SelectedProduct {
  product: IProduct;
  quantity: number;
}

interface ProductFormData {
  title: string;
  price: number;
  stock: number;
  categoryId: string;
  spaces: string[];
  tags: string[];
  minSellUnits: number;
  width: number;
  height: number;
  depth: number;
}

export function BundleCreatePage() {
  const router = useRouter();
  const [selectedProducts, setSelectedProducts] = useState<SelectedProduct[]>([]);
  const [pickerOpen, setPickerOpen] = useState(false);
  const [pickerSearch, setPickerSearch] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [createProductOpen, setCreateProductOpen] = useState(false);
  const [productImages, setProductImages] = useState<File[]>([]);
  const [productImagePreviews, setProductImagePreviews] = useState<string[]>([]);
  const [isCreatingProduct, setIsCreatingProduct] = useState(false);

  const { data: spaces, isLoading: spacesLoading } = useGetSpaces();
  const { data: myProducts, isLoading: productsLoading } = useGetMyProducts();
  const { data: categories, isLoading: categoriesLoading } = useGetCategories();
  const { data: tags } = useGetTags();
  const createBundle = useCreateBundle();
  const createProduct = useCreateProduct();

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<BundleFormData>({
    defaultValues: {
      name: '',
      description: '',
      spaceTypeId: '',
    },
  });

  const productForm = useForm<ProductFormData>({
    defaultValues: {
      stock: 1,
      minSellUnits: 1,
      width: 0,
      height: 0,
      depth: 0,
      spaces: [],
      tags: [],
    },
  });

  const selectedProductSpaces = productForm.watch('spaces') || [];
  const selectedProductTags = productForm.watch('tags') || [];

  const toggleProductSpace = (spaceTitle: string) => {
    const current = selectedProductSpaces;
    const updated = current.includes(spaceTitle)
      ? current.filter(t => t !== spaceTitle)
      : [...current, spaceTitle];
    productForm.setValue('spaces', updated);
  };

  const toggleProductTag = (tagTitle: string) => {
    const current = selectedProductTags;
    const updated = current.includes(tagTitle)
      ? current.filter(t => t !== tagTitle)
      : [...current, tagTitle];
    productForm.setValue('tags', updated);
  };

  const handleProductImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (files.length === 0) return;
    if (productImages.length + files.length > 5) {
      toast.error('Maximum 5 images allowed');
      return;
    }
    setProductImages(prev => [...prev, ...files]);
    files.forEach(file => {
      const reader = new FileReader();
      reader.onloadend = () => {
        setProductImagePreviews(prev => [...prev, reader.result as string]);
      };
      reader.readAsDataURL(file);
    });
  };

  const removeProductImage = (index: number) => {
    setProductImages(prev => prev.filter((_, i) => i !== index));
    setProductImagePreviews(prev => prev.filter((_, i) => i !== index));
  };

  const onCreateProduct = async (data: ProductFormData) => {
    if (productImages.length === 0) {
      toast.error('Please upload at least one image');
      return;
    }
    if (!data.categoryId) {
      toast.error('Please select a category');
      return;
    }
    if (data.spaces.length === 0) {
      toast.error('Please select at least one space');
      return;
    }
    if (data.tags.length === 0) {
      toast.error('Please select at least one tag');
      return;
    }

    setIsCreatingProduct(true);
    try {
      const imageKeys: string[] = [];
      for (let i = 0; i < productImages.length; i++) {
        const file = productImages[i];
        const { url, key } = await productService.getUploadUrl(file.type);
        await productService.uploadToS3(url, file);
        imageKeys.push(key);
      }

      const productData = {
        title: data.title,
        price: Number(data.price),
        stock: Number(data.stock),
        categoryId: data.categoryId,
        minSellUnits: Number(data.minSellUnits),
        dimension: {
          width: Number(data.width) || 0,
          height: Number(data.height) || 0,
          depth: Number(data.depth) || 0,
        },
        spaces: data.spaces,
        tags: data.tags,
        images: imageKeys,
      };

      const product = await createProduct.mutateAsync(productData);

      addProduct(product);
      setCreateProductOpen(false);
      setProductImages([]);
      setProductImagePreviews([]);
      productForm.reset();
      toast.success('Product created and added to bundle!');
    } catch (error: any) {
      console.error('Error creating product:', error);
      toast.error(error?.response?.data?.message || 'Failed to create product');
    } finally {
      setIsCreatingProduct(false);
    }
  };

  const totalPrice = selectedProducts.reduce(
    (sum, sp) => sum + sp.product.price * sp.quantity,
    0,
  );

  const filteredProducts = (myProducts ?? []).filter(p => {
    if (!pickerSearch) return true;
    const search = pickerSearch.toLowerCase();
    return (
      p.title.toLowerCase().includes(search) ||
      p.sku.toLowerCase().includes(search)
    );
  });

  const alreadySelectedIds = new Set(selectedProducts.map(sp => sp.product.id));

  const addProduct = (product: IProduct) => {
    if (alreadySelectedIds.has(product.id)) return;
    setSelectedProducts(prev => [...prev, { product, quantity: product.minSellUnits ?? 1 }]);
  };

  const removeProduct = (productId: string) => {
    setSelectedProducts(prev => prev.filter(sp => sp.product.id !== productId));
  };

  const updateQuantity = (productId: string, quantity: number) => {
    setSelectedProducts(prev =>
      prev.map(sp =>
        sp.product.id === productId ? { ...sp, quantity: Math.max(1, quantity) } : sp,
      ),
    );
  };

  const onSubmit = async (data: BundleFormData) => {
    if (selectedProducts.length < 2) {
      toast.error('Please add at least 2 products to your bundle');
      return;
    }

    if (!data.spaceTypeId) {
      toast.error('Please select a space type');
      return;
    }

    setIsSubmitting(true);

    try {
      const bundle = await createBundle.mutateAsync({
        name: data.name,
        description: data.description || undefined,
        bundleType: 'SUPPLIER',
        spaceTypeId: data.spaceTypeId,
      });

      for (const sp of selectedProducts) {
        await bundleService.addItem(bundle.id, {
          productId: sp.product.id,
          quantity: sp.quantity,
          priceSnapshot: sp.product.price,
        });
      }

      toast.success('Bundle created successfully!');
      router.push('/professional');
    } catch (error: any) {
      console.error('Error creating bundle:', error);
      toast.error(error?.response?.data?.message || 'Failed to create bundle');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className={"w-full max-w-4xl mx-auto p-6 space-y-6"}>
      <Button
        variant={"ghost"}
        className={"mb-4"}
        onClick={() => router.push('/professional')}
      >
        <ArrowLeft className={"w-4 h-4 mr-2"} />
        Back to Dashboard
      </Button>

      <div>
        <h1 className={"text-4xl font-medium tracking-tight mb-2"}>Create Supplier Bundle</h1>
        <p className={"text-muted-foreground"}>
          Combine your products into a curated bundle for buyers
        </p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className={"space-y-6"}>
        <Card className={"p-6 rounded-[30px] border-0 shadow-md space-y-6"}>
          <div className={"space-y-4"}>
            <div>
              <Label htmlFor={"name"}>Bundle Name *</Label>
              <Input
                id={"name"}
                {...register('name', { required: 'Bundle name is required' })}
                placeholder={"Enter bundle name"}
                className={"mt-2"}
              />
              {errors.name && (
                <p className={"text-sm text-red-500 mt-1"}>{errors.name.message}</p>
              )}
            </div>

            <div>
              <Label htmlFor={"description"}>Description</Label>
              <Textarea
                id={"description"}
                {...register('description')}
                placeholder={"Describe your bundle"}
                className={"mt-2"}
                rows={3}
              />
            </div>

            <div>
              <Label>Space Type *</Label>
              <Select
                onValueChange={(value) => setValue('spaceTypeId', value)}
                disabled={spacesLoading}
              >
                <SelectTrigger className={"mt-2"}>
                  <SelectValue placeholder={"Select space type"} />
                </SelectTrigger>
                <SelectContent>
                  {spaces?.map(space => (
                    <SelectItem key={space.id} value={space.id}>
                      {space.title}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </Card>

        <Card className={"p-6 rounded-[30px] border-0 shadow-md space-y-4"}>
          <div className={"flex items-center justify-between"}>
            <div>
              <Label>Products in Bundle *</Label>
              <p className={"text-sm text-muted-foreground mt-1"}>
                Add at least 2 of your products ({selectedProducts.length} selected)
              </p>
            </div>
            <div className={"text-right"}>
              <p className={"text-xs uppercase tracking-widest text-muted-foreground font-semibold"}>
                Total Price
              </p>
              <p className={"text-xl font-bold"}>
                ${totalPrice.toLocaleString('en-US', { minimumFractionDigits: 2 })}
              </p>
            </div>
          </div>

          <div className={"grid grid-cols-2 md:grid-cols-3 gap-4"}>
            {selectedProducts.map(sp => (
              <div
                key={sp.product.id}
                className={"relative rounded-[20px] border border-neutral-100 bg-white overflow-hidden shadow-sm"}
              >
                <button
                  type={"button"}
                  onClick={() => removeProduct(sp.product.id)}
                  className={"absolute top-2 right-2 z-10 w-6 h-6 rounded-full bg-red-500 text-white flex items-center justify-center hover:bg-red-600"}
                >
                  <X className={"w-4 h-4"} />
                </button>

                <div className={"aspect-square bg-neutral-50 relative"}>
                  {sp.product.images?.[0] ? (
                    <img
                      src={ROUTES.S3(sp.product.images[0])}
                      alt={sp.product.title}
                      className={"w-full h-full object-cover"}
                    />
                  ) : (
                    <div className={"w-full h-full flex items-center justify-center"}>
                      <Package className={"w-10 h-10 text-neutral-300"} />
                    </div>
                  )}
                </div>

                <div className={"p-3 space-y-2"}>
                  <p className={"text-sm font-semibold leading-tight line-clamp-2"}>
                    {sp.product.title}
                  </p>
                  <p className={"text-xs text-muted-foreground"}>
                    ${sp.product.price.toLocaleString('en-US', { minimumFractionDigits: 2 })} / unit
                  </p>
                  <div className={"flex items-center gap-2"}>
                    <span className={"text-xs text-muted-foreground"}>Qty:</span>
                    <div className={"flex items-center gap-2 bg-secondary/10 rounded-full px-3 py-1"}>
                      <button
                        type={"button"}
                        onClick={() => updateQuantity(sp.product.id, sp.quantity - 1)}
                        className={"text-secondary font-bold text-sm hover:opacity-70 transition-opacity"}
                      >
                        −
                      </button>
                      <span className={"text-sm font-semibold w-5 text-center text-secondary"}>
                        {sp.quantity}
                      </span>
                      <button
                        type={"button"}
                        onClick={() => updateQuantity(sp.product.id, sp.quantity + 1)}
                        className={"text-secondary font-bold text-sm hover:opacity-70 transition-opacity"}
                      >
                        +
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}

            <button
              type={"button"}
              onClick={() => setPickerOpen(true)}
              className={"aspect-square rounded-[20px] border-2 border-dashed border-neutral-300 hover:border-secondary transition-colors cursor-pointer flex flex-col items-center justify-center gap-2"}
            >
              <div className={"w-10 h-10 rounded-full bg-secondary/10 flex items-center justify-center"}>
                <Plus className={"w-5 h-5 text-secondary"} />
              </div>
              <span className={"text-xs font-medium text-muted-foreground"}>
                Add Product
              </span>
            </button>
          </div>
        </Card>

        <div className={"flex items-center justify-end gap-4"}>
          <Button
            type={"button"}
            variant={"outline"}
            onClick={() => router.push('/professional')}
          >
            Cancel
          </Button>
          <Button
            type={"submit"}
            disabled={isSubmitting || selectedProducts.length < 2}
          >
            {isSubmitting ? 'Creating...' : 'Create Bundle'}
          </Button>
        </div>
      </form>

      <Dialog open={pickerOpen} onOpenChange={setPickerOpen}>
        <DialogContent className={"rounded-[30px] p-6 sm:max-w-[640px] max-h-[80vh] flex flex-col"} showCloseButton={false}>
          <DialogHeader>
            <DialogTitle className={"text-lg font-semibold"}>
              Add Products to Bundle
            </DialogTitle>
          </DialogHeader>

          <div className={"relative"}>
            <Search className={"absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground"} />
            <Input
              placeholder={"Search your products..."}
              value={pickerSearch}
              onChange={e => setPickerSearch(e.target.value)}
              className={"pl-9"}
            />
          </div>

          <div className={"flex-1 overflow-y-auto space-y-2 min-h-0 max-h-[50vh]"}>
            {productsLoading ? (
              <div className={"space-y-2"}>
                {[...Array(4)].map((_, i) => (
                  <Skeleton key={i} className={"h-16 rounded-xl"} />
                ))}
              </div>
            ) : filteredProducts.length > 0 ? (
              filteredProducts.map(product => {
                const isSelected = alreadySelectedIds.has(product.id);
                return (
                  <div
                    key={product.id}
                    className={`flex items-center gap-3 p-3 rounded-xl border transition-colors ${
                      isSelected
                        ? 'border-secondary/30 bg-secondary/5 opacity-60'
                        : 'border-neutral-100 hover:bg-neutral-50 cursor-pointer'
                    }`}
                    onClick={() => {
                      if (!isSelected) {
                        addProduct(product);
                      }
                    }}
                  >
                    <div className={"w-12 h-12 rounded-lg bg-neutral-100 overflow-hidden shrink-0"}>
                      {product.images?.[0] ? (
                        <img
                          src={ROUTES.S3(product.images[0])}
                          alt={product.title}
                          className={"w-full h-full object-cover"}
                        />
                      ) : (
                        <div className={"w-full h-full flex items-center justify-center"}>
                          <Package className={"w-5 h-5 text-neutral-300"} />
                        </div>
                      )}
                    </div>

                    <div className={"flex-1 min-w-0"}>
                      <p className={"text-sm font-medium truncate"}>{product.title}</p>
                      <p className={"text-xs text-muted-foreground"}>
                        ${product.price.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                        {product.stock !== undefined && ` · ${product.stock} in stock`}
                      </p>
                    </div>

                    {isSelected ? (
                      <span className={"text-xs font-medium text-secondary px-2 py-1 rounded-full bg-secondary/10"}>
                        Added
                      </span>
                    ) : (
                      <Button
                        type={"button"}
                        variant={"outline"}
                        size={"sm"}
                        className={"rounded-full text-xs shrink-0"}
                        onClick={e => {
                          e.stopPropagation();
                          addProduct(product);
                        }}
                      >
                        <Plus className={"w-3 h-3 mr-1"} />
                        Add
                      </Button>
                    )}
                  </div>
                );
              })
            ) : (
              <div className={"flex flex-col items-center justify-center py-12 text-muted-foreground"}>
                <Package className={"w-10 h-10 mb-2 text-neutral-300"} />
                <p className={"text-sm"}>
                  {pickerSearch ? 'No products match your search' : 'No products found'}
                </p>
                <p className={"text-xs mt-1"}>Create products first in your dashboard</p>
              </div>
            )}
          </div>

          <div className={"flex justify-between pt-2"}>
            <Button
              type={"button"}
              variant={"outline"}
              className={"rounded-full gap-1"}
              onClick={() => {
                setPickerOpen(false);
                setCreateProductOpen(true);
              }}
            >
              <Plus className={"w-4 h-4"} />
              Create New Product
            </Button>
            <Button
              variant={"default"}
              className={"rounded-full"}
              onClick={() => {
                setPickerOpen(false);
                setPickerSearch('');
              }}
            >
              Done ({selectedProducts.length} selected)
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      <Dialog open={createProductOpen} onOpenChange={setCreateProductOpen}>
        <DialogContent className={"rounded-[30px] p-6 sm:max-w-[640px] max-h-[85vh] flex flex-col"} showCloseButton={false}>
          <DialogHeader>
            <DialogTitle className={"text-lg font-semibold"}>
              Create New Product
            </DialogTitle>
          </DialogHeader>

          <form onSubmit={productForm.handleSubmit(onCreateProduct)} className={"flex-1 overflow-y-auto space-y-4 min-h-0 max-h-[60vh] pr-1"}>
            <div>
              <Label htmlFor={"product-title"}>Product Name *</Label>
              <Input
                id={"product-title"}
                {...productForm.register('title', { required: 'Product name is required' })}
                placeholder={"Enter product name"}
                className={"mt-1"}
              />
              {productForm.formState.errors.title && (
                <p className={"text-sm text-red-500 mt-1"}>{productForm.formState.errors.title.message}</p>
              )}
            </div>

            <div className={"grid grid-cols-2 gap-4"}>
              <div>
                <Label htmlFor={"product-price"}>Price ($) *</Label>
                <Input
                  id={"product-price"}
                  type={"number"}
                  step={"0.01"}
                  {...productForm.register('price', {
                    required: 'Price is required',
                    min: { value: 0, message: 'Price must be positive' },
                  })}
                  placeholder={"0.00"}
                  className={"mt-1"}
                />
                {productForm.formState.errors.price && (
                  <p className={"text-sm text-red-500 mt-1"}>{productForm.formState.errors.price.message}</p>
                )}
              </div>
              <div>
                <Label htmlFor={"product-stock"}>Stock *</Label>
                <Input
                  id={"product-stock"}
                  type={"number"}
                  {...productForm.register('stock', {
                    required: 'Stock is required',
                    min: { value: 1, message: 'Must be at least 1' },
                  })}
                  placeholder={"1"}
                  className={"mt-1"}
                />
                {productForm.formState.errors.stock && (
                  <p className={"text-sm text-red-500 mt-1"}>{productForm.formState.errors.stock.message}</p>
                )}
              </div>
            </div>

            <div className={"grid grid-cols-2 gap-4"}>
              <div>
                <Label htmlFor={"product-minSellUnits"}>Min Sell Units *</Label>
                <Input
                  id={"product-minSellUnits"}
                  type={"number"}
                  {...productForm.register('minSellUnits', {
                    required: 'Required',
                    min: { value: 1, message: 'Must be at least 1' },
                  })}
                  placeholder={"1"}
                  className={"mt-1"}
                />
              </div>
            </div>

            <div>
              <Label>Category *</Label>
              <Select
                onValueChange={(value) => productForm.setValue('categoryId', value)}
                disabled={categoriesLoading}
              >
                <SelectTrigger className={"mt-1"}>
                  <SelectValue placeholder={"Select category"} />
                </SelectTrigger>
                <SelectContent>
                  {categories?.map(category => (
                    <SelectItem key={category.id} value={category.id}>
                      {category.title}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label>Spaces *</Label>
              <div className={"grid grid-cols-3 gap-2 mt-1"}>
                {spaces?.map(space => (
                  <Button
                    key={space.id}
                    type={"button"}
                    variant={selectedProductSpaces.includes(space.title) ? 'default' : 'outline'}
                    onClick={() => toggleProductSpace(space.title)}
                    className={"justify-start text-xs h-8"}
                    size={"sm"}
                  >
                    {space.title}
                  </Button>
                ))}
              </div>
            </div>

            <div>
              <Label>Tags *</Label>
              <div className={"flex flex-wrap gap-2 mt-1"}>
                {tags?.map(tag => (
                  <Button
                    key={tag.id}
                    type={"button"}
                    variant={selectedProductTags.includes(tag.title) ? 'default' : 'outline'}
                    onClick={() => toggleProductTag(tag.title)}
                    className={"text-xs h-8"}
                    size={"sm"}
                  >
                    {tag.title}
                  </Button>
                ))}
              </div>
            </div>

            <div>
              <Label>Dimensions (cm)</Label>
              <div className={"grid grid-cols-3 gap-3 mt-1"}>
                <Input
                  type={"number"}
                  step={"0.1"}
                  {...productForm.register('width', { min: 0 })}
                  placeholder={"Width"}
                />
                <Input
                  type={"number"}
                  step={"0.1"}
                  {...productForm.register('height', { min: 0 })}
                  placeholder={"Height"}
                />
                <Input
                  type={"number"}
                  step={"0.1"}
                  {...productForm.register('depth', { min: 0 })}
                  placeholder={"Depth"}
                />
              </div>
            </div>

            <div>
              <Label>Images * (Max 5)</Label>
              <div className={"grid grid-cols-5 gap-3 mt-1"}>
                {productImagePreviews.map((preview, index) => (
                  <div key={index} className={"relative aspect-square rounded-xl overflow-hidden bg-neutral-100"}>
                    <Image
                      src={preview}
                      alt={`Product ${index + 1}`}
                      fill
                      className={"object-cover"}
                    />
                    <button
                      type={"button"}
                      onClick={() => removeProductImage(index)}
                      className={"absolute top-1 right-1 w-5 h-5 rounded-full bg-red-500 text-white flex items-center justify-center hover:bg-red-600"}
                    >
                      <X className={"w-3 h-3"} />
                    </button>
                  </div>
                ))}
                {productImages.length < 5 && (
                  <label className={"aspect-square rounded-xl border-2 border-dashed border-neutral-300 hover:border-secondary transition-colors cursor-pointer flex flex-col items-center justify-center gap-1"}>
                    <Upload className={"w-5 h-5 text-muted-foreground"} />
                    <span className={"text-[10px] text-muted-foreground"}>Upload</span>
                    <input
                      type={"file"}
                      accept={"image/*"}
                      multiple
                      onChange={handleProductImageUpload}
                      className={"hidden"}
                    />
                  </label>
                )}
              </div>
            </div>
          </form>

          <div className={"flex justify-end gap-3 pt-3 border-t"}>
            <Button
              type={"button"}
              variant={"outline"}
              className={"rounded-full"}
              onClick={() => {
                setCreateProductOpen(false);
                setProductImages([]);
                setProductImagePreviews([]);
                productForm.reset();
                setPickerOpen(true);
              }}
            >
              Back to Picker
            </Button>
            <Button
              type={"button"}
              className={"rounded-full"}
              disabled={isCreatingProduct}
              onClick={productForm.handleSubmit(onCreateProduct)}
            >
              {isCreatingProduct ? 'Creating...' : 'Create & Add to Bundle'}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
