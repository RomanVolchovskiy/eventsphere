import type { EventCategory, SubscriptionTier } from "@/generated/prisma/enums";

/**
 * Движок Smart Match.
 *
 * Логіка навмисно тримається тут, а не в route handler: це чисті функції без
 * доступу до БД, тож їх легко перевіряти й переносити (web + mobile через API).
 */

export const ROLE_LABEL: Record<EventCategory, string> = {
  VENUE: "Локація",
  ENTERTAINMENT: "Ведучий та шоу",
  CATERING: "Кейтеринг",
  PHOTO_VIDEO: "Фото/Відео",
  DECOR: "Декор",
};

/**
 * Частки бюджету на роль за типом заходу. Категорії, яких немає в наборі,
 * у підбір не потрапляють (напр. презентації рідко замовляють ведучого-шоумена).
 * Сума часток кожного набору = 1.
 */
const BUDGET_SPLIT: Record<string, Partial<Record<EventCategory, number>>> = {
  "Весілля": { VENUE: 0.34, CATERING: 0.26, PHOTO_VIDEO: 0.16, ENTERTAINMENT: 0.14, DECOR: 0.10 },
  "Корпоратив": { VENUE: 0.32, CATERING: 0.30, ENTERTAINMENT: 0.20, PHOTO_VIDEO: 0.12, DECOR: 0.06 },
  "День народження": { VENUE: 0.30, CATERING: 0.28, ENTERTAINMENT: 0.22, DECOR: 0.12, PHOTO_VIDEO: 0.08 },
  "Ювілей": { VENUE: 0.32, CATERING: 0.28, ENTERTAINMENT: 0.18, PHOTO_VIDEO: 0.12, DECOR: 0.10 },
  "Випускний": { VENUE: 0.34, CATERING: 0.26, ENTERTAINMENT: 0.24, PHOTO_VIDEO: 0.16 },
  "Презентація": { VENUE: 0.38, CATERING: 0.26, PHOTO_VIDEO: 0.24, DECOR: 0.12 },
};

const DEFAULT_SPLIT: Partial<Record<EventCategory, number>> = {
  VENUE: 0.32, CATERING: 0.26, ENTERTAINMENT: 0.18, PHOTO_VIDEO: 0.14, DECOR: 0.10,
};

/** Пріоритет у видачі за тарифом (Project Bible): PRO 1.2, MAX 1.5. */
const TIER_BOOST: Record<SubscriptionTier, number> = {
  STANDARD: 1,
  PRO: 1.2,
  MAX: 1.5,
};

/** Ключові слова стилів — шукаються як підрядок в описі (укр. морфологія: корені без закінчень). */
const STYLE_KEYWORDS: Record<string, string[]> = {
  "Класичний": ["класич", "елегант", "преміальн", "банкетн"],
  "Мінімалізм": ["мінімал", "лаконіч", "стриман"],
  "Бохо": ["бохо", "етно", "натурал"],
  "Гламур": ["гламур", "люкс", "преміальн", "розкіш"],
  "Рустик": ["рустик", "дерев", "лофт", "заміськ"],
  "Модерн": ["модерн", "сучасн", "постановоч"],
};

const EVENT_KEYWORDS: Record<string, string[]> = {
  "Весілля": ["весілл"],
  "Корпоратив": ["корпоратив"],
  "День народження": ["день народженн", "дні народженн"],
  "Ювілей": ["ювіле"],
  "Випускний": ["випускн"],
  "Презентація": ["презентац", "конференц"],
};

/**
 * Кейтеринг тарифікується за гостя (у сіді 450 ₴/особа), решта ролей — фікс.
 * Тому кошторис ролі рахується по-різному.
 */
const PER_GUEST_CATEGORIES: ReadonlySet<EventCategory> = new Set<EventCategory>(["CATERING"]);

export type MatchCandidate = {
  id: string;
  businessName: string;
  description: string | null;
  category: EventCategory;
  city: string;
  priceFrom: number | null;
  subscription: SubscriptionTier;
  isVerified: boolean;
  rating: number;
  reviewsCount: number;
};

export type MatchInput = {
  eventType: string;
  style: string;
  city: string;
  guestsCount: number;
  budget: number;
};

export type Match = {
  role: string;
  category: EventCategory;
  vendor: {
    id: string;
    name: string;
    city: string;
    rating: number;
    reviewsCount: number;
    priceFrom: number;
    subscription: SubscriptionTier;
    isVerified: boolean;
    /** Відсоток збігу за фактичними ознаками — тариф на нього НЕ впливає. */
    matchScore: number;
  };
  /** Кошторис ролі: для кейтерингу — ціна × гості, інакше — стартова ціна. */
  estimatedCost: number;
  pricingNote: string | null;
  /** Виділений на цю роль бюджет. */
  allocated: number;
  reason: string;
};

