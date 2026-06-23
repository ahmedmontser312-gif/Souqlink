"use client";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { toast } from "@/components/ui/toast";
import { Plus, Trash2 } from "lucide-react";

interface Ad {
  _id: string;
  title: string;
  image: string;
  link: string;
  active: boolean;
}

export default function AdminAds() {
  const [ads, setAds] = useState<Ad[]>([]);
  const [newAd, setNewAd] = useState({ title: "", image: "", link: "" });

  useEffect(() => {
    fetch("/api/ads")
      .then((r) => r.json())
      .then(setAds)
      .catch(console.error);
  }, []);

  const addAd = async () => {
    if (!newAd.image) {
      toast({ title: "Image URL is required" });
      return;
    }
    try {
      const res = await fetch("/api/ads", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newAd),
      });
      if (!res.ok) throw new Error("Failed");
      const ad = await res.json();
      setAds((prev) => [...prev, ad]);
      setNewAd({ title: "", image: "", link: "" });
      toast({ title: "Ad added" });
    } catch {
      toast({ title: "Error", description: "Failed to add ad" });
    }
  };

  const deleteAd = async (id: string) => {
    try {
      const res = await fetch(`/api/ads`, {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id }),
      });
      if (!res.ok) throw new Error("Failed");
      setAds((prev) => prev.filter((a) => a._id !== id));
      toast({ title: "Ad deleted" });
    } catch {
      toast({ title: "Error", description: "Failed to delete ad" });
    }
  };

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Ads Slider</h1>

      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Add New Ad</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <Input
            placeholder="Image URL"
            value={newAd.image}
            onChange={(e) =>
              setNewAd((p) => ({ ...p, image: e.target.value }))
            }
          />
          <Input
            placeholder="Title (optional)"
            value={newAd.title}
            onChange={(e) =>
              setNewAd((p) => ({ ...p, title: e.target.value }))
            }
          />
          <Input
            placeholder="Link (optional)"
            value={newAd.link}
            onChange={(e) => setNewAd((p) => ({ ...p, link: e.target.value }))}
          />
          <Button onClick={addAd}>
            <Plus className="h-4 w-4 mr-1" /> Add Ad
          </Button>
        </CardContent>
      </Card>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {ads.map((ad) => (
          <Card key={ad._id}>
            <CardContent className="p-4">
              <div className="aspect-video rounded overflow-hidden mb-3">
                <img
                  src={ad.image}
                  alt={ad.title}
                  className="object-cover w-full h-full"
                />
              </div>
              <p className="font-medium mb-3">{ad.title || "No title"}</p>
              <Button
                variant="destructive"
                size="sm"
                className="w-full"
                onClick={() => deleteAd(ad._id)}
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
