'use client';

import { ArrowLeft } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';

import { Button } from '@/components/ui/shadcn/button';
import { Card } from '@/components/ui/shadcn/card';
import { Label } from '@/components/ui/shadcn/label';
import {
  useCreateProduct,
  useGetCategories,
  useGetSpaces,
  useGetTags,
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

export function ProductCreatePage() {
  const router = useRouter();
  const [images, setImages] = useState<File[]>([]);
  const [imagesPreviews, setImagesPreviews] = useState<string[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { data: categories, isLoading: categoriesLoading } = useGetCategories();
  const { data: spaces } = useGetSpaces();
  const { data: tags } = useGetTags();
  const createProduct = useCreateProduct();

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<ProductFormData>({
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

  const selectedSpaces = watch('spaces') || [];
  const selectedTags = watch('tags') || [];

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (files.length === 0) return;

    if (images.length + files.length > 5) {
      toast.error('Maximum 5 images allowed');
      return;
    }

    setImages(prev => [...prev, ...files]);

    // Create previews
    files.forEach(file => {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagesPreviews(prev => [...prev, reader.result as string]);
      };
      reader.readAsDataURL(file);
    });
  };

  const removeImage = (index: number) => {
    setImages(prev => prev.filter((_, i) => i !== index));
    setImagesPreviews(prev => prev.filter((_, i) => i !== index));
  };

  const onSubmit = async (data: ProductFormData) => {
    if (images.length === 0) {
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

    setIsSubmitting(true);

    try {
      const imageKeys: string[] = [];
      for (let i = 0; i < images.length; i++) {
        const file = images[i];
        const { url, key } = await productService.getUploadUrl(file.type);
        await productService.uploadToS3(url, file);
        imageKeys.push(key);
      }

      const productData = buildProductPayload(data, imageKeys);

      await createProduct.mutateAsync(productData);

      toast.success('Product created successfully!');
      router.push('/professional');
    } catch (error: any) {
      console.error('Error creating product:', error);
      toast.error(getApiErrorMessage(error, 'Failed to create product'));
    } finally {
      setIsSubmitting(false);
    }
  };

  const toggleSpace = (spaceTitle: string) =>
    setValue('spaces', toggleInList(selectedSpaces, spaceTitle));

  const toggleTag = (tagTitle: string) =>
    setValue('tags', toggleInList(selectedTags, tagTitle));

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
          Create New Product
        </h1>
        <p className={'text-muted-foreground'}>
          Add a new product to your inventory
        </p>
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
          spaces={spaces}
          tags={tags}
          selectedSpaces={selectedSpaces}
          selectedTags={selectedTags}
          onToggleSpace={toggleSpace}
          onToggleTag={toggleTag}
        />

        <Card className={'p-6 rounded-[30px] border-0 shadow-md space-y-4'}>
          <div>
            <Label>Product Images * (Max 5)</Label>
            <p className={'text-sm text-muted-foreground mb-4'}>
              Upload high-quality images of your product
            </p>
          </div>

          <div className={'grid grid-cols-5 gap-4'}>
            {imagesPreviews.map((preview, index) => (
              <ImageTile
                key={index}
                src={preview}
                alt={`Product ${index + 1}`}
                onRemove={() => removeImage(index)}
              />
            ))}

            {images.length < 5 && <UploadTile onChange={handleImageUpload} />}
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
            {isSubmitting ? 'Creating...' : 'Create Product'}
          </Button>
        </div>
      </form>
    </div>
  );
}
