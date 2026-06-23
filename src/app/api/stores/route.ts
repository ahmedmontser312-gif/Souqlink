import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import prisma from "@/lib/prisma";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const slug = searchParams.get("slug");
    const owner = searchParams.get("owner");
    const approved = searchParams.get("approved");

    if (slug) {
      const store = await prisma.store.findUnique({
        where: { slug },
        include: { owner: true },
      });
      if (!store) {
        return NextResponse.json({ error: "Store not found" }, { status: 404 });
      }
      return NextResponse.json(store);
    }

    if (owner) {
      const stores = await prisma.store.findMany({
        where: { ownerId: owner },
        include: { owner: true },
      });
      return NextResponse.json(stores);
    }

    if (approved === "true") {
      const stores = await prisma.store.findMany({
        where: { approved: true },
        include: { owner: true },
      });
      return NextResponse.json(stores);
    }

    const session = await getServerSession(authOptions);
    if (!session || (session.user as any).role !== "admin") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const stores = await prisma.store.findMany({
      include: { owner: true },
    });
    return NextResponse.json(stores);
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

    const { name, slug, description, logo, whatsappNumber } = await req.json();

    if (!name || !slug) {
      return NextResponse.json(
        { error: "Name and slug are required" },
        { status: 400 }
      );
    }

    const existing = await prisma.store.findUnique({ where: { slug } });
    if (existing) {
      return NextResponse.json(
        { error: "Slug already in use" },
        { status: 409 }
      );
    }

    const store = await prisma.store.create({
      data: {
        name,
        slug,
        description,
        logo,
        whatsappNumber,
        ownerId: userId,
      },
    });

    return NextResponse.json(store, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
