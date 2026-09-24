import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { getDb } from "@/lib/db";
import { participantWhere } from "@/lib/conversations";
import { DEMO_BLOCKED_MESSAGE, DEMO_OWNER_SELECT, isDemoVendor } from "@/lib/demo";

export const dynamic = "force-dynamic";

const CATEGORY_LABELS: Record<string, string> = {
  VENUE: "Локація", ENTERTAINMENT: "Розваги", CATERING: "Кейтеринг",
  PHOTO_VIDEO: "Фото/Відео", DECOR: "Декор",
};

// GET /api/conversations — розмови поточного користувача з обох боків:
// як клієнта (з виконавцями) і як виконавця (з клієнтами).
export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const uid = session.user.id;

  const db = getDb();
  const conversations = await db.conversation.findMany({
    where: participantWhere(uid),
    include: {
      vendor: { select: { id: true, userId: true, businessName: true, category: true } },
      user: { select: { id: true, name: true } },
      messages: {
        orderBy: { createdAt: "desc" },
        take: 1,
      },
      _count: { select: { messages: { where: { isRead: false, senderId: { not: uid } } } } },
    },
    orderBy: { updatedAt: "desc" },
  });

  // Співрозмовник — те, що показуємо в списку й шапці чату.
  const result = conversations.map(({ vendor, user, ...c }) => {
    const asVendor = vendor.userId === uid && c.userId !== uid;
    return {
      ...c,
      asVendor,
      peer: asVendor
        ? { name: user.name ?? "Клієнт", subtitle: `Клієнт · ${vendor.businessName}` }
        : { name: vendor.businessName, subtitle: CATEGORY_LABELS[vendor.category] ?? vendor.category },
    };
  });

  return NextResponse.json({ conversations: result });
}

// POST /api/conversations — create or get conversation with a vendor
export async function POST(request: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  let vendorId: unknown;
  try {
    ({ vendorId } = await request.json());
  } catch {
    return NextResponse.json({ error: "Некоректний запит" }, { status: 400 });
  }
  if (typeof vendorId !== "string" || !vendorId) {
    return NextResponse.json({ error: "vendorId required" }, { status: 400 });
  }

  const db = getDb();

  const vendor = await db.vendor.findUnique({
    where: { id: vendorId },
    select: { userId: true, ...DEMO_OWNER_SELECT },
  });
  if (!vendor) return NextResponse.json({ error: "Виконавця не знайдено" }, { status: 404 });
  if (isDemoVendor(vendor)) {
    return NextResponse.json({ error: DEMO_BLOCKED_MESSAGE }, { status: 409 });
  }
  if (vendor.userId === session.user.id) {
    return NextResponse.json({ error: "Це ваш власний профіль виконавця" }, { status: 400 });
  }

  const conversation = await db.conversation.upsert({
    where: { userId_vendorId: { userId: session.user.id, vendorId } },
    update: {},
    create: { userId: session.user.id, vendorId },
    select: { id: true },
  });

  return NextResponse.json({ conversation });
}
