import { NextRequest, NextResponse } from "next/server";
import { getDb } from "@/lib/db";
import { isEventCategory } from "@/lib/categories";
import { DEMO_OWNER_SELECT, isDemoVendor, neutralizeDemo } from "@/lib/demo";

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
  const categoryEnum = category && category !== "all" ? category.toUpperCase() : null;
  if (categoryEnum && !isEventCategory(categoryEnum)) {
    return NextResponse.json({ error: "Невідома категорія" }, { status: 400 });
  }

  const db = getDb();

  const vendors = await db.vendor.findMany({
    where: {
      ...(categoryEnum && isEventCategory(categoryEnum) ? { category: categoryEnum } : {}),
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
    include: DEMO_OWNER_SELECT,
    orderBy: [{ rating: "desc" }, { reviewsCount: "desc" }],
    take: 50,
  });

  // userId і email власника назовні не віддаємо.
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const result = vendors.map(({ user, userId, ...v }) => ({
    ...neutralizeDemo(v, isDemoVendor({ user })),
    tags: tagsByCategory[v.category] ?? [],
  })).sort((a, b) => Number(a.isDemo) - Number(b.isDemo));

  return NextResponse.json({ vendors: result, total: result.length });
}
