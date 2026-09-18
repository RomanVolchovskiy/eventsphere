import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { getDb } from "@/lib/db";

export const dynamic = "force-dynamic";

/** Замовлення, що прийшли на профіль виконавця поточного користувача. */
export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session) {
    return NextResponse.json({ error: "Необхідна авторизація" }, { status: 401 });
  }

  try {
    const db = getDb();
    const vendor = await db.vendor.findUnique({
      where: { userId: session.user.id },
      select: { id: true },
    });
    if (!vendor) {
      return NextResponse.json({ error: "Профіль виконавця не знайдено" }, { status: 404 });
    }

    const bookings = await db.booking.findMany({
      where: { vendorId: vendor.id },
      include: {
        user: { select: { id: true, name: true, phone: true, avatar: true } },
        service: { select: { name: true } },
      },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json({ bookings });
  } catch (error) {
    console.error("GET /api/vendors/me/bookings error:", error);
    return NextResponse.json({ error: "Помилка сервера" }, { status: 500 });
  }
}
