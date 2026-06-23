"use client"

import * as React from "react"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import ProductCard from "@/components/ProductCard"

interface Product {
  _id: string
  name: string
  price: number
  images: string[]
  storeName: string
  whatsappNumber?: string
}

interface ProductSliderProps {
  title: string
  products: Product[]
}

export default function ProductSlider({ title, products }: ProductSliderProps) {
  const scrollRef = React.useRef<HTMLDivElement>(null)

  const scroll = (direction: "left" | "right") => {
    if (!scrollRef.current) return
    const scrollAmount = scrollRef.current.clientWidth * 0.75
    scrollRef.current.scrollBy({
      left: direction === "left" ? -scrollAmount : scrollAmount,
      behavior: "smooth",
    })
  }

  if (!products.length) return null

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold tracking-tight">{title}</h2>
        <div className="flex gap-2">
          <Button
            variant="outline"
            size="icon"
            className="rounded-full"
            onClick={() => scroll("left")}
          >
            <ChevronLeft className="h-5 w-5" />
          </Button>
          <Button
            variant="outline"
            size="icon"
            className="rounded-full"
            onClick={() => scroll("right")}
          >
            <ChevronRight className="h-5 w-5" />
          </Button>
        </div>
      </div>
      <div
        ref={scrollRef}
        className="flex gap-4 overflow-x-auto scroll-smooth pb-2 -mx-4 px-4"
        style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
      >
        {products.map((product) => (
          <div key={product._id} className="min-w-[220px] max-w-[220px] flex-shrink-0">
            <ProductCard product={product} />
          </div>
        ))}
      </div>
    </div>
  )
}
