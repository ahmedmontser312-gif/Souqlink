import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import prisma from "@/lib/prisma";

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    if (!session || (session.user as any).role !== "admin") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const [totalMerchants, totalStores, totalProducts, pendingApprovals] =
      await Promise.all([
        prisma.user.count({ where: { role: "merchant" } }),
        prisma.store.count(),
        prisma.product.count(),
        prisma.store.count({ where: { approved: false } }),
      ]);

    return NextResponse.json({
      totalMerchants,
      totalStores,
      totalProducts,
      pendingApprovals,
    });
  } catch (error) {
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
