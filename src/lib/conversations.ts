/** Розмова, до якої має доступ користувач: він або клієнт, або власник профілю виконавця. */
export function participantWhere(userId: string) {
  return { OR: [{ userId }, { vendor: { userId } }] };
}
