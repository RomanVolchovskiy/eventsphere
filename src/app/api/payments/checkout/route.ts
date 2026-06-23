import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { getDb } from "@/lib/db";
import { stripe } from "@/lib/stripe";
import { rateLimit, getClientIp } from "@/lib/ratelimit";

export async function POST(request: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session) {
    return NextResponse.json({ error: "Необхідна авторизація" }, { status: 401 });
  }

  // Rate limit: 10 checkout attempts per user per hour
  const rl = rateLimit(`checkout:${session.user.id}`, 10, 60 * 60 * 1000);

  if (!rl.success) {
    return NextResponse.json(
      { error: "Забагато спроб оплати. Спробуйте через годину." },
      {
        status: 429,
        headers: {
          "Retry-After": String(Math.ceil((rl.resetAt - Date.now()) / 1000)),
        },
      }
    );
  }

  const body = await request.json();
  const { vendorId, date, notes, totalPrice, eventType } = body;

  if (!vendorId || !date || !totalPrice) {
    return NextResponse.json({ error: "Не вистачає даних" }, { status: 400 });
  }

  const db = getDb();

  const vendor = await db.vendor.findUnique({ where: { id: vendorId } });
  if (!vendor) {
    return NextResponse.json({ error: "Виконавця не знайдено" }, { status: 404 });
  }

  // Create booking first (PENDING)
  const booking = await db.booking.create({
    data: {
      userId: session.user.id,
      vendorId,
      date: new Date(date),
      notes: notes || null,
      totalPrice: Number(totalPrice),
      status: "PENDING",
    },
  });

  // Always derive baseUrl from env — never hardcode
  const baseUrl =
    process.env.NEXTAUTH_URL ??
    `https://${request.headers.get("host")}`;

  // Create Stripe Checkout session
  const checkoutSession = await stripe.checkout.sessions.create({
    payment_method_types: ["card"],
    mode: "payment",
    line_items: [
      {
        price_data: {
          currency: "uah",
          product_data: {
            name: `Бронювання: ${vendor.businessName}`,
            description: [
              eventType,
              new Date(date).toLocaleDateString("uk-UA", {
                day: "numeric",
                month: "long",
                year: "numeric",
              }),
            ]
              .filter(Boolean)
              .join(" · "),
          },
          unit_amount: Math.round(Number(totalPrice) * 100),
        },
        quantity: 1,
      },
    ],
    metadata: {
      bookingId: booking.id,
      userId: session.user.id,
    },
    success_url: `${baseUrl}/payment/success?bookingId=${booking.id}&session_id={CHECKOUT_SESSION_ID}`,
    cancel_url: `${baseUrl}/payment/cancel?bookingId=${booking.id}`,
  });

  return NextResponse.json({ url: checkoutSession.url, bookingId: booking.id });
}
