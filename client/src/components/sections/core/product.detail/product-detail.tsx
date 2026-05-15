'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/shadcn/button';
import { ICONS } from '@/shared/data/icons';
import { ProductData } from '@/shared/data/core/catalog/catalog.data';

export function ProductDetail() {
  const [quantity, setQuantity] = useState(ProductData.quantity);
  const [selectedImage, setSelectedImage] = useState(ProductData.image);

  return (
    <div className="grid grid-cols-2 gap-10">

      
      <div className="flex flex-col gap-4">
        <div className="rounded-[30px] overflow-hidden" style={{ width: '900px', height: '475px' }}>
          <img
            src={selectedImage}
            alt={ProductData.name}
            className="w-full h-full object-cover"
          />
        </div>

       
        <div className="flex gap-3">
          {ProductData.gallery.map((img, i) => (
            <button
              key={i}
              onClick={() => setSelectedImage(img)}
              className="rounded-2xl overflow-hidden shrink-0 opacity-80 hover:opacity-100 transition-opacity"
              style={{ width: '167px', height: '146px' }}
            >
              <img src={img} alt={`thumb ${i}`} className="w-full h-full object-cover" />
            </button>
          ))}
          <button
            className="rounded-2xl border border-neutral-200 bg-neutral-50 flex items-center justify-center text-xs font-medium text-muted-foreground hover:bg-neutral-100 transition-colors shrink-0"
            style={{ width: '167px', height: '146px' }}
          >
            +{ProductData.totalGalleryCount - ProductData.gallery.length} More
          </button>
        </div>
      </div>

      
      <div className="flex flex-col">

       
        <div className="py-[30px] border-b border-neutral-100">
          <h1 className="text-4xl font-normal leading-tight">{ProductData.name}</h1>
          <div className="flex items-baseline gap-2 mt-2">
            <span className="text-2xl font-bold">${ProductData.pricePerUnit.toFixed(2)}</span>
            <span className="text-sm text-muted-foreground">per unit</span>
          </div>
        </div>

     
        <div className="py-[30px] border-b border-neutral-100">
          <p className="text-[12px] font-bold uppercase tracking-widest text-muted-foreground mb-2">
            Curator's Description
          </p>
          <p className="text-sm text-muted-foreground leading-relaxed">
            {ProductData.description}
          </p>
        </div>

       
        <div className="flex items-center gap-4 py-[30px] border-b border-neutral-100">
          <div className="flex items-center gap-3 bg-secondary/10 rounded-full px-4 py-2.5 h-[60px] w-[128px] justify-center">
            <button
              onClick={() => setQuantity((q) => Math.max(1, q - 1))}
              className="text-secondary font-bold text-base hover:opacity-70 transition-opacity"
            >
              −
            </button>
            <span className="text-sm font-semibold w-5 text-center text-secondary">
              {String(quantity).padStart(2, '0')}
            </span>
            <button
              onClick={() => setQuantity((q) => q + 1)}
              className="text-secondary font-bold text-base hover:opacity-70 transition-opacity"
            >
              +
            </button>
          </div>
          <Button className="rounded-full flex-1 h-[60px] gap-2" variant="default">
            <ICONS.Cart size={16} color="currentColor" />
            Add to Project Bundle
          </Button>
        </div>

 
        <div className="flex gap-6 py-[30px]">

          
          <div
            className="rounded-2xl border border-neutral-100 p-6 flex flex-col shadow-[0_8px_40px_rgba(0,0,0,0.08)]"
            style={{ width: '438px', height: '230px' }}
          >
            <p className="text-[12px] font-bold uppercase tracking-widest text-muted-foreground mb-6">
              Technical Specifications
            </p>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-[10px] uppercase tracking-widest text-muted-foreground">SKU Reference</p>
                <p className="text-sm font-normal mt-1">{ProductData.specs.skuReference}</p>
              </div>
              <div>
                <p className="text-[10px] uppercase tracking-widest text-muted-foreground">Minimum Order</p>
                <p className="text-sm font-normal mt-1">{ProductData.specs.minimumOrder} Units</p>
              </div>
              <div>
                <p className="text-[10px] uppercase tracking-widest text-muted-foreground">Dimensions</p>
                <p className="text-sm font-normal mt-1">{ProductData.specs.dimensions}</p>
              </div>
              <div>
                <p className="text-[10px] uppercase tracking-widest text-muted-foreground">Lead Time</p>
                <p className="text-sm font-normal mt-1">{ProductData.specs.leadTime}</p>
              </div>
            </div>
          </div>

          
          <div
            className="rounded-2xl border border-neutral-100 p-5 flex items-center gap-4 shadow-[0_8px_40px_rgba(0,0,0,0.08)]"
            style={{ width: '438px', height: '230px' }}
          >
            <div
              className="rounded-2xl overflow-hidden shrink-0"
              style={{ width: '150px', height: '210px' }}
            >
              <img
                src={ProductData.supplier.image}
                alt={ProductData.supplier.name}
                className="w-full h-full object-cover"
              />
            </div>

            <div className="flex flex-col justify-center h-full flex-1 gap-2">
              <div className="flex justify-end">
                <div className="flex items-center gap-1">
                  <ICONS.StarSolid size={12} color="#5b6cf8" />
                  <span className="text-xs font-bold text-secondary">{ProductData.supplier.rating}</span>
                </div>
              </div>
              <div>
                <p className="text-base font-semibold">{ProductData.supplier.name}</p>
                <p className="text-xs text-muted-foreground mt-0.5">
                  Specialization: {ProductData.supplier.specialization}
                </p>
              </div>
              <div className="flex items-center gap-2">
                <button className="text-xs text-secondary underline underline-offset-2">
                  View Full Profile
                </button>
                <span className="text-neutral-300">|</span>
                {ProductData.supplier.verified && (
                  <div className="flex items-center gap-1">
                    <ICONS.Verified size={12} color="#5b6cf8" />
                    <span className="text-xs text-secondary">Verified Supplier</span>
                  </div>
                )}
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}