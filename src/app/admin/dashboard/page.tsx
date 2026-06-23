"use client";
import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Store, Package, Users, ShoppingBag } from "lucide-react";

export default function AdminDashboard() {
  const { data: session } = useSession();
  const [stats, setStats] = useState({
    merchants: 0,
    stores: 0,
    products: 0,
    pending: 0,
  });

  useEffect(() => {
    fetch("/api/admin/stats")
      .then((r) => r.json())
      .then(setStats)
      .catch(console.error);
  }, []);

  const cards = [
    { title: "Merchants", value: stats.merchants, icon: Users },
    { title: "Stores", value: stats.stores, icon: Store },
    { title: "Products", value: stats.products, icon: Package },
    { title: "Pending Approval", value: stats.pending, icon: ShoppingBag },
  ];

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Dashboard</h1>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {cards.map((card) => (
          <Card key={card.title}>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">
                {card.title}
              </CardTitle>
              <card.icon className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold">{card.value}</p>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
