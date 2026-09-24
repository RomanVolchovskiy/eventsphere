import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { getDb } from "@/lib/db";
import { stripe } from "@/lib/stripe";
import { rateLimit } from "@/lib/ratelimit";
import { DEMO_BLOCKED_MESSAGE, DEMO_OWNER_SELECT, isDemoVendor } from "@/lib/demo";

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

  let body: Record<string, unknown>;
  try {
    body = (await request.json()) as Record<string, unknown>;
  } catch {
    return NextResponse.json({ error: "Некоректний запит" }, { status: 400 });
  }
  const { vendorId, notes, eventType } = body;
  const date = typeof body.date === "string" ? new Date(body.date) : null;
  const totalPrice = Number(body.totalPrice);

  if (typeof vendorId !== "string" || !vendorId || !date || Number.isNaN(date.getTime())) {
    return NextResponse.json({ error: "Не вистачає даних" }, { status: 400 });
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
  if (vendor.userId === session.user.id) {
    return NextResponse.json({ error: "Не можна забронювати власні послуги" }, { status: 400 });
  }

  // Free-access mode (default). Поки платежі недоступні (Stripe не працює в Україні),
  // бронювання підтверджується одразу без оплати. Щоб увімкнути платний checkout —
  // виставити NEXT_PUBLIC_PAYMENTS_ENABLED=true у Vercel.
  const paymentsEnabled = process.env.NEXT_PUBLIC_PAYMENTS_ENABLED === "true";

  // Бронювання завжди стартує як PENDING: у вільному режимі його підтверджує
  // виконавець у своєму кабінеті (/api/vendors/me/bookings/[id]), у платному —
  // вебхук Stripe після оплати.
  const booking = await db.booking.create({
    data: {
      userId: session.user.id,
      vendorId,
      date,
      notes: typeof notes === "string" && notes.trim() ? notes.trim().slice(0, 2000) : null,
      totalPrice,
      status: "PENDING",
    },
  });

  // Always derive baseUrl from env — never hardcode
  const baseUrl =
    process.env.NEXTAUTH_URL ??
    `https://${request.headers.get("host")}`;

  if (!paymentsEnabled) {
    return NextResponse.json({
      url: `${baseUrl}/payment/success?bookingId=${booking.id}&free=1`,
      bookingId: booking.id,
    });
  }

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
              typeof eventType === "string" ? eventType : null,
              date.toLocaleDateString("uk-UA", {
                day: "numeric",
                month: "long",
                year: "numeric",
              }),
            ]
              .filter(Boolean)
              .join(" · "),
          },
          unit_amount: Math.round(totalPrice * 100),
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
