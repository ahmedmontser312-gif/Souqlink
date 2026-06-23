"use client"

import { useState } from "react"
import Image from "next/image"
import { cn } from "@/lib/utils"

interface ProductGalleryProps {
  images: string[]
  name: string
}

export default function ProductGallery({ images, name }: ProductGalleryProps) {
  const [selectedIndex, setSelectedIndex] = useState(0)

  const allImages = images.length > 0 ? images : ["/placeholder.svg"]
  const currentImage = allImages[selectedIndex] || allImages[0]

  return (
    <div className="space-y-4">
      <div className="relative aspect-square overflow-hidden rounded-xl border bg-muted">
        <Image
          src={currentImage}
          alt={name}
          fill
          className="object-cover"
          priority
          sizes="(max-width: 768px) 100vw, 50vw"
        />
      </div>
      {allImages.length > 1 && (
        <div className="flex gap-3 overflow-x-auto pb-2">
          {allImages.map((img, i) => (
            <button
              key={i}
              onClick={() => setSelectedIndex(i)}
              className={cn(
                "relative h-20 w-20 shrink-0 overflow-hidden rounded-md border-2 transition-all",
                i === selectedIndex
                  ? "border-primary ring-1 ring-primary"
                  : "border-muted hover:border-muted-foreground/50"
              )}
            >
              <Image
                src={img}
                alt={`${name} ${i + 1}`}
                fill
                className="object-cover"
                sizes="80px"
              />
            </button>
          ))}
        </div>
      )}
    </div>
  )
}
