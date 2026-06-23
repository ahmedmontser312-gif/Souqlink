"use client"

import * as React from "react"
import Image from "next/image"
import Link from "next/link"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"

interface Slide {
  image: string
  title: string
  description: string
  link: string
}

interface HeroSliderProps {
  slides: Slide[]
}

export default function HeroSlider({ slides }: HeroSliderProps) {
  const [current, setCurrent] = React.useState(0)
  const intervalRef = React.useRef<ReturnType<typeof setInterval> | null>(null)

  const startAutoPlay = React.useCallback(() => {
    if (intervalRef.current) clearInterval(intervalRef.current)
    intervalRef.current = setInterval(() => {
      setCurrent((prev) => (prev + 1) % slides.length)
    }, 5000)
  }, [slides.length])

  React.useEffect(() => {
    if (slides.length <= 1) return
    startAutoPlay()
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current)
    }
  }, [slides.length, startAutoPlay])

  const goTo = (index: number) => {
    setCurrent(index)
    startAutoPlay()
  }

  const goPrev = () => {
    goTo(current === 0 ? slides.length - 1 : current - 1)
  }

  const goNext = () => {
    goTo(current === slides.length - 1 ? 0 : current + 1)
  }

  if (!slides.length) return null

  const slide = slides[current]

  return (
    <div className="relative overflow-hidden rounded-xl bg-muted">
      <div className="relative aspect-[21/9] w-full">
        <Image
          src={slide.image}
          alt={slide.title}
          fill
          className="object-cover"
          priority
          sizes="100vw"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-black/60 to-transparent" />
        <div className="absolute inset-0 flex items-center">
          <div className="container mx-auto px-4 md:px-8">
            <div className="max-w-lg space-y-4">
              <h2 className="text-3xl font-bold text-white md:text-4xl lg:text-5xl">
                {slide.title}
              </h2>
              <p className="text-sm text-white/80 md:text-base lg:text-lg">
                {slide.description}
              </p>
              <Button asChild size="lg" className="mt-2">
                <Link href={slide.link}>Shop Now</Link>
              </Button>
            </div>
          </div>
        </div>
      </div>

      {slides.length > 1 && (
        <>
          <Button
            variant="ghost"
            size="icon"
            className="absolute left-2 top-1/2 -translate-y-1/2 rounded-full bg-white/20 text-white hover:bg-white/40"
            onClick={goPrev}
          >
            <ChevronLeft className="h-6 w-6" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="absolute right-2 top-1/2 -translate-y-1/2 rounded-full bg-white/20 text-white hover:bg-white/40"
            onClick={goNext}
          >
            <ChevronRight className="h-6 w-6" />
          </Button>
          <div className="absolute bottom-4 left-1/2 flex -translate-x-1/2 gap-2">
            {slides.map((_, i) => (
              <button
                key={i}
                className={cn(
                  "h-2 w-2 rounded-full transition-all",
                  i === current ? "bg-white w-6" : "bg-white/50 hover:bg-white/80"
                )}
                onClick={() => goTo(i)}
              />
            ))}
          </div>
        </>
      )}
    </div>
  )
}
