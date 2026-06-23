import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import prisma from "@/lib/prisma";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const product = await prisma.product.findUnique({
      where: { id },
      include: { store: true, images: true },
    });

    if (!product) {
      return NextResponse.json({ error: "Product not found" }, { status: 404 });
    }

    return NextResponse.json({
      ...product,
      images: product.images.map((i) => i.url),
    });
  } catch (error) {
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const userId = (session.user as any).id;
    const role = (session.user as any).role;

    const product = await prisma.product.findUnique({ where: { id } });
    if (!product) {
      return NextResponse.json({ error: "Product not found" }, { status: 404 });
    }

    const store = await prisma.store.findUnique({ where: { id: product.storeId } });
    if (!store) {
      return NextResponse.json({ error: "Store not found" }, { status: 404 });
    }

    if (store.ownerId !== userId && role !== "admin") {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const updates = await req.json();
    const { images, ...fields } = updates;
    delete fields.id;
    delete fields.storeId;

    const data: Record<string, unknown> = { ...fields };
    if (data.price !== undefined) {
      data.price = parseFloat(data.price as string);
    }

    if (images) {
      await prisma.productImage.deleteMany({ where: { productId: id } });
      data.images = {
        create: (images as string[]).map((url: string) => ({ url })),
      };
    }

    const updated = await prisma.product.update({
      where: { id },
      data,
      include: { images: true },
    });

    return NextResponse.json({
      ...updated,
      images: updated.images.map((i) => i.url),
    });
  } catch (error) {
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const userId = (session.user as any).id;
    const role = (session.user as any).role;

    const product = await prisma.product.findUnique({ where: { id } });
    if (!product) {
      return NextResponse.json({ error: "Product not found" }, { status: 404 });
    }

    const store = await prisma.store.findUnique({ where: { id: product.storeId } });
    if (!store) {
      return NextResponse.json({ error: "Store not found" }, { status: 404 });
    }

    if (store.ownerId !== userId && role !== "admin") {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    await prisma.product.delete({ where: { id } });

    return NextResponse.json({ message: "Product deleted" });
  } catch (error) {
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
