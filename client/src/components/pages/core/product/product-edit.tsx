'use client';

import { ArrowLeft, Upload, X } from 'lucide-react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';

import { Button } from '@/components/ui/shadcn/button';
import { Card } from '@/components/ui/shadcn/card';
import { Input } from '@/components/ui/shadcn/input';
import { Label } from '@/components/ui/shadcn/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/shadcn/select';
import { Skeleton } from '@/components/ui/shadcn/skeleton';
import { ROUTES } from '@/constants';
import {
  useGetCategories,
  useGetProduct,
  useGetSpaces,
  useGetTags,
  useUpdateProduct,
} from '@/hooks/queries/catalog.query';
import { productService } from '@/services';

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

export function ProductEditPage({ productId }: { productId: string }) {
  const router = useRouter();
  const [newImages, setNewImages] = useState<File[]>([]);
  const [newImagePreviews, setNewImagePreviews] = useState<string[]>([]);
  const [existingImages, setExistingImages] = useState<string[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { data: product, isLoading: productLoading } = useGetProduct(productId);
  const { data: categories, isLoading: categoriesLoading } = useGetCategories();
  const { data: spaces } = useGetSpaces();
  const { data: tags } = useGetTags();
  const updateProduct = useUpdateProduct(productId);

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    reset,
    formState: { errors },
  } = useForm<ProductFormData>();

  const selectedSpaces = watch('spaces') || [];
  const selectedTags = watch('tags') || [];

  useEffect(() => {
    if (product) {
      reset({
        title: product.title,
        price: product.price,
        stock: product.stock,
        categoryId: product.category?.id || '',
        spaces: product.spaces?.map(s => s.title) || [],
        tags: product.tags?.map(t => t.title) || [],
        minSellUnits: product.minSellUnits ?? 1,
        width: product.dimension?.width || 0,
        height: product.dimension?.height || 0,
        depth: product.dimension?.depth || 0,
      });
      setExistingImages(product.images || []);
    }
  }, [product, reset]);

  const totalImageCount = existingImages.length + newImages.length;

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (files.length === 0) return;

    if (totalImageCount + files.length > 10) {
      toast.error('Maximum 10 images allowed');
      return;
    }

    setNewImages(prev => [...prev, ...files]);
    files.forEach(file => {
      const reader = new FileReader();
      reader.onloadend = () => {
        setNewImagePreviews(prev => [...prev, reader.result as string]);
      };
      reader.readAsDataURL(file);
    });
  };

  const removeExistingImage = (index: number) => {
    setExistingImages(prev => prev.filter((_, i) => i !== index));
  };

  const removeNewImage = (index: number) => {
    setNewImages(prev => prev.filter((_, i) => i !== index));
    setNewImagePreviews(prev => prev.filter((_, i) => i !== index));
  };

  const toggleSpace = (spaceTitle: string) => {
    const current = selectedSpaces;
    const updated = current.includes(spaceTitle)
      ? current.filter(t => t !== spaceTitle)
      : [...current, spaceTitle];
    setValue('spaces', updated, { shouldDirty: true });
  };

  const toggleTag = (tagTitle: string) => {
    const current = selectedTags;
    const updated = current.includes(tagTitle)
      ? current.filter(t => t !== tagTitle)
      : [...current, tagTitle];
    setValue('tags', updated, { shouldDirty: true });
  };

  const onSubmit = async (data: ProductFormData) => {
    if (existingImages.length + newImages.length === 0) {
      toast.error('Please have at least one image');
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

    setIsSubmitting(true);

    try {
      const uploadedKeys: string[] = [];
      for (const file of newImages) {
        const { url, key } = await productService.getUploadUrl(file.type);
        await productService.uploadToS3(url, file);
        uploadedKeys.push(key);
      }

      const allImages = [...existingImages, ...uploadedKeys];

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
        images: allImages,
      };

      await updateProduct.mutateAsync(productData);
      toast.success('Product updated successfully!');
      router.push('/professional');
    } catch (error: any) {
      console.error('Error updating product:', error);
      const errMsg = Array.isArray(error?.response?.data?.message)
        ? error.response.data.message.join(', ')
        : error?.response?.data?.message || 'Failed to update product';
      toast.error(errMsg);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (productLoading) {
    return (
      <div className={'w-full max-w-4xl mx-auto p-6 space-y-6'}>
        <Skeleton className={'h-10 w-40'} />
        <Skeleton className={'h-12 w-80'} />
        <Skeleton className={'h-96 w-full rounded-[30px]'} />
      </div>
    );
  }

  if (!product) {
    return (
      <div className={'w-full max-w-4xl mx-auto p-6 text-center py-20'}>
        <p className={'text-muted-foreground'}>Product not found</p>
        <Button
          variant={'outline'}
          className={'mt-4'}
          onClick={() => router.push('/professional')}
        >
          Back to Dashboard
        </Button>
      </div>
    );
  }

  return (
    <div className={'w-full max-w-4xl mx-auto p-6 space-y-6'}>
      <Button
        variant={'ghost'}
        className={'mb-4'}
        onClick={() => router.push('/professional')}
      >
        <ArrowLeft className={'w-4 h-4 mr-2'} />
        Back to Dashboard
      </Button>

      <div>
        <h1 className={'text-4xl font-medium tracking-tight mb-2'}>
          Edit Product
        </h1>
        <p className={'text-muted-foreground'}>Update your product details</p>
      </div>

      <form
        onSubmit={handleSubmit(onSubmit)}
        className={'space-y-6'}
      >
        <Card className={'p-6 rounded-[30px] border-0 shadow-md space-y-6'}>
          <div className={'space-y-4'}>
            <div>
              <Label htmlFor={'title'}>Product Name *</Label>
              <Input
                id={'title'}
                {...register('title', { required: 'Product name is required' })}
                placeholder={'Enter product name'}
                className={'mt-2'}
              />
              {errors.title && (
                <p className={'text-sm text-red-500 mt-1'}>
                  {errors.title.message}
                </p>
              )}
            </div>

            <div className={'grid grid-cols-2 gap-4'}>
              <div>
                <Label htmlFor={'price'}>Price ($) *</Label>
                <Input
                  id={'price'}
                  type={'number'}
                  step={'0.01'}
                  {...register('price', {
                    required: 'Price is required',
                    min: { value: 0, message: 'Price must be positive' },
                  })}
                  placeholder={'0.00'}
                  className={'mt-2'}
                />
                {errors.price && (
                  <p className={'text-sm text-red-500 mt-1'}>
                    {errors.price.message}
                  </p>
                )}
              </div>

              <div>
                <Label htmlFor={'stock'}>Stock *</Label>
                <Input
                  id={'stock'}
                  type={'number'}
                  {...register('stock', {
                    required: 'Stock is required',
                    min: { value: 1, message: 'Must be at least 1' },
                  })}
                  placeholder={'1'}
                  className={'mt-2'}
                />
                {errors.stock && (
                  <p className={'text-sm text-red-500 mt-1'}>
                    {errors.stock.message}
                  </p>
                )}
              </div>
            </div>

            <div>
              <Label htmlFor={'minSellUnits'}>Minimum Sell Units *</Label>
              <Input
                id={'minSellUnits'}
                type={'number'}
                {...register('minSellUnits', {
                  required: 'Min sell units is required',
                  min: { value: 1, message: 'Must be at least 1' },
                })}
                placeholder={'1'}
                className={'mt-2'}
              />
              {errors.minSellUnits && (
                <p className={'text-sm text-red-500 mt-1'}>
                  {errors.minSellUnits.message}
                </p>
              )}
            </div>

            <div>
              <Label htmlFor={'categoryId'}>Category *</Label>
              <Select
                value={product.category?.id}
                onValueChange={value =>
                  setValue('categoryId', value, { shouldDirty: true })
                }
                disabled={categoriesLoading}
              >
                <SelectTrigger className={'mt-2'}>
                  <SelectValue placeholder={'Select category'} />
                </SelectTrigger>
                <SelectContent>
                  {categories?.map(category => (
                    <SelectItem
                      key={category.id}
                      value={category.id}
                    >
                      {category.title}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label>Spaces *</Label>
              <div className={'grid grid-cols-3 gap-2 mt-2'}>
                {spaces?.map(space => (
                  <Button
                    key={space.id}
                    type={'button'}
                    variant={
                      selectedSpaces.includes(space.title)
                        ? 'default'
                        : 'outline'
                    }
                    onClick={() => toggleSpace(space.title)}
                    className={'justify-start'}
                  >
                    {space.title}
                  </Button>
                ))}
              </div>
            </div>

            <div>
              <Label>Tags *</Label>
              <div className={'flex flex-wrap gap-2 mt-2'}>
                {tags?.map(tag => (
                  <Button
                    key={tag.id}
                    type={'button'}
                    variant={
                      selectedTags.includes(tag.title) ? 'default' : 'outline'
                    }
                    onClick={() => toggleTag(tag.title)}
                    className={'justify-start'}
                  >
                    {tag.title}
                  </Button>
                ))}
              </div>
            </div>

            <div>
              <Label>Dimensions (cm)</Label>
              <div className={'grid grid-cols-3 gap-4 mt-2'}>
                <Input
                  type={'number'}
                  step={'0.1'}
                  {...register('width', { min: 0 })}
                  placeholder={'Width'}
                />
                <Input
                  type={'number'}
                  step={'0.1'}
                  {...register('height', { min: 0 })}
                  placeholder={'Height'}
                />
                <Input
                  type={'number'}
                  step={'0.1'}
                  {...register('depth', { min: 0 })}
                  placeholder={'Depth'}
                />
              </div>
            </div>
          </div>
        </Card>

        <Card className={'p-6 rounded-[30px] border-0 shadow-md space-y-4'}>
          <div>
            <Label>Product Images * (Max 10)</Label>
            <p className={'text-sm text-muted-foreground mb-4'}>
              Manage your product images
            </p>
          </div>

          <div className={'grid grid-cols-5 gap-4'}>
            {existingImages.map((imageKey, index) => (
              <div
                key={`existing-${index}`}
                className={
                  'relative aspect-square rounded-[20px] overflow-hidden bg-neutral-100'
                }
              >
                <Image
                  src={ROUTES.S3(imageKey)}
                  alt={`Product ${index + 1}`}
                  className={'w-full h-full object-cover'}
                  unoptimized
                  fill
                />
                <button
                  type={'button'}
                  onClick={() => removeExistingImage(index)}
                  className={
                    'absolute top-2 right-2 w-6 h-6 rounded-full bg-red-500 text-white flex items-center justify-center hover:bg-red-600'
                  }
                >
                  <X className={'w-4 h-4'} />
                </button>
              </div>
            ))}

            {newImagePreviews.map((preview, index) => (
              <div
                key={`new-${index}`}
                className={
                  'relative aspect-square rounded-[20px] overflow-hidden bg-neutral-100'
                }
              >
                <Image
                  src={preview}
                  alt={`New ${index + 1}`}
                  fill
                  className={'object-cover'}
                />
                <button
                  type={'button'}
                  onClick={() => removeNewImage(index)}
                  className={
                    'absolute top-2 right-2 w-6 h-6 rounded-full bg-red-500 text-white flex items-center justify-center hover:bg-red-600'
                  }
                >
                  <X className={'w-4 h-4'} />
                </button>
              </div>
            ))}

            {totalImageCount < 10 && (
              <label
                className={
                  'aspect-square rounded-[20px] border-2 border-dashed border-neutral-300 hover:border-secondary transition-colors cursor-pointer flex flex-col items-center justify-center gap-2'
                }
              >
                <Upload className={'w-6 h-6 text-muted-foreground'} />
                <span className={'text-xs text-muted-foreground'}>Upload</span>
                <input
                  type={'file'}
                  accept={'image/*'}
                  multiple
                  onChange={handleImageUpload}
                  className={'hidden'}
                />
              </label>
            )}
          </div>
        </Card>

        <div className={'flex items-center justify-end gap-4'}>
          <Button
            type={'button'}
            variant={'outline'}
            onClick={() => router.push('/professional')}
          >
            Cancel
          </Button>
          <Button
            type={'submit'}
            disabled={isSubmitting}
          >
            {isSubmitting ? 'Saving...' : 'Save Changes'}
          </Button>
        </div>
      </form>
    </div>
  );
}
