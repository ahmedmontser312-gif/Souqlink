"use client";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "@/components/ui/toast";
import { formatPrice } from "@/lib/utils";
import { Plus, Pencil, Trash2 } from "lucide-react";

const categories = [
  "All",
  "Clothes",
  "Electronics",
  "Accessories",
  "Home",
  "Beauty",
  "Sports",
];

interface Product {
  _id: string;
  name: string;
  price: number;
  images: string[];
  category: string;
  whatsappNumber: string;
  description: string;
}

export default function MerchantProducts() {
  const [products, setProducts] = useState<Product[]>([]);
  const [storeId, setStoreId] = useState<string | null>(null);
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<Product | null>(null);
  const [form, setForm] = useState({
    name: "",
    price: "",
    description: "",
    images: "",
    category: "General",
    whatsappNumber: "",
  });

  useEffect(() => {
    fetch("/api/me")
      .then((r) => r.json())
      .then((data) => {
        if (data.store?._id) {
          setStoreId(data.store._id);
          setForm((p) => ({
            ...p,
            whatsappNumber: data.store.whatsappNumber || "",
          }));
        }
      })
      .catch(console.error);
  }, []);

  useEffect(() => {
    if (!storeId) return;
    fetch(`/api/products?store=${storeId}`)
      .then((r) => r.json())
      .then(setProducts)
      .catch(console.error);
  }, [storeId]);

  const resetForm = () => {
    setForm({
      name: "",
      price: "",
      description: "",
      images: "",
      category: "General",
      whatsappNumber: "",
    });
    setEditing(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const body = {
        ...form,
        price: parseFloat(form.price),
        images: form.images
          ? form.images.split("\n").map((s) => s.trim()).filter(Boolean)
          : [],
      };

      const url = editing ? `/api/products/${editing._id}` : "/api/products";
      const method = editing ? "PUT" : "POST";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });

      if (!res.ok) throw new Error("Failed to save product");

      const saved = await res.json();

      if (editing) {
        setProducts((prev) =>
          prev.map((p) => (p._id === saved._id ? saved : p))
        );
      } else {
        setProducts((prev) => [...prev, saved]);
      }

      toast({
        title: editing ? "Product updated" : "Product created",
      });
      setOpen(false);
      resetForm();
    } catch {
      toast({ title: "Error", description: "Failed to save product" });
    }
  };

  const deleteProduct = async (id: string) => {
    if (!confirm("Delete this product?")) return;
    try {
      const res = await fetch(`/api/products/${id}`, { method: "DELETE" });
      if (!res.ok) throw new Error("Failed");
      setProducts((prev) => prev.filter((p) => p._id !== id));
      toast({ title: "Product deleted" });
    } catch {
      toast({ title: "Error", description: "Failed to delete product" });
    }
  };

  const startEdit = (product: Product) => {
    setEditing(product);
    setForm({
      name: product.name,
      price: product.price.toString(),
      description: product.description,
      images: product.images.join("\n"),
      category: product.category,
      whatsappNumber: product.whatsappNumber,
    });
    setOpen(true);
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">My Products</h1>
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button onClick={resetForm}>
              <Plus className="h-4 w-4 mr-1" /> Add Product
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>
                {editing ? "Edit Product" : "Add Product"}
              </DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label>Product Name</Label>
                <Input
                  value={form.name}
                  onChange={(e) =>
                    setForm((p) => ({ ...p, name: e.target.value }))
                  }
                  required
                />
              </div>
              <div className="space-y-2">
                <Label>Price (EGP)</Label>
                <Input
                  type="number"
                  step="0.01"
                  value={form.price}
                  onChange={(e) =>
                    setForm((p) => ({ ...p, price: e.target.value }))
                  }
                  required
                />
              </div>
              <div className="space-y-2">
                <Label>Category</Label>
                <Select
                  value={form.category}
                  onValueChange={(v) =>
                    setForm((p) => ({ ...p, category: v }))
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {categories
                      .filter((c) => c !== "All")
                      .map((cat) => (
                        <SelectItem key={cat} value={cat}>
                          {cat}
                        </SelectItem>
                      ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Description</Label>
                <textarea
                  className="flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                  value={form.description}
                  onChange={(e) =>
                    setForm((p) => ({ ...p, description: e.target.value }))
                  }
                />
              </div>
              <div className="space-y-2">
                <Label>Image URLs (one per line)</Label>
                <textarea
                  className="flex min-h-[60px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                  value={form.images}
                  onChange={(e) =>
                    setForm((p) => ({ ...p, images: e.target.value }))
                  }
                  placeholder="https://example.com/image1.jpg"
                />
              </div>
              <div className="space-y-2">
                <Label>WhatsApp Number</Label>
                <Input
                  value={form.whatsappNumber}
                  onChange={(e) =>
                    setForm((p) => ({ ...p, whatsappNumber: e.target.value }))
                  }
                  placeholder="+201234567890"
                />
              </div>
              <Button type="submit" className="w-full">
                {editing ? "Update" : "Create"} Product
              </Button>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {products.map((product) => (
          <Card key={product._id}>
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
                {product.category}
              </p>
              <p className="font-bold text-lg mb-3">
                {formatPrice(product.price)}
              </p>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  className="flex-1"
                  onClick={() => startEdit(product)}
                >
                  <Pencil className="h-4 w-4 mr-1" /> Edit
                </Button>
                <Button
                  variant="destructive"
                  size="sm"
                  className="flex-1"
                  onClick={() => deleteProduct(product._id)}
                >
                  <Trash2 className="h-4 w-4 mr-1" /> Delete
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {products.length === 0 && (
        <p className="text-center text-muted-foreground py-12">
          No products yet. Click "Add Product" to get started.
        </p>
      )}
    </div>
  );
}
