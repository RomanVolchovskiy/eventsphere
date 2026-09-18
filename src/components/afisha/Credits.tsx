import Link from "next/link";

// Без вигаданих обсягів каталогу — лише твердження, які правдиві
// на будь-якому розмірі й перевіряються в коді.
const CREDITS = [
  ["Хто ми", "ЄСвято · Київ"],
  ["Працюємо з", "2026 року"],
  ["Напрямки", "Зал, кейтеринг, фото, ведучий, декор"],
  ["Передоплата", "Не потрібна"],
  ["Для клієнта", "Безкоштовно"],
  ["Виконавцям", "Профіль безкоштовний"],
];

export default function Credits() {
  return (
    <section className="af-section" id="colophon">
      <div className="af-head">
        <span className="af-kicker">Про ЄСвято · титри</span>
        <h2 className="af-h2">
          Свято без <span className="accent">зайвого клопоту</span>
        </h2>
        <p className="af-lead">
          ЄСвято збирає перевірених виконавців в одному місці, щоб вам не
          довелось шукати їх по знайомих і телефонувати кожному окремо.
        </p>
      </div>

      <div className="af-credits">
        {CREDITS.map(([k, v]) => (
          <div className="af-credit" key={k}>
            <span className="k">{k}</span>
            <span className="v">{v}</span>
          </div>
        ))}
      </div>

      <div className="af-finale">
        <span className="af-num">© 2026 — ЄСвято · Завіса</span>
        <Link href="/smart-match" className="af-btn">
          <span>Підібрати команду</span>
          <span className="arr">→</span>
        </Link>
      </div>

      <div className="af-curtain" aria-hidden="true" />
    </section>
  );
}
