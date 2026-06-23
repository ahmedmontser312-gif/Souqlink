import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

const PRODUCT_CATEGORIES = ["Clothes", "Electronics", "Accessories", "Home", "Beauty", "Sports"];
const PRODUCTS_PER_CATEGORY = 20;

export async function GET() {
  try {
    const approvedStoreFilter = { store: { approved: true } };

    const [heroSlides, ads, ...categoryResults] = await Promise.all([
      prisma.slider.findMany({
        where: { active: true, type: "hero" },
        orderBy: { order: "asc" },
      }),
      prisma.slider.findMany({
        where: { active: true, type: "ad" },
        orderBy: { order: "asc" },
      }),
      ...PRODUCT_CATEGORIES.map((category) =>
        prisma.product.findMany({
          where: { category, ...approvedStoreFilter },
          include: { store: true, images: true },
          orderBy: { createdAt: "desc" },
          take: PRODUCTS_PER_CATEGORY,
        })
      ),
    ]);

    const categories: Record<string, unknown[]> = {};
    PRODUCT_CATEGORIES.forEach((cat, i) => {
      categories[cat] = categoryResults[i].map((p) => ({
        ...p,
        images: p.images.map((img) => img.url),
      }));
    });

    return NextResponse.json({ heroSlides, ads, categories });
  } catch (error) {
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
