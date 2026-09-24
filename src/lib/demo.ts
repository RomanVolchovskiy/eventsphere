/**
 * Демо-виконавці з prisma/seed.ts наповнюють каталог, але за ними не стоїть
 * реальний бізнес: рейтинг і відгуки вигадані, відповідати на заявки нікому.
 * Тому вони показуються з позначкою «Демо», без рейтингу й «верифікації»,
 * а бронювати їх чи писати їм не можна.
 *
 * Розпізнаємо їх за доменом email власника — він однаковий у seed для всіх
 * середовищ і не потребує міграції схеми. Реєстрацію на цей домен закрито
 * (src/app/api/auth/register/route.ts), щоб справжній профіль не став «демо».
 */
export const DEMO_EMAIL_DOMAIN = "@eventsphere.com";

export function isDemoEmail(email: string | null | undefined): boolean {
  return !!email && email.toLowerCase().endsWith(DEMO_EMAIL_DOMAIN);
}

/** Для `select` у запитах до Vendor — щоб потім викликати isDemoVendor. */
export const DEMO_OWNER_SELECT = { user: { select: { email: true } } } as const;

export function isDemoVendor(vendor: { user: { email: string } }): boolean {
  return isDemoEmail(vendor.user.email);
}

export const DEMO_BLOCKED_MESSAGE =
  "Це демо-профіль для ознайомлення — забронювати чи написати йому не можна.";

/**
 * Прибирає вигадані показники, щоб вони не впливали на сортування й підбір.
 * Порядок: спершу справжні виконавці, демо — в кінці.
 */
export function neutralizeDemo<T extends { rating: number; reviewsCount: number; isVerified: boolean }>(
  vendor: T,
  isDemo: boolean,
): T & { isDemo: boolean } {
  if (!isDemo) return { ...vendor, isDemo };
  return { ...vendor, rating: 0, reviewsCount: 0, isVerified: false, isDemo };
}
