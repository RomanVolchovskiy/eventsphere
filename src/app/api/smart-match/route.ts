import { NextRequest, NextResponse } from "next/server";
import { getDb } from "@/lib/db";
import { rateLimit, getClientIp } from "@/lib/ratelimit";
import { buildMatches, type MatchCandidate, type MatchInput } from "@/lib/match";

export const dynamic = "force-dynamic";

const EVENT_TYPES = ["Весілля", "Корпоратив", "День народження", "Ювілей", "Випускний", "Презентація"];
const STYLES = ["Класичний", "Мінімалізм", "Бохо", "Гламур", "Рустик", "Модерн"];

const GUESTS_MIN = 10;
const GUESTS_MAX = 500;
const BUDGET_MIN = 10_000;
const BUDGET_MAX = 500_000;

/** Скільки виконавців тягнемо з БД на підбір — далі скоринг іде в пам'яті. */
const CANDIDATE_LIMIT = 200;

function parseInput(body: unknown): { input: MatchInput } | { error: string } {
  if (typeof body !== "object" || body === null) {
    return { error: "Некоректний запит" };
  }
  const raw = body as Record<string, unknown>;

  const eventType = typeof raw.eventType === "string" ? raw.eventType.trim() : "";
  const style = typeof raw.style === "string" ? raw.style.trim() : "";
  const city = typeof raw.city === "string" ? raw.city.trim() : "";
  const guestsCount = Number(raw.guestsCount);
  const budget = Number(raw.budget);

  if (!EVENT_TYPES.includes(eventType)) {
    return { error: "Оберіть тип заходу зі списку" };
  }
  if (style && !STYLES.includes(style)) {
    return { error: "Оберіть стиль зі списку" };
  }
  if (!city) {
    return { error: "Вкажіть місто проведення" };
  }
  if (!Number.isFinite(guestsCount) || guestsCount < GUESTS_MIN || guestsCount > GUESTS_MAX) {
    return { error: `Кількість гостей має бути від ${GUESTS_MIN} до ${GUESTS_MAX}` };
  }
  if (!Number.isFinite(budget) || budget < BUDGET_MIN || budget > BUDGET_MAX) {
    return { error: `Бюджет має бути від ${BUDGET_MIN.toLocaleString("uk-UA")} до ${BUDGET_MAX.toLocaleString("uk-UA")} ₴` };
  }

  return {
    input: {
      eventType,
      style,
      city,
      guestsCount: Math.round(guestsCount),
      budget: Math.round(budget),
    },
  };
}

export async function POST(request: NextRequest) {
  // Ендпоінт публічний і б'є в БД — обмежуємо за IP.
  const rl = rateLimit(`smart-match:${getClientIp(request)}`, 30, 10 * 60 * 1000);
  if (!rl.success) {
    return NextResponse.json(
      { error: "Забагато запитів. Спробуйте за кілька хвилин." },
      {
        status: 429,
        headers: { "Retry-After": String(Math.ceil((rl.resetAt - Date.now()) / 1000)) },
      },
    );
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Некоректний JSON" }, { status: 400 });
  }

  const parsed = parseInput(body);
  if ("error" in parsed) {
    return NextResponse.json({ error: parsed.error }, { status: 400 });
  }
  const { input } = parsed;

  let candidates: MatchCandidate[];
  try {
    const db = getDb();
    // Місто не фільтруємо в SQL: якщо в місті користувача виконавця під роль
    // немає, краще запропонувати виїзний варіант зі зниженим збігом, ніж нічого.
    candidates = await db.vendor.findMany({
      // Та сама умова, що й у каталозі: незаповнений профіль не пропонуємо.
      where: { city: { not: "" }, description: { not: null } },
      select: {
        id: true,
        businessName: true,
        description: true,
        category: true,
        city: true,
        priceFrom: true,
        subscription: true,
        isVerified: true,
        rating: true,
        reviewsCount: true,
      },
      orderBy: [{ rating: "desc" }, { reviewsCount: "desc" }],
      take: CANDIDATE_LIMIT,
    });
  } catch (error) {
    console.error("smart-match: помилка доступу до БД", error);
    return NextResponse.json(
      { error: "Каталог тимчасово недоступний. Спробуйте пізніше." },
      { status: 503 },
    );
  }

  return NextResponse.json(buildMatches(candidates, input));
}
