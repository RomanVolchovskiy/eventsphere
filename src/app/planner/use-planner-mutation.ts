"use client";

import { useRouter } from "next/navigation";
import { useCallback, useState, useTransition } from "react";

/**
 * Запит до API планувальника + перечитування серверних даних сторінки.
 * Сторінка /planner — серверний компонент, тож після успішного запису
 * достатньо router.refresh(): список і картки статистики оновляться самі,
 * без дублювання стану на клієнті.
 */
export function usePlannerMutation() {
  const router = useRouter();
  const [isRefreshing, startTransition] = useTransition();
  const [busyKey, setBusyKey] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const run = useCallback(
    async (key: string, url: string, init: RequestInit): Promise<boolean> => {
      setBusyKey(key);
      setError(null);
      try {
        const res = await fetch(url, {
          headers: { "Content-Type": "application/json" },
          ...init,
        });
        if (!res.ok) {
          const data = (await res.json().catch(() => ({}))) as { error?: string };
          setError(data.error ?? "Не вдалося зберегти");
          return false;
        }
        startTransition(() => router.refresh());
        return true;
      } catch {
        setError("Немає зв'язку з сервером");
        return false;
      } finally {
        setBusyKey(null);
      }
    },
    [router],
  );

  return { run, busyKey, error, isRefreshing };
}

export const plannerInput =
  "w-full bg-[var(--dark)] border border-[var(--dark-border)] rounded-xl px-3 py-2 text-white placeholder:text-[var(--text-muted)] focus:outline-none focus:border-[var(--gold)] transition-colors text-sm";
