import Link from "next/link"
import { notFound } from "next/navigation"
import { Button } from "@/components/ui/button"
import { formatPrice } from "@/lib/utils"
import { MessageCircle, Store, ArrowLeft, Tag } from "lucide-react"
import ProductGallery from "./product-gallery"

export default async function ProductPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"

  let product
  try {
    const res = await fetch(`${baseUrl}/api/products/${id}`, { cache: "no-store" })
    if (!res.ok) notFound()
    product = await res.json()
  } catch {
    notFound()
  }

  const store = product.store || {}
  const whatsappNumber = product.whatsappNumber || store.whatsappNumber || ""
  const whatsappUrl = `https://wa.me/${whatsappNumber.replace(/^\+/, "")}?text=${encodeURIComponent(`Hi, I'm interested in buying "${product.name}" from SouqLink`)}`

  return (
    <div className="container mx-auto px-4 py-8">
      <Link
        href="/"
        className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground mb-6"
      >
        <ArrowLeft className="h-4 w-4" />
        Back to Marketplace
      </Link>

      <div className="grid md:grid-cols-2 gap-8 lg:gap-12">
        <ProductGallery images={product.images || []} name={product.name} />

        <div className="space-y-6">
          <div>
            <div className="flex items-center gap-2 mb-2">
              {product.category && (
                <span className="inline-flex items-center gap-1 rounded-full bg-primary/10 px-3 py-1 text-xs font-medium text-primary">
                  <Tag className="h-3 w-3" />
                  {product.category}
                </span>
              )}
            </div>
            <h1 className="text-3xl font-bold">{product.name}</h1>
          </div>

          <p className="text-4xl font-bold text-primary">{formatPrice(product.price)}</p>

          {product.description && (
            <div>
              <h3 className="font-semibold mb-2">Description</h3>
              <p className="text-muted-foreground leading-relaxed">{product.description}</p>
            </div>
          )}

          {store.name && (
            <div className="flex items-center gap-3 rounded-lg border p-4">
              <Store className="h-8 w-8 text-muted-foreground" />
              <div>
                <p className="text-sm text-muted-foreground">Sold by</p>
                <Link href={`/store/${store.slug}`} className="font-medium hover:underline">
                  {store.name}
                </Link>
              </div>
            </div>
          )}

          <div className="flex flex-col sm:flex-row gap-3 pt-2">
            {whatsappNumber && (
              <Button asChild className="gap-2 flex-1" size="lg">
                <a href={whatsappUrl} target="_blank" rel="noopener noreferrer">
                  <MessageCircle className="h-5 w-5" />
                  Buy Now via WhatsApp
                </a>
              </Button>
            )}
            {store.slug && (
              <Button variant="outline" asChild className="gap-2 flex-1" size="lg">
                <Link href={`/store/${store.slug}`}>
                  <Store className="h-5 w-5" />
                  Visit Store
                </Link>
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
