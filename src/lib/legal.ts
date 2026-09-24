/**
 * Реквізити оператора сервісу — використовуються в /terms, /privacy і футері.
 *
 * ⚠️ OPERATOR_NAME і OPERATOR_CODE треба заповнити справжніми даними
 * (ФОП або юрособа, ІПН/ЄДРПОУ) перед публічним запуском: закон «Про захист
 * персональних даних» вимагає, щоб користувач знав, хто володілець його даних.
 * Поки поле порожнє, сторінки показують нейтральний текст без вигаданих реквізитів.
 */
export const LEGAL = {
  serviceName: "ЄСвято",
  operatorName: "",
  operatorCode: "",
  contactEmail: "hello@eventsphere.ua",
  /** Дата набрання чинності поточною редакцією документів. */
  effectiveDate: "24 вересня 2026 року",
} as const;

export function operatorLine(): string {
  if (!LEGAL.operatorName) return `команда сервісу «${LEGAL.serviceName}»`;
  return LEGAL.operatorCode
    ? `${LEGAL.operatorName} (код ${LEGAL.operatorCode})`
    : LEGAL.operatorName;
}
