'use client';

import { authClient } from '@/lib';
import { ProductCard, HeroBg } from "@/components/sections/core/catalog";
import { CatalogSidebar } from "@/components/layout/sidebar";
import { ProductCardData } from '@/shared/data/core/catalog/product-card.data';
import { Input } from "@/components/ui/shadcn/input";
import { Button } from "@/components/ui/shadcn/button";
import { Badge } from "@/components/ui/shadcn/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/shadcn/dropdown-menu";
import { Search, X, ChevronDown } from "lucide-react";

export function CatalogPage() {
  const { data: session, isPending: isLoading } = authClient.useSession();

  if (isLoading) return (
    <div className={"flex h-screen items-center justify-center bg-background"}>
      <div className={"animate-pulse font-bold text-xl uppercase tracking-widest"}>Loading Marketplace...</div>
    </div>
  );

  const isAuthorized = !!session;

  return (
    <div className={"flex flex-col min-h-screen"}>
      <HeroBg />

      <div className={"container mx-auto px-6 py-10 flex flex-col lg:flex-row gap-10"}>
        <CatalogSidebar />

        <div className={"flex-1 min-w-0"}>
          <div className={"flex flex-wrap justify-between items-center mb-6 gap-4"}>
            <h2 className={"text-[26px] font-bold tracking-tight text-foreground whitespace-nowrap"}>
              Catalog with Items
            </h2>
            <div className={"flex items-center gap-3"}>
              <div className={"relative w-[220px]"}>
                <Search className={"absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-muted-foreground"} />
                <Input
                  placeholder={"Search current catalog..."}
                  className={"pl-8 h-9 text-xs rounded-full bg-white border border-neutral-200 text-foreground placeholder:text-muted-foreground shadow-none"}
                />
              </div>
              <Button size={"sm"} className={"rounded-xl whitespace-nowrap"} variant={"default"}>
                View prebuilt Bundles
              </Button>
            </div>
          </div>

          <div className={"flex items-center justify-between mb-6 gap-4 flex-wrap"}>
            <div className={"flex items-center gap-2 flex-wrap"}>
              <Badge variant={"secondary"} className={"rounded-full px-3 py-1 text-xs flex items-center gap-1.5 cursor-pointer"}>
                Seating <X className={"w-3 h-3"} />
              </Badge>
              <Badge variant={"secondary"} className={"rounded-full px-3 py-1 text-xs flex items-center gap-1.5 cursor-pointer"}>
                Restaurant <X className={"w-3 h-3"} />
              </Badge>
              <button className={"text-xs text-muted-foreground hover:underline underline-offset-2"}>
                Clear all
              </button>
            </div>
            <div className={"flex items-center gap-1.5 text-xs text-muted-foreground shrink-0"}>
              Sort by:
              <DropdownMenu>
                <DropdownMenuTrigger className={"flex items-center gap-1 text-xs font-medium text-foreground outline-none"}>
                  Curated Popularity <ChevronDown className={"w-3 h-3"} />
                </DropdownMenuTrigger>
                <DropdownMenuContent align={"end"}>
                  <DropdownMenuItem className={"text-xs"}>Curated Popularity</DropdownMenuItem>
                  <DropdownMenuItem className={"text-xs"}>Price: Low to High</DropdownMenuItem>
                  <DropdownMenuItem className={"text-xs"}>Price: High to Low</DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>

          <div className={"grid grid-cols-2 md:grid-cols-3 xl:grid-cols-5 gap-x-4 gap-y-10"}>
            {[...Array(20)].map((_, i) => (
              <ProductCard key={i} isLoggedIn={isAuthorized} product={ProductCardData} />
            ))}
          </div>

          <div className={"flex items-center justify-between mt-12 text-xs text-muted-foreground"}>
            <span>Page 01 — 24</span>
            <div className={"flex items-center gap-2"}>
              <button className={"w-8 h-8 rounded-full border border-neutral-200 flex items-center justify-center hover:bg-neutral-100"}>‹</button>
              <button className={"w-8 h-8 rounded-full bg-foreground text-background flex items-center justify-center"}>›</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}