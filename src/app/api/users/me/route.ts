import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { getDb } from "@/lib/db";

export const dynamic = "force-dynamic";

const USER_SELECT = {
  id: true,
  email: true,
  name: true,
  phone: true,
  avatar: true,
  role: true,
  createdAt: true,
} as const;

const VENDOR_SELECT = {
  id: true,
  businessName: true,
  description: true,
  category: true,
  city: true,
  photos: true,
  priceFrom: true,
  priceTo: true,
  isVerified: true,
  rating: true,
  reviewsCount: true,
  subscription: true,
} as const;

/** Зведення персональної сторінки: користувач + обидві ролі + лічильники. */
export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session) {
    return NextResponse.json({ error: "Необхідна авторизація" }, { status: 401 });
  }
  const uid = session.user.id;

  try {
    const db = getDb();
    const [user, vendor, eventsCount, bookingsCount, unreadMessages] = await Promise.all([
      db.user.findUnique({ where: { id: uid }, select: USER_SELECT }),
      db.vendor.findUnique({ where: { userId: uid }, select: VENDOR_SELECT }),
      db.event.count({ where: { userId: uid } }),
      db.booking.count({ where: { userId: uid } }),
      db.message.count({
        where: {
          isRead: false,
          senderId: { not: uid },
          conversation: { OR: [{ userId: uid }, { vendor: { userId: uid } }] },
        },
      }),
    ]);

    if (!user) {
      return NextResponse.json({ error: "Користувача не знайдено" }, { status: 404 });
    }

    // Замовлення клієнтів рахуємо лише коли є профіль виконавця.
    const vendorOrders = vendor
      ? await db.booking.count({ where: { vendorId: vendor.id } })
      : 0;

    return NextResponse.json({
      user,
      vendor,
      stats: { events: eventsCount, bookings: bookingsCount, vendorOrders, unreadMessages },
    });
  } catch (error) {
    console.error("GET /api/users/me error:", error);
    return NextResponse.json({ error: "Помилка сервера" }, { status: 500 });
  }
}

/** Оновлення особистих даних. Email і роль звідси не змінюються. */
export async function PATCH(request: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session) {
    return NextResponse.json({ error: "Необхідна авторизація" }, { status: 401 });
  }

  let body: Record<string, unknown>;
  try {
    body = (await request.json()) as Record<string, unknown>;
  } catch {
    return NextResponse.json({ error: "Некоректний запит" }, { status: 400 });
  }

  const name = typeof body.name === "string" ? body.name.trim() : "";
  if (!name) {
    return NextResponse.json({ error: "Вкажіть ім'я" }, { status: 400 });
  }

  const phone =
    typeof body.phone === "string" && body.phone.trim() ? body.phone.trim().slice(0, 30) : null;
  const avatar =
    typeof body.avatar === "string" && body.avatar.trim()
      ? body.avatar.trim().slice(0, 500)
      : null;

  try {
    const db = getDb();
    const user = await db.user.update({
      where: { id: session.user.id },
      data: { name: name.slice(0, 120), phone, avatar },
      select: USER_SELECT,
    });
    return NextResponse.json({ user });
  } catch (error) {
    console.error("PATCH /api/users/me error:", error);
    return NextResponse.json({ error: "Помилка сервера" }, { status: 500 });
  }
}
