"use client";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { formatPrice } from "@/lib/utils";
import { Trash2 } from "lucide-react";
import { toast } from "@/components/ui/toast";

interface Product {
  id: string;
  name: string;
  price: number;
  images: string[];
  storeName: string;
  category: string;
}

export default function AdminProducts() {
  const [products, setProducts] = useState<Product[]>([]);

  useEffect(() => {
    fetch("/api/products")
      .then((r) => r.json())
      .then(setProducts)
      .catch(console.error);
  }, []);

  const deleteProduct = async (id: string) => {
    if (!confirm("Are you sure you want to delete this product?")) return;
    try {
      const res = await fetch(`/api/products/${id}`, { method: "DELETE" });
      if (!res.ok) throw new Error("Failed");
      setProducts((prev) => prev.filter((p) => p.id !== id));
      toast({ title: "Product deleted" });
    } catch {
      toast({ title: "Error", description: "Failed to delete product" });
    }
  };

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">All Products</h1>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {products.map((product) => (
          <Card key={product.id}>
            <CardHeader className="p-0">
              <div className="aspect-square relative overflow-hidden rounded-t-lg">
                <img
                  src={product.images?.[0] || "/placeholder.svg"}
                  alt={product.name}
                  className="object-cover w-full h-full"
                />
              </div>
            </CardHeader>
            <CardContent className="p-4">
              <CardTitle className="text-base mb-1">{product.name}</CardTitle>
              <p className="text-sm text-muted-foreground mb-1">
                {product.storeName} • {product.category}
              </p>
              <p className="font-bold text-lg mb-3">
                {formatPrice(product.price)}
              </p>
              <Button
                variant="destructive"
                size="sm"
                className="w-full"
                onClick={() => deleteProduct(product.id)}
              >
                <Trash2 className="h-4 w-4 mr-1" /> Delete
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
