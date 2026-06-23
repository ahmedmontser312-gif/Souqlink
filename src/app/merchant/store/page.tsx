"use client";
import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { toast } from "@/components/ui/toast";

export default function MerchantStore() {
  const { data: session } = useSession();
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [store, setStore] = useState<any>(null);
  const [form, setForm] = useState({
    name: "",
    slug: "",
    description: "",
    logo: "",
    whatsappNumber: "",
  });

  useEffect(() => {
    fetch("/api/me")
      .then((r) => r.json())
      .then((data) => {
        if (data.store) {
          setStore(data.store);
          setForm({
            name: data.store.name,
            slug: data.store.slug,
            description: data.store.description || "",
            logo: data.store.logo || "",
            whatsappNumber: data.store.whatsappNumber || "",
          });
        }
      })
      .catch(console.error);
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const url = store
        ? `/api/stores/${store.slug}`
        : "/api/stores";
      const method = store ? "PUT" : "POST";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error || "Failed to save store");
      }

      toast({
        title: store ? "Store updated" : "Store created",
        description: store
          ? "Your store has been updated."
          : "Your store has been created and is pending approval.",
      });
      router.refresh();
    } catch (err: any) {
      toast({ title: "Error", description: err.message });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl">
      <h1 className="text-2xl font-bold mb-6">
        {store ? "Edit Store" : "Create Store"}
      </h1>
      <Card>
        <CardHeader>
          <CardTitle>Store Information</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">Store Name</Label>
              <Input
                id="name"
                value={form.name}
                onChange={(e) =>
                  setForm((p) => ({ ...p, name: e.target.value }))
                }
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="slug">Store URL (slug)</Label>
              <Input
                id="slug"
                value={form.slug}
                onChange={(e) =>
                  setForm((p) => ({ ...p, slug: e.target.value }))
                }
                placeholder="my-store"
                required
              />
              <p className="text-xs text-muted-foreground">
                Your store will be at /store/{form.slug || "my-store"}
              </p>
            </div>
            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <textarea
                id="description"
                className="flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                value={form.description}
                onChange={(e) =>
                  setForm((p) => ({ ...p, description: e.target.value }))
                }
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="logo">Logo URL</Label>
              <Input
                id="logo"
                value={form.logo}
                onChange={(e) =>
                  setForm((p) => ({ ...p, logo: e.target.value }))
                }
                placeholder="https://example.com/logo.png"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="whatsapp">WhatsApp Number</Label>
              <Input
                id="whatsapp"
                value={form.whatsappNumber}
                onChange={(e) =>
                  setForm((p) => ({ ...p, whatsappNumber: e.target.value }))
                }
                placeholder="+201234567890"
              />
              <p className="text-xs text-muted-foreground">
                Include country code without spaces or symbols
              </p>
            </div>
            <Button type="submit" disabled={loading}>
              {loading
                ? "Saving..."
                : store
                ? "Update Store"
                : "Create Store"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
