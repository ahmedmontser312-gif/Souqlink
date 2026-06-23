"use client"

import * as React from "react"
import Image from "next/image"
import Link from "next/link"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"

interface Ad {
  image: string
  link: string
  title?: string
}

interface AdsSliderProps {
  ads: Ad[]
}

export default function AdsSlider({ ads }: AdsSliderProps) {
  const [current, setCurrent] = React.useState(0)
  const intervalRef = React.useRef<ReturnType<typeof setInterval> | null>(null)

  const startAutoPlay = React.useCallback(() => {
    if (intervalRef.current) clearInterval(intervalRef.current)
    intervalRef.current = setInterval(() => {
      setCurrent((prev) => (prev + 1) % ads.length)
    }, 5000)
  }, [ads.length])

  React.useEffect(() => {
    if (ads.length <= 1) return
    startAutoPlay()
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current)
    }
  }, [ads.length, startAutoPlay])

  const goTo = (index: number) => {
    setCurrent(index)
    startAutoPlay()
  }

  const goPrev = () => {
    goTo(current === 0 ? ads.length - 1 : current - 1)
  }

  const goNext = () => {
    goTo(current === ads.length - 1 ? 0 : current + 1)
  }

  if (!ads.length) return null

  const ad = ads[current]

  return (
    <div className="relative overflow-hidden rounded-lg bg-muted">
      <Link href={ad.link} className="relative block aspect-[21/4] w-full">
        <Image
          src={ad.image}
          alt={ad.title || "Advertisement"}
          fill
          className="object-cover"
          sizes="100vw"
        />
        {ad.title && (
          <div className="absolute inset-0 flex items-center justify-center bg-black/20">
            <h3 className="text-xl font-bold text-white md:text-2xl">{ad.title}</h3>
          </div>
        )}
      </Link>

      {ads.length > 1 && (
        <>
          <Button
            variant="ghost"
            size="icon"
            className="absolute left-1 top-1/2 -translate-y-1/2 rounded-full bg-white/20 text-white hover:bg-white/40 h-8 w-8"
            onClick={(e) => { e.preventDefault(); goPrev() }}
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="absolute right-1 top-1/2 -translate-y-1/2 rounded-full bg-white/20 text-white hover:bg-white/40 h-8 w-8"
            onClick={(e) => { e.preventDefault(); goNext() }}
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
          <div className="absolute bottom-2 left-1/2 flex -translate-x-1/2 gap-1.5">
            {ads.map((_, i) => (
              <button
                key={i}
                className={cn(
                  "h-1.5 rounded-full transition-all",
                  i === current ? "bg-white w-4" : "bg-white/50 hover:bg-white/80 w-1.5"
                )}
                onClick={(e) => { e.preventDefault(); goTo(i) }}
              />
            ))}
          </div>
        </>
      )}
    </div>
  )
}
