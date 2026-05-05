import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { getDb } from "@/lib/db";

export const dynamic = "force-dynamic";

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const db = getDb();

  const conversation = await db.conversation.findFirst({
    where: { id, userId: session.user.id },
  });
  if (!conversation) return NextResponse.json({ error: "Not found" }, { status: 404 });

  await db.message.updateMany({
    where: {
      conversationId: id,
      senderId: { not: session.user.id },
      isRead: false,
    },
    data: { isRead: true },
  });

  const messages = await db.message.findMany({
    where: { conversationId: id },
    include: { sender: { select: { id: true, name: true, avatar: true } } },
    orderBy: { createdAt: "asc" },
  });

  return NextResponse.json({ messages });
}

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { text } = await request.json();
  if (!text?.trim()) return NextResponse.json({ error: "Текст порожній" }, { status: 400 });

  const db = getDb();

  const conversation = await db.conversation.findFirst({
    where: { id, userId: session.user.id },
  });
  if (!conversation) return NextResponse.json({ error: "Not found" }, { status: 404 });

  const message = await db.message.create({
    data: {
      conversationId: id,
      senderId: session.user.id,
      text: text.trim(),
    },
    include: { sender: { select: { id: true, name: true } } },
  });

  await db.conversation.update({
    where: { id },
    data: { updatedAt: new Date() },
  });

  return NextResponse.json({ message }, { status: 201 });
}
