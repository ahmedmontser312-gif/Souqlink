"use client"

import * as React from "react"
import Image from "next/image"
import Link from "next/link"
import { ShoppingBag } from "lucide-react"
import { cn, formatPrice } from "@/lib/utils"
import { Button } from "@/components/ui/button"

interface ProductCardProps {
  product: {
    id: string
    name: string
    price: number
    images: string[]
    storeName: string
    whatsappNumber?: string
  }
}

export default function ProductCard({ product }: ProductCardProps) {
  const imageSrc = product.images?.[0] || "/placeholder.svg"
  const whatsappUrl = product.whatsappNumber
    ? `https://wa.me/${product.whatsappNumber.replace(/^\+/, "")}?text=${encodeURIComponent(`Hi, I'm interested in buying "${product.name}" from SouqLink`)}`
    : "#"

  return (
    <div className="group relative flex flex-col overflow-hidden rounded-lg border bg-card shadow-sm transition-all hover:shadow-md">
      <Link href={`/product/${product.id}`} className="overflow-hidden">
        <div className="relative aspect-square overflow-hidden bg-muted">
          <Image
            src={imageSrc}
            alt={product.name}
            fill
            className="object-cover transition-transform group-hover:scale-105"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
          />
        </div>
      </Link>
      <div className="flex flex-1 flex-col gap-2 p-4">
        <Link href={`/product/${product.id}`}>
          <h3 className="line-clamp-2 text-sm font-medium leading-tight hover:underline">
            {product.name}
          </h3>
        </Link>
        <p className="text-xs text-muted-foreground">{product.storeName}</p>
        <div className="mt-auto flex items-center justify-between">
          <span className="text-lg font-bold text-primary">
            {formatPrice(product.price)}
          </span>
          <Button
            size="sm"
            className="gap-1.5"
            onClick={() => window.open(whatsappUrl, "_blank")}
          >
            <ShoppingBag className="h-4 w-4" />
            Buy Now
          </Button>
        </div>
      </div>
    </div>
  )
}
