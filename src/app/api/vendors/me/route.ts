import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { getDb } from "@/lib/db";
import { isEventCategory } from "@/lib/categories";

export const dynamic = "force-dynamic";

/** Профіль виконавця, який належить поточному користувачу. */
const SELECT = {
  id: true,
  businessName: true,
  description: true,
  category: true,
  city: true,
  address: true,
  website: true,
  instagram: true,
  tiktok: true,
  photos: true,
  priceFrom: true,
  priceTo: true,
  isVerified: true,
  rating: true,
  reviewsCount: true,
} as const;

async function getOwnVendor(userId: string) {
  const db = getDb();
  return db.vendor.findUnique({ where: { userId }, select: SELECT });
}

export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session) {
    return NextResponse.json({ error: "Необхідна авторизація" }, { status: 401 });
  }

  try {
    const vendor = await getOwnVendor(session.user.id);
    if (!vendor) {
      return NextResponse.json({ error: "Профіль виконавця не знайдено" }, { status: 404 });
    }
    return NextResponse.json({ vendor });
  } catch (error) {
    console.error("GET /api/vendors/me error:", error);
    return NextResponse.json({ error: "Помилка сервера" }, { status: 500 });
  }
}

const MAX_PHOTOS = 10;
const PRICE_MAX = 10_000_000;

/** Порожній рядок з форми означає «не вказано» -> null у БД. */
function optionalText(value: unknown, maxLen: number): string | null | undefined {
  if (value === undefined) return undefined;
  if (typeof value !== "string") return undefined;
  const trimmed = value.trim();
  if (!trimmed) return null;
  return trimmed.slice(0, maxLen);
}

function parsePrice(value: unknown): number | null | undefined {
  if (value === undefined || value === "" || value === null) return null;
  const n = Number(value);
  if (!Number.isFinite(n) || n < 0 || n > PRICE_MAX) return undefined;
  return n;
}

export async function PUT(request: NextRequest) {
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

  const businessName = typeof body.businessName === "string" ? body.businessName.trim() : "";
  if (!businessName) {
    return NextResponse.json({ error: "Вкажіть назву бізнесу" }, { status: 400 });
  }
  if (!isEventCategory(body.category)) {
    return NextResponse.json({ error: "Оберіть напрям роботи" }, { status: 400 });
  }
  const city = typeof body.city === "string" ? body.city.trim() : "";
  if (!city) {
    return NextResponse.json({ error: "Вкажіть місто" }, { status: 400 });
  }

  const priceFrom = parsePrice(body.priceFrom);
  const priceTo = parsePrice(body.priceTo);
  if (priceFrom === undefined || priceTo === undefined) {
    return NextResponse.json({ error: "Ціна вказана некоректно" }, { status: 400 });
  }
  if (priceFrom !== null && priceTo !== null && priceTo < priceFrom) {
    return NextResponse.json(
      { error: "Ціна «до» не може бути меншою за ціну «від»" },
      { status: 400 },
    );
  }

  const photos = Array.isArray(body.photos)
    ? body.photos
        .filter((p): p is string => typeof p === "string" && p.trim().length > 0)
        .map((p) => p.trim())
        .slice(0, MAX_PHOTOS)
    : undefined;

  try {
    const db = getDb();
    const existing = await db.vendor.findUnique({
      where: { userId: session.user.id },
      select: { id: true },
    });
    if (!existing) {
      return NextResponse.json({ error: "Профіль виконавця не знайдено" }, { status: 404 });
    }

    // Оновлюємо лише поля профілю. rating, reviewsCount, isVerified і
    // subscription сюди свідомо не потрапляють — їх виконавець собі не ставить.
    const vendor = await db.vendor.update({
      where: { userId: session.user.id },
      data: {
        businessName: businessName.slice(0, 120),
        category: body.category,
        city: city.slice(0, 80),
        description: optionalText(body.description, 2000),
        address: optionalText(body.address, 200),
        website: optionalText(body.website, 200),
        instagram: optionalText(body.instagram, 100),
        tiktok: optionalText(body.tiktok, 100),
        priceFrom,
        priceTo,
        ...(photos ? { photos } : {}),
      },
      select: SELECT,
    });

    return NextResponse.json({ vendor });
  } catch (error) {
    console.error("PUT /api/vendors/me error:", error);
    return NextResponse.json({ error: "Помилка сервера" }, { status: 500 });
  }
}
