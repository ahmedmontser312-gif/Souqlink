import HeroSlider from "@/components/HeroSlider"
import AdsSlider from "@/components/AdsSlider"
import ProductSlider from "@/components/ProductSlider"

const categories = ["All", "Clothes", "Electronics", "Accessories", "Home", "Beauty", "Sports"]

export default async function HomePage() {
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"

  async function fetchJson(url: string) {
    try {
      const res = await fetch(url, { cache: "no-store" })
      if (!res.ok) return []
      return await res.json()
    } catch {
      return []
    }
  }

  const [heroSlides, ads, allProducts, clothes, electronics, accessories, home, beauty, sports] =
    await Promise.all([
      fetchJson(`${baseUrl}/api/slider?type=hero`),
      fetchJson(`${baseUrl}/api/ads`),
      fetchJson(`${baseUrl}/api/products`),
      fetchJson(`${baseUrl}/api/products?category=Clothes`),
      fetchJson(`${baseUrl}/api/products?category=Electronics`),
      fetchJson(`${baseUrl}/api/products?category=Accessories`),
      fetchJson(`${baseUrl}/api/products?category=Home`),
      fetchJson(`${baseUrl}/api/products?category=Beauty`),
      fetchJson(`${baseUrl}/api/products?category=Sports`),
    ])

  const categoryProducts: Record<string, any[]> = {
    All: allProducts,
    Clothes: clothes,
    Electronics: electronics,
    Accessories: accessories,
    Home: home,
    Beauty: beauty,
    Sports: sports,
  }

  return (
    <div className="container mx-auto px-4 py-6 space-y-10">
      <HeroSlider slides={heroSlides} />
      <AdsSlider ads={ads} />
      {categories.map((cat) => {
        const products = categoryProducts[cat]
        if (!Array.isArray(products) || products.length === 0) return null
        return (
          <ProductSlider
            key={cat}
            title={cat === "All" ? "Featured Products" : cat}
            products={products}
          />
        )
      })}
    </div>
  )
}
