import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { getDb } from "@/lib/db";
import { DEMO_BLOCKED_MESSAGE, DEMO_OWNER_SELECT, isDemoVendor } from "@/lib/demo";

export const dynamic = "force-dynamic";

export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session) {
    return NextResponse.json({ error: "Необхідна авторизація" }, { status: 401 });
  }

  const db = getDb();
  const bookings = await db.booking.findMany({
    where: { userId: session.user.id },
    include: {
      vendor: { select: { businessName: true, category: true, city: true } },
      service: { select: { name: true } },
    },
    orderBy: { createdAt: "desc" },
  });

  return NextResponse.json({ bookings });
}

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: "Необхідна авторизація" }, { status: 401 });
    }

    const body = await request.json();
    const { vendorId, serviceId, eventId, notes } = body;
    const date = typeof body.date === "string" ? new Date(body.date) : null;
    const totalPrice = Number(body.totalPrice);

    if (!vendorId || !date || Number.isNaN(date.getTime()) || !body.totalPrice) {
      return NextResponse.json(
        { error: "Обов'язкові поля: vendorId, date, totalPrice" },
        { status: 400 }
      );
    }
    if (!Number.isFinite(totalPrice) || totalPrice < 0 || totalPrice > 10_000_000) {
      return NextResponse.json({ error: "Некоректна сума" }, { status: 400 });
    }

    const db = getDb();

    const vendor = await db.vendor.findUnique({
      where: { id: vendorId },
      include: DEMO_OWNER_SELECT,
    });
    if (!vendor) {
      return NextResponse.json({ error: "Виконавця не знайдено" }, { status: 404 });
    }
    if (isDemoVendor(vendor)) {
      return NextResponse.json({ error: DEMO_BLOCKED_MESSAGE }, { status: 409 });
    }

    // Прив'язати бронювання можна лише до власного заходу — інакше воно
    // з'явилося б у чужому планувальнику й бюджеті.
    if (eventId) {
      const ownEvent = await db.event.findFirst({
        where: { id: eventId, userId: session.user.id },
        select: { id: true },
      });
      if (!ownEvent) {
        return NextResponse.json({ error: "Захід не знайдено" }, { status: 404 });
      }
    }

    const booking = await db.booking.create({
      data: {
        userId: session.user.id,
        vendorId,
        serviceId: serviceId || null,
        eventId: eventId || null,
        date,
        notes: notes || null,
        totalPrice,
        status: "PENDING",
      },
      include: {
        vendor: { select: { businessName: true } },
        service: { select: { name: true } },
      },
    });

    return NextResponse.json({ booking, message: "Запит надіслано успішно" }, { status: 201 });
  } catch (error) {
    console.error("POST /api/bookings error:", error);
    return NextResponse.json({ error: "Помилка сервера" }, { status: 500 });
  }
}
