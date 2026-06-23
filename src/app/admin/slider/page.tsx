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
import { Plus, Trash2, GripVertical } from "lucide-react";

interface Slide {
  _id: string;
  title: string;
  description: string;
  image: string;
  link: string;
  order: number;
  active: boolean;
}

export default function AdminSlider() {
  const [slides, setSlides] = useState<Slide[]>([]);
  const [newSlide, setNewSlide] = useState({
    title: "",
    description: "",
    image: "",
    link: "",
  });

  useEffect(() => {
    fetch("/api/slider?type=hero")
      .then((r) => r.json())
      .then(setSlides)
      .catch(console.error);
  }, []);

  const addSlide = async () => {
    if (!newSlide.image) {
      toast({ title: "Image URL is required" });
      return;
    }
    try {
      const res = await fetch("/api/slider", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...newSlide, type: "hero", order: slides.length }),
      });
      if (!res.ok) throw new Error("Failed");
      const slide = await res.json();
      setSlides((prev) => [...prev, slide]);
      setNewSlide({ title: "", description: "", image: "", link: "" });
      toast({ title: "Slide added" });
    } catch {
      toast({ title: "Error", description: "Failed to add slide" });
    }
  };

  const deleteSlide = async (id: string) => {
    try {
      const res = await fetch(`/api/slider`, {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id }),
      });
      if (!res.ok) throw new Error("Failed");
      setSlides((prev) => prev.filter((s) => s._id !== id));
      toast({ title: "Slide deleted" });
    } catch {
      toast({ title: "Error", description: "Failed to delete slide" });
    }
  };

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Hero Slider</h1>

      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Add New Slide</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <Input
            placeholder="Image URL"
            value={newSlide.image}
            onChange={(e) =>
              setNewSlide((p) => ({ ...p, image: e.target.value }))
            }
          />
          <Input
            placeholder="Title (optional)"
            value={newSlide.title}
            onChange={(e) =>
              setNewSlide((p) => ({ ...p, title: e.target.value }))
            }
          />
          <Input
            placeholder="Description (optional)"
            value={newSlide.description}
            onChange={(e) =>
              setNewSlide((p) => ({ ...p, description: e.target.value }))
            }
          />
          <Input
            placeholder="Link (optional)"
            value={newSlide.link}
            onChange={(e) =>
              setNewSlide((p) => ({ ...p, link: e.target.value }))
            }
          />
          <Button onClick={addSlide}>
            <Plus className="h-4 w-4 mr-1" /> Add Slide
          </Button>
        </CardContent>
      </Card>

      <div className="space-y-3">
        {slides.map((slide) => (
          <Card key={slide._id}>
            <CardContent className="flex items-center gap-4 p-4">
              <GripVertical className="h-5 w-5 text-muted-foreground" />
              <div className="w-20 h-20 rounded overflow-hidden flex-shrink-0">
                <img
                  src={slide.image}
                  alt=""
                  className="object-cover w-full h-full"
                />
              </div>
              <div className="flex-1">
                <p className="font-medium">{slide.title || "No title"}</p>
                <p className="text-sm text-muted-foreground">
                  {slide.description || "No description"}
                </p>
              </div>
              <Button
                variant="destructive"
                size="sm"
                onClick={() => deleteSlide(slide._id)}
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
