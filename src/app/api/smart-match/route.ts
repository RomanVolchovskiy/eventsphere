import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  const body = await request.json();
  const { budget, eventType, guestsCount, city, style } = body;

  await new Promise((r) => setTimeout(r, 500));

  const matches = [
    {
      role: "Локація",
      vendor: { id: "1", name: "Crystal Hall", rating: 4.9, priceFrom: 15000, matchScore: 97 },
      reason: "Відповідає бюджету і стилю, 128 весіль — найкращий рейтинг у категорії",
    },
    {
      role: "Ведучий",
      vendor: { id: "2", name: "Артем Мороз", rating: 5.0, priceFrom: 8000, matchScore: 94 },
      reason: "Вже 7 разів працював з Crystal Hall, рейтинг 5.0 — ідеальна синергія",
    },
    {
      role: "Фото/Відео",
      vendor: { id: "4", name: "Студія Lumière", rating: 4.9, priceFrom: 5000, matchScore: 91 },
      reason: "Стиль знімання відповідає вашим уподобанням, знижка 10% при бронюванні пакету",
    },
    {
      role: "Декор",
      vendor: { id: "5", name: "FlowerBox Studio", rating: 4.7, priceFrom: 3000, matchScore: 88 },
      reason: "Спеціалізуються на флористичному стилі, який ви зазначили",
    },
  ];

  const totalEstimate = matches.reduce((sum, m) => sum + m.vendor.priceFrom, 0);

  return NextResponse.json({
    matches,
    totalEstimate,
    budgetOk: totalEstimate <= budget,
    message: `Smart Match підібрав команду з рейтингом ${(matches.reduce((s, m) => s + m.vendor.rating, 0) / matches.length).toFixed(1)} — ідеально для вашого ${eventType}`,
  });
}
