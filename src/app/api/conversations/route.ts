import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { getDb } from "@/lib/db";

export const dynamic = "force-dynamic";

// GET /api/conversations — list all conversations for current user
export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const db = getDb();
  const conversations = await db.conversation.findMany({
    where: { userId: session.user.id },
    include: {
      vendor: { select: { id: true, businessName: true, category: true, photos: true } },
      messages: {
        orderBy: { createdAt: "desc" },
        take: 1,
      },
      _count: { select: { messages: { where: { isRead: false, senderId: { not: session.user.id } } } } },
    },
    orderBy: { updatedAt: "desc" },
  });

  return NextResponse.json({ conversations });
}

// POST /api/conversations — create or get conversation with a vendor
export async function POST(request: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { vendorId } = await request.json();
  if (!vendorId) return NextResponse.json({ error: "vendorId required" }, { status: 400 });

  const db = getDb();

  const conversation = await db.conversation.upsert({
    where: { userId_vendorId: { userId: session.user.id, vendorId } },
    update: {},
    create: { userId: session.user.id, vendorId },
    include: {
      vendor: { select: { id: true, businessName: true, category: true } },
    },
  });

  return NextResponse.json({ conversation });
}
