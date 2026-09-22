import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { getDb } from "@/lib/db";

/**
 * Спільна перевірка для роутів планувальника: сесія є, і захід належить
 * поточному користувачу. Чужий захід віддає 404, а не 403 — щоб не
 * підтверджувати існування id.
 */
export async function requireOwnEvent(eventId: string) {
  const session = await getServerSession(authOptions);
  if (!session) {
    return { error: NextResponse.json({ error: "Необхідна авторизація" }, { status: 401 }) };
  }
  const db = getDb();
  const event = await db.event.findFirst({
    where: { id: eventId, userId: session.user.id },
    select: { id: true },
  });
  if (!event) {
    return { error: NextResponse.json({ error: "Захід не знайдено" }, { status: 404 }) };
  }
  return { db, eventId: event.id };
}

export async function readJson(request: NextRequest): Promise<Record<string, unknown> | null> {
  try {
    return (await request.json()) as Record<string, unknown>;
  } catch {
    return null;
  }
}

export const badRequest = (message: string) =>
  NextResponse.json({ error: message }, { status: 400 });

/** Рядок з тілa запиту: обрізаний, обмежений по довжині; порожній → null. */
export function optionalString(value: unknown, max: number): string | null {
  return typeof value === "string" && value.trim() ? value.trim().slice(0, max) : null;
}

/** Дата з тіла запиту; невалідна → null. */
export function parseDate(value: unknown): Date | null {
  if (typeof value !== "string" || !value.trim()) return null;
  const d = new Date(value);
  return Number.isNaN(d.getTime()) ? null : d;
}

export const RSVP_VALUES = ["yes", "no"] as const;
/** RSVP: "yes" | "no" | null (очікує). Будь-що інше → undefined (не задано). */
export function parseRsvp(value: unknown): "yes" | "no" | null | undefined {
  if (value === null || value === "pending" || value === "") return null;
  if (value === "yes" || value === "no") return value;
  return undefined;
}
