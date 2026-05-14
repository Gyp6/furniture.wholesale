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

      {/* LEFT — Gallery */}
      <div className="flex flex-col gap-4">
        <div className="rounded-[30px] overflow-hidden">
          <img
            src={selectedImage}
            alt={ProductData.name}
            className="w-full aspect-[4/3] object-cover"
          />
        </div>

        {/* Thumbnails */}
        <div className="flex gap-3">
          {ProductData.gallery.map((img, i) => (
            <button
              key={i}
              onClick={() => setSelectedImage(img)}
              className={`w-[80px] h-[80px] rounded-2xl overflow-hidden border-2 transition-colors ${
                selectedImage === img ? 'border-secondary' : 'border-transparent'
              }`}
            >
              <img src={img} alt={`thumb ${i}`} className="w-full h-full object-cover" />
            </button>
          ))}
          <button className="w-[80px] h-[80px] rounded-2xl border border-neutral-200 bg-neutral-50 flex items-center justify-center text-xs font-medium text-muted-foreground hover:bg-neutral-100 transition-colors">
            +{ProductData.totalGalleryCount - ProductData.gallery.length} More
          </button>
        </div>
      </div>

      {/* RIGHT — Info */}
      <div className="flex flex-col gap-6">

        {/* Name + Price */}
        <div>
          <h1 className="text-2xl font-bold leading-tight">{ProductData.name}</h1>
          <div className="flex items-baseline gap-2 mt-2">
            <span className="text-2xl font-bold">${ProductData.pricePerUnit.toFixed(2)}</span>
            <span className="text-sm text-muted-foreground">per unit</span>
          </div>
        </div>

        {/* Description */}
        <div>
          <p className="text-[11px] font-bold uppercase tracking-widest text-muted-foreground mb-2">
            Curator's Description
          </p>
          <p className="text-sm text-muted-foreground leading-relaxed">
            {ProductData.description}
          </p>
        </div>

        {/* Quantity + Button */}
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-3 bg-secondary/10 rounded-full px-4 py-2.5">
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
          <Button className="rounded-full flex-1 h-11 gap-2" variant="default">
            <ICONS.Cart size={16} color="currentColor" />
            Add to Project Bundle
          </Button>
        </div>

        {/* Specs + Supplier */}
        <div className="grid grid-cols-2 gap-4">

          {/* Technical Specifications */}
          <div className="rounded-2xl border border-neutral-100 p-4 flex flex-col gap-3">
            <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">
              Technical Specifications
            </p>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <p className="text-[10px] uppercase tracking-widest text-muted-foreground">SKU Reference</p>
                <p className="text-xs font-semibold mt-0.5">{ProductData.specs.skuReference}</p>
              </div>
              <div>
                <p className="text-[10px] uppercase tracking-widest text-muted-foreground">Minimum Order</p>
                <p className="text-xs font-semibold mt-0.5">{ProductData.specs.minimumOrder} Units</p>
              </div>
              <div>
                <p className="text-[10px] uppercase tracking-widest text-muted-foreground">Dimensions</p>
                <p className="text-xs font-semibold mt-0.5">{ProductData.specs.dimensions}</p>
              </div>
              <div>
                <p className="text-[10px] uppercase tracking-widest text-muted-foreground">Lead Time</p>
                <p className="text-xs font-semibold mt-0.5">{ProductData.specs.leadTime}</p>
              </div>
            </div>
          </div>

          {/* Supplier */}
          <div className="rounded-2xl bg-foreground p-4 flex flex-col justify-between gap-3">
            <div className="flex items-center justify-between">
              <div className="w-8 h-8 rounded-full bg-neutral-600 overflow-hidden">
                <img
                  src={ProductData.supplier.image}
                  alt={ProductData.supplier.name}
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="flex items-center gap-1">
                <ICONS.StarSolid size={12} color="#FFD700" />
                <span className="text-xs font-bold text-white">{ProductData.supplier.rating}</span>
              </div>
            </div>
            <div>
              <p className="text-sm font-bold text-white">{ProductData.supplier.name}</p>
              <p className="text-[10px] text-neutral-400 mt-0.5">{ProductData.supplier.specialization}</p>
            </div>
            <div className="flex items-center justify-between">
              <button className="text-[10px] text-secondary underline underline-offset-2">
                View Full Profile
              </button>
              {ProductData.supplier.verified && (
                <div className="flex items-center gap-1">
                  <ICONS.Verified size={12} color="#5b6cf8" />
                  <span className="text-[10px] text-secondary">Verified Supplier</span>
                </div>
              )}
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}