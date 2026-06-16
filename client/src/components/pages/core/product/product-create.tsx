'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { Upload, X, ArrowLeft } from 'lucide-react';
import Image from 'next/image';

import { Button } from '@/components/ui/shadcn/button';
import { Input } from '@/components/ui/shadcn/input';
import { Label } from '@/components/ui/shadcn/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/shadcn/select';
import { Card } from '@/components/ui/shadcn/card';
import { useGetCategories, useGetSpaces, useGetTags, useCreateProduct } from '@/hooks/queries/catalog.query';
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

export function ProductCreatePage() {
  const router = useRouter();
  const [images, setImages] = useState<File[]>([]);
  const [imagesPreviews, setImagesPreviews] = useState<string[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { data: categories, isLoading: categoriesLoading } = useGetCategories();
  const { data: spaces, isLoading: spacesLoading } = useGetSpaces();
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

      await createProduct.mutateAsync(productData);

      toast.success('Product created successfully!');
      router.push('/professional');
    } catch (error: any) {
      console.error('Error creating product:', error);
      const errMsg = Array.isArray(error?.response?.data?.message)
        ? error.response.data.message.join(', ')
        : error?.response?.data?.message || 'Failed to create product';
      toast.error(errMsg);
    } finally {
      setIsSubmitting(false);
    }
  };

  const toggleSpace = (spaceTitle: string) => {
    const current = selectedSpaces;
    const newSpaces = current.includes(spaceTitle)
      ? current.filter(t => t !== spaceTitle)
      : [...current, spaceTitle];
    setValue('spaces', newSpaces);
  };

  const toggleTag = (tagTitle: string) => {
    const current = selectedTags;
    const newTags = current.includes(tagTitle)
      ? current.filter(t => t !== tagTitle)
      : [...current, tagTitle];
    setValue('tags', newTags);
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
        <h1 className={"text-4xl font-medium tracking-tight mb-2"}>Create New Product</h1>
        <p className={"text-muted-foreground"}>Add a new product to your inventory</p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className={"space-y-6"}>
        <Card className={"p-6 rounded-[30px] border-0 shadow-md space-y-6"}>
          <div className={"space-y-4"}>
            <div>
              <Label htmlFor={"title"}>Product Name *</Label>
              <Input
                id={"title"}
                {...register('title', { required: 'Product name is required' })}
                placeholder={"Enter product name"}
                className={"mt-2"}
              />
              {errors.title && (
                <p className={"text-sm text-red-500 mt-1"}>{errors.title.message}</p>
              )}
            </div>

            <div className={"grid grid-cols-2 gap-4"}>
              <div>
                <Label htmlFor={"price"}>Price ($) *</Label>
                <Input
                  id={"price"}
                  type={"number"}
                  step={"0.01"}
                  {...register('price', {
                    required: 'Price is required',
                    min: { value: 0, message: 'Price must be positive' }
                  })}
                  placeholder={"0.00"}
                  className={"mt-2"}
                />
                {errors.price && (
                  <p className={"text-sm text-red-500 mt-1"}>{errors.price.message}</p>
                )}
              </div>

              <div>
                <Label htmlFor={"stock"}>Stock *</Label>
                <Input
                  id={"stock"}
                  type={"number"}
                  {...register('stock', {
                    required: 'Stock is required',
                    min: { value: 1, message: 'Must be at least 1' }
                  })}
                  placeholder={"1"}
                  className={"mt-2"}
                />
                {errors.stock && (
                  <p className={"text-sm text-red-500 mt-1"}>{errors.stock.message}</p>
                )}
              </div>
            </div>

            <div>
              <Label htmlFor={"minSellUnits"}>Minimum Sell Units *</Label>
              <Input
                id={"minSellUnits"}
                type={"number"}
                {...register('minSellUnits', {
                  required: 'Min sell units is required',
                  min: { value: 1, message: 'Must be at least 1' }
                })}
                placeholder={"1"}
                className={"mt-2"}
              />
              {errors.minSellUnits && (
                <p className={"text-sm text-red-500 mt-1"}>{errors.minSellUnits.message}</p>
              )}
            </div>

            <div>
              <Label htmlFor={"categoryId"}>Category *</Label>
              <Select
                onValueChange={(value) => setValue('categoryId', value)}
                disabled={categoriesLoading}
              >
                <SelectTrigger className={"mt-2"}>
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
              {errors.categoryId && (
                <p className={"text-sm text-red-500 mt-1"}>{errors.categoryId.message}</p>
              )}
            </div>

            <div>
              <Label>Spaces *</Label>
              <div className={"grid grid-cols-3 gap-2 mt-2"}>
                {spaces?.map(space => (
                  <Button
                    key={space.id}
                    type={"button"}
                    variant={selectedSpaces.includes(space.title) ? 'default' : 'outline'}
                    onClick={() => toggleSpace(space.title)}
                    className={"justify-start"}
                  >
                    {space.title}
                  </Button>
                ))}
              </div>
            </div>

            <div>
              <Label>Tags *</Label>
              <div className={"flex flex-wrap gap-2 mt-2"}>
                {tags?.map(tag => (
                  <Button
                    key={tag.id}
                    type={"button"}
                    variant={selectedTags.includes(tag.title) ? 'default' : 'outline'}
                    onClick={() => toggleTag(tag.title)}
                    className={"justify-start"}
                  >
                    {tag.title}
                  </Button>
                ))}
              </div>
            </div>

            <div>
              <Label>Dimensions (cm)</Label>
              <div className={"grid grid-cols-3 gap-4 mt-2"}>
                <div>
                  <Input
                    type={"number"}
                    step={"0.1"}
                    {...register('width', { min: 0 })}
                    placeholder={"Width"}
                  />
                </div>
                <div>
                  <Input
                    type={"number"}
                    step={"0.1"}
                    {...register('height', { min: 0 })}
                    placeholder={"Height"}
                  />
                </div>
                <div>
                  <Input
                    type={"number"}
                    step={"0.1"}
                    {...register('depth', { min: 0 })}
                    placeholder={"Depth"}
                  />
                </div>
              </div>
            </div>
          </div>
        </Card>

        <Card className={"p-6 rounded-[30px] border-0 shadow-md space-y-4"}>
          <div>
            <Label>Product Images * (Max 5)</Label>
            <p className={"text-sm text-muted-foreground mb-4"}>Upload high-quality images of your product</p>
          </div>

          <div className={"grid grid-cols-5 gap-4"}>
            {imagesPreviews.map((preview, index) => (
              <div key={index} className={"relative aspect-square rounded-[20px] overflow-hidden bg-neutral-100"}>
                <Image
                  src={preview}
                  alt={`Product ${index + 1}`}
                  fill
                  className={"object-cover"}
                />
                <button
                  type={"button"}
                  onClick={() => removeImage(index)}
                  className={"absolute top-2 right-2 w-6 h-6 rounded-full bg-red-500 text-white flex items-center justify-center hover:bg-red-600"}
                >
                  <X className={"w-4 h-4"} />
                </button>
              </div>
            ))}

            {images.length < 5 && (
              <label className={"aspect-square rounded-[20px] border-2 border-dashed border-neutral-300 hover:border-secondary transition-colors cursor-pointer flex flex-col items-center justify-center gap-2"}>
                <Upload className={"w-6 h-6 text-muted-foreground"} />
                <span className={"text-xs text-muted-foreground"}>Upload</span>
                <input
                  type={"file"}
                  accept={"image/*"}
                  multiple
                  onChange={handleImageUpload}
                  className={"hidden"}
                />
              </label>
            )}
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
            disabled={isSubmitting}
          >
            {isSubmitting ? 'Creating...' : 'Create Product'}
          </Button>
        </div>
      </form>
    </div>
  );
}
