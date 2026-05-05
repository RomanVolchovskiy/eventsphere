import { NextRequest, NextResponse } from "next/server";
import { getDb } from "@/lib/db";
import type { EventCategory } from "@/generated/prisma/enums";

export const dynamic = "force-dynamic";

const tagsByCategory: Record<string, string[]> = {
  VENUE: ["Весілля", "Корпоратив", "Банкет"],
  ENTERTAINMENT: ["Ведучий", "DJ", "Музика"],
  CATERING: ["Фуршет", "Банкет", "Кейтеринг"],
  PHOTO_VIDEO: ["Фотозйомка", "Відеозйомка", "360°"],
  DECOR: ["Квіти", "Декор", "Оформлення"],
};

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const category = searchParams.get("category");
  const city = searchParams.get("city");
  const q = searchParams.get("q");

  const db = getDb();

  const vendors = await db.vendor.findMany({
    where: {
      ...(category && category !== "all"
        ? { category: category.toUpperCase() as EventCategory }
        : {}),
      ...(city ? { city: { contains: city, mode: "insensitive" } } : {}),
      ...(q
        ? {
            OR: [
              { businessName: { contains: q, mode: "insensitive" } },
              { description: { contains: q, mode: "insensitive" } },
              { city: { contains: q, mode: "insensitive" } },
            ],
          }
        : {}),
    },
    orderBy: [{ rating: "desc" }, { reviewsCount: "desc" }],
    take: 50,
  });

  const result = vendors.map((v) => ({
    ...v,
    tags: tagsByCategory[v.category] ?? [],
  }));

  return NextResponse.json({ vendors: result, total: result.length });
}
