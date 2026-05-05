import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { getDb } from "@/lib/db";

export const dynamic = "force-dynamic";

export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session) {
    return NextResponse.json({ error: "Необхідна авторизація" }, { status: 401 });
  }

  const db = getDb();
  const events = await db.event.findMany({
    where: { userId: session.user.id },
    include: {
      bookings: { select: { totalPrice: true, status: true } },
      _count: { select: { guests: true, timeline: true } },
    },
    orderBy: { date: "asc" },
  });

  const result = events.map((ev) => ({
    ...ev,
    spent: ev.bookings
      .filter((b) => b.status !== "CANCELLED")
      .reduce((sum, b) => sum + b.totalPrice, 0),
    bookingsCount: ev.bookings.length,
    guestsCount: ev._count.guests,
    tasksCount: ev._count.timeline,
  }));

  return NextResponse.json({ events: result });
}

export async function POST(request: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session) {
    return NextResponse.json({ error: "Необхідна авторизація" }, { status: 401 });
  }

  const body = await request.json();
  const { title, date, budget, notes } = body;

  if (!title || !date || !budget) {
    return NextResponse.json({ error: "Назва, дата та бюджет обов'язкові" }, { status: 400 });
  }

  const db = getDb();
  const event = await db.event.create({
    data: {
      userId: session.user.id,
      title,
      date: new Date(date),
      budget: Number(budget),
      notes: notes || null,
    },
  });

  return NextResponse.json({ event }, { status: 201 });
}
