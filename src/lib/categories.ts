import type { EventCategory } from "@/generated/prisma/enums";

/**
 * Єдине джерело назв категорій. Значення збігаються з EventCategory
 * у prisma/schema.prisma — тримати синхронно.
 */
export const VENDOR_CATEGORIES: { value: EventCategory; label: string }[] = [
  { value: "VENUE", label: "Локація, зал" },
  { value: "ENTERTAINMENT", label: "Ведучий, музика, шоу" },
  { value: "CATERING", label: "Кейтеринг, кухня" },
  { value: "PHOTO_VIDEO", label: "Фото і відео" },
  { value: "DECOR", label: "Декор, квіти" },
];

export const CATEGORY_VALUES = VENDOR_CATEGORIES.map((c) => c.value);

export function isEventCategory(value: unknown): value is EventCategory {
  return typeof value === "string" && (CATEGORY_VALUES as string[]).includes(value);
}

/** Коротка назва для картки й сторінки виконавця. */
export const CATEGORY_LABELS: Record<string, string> = {
  VENUE: "Локація",
  ENTERTAINMENT: "Шоу-програма",
  CATERING: "Кейтеринг",
  PHOTO_VIDEO: "Фото/Відео",
  DECOR: "Декор",
};
