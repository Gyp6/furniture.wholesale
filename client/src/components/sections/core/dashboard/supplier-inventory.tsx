'use client';

import { useRouter } from 'next/navigation';

import { Button } from '@/components/ui/shadcn/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/shadcn/select';
import { Skeleton } from '@/components/ui/shadcn/skeleton';
import { CATEGORY_STYLES } from '@/constants/dashboard.const';
import { ICONS } from '@/shared/data/icons';
import { IBundle, IProduct } from '@/shared/types';

const INVENTORY_GRID = 'grid grid-cols-[2fr_1fr_0.8fr_0.8fr_0.6fr]';
const INVENTORY_COLUMNS = [
  'PRODUCT NAME',
  'CATEGORY',
  'STOCK LEVEL',
  'STATUS',
  'ACTION',
];

const STATUS_DOT: Record<string, string> = {
  ACTIVE: 'bg-green-500',
  DRAFT: 'bg-yellow-500',
};

type TStatusChange = (id: string, status: string) => void;

function StatusSelect({
  value,
  onChange,
}: {
  value?: string;
  onChange: (value: string) => void;
}) {
  return (
    <Select
      value={value}
      onValueChange={onChange}
    >
      <SelectTrigger
        className={'h-7 w-[110px] text-xs border-0 bg-transparent px-1 gap-1'}
      >
        <div className={'flex items-center gap-1'}>
          <div
            className={`w-1.5 h-1.5 rounded-full ${STATUS_DOT[value ?? ''] ?? 'bg-neutral-300'}`}
          />
          <SelectValue />
        </div>
      </SelectTrigger>
      <SelectContent>
        <SelectItem value={'ACTIVE'}>Active</SelectItem>
        <SelectItem value={'INACTIVE'}>Inactive</SelectItem>
        <SelectItem value={'DRAFT'}>Draft</SelectItem>
      </SelectContent>
    </Select>
  );
}

function RowActions({
  onEdit,
  onDelete,
}: {
  onEdit: () => void;
  onDelete?: () => void;
}) {
  return (
    <div className={'flex items-center gap-2'}>
      <button
        className={
          'w-8 h-8 rounded-full bg-secondary/10 flex items-center justify-center hover:bg-secondary/20 transition-colors'
        }
        onClick={e => {
          e.stopPropagation();
          onEdit();
        }}
      >
        <ICONS.PenFigma
          size={14}
          color={'currentColor'}
          className={'text-secondary'}
        />
      </button>
      <button
        className={
          'w-8 h-8 rounded-full bg-red-100 flex items-center justify-center hover:bg-red-200 transition-colors'
        }
        onClick={e => {
          e.stopPropagation();
          onDelete?.();
        }}
      >
        <ICONS.TrashFigma
          size={14}
          color={'currentColor'}
          className={'text-red-500'}
        />
      </button>
    </div>
  );
}

type TInventoryRowProps = {
  title: string;
  category: string;
  stockLabel: string;
  status?: string;
  onStatusChange: (status: string) => void;
  onEdit: () => void;
  clickable?: boolean;
};

function InventoryRow({
  title,
  category,
  stockLabel,
  status,
  onStatusChange,
  onEdit,
  clickable,
}: TInventoryRowProps) {
  return (
    <div
      className={`${INVENTORY_GRID} items-center px-5 py-3 border-b border-neutral-50 last:border-0 hover:bg-neutral-50 transition-colors${clickable ? ' cursor-pointer' : ''}`}
      onClick={clickable ? onEdit : undefined}
    >
      <div className={'flex items-center gap-2'}>
        <span
          className={
            'text-sm font-medium text-muted-foreground leading-tight line-clamp-1'
          }
        >
          {title}
        </span>
      </div>

      <span
        className={`inline-flex w-fit px-2 py-0.5 rounded-full text-[12px] font-semibold ${CATEGORY_STYLES[category] ?? 'bg-neutral-100 text-neutral-600'}`}
      >
        {category}
      </span>

      <span className={'text-sm text-muted-foreground'}>{stockLabel}</span>

      <div
        className={'flex items-center'}
        onClick={e => e.stopPropagation()}
      >
        <StatusSelect
          value={status}
          onChange={onStatusChange}
        />
      </div>

      <RowActions onEdit={onEdit} />
    </div>
  );
}

