import HeroSlider from "@/components/HeroSlider"
import AdsSlider from "@/components/AdsSlider"
import ProductSlider from "@/components/ProductSlider"

const CATEGORIES = ["Clothes", "Electronics", "Accessories", "Home", "Beauty", "Sports"]

export default async function HomePage() {
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"

  let heroSlides: any[] = []
  let ads: any[] = []
  let categoryProducts: Record<string, any[]> = {}

  try {
    const res = await fetch(`${baseUrl}/api/home`, { cache: "no-store" })
    if (res.ok) {
      const data = await res.json()
      heroSlides = data.heroSlides ?? []
      ads = data.ads ?? []
      categoryProducts = data.categories ?? {}
    }
  } catch {
    // render with empty data
  }

  return (
    <div className="container mx-auto px-4 py-6 space-y-10">
      <HeroSlider slides={heroSlides} />
      <AdsSlider ads={ads} />
      {CATEGORIES.map((cat) => {
        const products = categoryProducts[cat]
        if (!Array.isArray(products) || products.length === 0) return null
        return (
          <ProductSlider
            key={cat}
            title={cat}
            products={products}
          />
        )
      })}
    </div>
  )
}
