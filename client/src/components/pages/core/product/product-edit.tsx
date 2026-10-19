'use client';

import { ArrowLeft } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';

import { Button } from '@/components/ui/shadcn/button';
import { Card } from '@/components/ui/shadcn/card';
import { Label } from '@/components/ui/shadcn/label';
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

import {
  buildProductPayload,
  getApiErrorMessage,
  ImageTile,
  ProductFormData,
  ProductFormFields,
  toggleInList,
  UploadTile,
} from './product-form-fields';

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

  const toggleSpace = (spaceTitle: string) =>
    setValue('spaces', toggleInList(selectedSpaces, spaceTitle), {
      shouldDirty: true,
    });

  const toggleTag = (tagTitle: string) =>
    setValue('tags', toggleInList(selectedTags, tagTitle), {
      shouldDirty: true,
    });

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

      const productData = buildProductPayload(data, allImages);

      await updateProduct.mutateAsync(productData);
      toast.success('Product updated successfully!');
      router.push('/professional');
    } catch (error: any) {
      console.error('Error updating product:', error);
      toast.error(getApiErrorMessage(error, 'Failed to update product'));
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
        <ProductFormFields
          register={register}
          errors={errors}
          setValue={setValue}
          categories={categories}
          categoriesLoading={categoriesLoading}
          categoryValue={product.category?.id}
          spaces={spaces}
          tags={tags}
          selectedSpaces={selectedSpaces}
          selectedTags={selectedTags}
          onToggleSpace={toggleSpace}
          onToggleTag={toggleTag}
        />

        <Card className={'p-6 rounded-[30px] border-0 shadow-md space-y-4'}>
          <div>
            <Label>Product Images * (Max 10)</Label>
            <p className={'text-sm text-muted-foreground mb-4'}>
              Manage your product images
            </p>
          </div>

          <div className={'grid grid-cols-5 gap-4'}>
            {existingImages.map((imageKey, index) => (
              <ImageTile
                key={`existing-${index}`}
                src={ROUTES.S3(imageKey)}
                alt={`Product ${index + 1}`}
                onRemove={() => removeExistingImage(index)}
                unoptimized
              />
            ))}

            {newImagePreviews.map((preview, index) => (
              <ImageTile
                key={`new-${index}`}
                src={preview}
                alt={`New ${index + 1}`}
                onRemove={() => removeNewImage(index)}
              />
            ))}

            {totalImageCount < 10 && (
              <UploadTile onChange={handleImageUpload} />
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
