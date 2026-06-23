"use client";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { toast } from "@/components/ui/toast";
import { Check, X } from "lucide-react";

interface Merchant {
  _id: string;
  name: string;
  email: string;
  stores?: {
    _id: string;
    name: string;
    slug: string;
    approved: boolean;
  }[];
}

export default function AdminMerchants() {
  const [merchants, setMerchants] = useState<Merchant[]>([]);

  useEffect(() => {
    fetch("/api/admin/merchants")
      .then((r) => r.json())
      .then(setMerchants)
      .catch(console.error);
  }, []);

  const toggleApproval = async (slug: string, approved: boolean) => {
    try {
      const res = await fetch(`/api/stores/${slug}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ approved }),
      });
      if (!res.ok) throw new Error("Failed");
      setMerchants((prev) =>
        prev.map((m) => {
          const store = m.stores?.[0];
          if (store?.slug === slug) {
            return {
              ...m,
              stores: [{ ...store, approved }],
            };
          }
          return m;
        })
      );
    } catch {
      toast({ title: "Error", description: "Failed to update store" });
    }
  };

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Merchants</h1>
      <div className="space-y-4">
        {merchants.map((merchant) => (
          <Card key={merchant._id}>
            <CardHeader>
              <CardTitle className="text-lg">{merchant.name}</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground mb-2">
                {merchant.email}
              </p>
              {merchant.stores?.[0] ? (
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">{merchant.stores[0].name}</p>
                    <p className="text-sm text-muted-foreground">
                      /store/{merchant.stores[0].slug}
                    </p>
                  </div>
                  <div className="flex gap-2">
                    {merchant.stores[0].approved ? (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() =>
                          toggleApproval(merchant.stores![0].slug, false)
                        }
                      >
                        <X className="h-4 w-4 mr-1" /> Reject
                      </Button>
                    ) : (
                      <Button
                        size="sm"
                        onClick={() =>
                          toggleApproval(merchant.stores![0].slug, true)
                        }
                      >
                        <Check className="h-4 w-4 mr-1" /> Approve
                      </Button>
                    )}
                  </div>
                </div>
              ) : (
                <p className="text-sm text-muted-foreground">
                  No store created yet
                </p>
              )}
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
