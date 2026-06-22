'use client';

import { OrderCard } from '@/components/ui/order-card';
import { BundlesTitleSection } from '@/components/ui/title';
import { useSpaceBundleStore } from '@/store/use-space-bundle.store';

import { SupplierBundleItem } from './supplier-bundle-item';

export function OrderGrid() {
  const store = useSpaceBundleStore(state => state);

  if (!store?.items || store.items.length === 0) {
    return (
      <div
        className={
          'text-center py-20 bg-white rounded-[40px] border border-dashed border-neutral-200'
        }
      >
        <p className={'text-muted-foreground'}>Your Space Bundle is empty.</p>
      </div>
    );
  }

  const { items = [], removeItem, updateQuantity } = store;

  const productItems = items.filter(i => !!i.product);
  const bundleItems = items.filter(i => !!i.nestedBundle);

  // Group products by manufacturer
  const productsByManufacturer = productItems.reduce(
    (acc, item) => {
      const manufacturerName =
        item.product!.manufacturer?.name || 'Unknown Brand';
      if (!acc[manufacturerName]) {
        acc[manufacturerName] = [];
      }
      acc[manufacturerName].push(item);
      return acc;
    },
    {} as Record<string, typeof productItems>,
  );

  return (
    <div className={'flex flex-col gap-12'}>
      {/* Products grouped by manufacturer */}
      {Object.entries(productsByManufacturer).map(
        ([manufacturer, manufacturerItems]) => (
          <div
            key={manufacturer}
            className={'flex flex-col gap-6'}
          >
            <BundlesTitleSection title={manufacturer} />
            <div
              className={
                'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-5'
              }
            >
              {manufacturerItems.map(item => (
                <OrderCard
                  key={item.productId}
                  name={item.product!.title}
                  vendor={item.product!.manufacturer?.name || 'Unknown'}
                  category={item.product!.spaces?.[0]?.title || 'Furniture'}
                  minPieces={item.product!.minSellUnits || 1}
                  pricePerUnit={item.priceSnapshot}
                  quantity={item.quantity}
                  image={item.product!.images[0]}
                  onDelete={() => removeItem(item.productId!)}
                  onUpdateQuantity={q => updateQuantity(item.productId!, q)}
                />
              ))}
            </div>
          </div>
        ),
      )}

      {/* Supplier Bundles */}
      {bundleItems.length > 0 && (
        <div className={'flex flex-col gap-6'}>
          <BundlesTitleSection title={'Prebuilt Bundles'} />
          <div className={'flex flex-col gap-8'}>
            {bundleItems.map(item => (
              <SupplierBundleItem
                key={item.nestedBundleId}
                bundle={item.nestedBundle!}
                quantity={item.quantity}
                priceSnapshot={item.priceSnapshot}
                onDelete={() => removeItem(item.nestedBundleId!)}
                onUpdateQuantity={q => updateQuantity(item.nestedBundleId!, q)}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
