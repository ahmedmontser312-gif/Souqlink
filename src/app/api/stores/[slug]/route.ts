import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import prisma from "@/lib/prisma";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await params;
    const store = await prisma.store.findUnique({
      where: { slug },
      include: { owner: true },
    });

    if (!store) {
      return NextResponse.json({ error: "Store not found" }, { status: 404 });
    }

    return NextResponse.json(store);
  } catch (error) {
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await params;
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const userId = (session.user as any).id;
    const role = (session.user as any).role;

    const store = await prisma.store.findUnique({ where: { slug } });
    if (!store) {
      return NextResponse.json({ error: "Store not found" }, { status: 404 });
    }

    if (store.ownerId !== userId && role !== "admin") {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const updates = await req.json();
    delete updates.id;
    delete updates.slug;
    delete updates.ownerId;

    const updated = await prisma.store.update({
      where: { slug },
      data: updates,
    });

    return NextResponse.json(updated);
  } catch (error) {
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await params;
    const session = await getServerSession(authOptions);
    if (!session || (session.user as any).role !== "admin") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const existing = await prisma.store.findUnique({ where: { slug } });
    if (!existing) {
      return NextResponse.json({ error: "Store not found" }, { status: 404 });
    }

    const { approved } = await req.json();

    const store = await prisma.store.update({
      where: { slug },
      data: { approved },
    });

    return NextResponse.json(store);
  } catch (error) {
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