function EmptyInventory({ text }: { text: string }) {
  return (
    <div
      className={
        'flex items-center justify-center h-full py-8 text-muted-foreground text-sm'
      }
    >
      {text}
    </div>
  );
}

type TInventoryListProps = {
  showProducts: boolean;
  loading: boolean;
  products?: IProduct[];
  bundles?: IBundle[];
  onProductStatusChange: TStatusChange;
  onBundleStatusChange: TStatusChange;
};

function InventoryList({
  showProducts,
  loading,
  products,
  bundles,
  onProductStatusChange,
  onBundleStatusChange,
}: TInventoryListProps) {
  const router = useRouter();

  if (loading) {
    return (
      <div className={'flex flex-col gap-2 p-4'}>
        {[...Array(3)].map((_, i) => (
          <Skeleton
            key={i}
            className={'h-10 rounded-xl'}
          />
        ))}
      </div>
    );
  }

  if (showProducts) {
    if (!products?.length)
      return <EmptyInventory text={'No products in inventory.'} />;
    return (
      <>
        {products.map((product, i) => (
          <InventoryRow
            key={product.id || i}
            title={product.title}
            category={product.category?.title || 'Uncategorized'}
            stockLabel={`${product.stock} units`}
            status={product.status}
            onStatusChange={value => onProductStatusChange(product.id, value)}
            onEdit={() => router.push(`/product/${product.id}/edit`)}
            clickable
          />
        ))}
      </>
    );
  }

  if (!bundles?.length)
    return <EmptyInventory text={'No bundles in inventory.'} />;
  return (
    <>
      {bundles.map((bundle, i) => (
        <InventoryRow
          key={bundle.id || i}
          title={bundle.name}
          category={bundle.space?.title || 'Hotel Room'}
          stockLabel={`${bundle.items?.length || 0} units`}
          status={bundle.status}
          onStatusChange={value => onBundleStatusChange(bundle.id, value)}
          onEdit={() => router.push(`/bundle-edit/${bundle.id}`)}
        />
      ))}
    </>
  );
}

type TSupplierInventoryProps = Omit<
  TInventoryListProps,
  'showProducts' | 'loading'
> & {
  showProducts: boolean;
  onToggle: () => void;
  productsLoading: boolean;
  bundlesLoading: boolean;
};

/** Bundles / items inventory card with a switch between both lists. */
export function SupplierInventory({
  showProducts,
  onToggle,
  productsLoading,
  bundlesLoading,
  ...listProps
}: TSupplierInventoryProps) {
  return (
    <div
      className={
        'rounded-2xl bg-white overflow-hidden flex flex-col shadow-[0_8px_40px_rgba(0,0,0,0.08)]'
      }
      style={{ height: '300px' }}
    >
      <div className={'flex items-center justify-between px-5 py-4 shrink-0'}>
        <h2 className={'text-xl font-semibold'}>
          {showProducts ? 'Items Inventory' : 'Bundles Inventory'}
        </h2>
        <Button
          variant={'secondary'}
          className={
            'rounded-full bg-secondary/10 text-secondary hover:bg-secondary/20 border-0'
          }
          style={{ width: '178px', height: '48px' }}
          onClick={onToggle}
        >
          {showProducts ? 'Bundles Inventory' : 'Items Inventory'}
        </Button>
      </div>

      <div
        className={`${INVENTORY_GRID} px-5 py-3 border-y border-neutral-50 shrink-0`}
      >
        {INVENTORY_COLUMNS.map(col => (
          <span
            key={col}
            className={
              'text-[12px] font-bold uppercase tracking-widest text-muted-foreground'
            }
          >
            {col}
          </span>
        ))}
      </div>

      <div className={'overflow-y-auto scrollbar-hide flex-1'}>
        <InventoryList
          showProducts={showProducts}
          loading={showProducts ? productsLoading : bundlesLoading}
          {...listProps}
        />
      </div>
    </div>
  );
}
