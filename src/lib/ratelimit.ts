/**
 * Rate limiter на Upstash Redis — лічильники спільні для всіх інстансів
 * Vercel, тож ліміт справді тримається, а не множиться на кількість
 * холодних стартів.
 *
 * Змінні середовища (будь-яка пара):
 *   UPSTASH_REDIS_REST_URL / UPSTASH_REDIS_REST_TOKEN — пряме підключення Upstash
 *   KV_REST_API_URL / KV_REST_API_TOKEN               — інтеграція Upstash у Vercel Marketplace
 *
 * Без них (локальна розробка, або Redis ще не підключено) працює запасний
 * лімітер у пам'яті процесу — як було раніше.
 */
import { Ratelimit, type Duration } from "@upstash/ratelimit";
import { Redis } from "@upstash/redis";

export type RateLimitResult = { success: boolean; remaining: number; resetAt: number };

const hasRedisEnv =
  !!(process.env.UPSTASH_REDIS_REST_URL || process.env.KV_REST_API_URL) &&
  !!(process.env.UPSTASH_REDIS_REST_TOKEN || process.env.KV_REST_API_TOKEN);

// Один повтор замість типових п'яти з backoff: інакше збій Redis
// розтягується на секунди й з'їдає timeout нижче.
const redis = hasRedisEnv ? Redis.fromEnv({ retry: { retries: 1 } }) : null;

if (!redis && process.env.VERCEL_ENV === "production") {
  console.warn("ratelimit: Upstash Redis не налаштовано — використовується лімітер у пам'яті");
}

/**
 * Екземпляр Ratelimit на кожну пару (ліміт, вікно). Створюються один раз на
 * інстанс: ephemeralCache тоді блокує вже заблокованих без запиту в Redis.
 */
const limiters = new Map<string, Ratelimit>();

function getLimiter(limit: number, windowMs: number): Ratelimit {
  const id = `${limit}:${windowMs}`;
  let limiter = limiters.get(id);
  if (!limiter) {
    limiter = new Ratelimit({
      redis: redis!,
      limiter: Ratelimit.slidingWindow(limit, `${windowMs} ms` as Duration),
      prefix: `rl:${id}`,
      ephemeralCache: new Map(),
      // Redis не відповів за секунду — rateLimit() нижче перейде на пам'ять.
      timeout: 1000,
    });
    limiters.set(id, limiter);
  }
  return limiter;
}

/**
 * @param key      Unique identifier (e.g. IP + route)
 * @param limit    Max requests allowed in the window
 * @param windowMs Time window in milliseconds
 */
export async function rateLimit(
  key: string,
  limit: number,
  windowMs: number
): Promise<RateLimitResult> {
  if (!redis) return memoryRateLimit(key, limit, windowMs);

  try {
    const { success, remaining, reset, reason } = await getLimiter(limit, windowMs).limit(key);
    // На таймауті бібліотека просто пропускає запит — тоді рахуємо в пам'яті,
    // щоб збій Redis не вимикав ліміт повністю.
    if (reason === "timeout") {
      console.error("ratelimit: Upstash не відповів вчасно, fallback на пам'ять");
      return memoryRateLimit(key, limit, windowMs);
    }
    return { success, remaining, resetAt: reset };
  } catch (error) {
    // Помилка мережі/авторизації Upstash — не валимо запит, падаємо на пам'ять.
    console.error("ratelimit: Upstash недоступний, fallback на пам'ять", error);
    return memoryRateLimit(key, limit, windowMs);
  }
}

// ── Запасний лімітер у пам'яті (per-instance) ─────────────────────────────

interface RateLimitEntry {
  count: number;
  resetAt: number;
}

const store = new Map<string, RateLimitEntry>();

// Clean up old entries every 5 minutes
if (typeof setInterval !== "undefined") {
  setInterval(() => {
    const now = Date.now();
    for (const [key, entry] of store.entries()) {
      if (entry.resetAt < now) store.delete(key);
    }
  }, 5 * 60 * 1000).unref?.();
}

function memoryRateLimit(key: string, limit: number, windowMs: number): RateLimitResult {
  const now = Date.now();
  const entry = store.get(key);

  if (!entry || entry.resetAt < now) {
    const newEntry: RateLimitEntry = { count: 1, resetAt: now + windowMs };
    store.set(key, newEntry);
    return { success: true, remaining: limit - 1, resetAt: newEntry.resetAt };
  }

  if (entry.count >= limit) {
    return { success: false, remaining: 0, resetAt: entry.resetAt };
  }

  entry.count += 1;
  return { success: true, remaining: limit - entry.count, resetAt: entry.resetAt };
}

/** Extract IP from Next.js request headers */
export function getClientIp(request: Request): string {
  return (
    request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ??
    request.headers.get("x-real-ip") ??
    "unknown"
  );
}
