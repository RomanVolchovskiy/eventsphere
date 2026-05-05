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
  const session = await getServerSession(authOptions);
  if (!session) {
    return NextResponse.json({ error: "Необхідна авторизація" }, { status: 401 });
  }

  const body = await request.json();
  const { vendorId, serviceId, eventId, date, notes, totalPrice, guests } = body;

  if (!vendorId || !date || !totalPrice) {
    return NextResponse.json(
      { error: "Обов'язкові поля: vendorId, date, totalPrice" },
      { status: 400 }
    );
  }

  const db = getDb();

  const vendor = await db.vendor.findUnique({ where: { id: vendorId } });
  if (!vendor) {
    return NextResponse.json({ error: "Виконавця не знайдено" }, { status: 404 });
  }

  const booking = await db.booking.create({
    data: {
      userId: session.user.id,
      vendorId,
      serviceId: serviceId || null,
      eventId: eventId || null,
      date: new Date(date),
      notes: notes || null,
      totalPrice: Number(totalPrice),
      status: "PENDING",
    },
    include: {
      vendor: { select: { businessName: true } },
      service: { select: { name: true } },
    },
  });

  return NextResponse.json({ booking, message: "Запит надіслано успішно" }, { status: 201 });
}
