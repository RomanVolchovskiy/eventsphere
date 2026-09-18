import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { getDb } from "@/lib/db";

export const dynamic = "force-dynamic";

// Дозволені переходи статусів з боку виконавця.
const TRANSITIONS: Record<string, string[]> = {
  PENDING: ["CONFIRMED", "CANCELLED"],
  CONFIRMED: ["COMPLETED", "CANCELLED"],
};

/** Виконавець підтверджує, відхиляє або завершує замовлення на себе. */
export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const session = await getServerSession(authOptions);
  if (!session) {
    return NextResponse.json({ error: "Необхідна авторизація" }, { status: 401 });
  }

  let body: { status?: unknown };
  try {
    body = (await request.json()) as { status?: unknown };
  } catch {
    return NextResponse.json({ error: "Некоректний запит" }, { status: 400 });
  }
  const nextStatus = typeof body.status === "string" ? body.status : "";

  try {
    const db = getDb();
    const booking = await db.booking.findFirst({
      where: { id, vendor: { userId: session.user.id } },
      select: { id: true, status: true },
    });
    if (!booking) {
      return NextResponse.json({ error: "Замовлення не знайдено" }, { status: 404 });
    }

    if (!TRANSITIONS[booking.status]?.includes(nextStatus)) {
      return NextResponse.json(
        { error: `Зі статусу «${booking.status}» не можна перейти в «${nextStatus}»` },
        { status: 400 },
      );
    }

    const updated = await db.booking.update({
      where: { id: booking.id },
      data: { status: nextStatus as "CONFIRMED" | "CANCELLED" | "COMPLETED" },
      include: {
        user: { select: { id: true, name: true, phone: true, avatar: true } },
        service: { select: { name: true } },
      },
    });

    return NextResponse.json({ booking: updated });
  } catch (error) {
    console.error("PATCH /api/vendors/me/bookings/[id] error:", error);
    return NextResponse.json({ error: "Помилка сервера" }, { status: 500 });
  }
}