export type MatchOutcome = {
  matches: Match[];
  totalEstimate: number;
  budget: number;
  budgetOk: boolean;
  /** Ролі, під які в каталозі ще немає жодного виконавця. */
  missingRoles: string[];
  message: string;
};

function clamp(value: number, min: number, max: number): number {
  return Math.min(max, Math.max(min, value));
}

function normalize(text: string): string {
  return text.toLowerCase().replace(/['’ʼ]/g, "");
}

function hasKeyword(haystack: string, keywords: string[] | undefined): boolean {
  if (!keywords) return false;
  return keywords.some((k) => haystack.includes(k));
}

/**
 * Розподіл бюджету по ролях. Чим більше гостей, тим більша частка йде
 * на локацію та кейтеринг — саме вони масштабуються з кількістю людей.
 */
export function allocateBudget(
  budget: number,
  eventType: string,
  guestsCount: number,
): Partial<Record<EventCategory, number>> {
  const split = { ...(BUDGET_SPLIT[eventType] ?? DEFAULT_SPLIT) };
  const scale = clamp(guestsCount / 80, 0.8, 1.3);

  for (const key of ["VENUE", "CATERING"] as const) {
    if (split[key] !== undefined) split[key] = split[key]! * scale;
  }

  const total = Object.values(split).reduce((sum, share) => sum + (share ?? 0), 0);
  const allocation: Partial<Record<EventCategory, number>> = {};
  for (const [category, share] of Object.entries(split)) {
    allocation[category as EventCategory] = (budget * (share ?? 0)) / total;
  }
  return allocation;
}

export function estimateCost(candidate: MatchCandidate, guestsCount: number): number {
  const base = candidate.priceFrom ?? 0;
  return PER_GUEST_CATEGORIES.has(candidate.category) ? base * guestsCount : base;
}

/**
 * Оцінка збігу 0..1 за шістьма сигналами + окремий пріоритет за тарифом.
 * `fit` показується користувачу, `rank` використовується для сортування —
 * тариф піднімає виконавця у видачі, але не малює йому кращий відсоток збігу.
 */
export function scoreCandidate(
  candidate: MatchCandidate,
  input: MatchInput,
  allocated: number,
): { fit: number; rank: number; signals: string[] } {
  // Сигнали збираються з пріоритетом, бо в пояснення йдуть лише перші три:
  // конкретика («досвід у форматі», «стиль») інформативніша за загальні фрази.
  const signals: { text: string; priority: number }[] = [];
  const text = normalize(`${candidate.businessName} ${candidate.description ?? ""}`);

  // Якість: без жодного відгуку рейтинг за замовчуванням 0 — це не «погано»,
  // а «невідомо», тож даємо нейтральну оцінку замість нуля.
  const quality = candidate.reviewsCount > 0 ? candidate.rating / 5 : 0.55;
  if (candidate.reviewsCount > 0 && candidate.rating >= 4.8) {
    signals.push({
      text: `рейтинг ${candidate.rating.toFixed(1)} з ${candidate.reviewsCount} відгуків`,
      priority: 90,
    });
  }

  // Довіра: логарифм відгуків (100+ відгуків = максимум) + верифікація.
  const reviewsPart = clamp(Math.log10(candidate.reviewsCount + 1) / 2, 0, 1);
  const trust = 0.7 * reviewsPart + 0.3 * (candidate.isVerified ? 1 : 0);
  if (candidate.isVerified) signals.push({ text: "перевірений профіль", priority: 30 });

  // Бюджет: ідеал — вкластися й використати виділену суму, а не бути найдешевшим.
  const cost = estimateCost(candidate, input.guestsCount);
  const ratio = allocated > 0 ? cost / allocated : 1;
  const budgetFit = ratio <= 1 ? 0.75 + 0.25 * ratio : clamp(1 - (ratio - 1) * 1.5, 0, 1);
  if (ratio <= 1) signals.push({ text: "вкладається у бюджет ролі", priority: 40 });
  else signals.push({ text: "дорожче за виділений бюджет ролі", priority: 75 });

  const cityFit = normalize(candidate.city) === normalize(input.city) ? 1 : 0.35;
  if (cityFit === 1) signals.push({ text: `працює у місті ${candidate.city}`, priority: 60 });
  else signals.push({ text: `база — ${candidate.city}, можливий виїзд`, priority: 50 });

  const styleHit = hasKeyword(text, STYLE_KEYWORDS[input.style]);
  const styleFit = styleHit ? 1 : 0.5;
  if (styleHit) {
    signals.push({ text: `профіль збігається зі стилем «${input.style}»`, priority: 80 });
  }

  const eventHit = hasKeyword(text, EVENT_KEYWORDS[input.eventType]);
  const eventFit = eventHit ? 1 : 0.5;
  if (eventHit) {
    signals.push({ text: `має досвід у форматі «${input.eventType}»`, priority: 85 });
  }

  const fit =
    quality * 0.34 +
    budgetFit * 0.24 +
    trust * 0.14 +
    cityFit * 0.12 +
    styleFit * 0.08 +
    eventFit * 0.08;

  if (candidate.subscription !== "STANDARD") {
    signals.push({ text: `${candidate.subscription}-партнер`, priority: 35 });
  }

  const ordered = signals.sort((a, b) => b.priority - a.priority).map((s) => s.text);
  return { fit, rank: fit * TIER_BOOST[candidate.subscription], signals: ordered };
}

function buildReason(signals: string[]): string {
  if (signals.length === 0) return "Найкращий доступний варіант у цій категорії.";
  const sentence = signals.slice(0, 3).join(", ");
  return sentence.charAt(0).toUpperCase() + sentence.slice(1) + ".";
}

/** Підбирає по одному найкращому виконавцю на кожну релевантну роль. */
export function buildMatches(candidates: MatchCandidate[], input: MatchInput): MatchOutcome {
  const allocation = allocateBudget(input.budget, input.eventType, input.guestsCount);
  const matches: Match[] = [];
  const missingRoles: string[] = [];

  for (const [category, allocated] of Object.entries(allocation) as [EventCategory, number][]) {
    const pool = candidates.filter((c) => c.category === category);
    if (pool.length === 0) {
      missingRoles.push(ROLE_LABEL[category]);
      continue;
    }

    const best = pool
      .map((candidate) => ({ candidate, ...scoreCandidate(candidate, input, allocated) }))
      .sort((a, b) => b.rank - a.rank)[0];

    const cost = estimateCost(best.candidate, input.guestsCount);
    matches.push({
      role: ROLE_LABEL[category],
      category,
      vendor: {
        id: best.candidate.id,
        name: best.candidate.businessName,
        city: best.candidate.city,
        rating: best.candidate.rating,
        reviewsCount: best.candidate.reviewsCount,
        priceFrom: best.candidate.priceFrom ?? 0,
        subscription: best.candidate.subscription,
        isVerified: best.candidate.isVerified,
        matchScore: Math.round(best.fit * 100),
      },
      estimatedCost: Math.round(cost),
      pricingNote: PER_GUEST_CATEGORIES.has(category)
        ? `${(best.candidate.priceFrom ?? 0).toLocaleString("uk-UA")} ₴ × ${input.guestsCount} гостей`
        : null,
      allocated: Math.round(allocated),
      reason: buildReason(best.signals),
    });
  }

  matches.sort((a, b) => b.vendor.matchScore - a.vendor.matchScore);

  const totalEstimate = matches.reduce((sum, m) => sum + m.estimatedCost, 0);
  const budgetOk = totalEstimate <= input.budget;

  return {
    matches,
    totalEstimate,
    budget: input.budget,
    budgetOk,
    missingRoles,
    message: buildMessage(matches, missingRoles, input, totalEstimate, budgetOk),
  };
}

function buildMessage(
  matches: Match[],
  missingRoles: string[],
  input: MatchInput,
  totalEstimate: number,
  budgetOk: boolean,
): string {
  if (matches.length === 0) {
    return "У каталозі поки немає виконавців під ці параметри. Спробуйте інше місто або тип заходу.";
  }

  const avgRating =
    matches.reduce((sum, m) => sum + m.vendor.rating, 0) / matches.length;
  const parts = [
    `Підібрано ${matches.length} ${matches.length === 1 ? "виконавця" : "виконавців"} для «${input.eventType}» на ${input.guestsCount} гостей`,
    `середній рейтинг ${avgRating.toFixed(1)}`,
  ];

  if (budgetOk) {
    const left = input.budget - totalEstimate;
    parts.push(`залишок бюджету ≈ ${left.toLocaleString("uk-UA")} ₴`);
  } else {
    const over = totalEstimate - input.budget;
    parts.push(`перевищення бюджету ≈ ${over.toLocaleString("uk-UA")} ₴`);
  }

  if (missingRoles.length > 0) {
    parts.push(`без пропозицій поки: ${missingRoles.join(", ")}`);
  }

  return parts.join(" · ");
}
