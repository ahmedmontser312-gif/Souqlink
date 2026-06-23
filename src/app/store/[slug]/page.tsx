import Image from "next/image"
import Link from "next/link"
import { notFound } from "next/navigation"
import { Button } from "@/components/ui/button"
import ProductCard from "@/components/ProductCard"
import { MessageCircle, ArrowLeft } from "lucide-react"

export default async function StorePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"

  let store
  try {
    const res = await fetch(`${baseUrl}/api/stores?slug=${slug}`, { cache: "no-store" })
    if (!res.ok) notFound()
    store = await res.json()
  } catch {
    notFound()
  }

  let products: any[] = []
  try {
    const res = await fetch(`${baseUrl}/api/products?store=${store._id}`, { cache: "no-store" })
    if (res.ok) products = await res.json()
  } catch {
    // products stays empty
  }

  return (
    <div className="container mx-auto px-4 py-8 space-y-8">
      <Link
        href="/"
        className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground"
      >
        <ArrowLeft className="h-4 w-4" />
        Back to Marketplace
      </Link>

      <div className="rounded-xl border bg-card overflow-hidden">
        <div className="bg-gradient-to-r from-primary/10 to-primary/5 p-8 md:p-12">
          <div className="flex flex-col sm:flex-row items-center gap-6">
            {store.logo && (
              <div className="relative h-24 w-24 overflow-hidden rounded-full border-4 border-background shrink-0">
                <Image
                  src={store.logo}
                  alt={store.name}
                  fill
                  className="object-cover"
                />
              </div>
            )}
            <div className="text-center sm:text-left flex-1">
              <h1 className="text-3xl font-bold">{store.name}</h1>
              {store.description && (
                <p className="mt-2 text-muted-foreground max-w-2xl">{store.description}</p>
              )}
              {store.whatsappNumber && (
                <Button asChild className="mt-4 gap-2">
                  <a
                    href={`https://wa.me/${store.whatsappNumber.replace(/^\+/, "")}?text=${encodeURIComponent("Hi, I'm interested in your products from SouqLink")}`}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <MessageCircle className="h-4 w-4" />
                    Contact via WhatsApp
                  </a>
                </Button>
              )}
            </div>
          </div>
        </div>
      </div>

      <div>
        <h2 className="text-2xl font-bold mb-6">Products</h2>
        {products.length === 0 ? (
          <p className="text-muted-foreground text-center py-12">No products available yet.</p>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
            {products.map((product) => (
              <ProductCard key={product._id} product={product} />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
