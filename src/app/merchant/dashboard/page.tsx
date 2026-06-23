"use client";
import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Package, Store } from "lucide-react";

export default function MerchantDashboard() {
  const { data: session } = useSession();
  const [store, setStore] = useState<any>(null);
  const [productCount, setProductCount] = useState(0);

  useEffect(() => {
    fetch("/api/me")
      .then((r) => r.json())
      .then((data) => {
        if (data.store) setStore(data.store);
      })
      .catch(console.error);
  }, []);

  useEffect(() => {
    if (!store?.id) return;
    fetch(`/api/products?store=${store.id}`)
      .then((r) => r.json())
      .then((products) => setProductCount(products.length))
      .catch(console.error);
  }, [store]);

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">
        Welcome, {session?.user?.name}
      </h1>
      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">My Store</CardTitle>
            <Store className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            {store ? (
              <>
                <p className="text-lg font-semibold">{store.name}</p>
                <p className="text-sm text-muted-foreground">
                  {store.approved ? "Approved" : "Pending Approval"}
                </p>
              </>
            ) : (
              <p className="text-sm text-muted-foreground">
                No store created yet. Go to "My Store" to create one.
              </p>
            )}
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Products</CardTitle>
            <Package className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">{productCount}</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
