import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import prisma from "@/lib/prisma";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const store = searchParams.get("store");
    const category = searchParams.get("category");
    const featured = searchParams.get("featured");

    if (featured === "true") {
      const products = await prisma.product.findMany({
        where: { featured: true },
        include: { store: true, images: true },
        take: 5,
      });
      return NextResponse.json(
        products.map((p) => ({ ...p, images: p.images.map((i) => i.url) }))
      );
    }

    const filter: Record<string, unknown> = {};
    if (store) filter.storeId = store;
    if (category) filter.category = category;

    const products = await prisma.product.findMany({
      where: filter,
      include: { store: true, images: true },
      orderBy: { createdAt: "desc" },
      take: 50,
    });

    return NextResponse.json(
      products.map((p) => ({ ...p, images: p.images.map((i) => i.url) }))
    );
  } catch (error) {
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const userId = (session.user as any).id;

    const store = await prisma.store.findUnique({ where: { ownerId: userId } });
    if (!store) {
      return NextResponse.json({ error: "No store found" }, { status: 404 });
    }

    const { name, price, description, images, category, whatsappNumber } =
      await req.json();

    if (!name || price === undefined) {
      return NextResponse.json(
        { error: "Name and price are required" },
        { status: 400 }
      );
    }

    const slug = name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-|-$/g, "");

    const product = await prisma.product.create({
      data: {
        name,
        slug,
        price: parseFloat(price),
        description,
        category: category || "General",
        whatsappNumber: whatsappNumber || store.whatsappNumber,
        storeId: store.id,
        storeName: store.name,
        images: {
          create: (images || []).map((url: string) => ({ url })),
        },
      },
      include: { images: true },
    });

    return NextResponse.json(
      { ...product, images: product.images.map((i) => i.url) },
      { status: 201 }
    );
  } catch (error) {
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
