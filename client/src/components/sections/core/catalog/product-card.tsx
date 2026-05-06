'use client';

import { useRouter } from 'next/navigation';
import { ROUTES } from '@/constants';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/shadcn/card";
import { Button } from "@/components/ui/shadcn/button";
import { Badge } from "@/components/ui/shadcn/badge";
import { Plus, Heart } from "lucide-react";

export function ProductCard({ isLoggedIn, product }: any) {
  const router = useRouter();

  return (
    <Card className="border-none shadow-none bg-transparent gap-0 p-0 w-[200px] ring-0">
      <div className="relative">
        <img
          src={product.image}
          alt={product.name}
          className="w-full aspect-square object-cover rounded-2xl"
        />
        <Badge className="absolute top-2.5 left-2.5 bg-white text-black text-[10px] font-medium px-2.5 py-1 rounded-full shadow-sm border-0">
          {product.category || "Cafe"}
        </Badge>
        <button className="absolute top-2.5 right-2.5 w-7 h-7 bg-white rounded-full flex items-center justify-center shadow-sm">
          <Heart className="w-3.5 h-3.5 text-neutral-400" />
        </button>
      </div>

      <CardHeader className="pt-3 px-0 pb-0 gap-0.5">
        <CardTitle variant="default" className="text-base font-bold leading-tight">
          {product.name}
        </CardTitle>
        <CardDescription className="text-xs">{product.vendor}</CardDescription>
        <p className="text-xs text-muted-foreground">min. {product.minPieces} pieces</p>
      </CardHeader>

      <CardContent className="px-0 pt-3 pb-0">
        {isLoggedIn ? (
          <div className="flex flex-col gap-2">
            <span className="text-base font-bold">${product.price?.toLocaleString()}</span>
            <Button className="w-full h-10 rounded-2xl text-xs" variant="default">
              <Plus className="mr-1 w-3 h-3" /> Add to Bundle
            </Button>
          </div>
        ) : (
          <Button
            className="w-full h-10 rounded-2xl text-xs whitespace-normal text-center leading-tight bg-neutral-100 text-neutral-500 hover:bg-neutral-200"
            variant="secondary"
            onClick={() => router.push(ROUTES.AUTH.REGISTER)}
          >
            Price available after registration
          </Button>
        )}
      </CardContent>
    </Card>
  );
}